import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    DataSource,
    EntityManager,
    Repository,
} from 'typeorm';
import { randomInt, randomUUID } from 'crypto';

import { CartEntity } from '@entities/cart.entity';
import { CartItemEntity } from '@entities/cart-item.entity';
import { CourseEntity } from '@entities/course.entity';
import { DiscountCodeEntity } from '@entities/discount-code.entity';
import { DiscountCodeUsageEntity } from '@entities/discount-code-usage.entity';
import { EnrollmentEntity } from '@entities/enrollment.entity';
import { OrderEntity } from '@entities/order.entity';
import { OrderItemEntity } from '@entities/order-item.entity';
import {
    CartStatus,
    DiscountCodeScope,
    DiscountCodeType,
    OrderPaymentStatus,
    OrderStatus,
    PaymentGatewayName,
} from '@constants/app.constants';
import { AddCartItemDto } from '../dto/add-cart-item.dto';
import { ApplyDiscountDto } from '../dto/apply-discount.dto';
import { CartIdentityDto } from '../dto/cart-identity.dto';
import { CheckoutDto } from '../dto/checkout.dto';
import { PaymentsService } from './payments.service';

type CartWithRelations = CartEntity & {
    items: Array<CartItemEntity & { course: CourseEntity }>;
    discount_code?: DiscountCodeEntity | null;
};

type CouponEvaluation = {
    code: DiscountCodeEntity | null;
    eligibleItems: Array<CartItemEntity & { course: CourseEntity }>;
    eligibleSubtotal: number;
    couponDiscountAmount: number;
};

@Injectable()
export class CartsService {
    private readonly cartLifetimeInDays = 7;

    constructor(
        @InjectRepository(CartEntity)
        private readonly cartRepository: Repository<CartEntity>,
        @InjectRepository(CartItemEntity)
        private readonly cartItemRepository: Repository<CartItemEntity>,
        @InjectRepository(CourseEntity)
        private readonly courseRepository: Repository<CourseEntity>,
        @InjectRepository(DiscountCodeEntity)
        private readonly discountCodeRepository: Repository<DiscountCodeEntity>,
        @InjectRepository(DiscountCodeUsageEntity)
        private readonly discountCodeUsageRepository: Repository<DiscountCodeUsageEntity>,
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        @InjectRepository(OrderItemEntity)
        private readonly orderItemRepository: Repository<OrderItemEntity>,
        @InjectRepository(EnrollmentEntity)
        private readonly enrollmentRepository: Repository<EnrollmentEntity>,
        private readonly dataSource: DataSource,
        private readonly paymentsService: PaymentsService,
    ) { }

    async getCart(dto: CartIdentityDto) {
        const cart = await this.resolveActiveCart(dto, false);
        if (!cart) {
            return this.buildEmptyCartResponse(dto.session_token);
        }

        const recalculatedCart = await this.recalculateCart(cart.id);
        return this.buildCartResponse(recalculatedCart);
    }

    async addItem(dto: AddCartItemDto) {
        const course = await this.courseRepository.findOne({
            where: { id: dto.course_id } as any,
        });

        if (!course) {
            throw new NotFoundException('Course not found');
        }

        if (dto.user_id) {
            const existingEnrollment = await this.enrollmentRepository.findOne({
                where: {
                    user_id: dto.user_id,
                    course_id: dto.course_id,
                } as any,
            });

            if (existingEnrollment) {
                throw new BadRequestException('User has already purchased this course');
            }
        }

        let cart = await this.resolveActiveCart(dto, true);
        const existingItem = cart.items.find((item) => item.course_id === dto.course_id);

        if (!existingItem) {
            const pricing = this.getCoursePricing(course);
            await this.cartItemRepository.save(
                this.cartItemRepository.create({
                    cart_id: cart.id,
                    course_id: course.id,
                    course_title_snapshot: course.title,
                    course_slug_snapshot: course.slug,
                    quantity: 1,
                    base_unit_price: pricing.basePrice,
                    discounted_unit_price: pricing.discountedPrice,
                    final_unit_price: pricing.finalPrice,
                    line_total_amount: pricing.finalPrice,
                    has_course_discount: pricing.hasCourseDiscount,
                    is_coupon_eligible: !pricing.hasCourseDiscount,
                }),
            );
        }

        cart = await this.recalculateCart(cart.id, true);
        return this.buildCartResponse(cart);
    }

    async removeItem(courseId: number, dto: CartIdentityDto) {
        const cart = await this.resolveActiveCart(dto, false);
        if (!cart) {
            return this.buildEmptyCartResponse(dto.session_token);
        }

        const existingItem = cart.items.find((item) => item.course_id === courseId);
        if (!existingItem) {
            throw new NotFoundException('Course not found in cart');
        }

        await this.cartItemRepository.delete(existingItem.id);
        const recalculatedCart = await this.recalculateCart(cart.id, true);
        return this.buildCartResponse(recalculatedCart);
    }

    async applyDiscount(dto: ApplyDiscountDto) {
        const cart = await this.resolveActiveCart(dto, false);
        if (!cart || cart.items.length === 0) {
            throw new BadRequestException('Cart is empty');
        }

        const discountCode = await this.findDiscountCodeByCode(dto.code);
        if (!discountCode) {
            throw new NotFoundException('Discount code not found');
        }

        await this.validateDiscountCode(discountCode, cart, dto.user_id);

        await this.cartRepository.update(cart.id, {
            discount_code_id: discountCode.id,
            discount_code_snapshot: discountCode.code,
        });

        const recalculatedCart = await this.recalculateCart(cart.id, true);
        return this.buildCartResponse(recalculatedCart);
    }

    async checkout(dto: CheckoutDto) {
        const activeCart = await this.resolveActiveCart(dto, false);
        if (!activeCart || activeCart.items.length === 0) {
            throw new BadRequestException('Cart is empty');
        }

        const checkedCart = await this.recalculateCart(activeCart.id, true);
        if (checkedCart.items.length === 0) {
            throw new BadRequestException('Cart has no valid items to checkout');
        }

        const courseIds = checkedCart.items.map((item) => item.course_id);
        const existingEnrollments = await this.enrollmentRepository.find({
            where: {
                user_id: dto.user_id,
            } as any,
        });

        const enrolledCourseIds = new Set(existingEnrollments.map((item) => item.course_id));
        const duplicatedCourseId = courseIds.find((courseId) => enrolledCourseIds.has(courseId));
        if (duplicatedCourseId) {
            throw new BadRequestException(`User has already purchased course ${duplicatedCourseId}`);
        }

        const pendingOrder = await this.dataSource.transaction(async (manager) => {
            const cart = await this.recalculateCart(checkedCart.id, true, manager);
            const couponEvaluation = await this.evaluateCoupon(cart, dto.user_id, manager, true);
            const couponAllocations = this.allocateCouponAcrossItems(
                cart.items,
                couponEvaluation.eligibleItems,
                couponEvaluation.couponDiscountAmount,
            );
            const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

            const order = await manager.getRepository(OrderEntity).save(
                manager.getRepository(OrderEntity).create({
                    order_number: this.generateOrderNumber(),
                    user_id: dto.user_id,
                    cart_id: cart.id,
                    status: this.toNumber(cart.payable_amount) > 0 ? OrderStatus.AWAITING_PAYMENT : OrderStatus.PAID,
                    payment_status: this.toNumber(cart.payable_amount) > 0 ? OrderPaymentStatus.PENDING : OrderPaymentStatus.PAID,
                    currency: cart.currency,
                    subtotal_amount: cart.subtotal_amount,
                    course_discount_amount: cart.course_discount_amount,
                    coupon_discount_amount: cart.coupon_discount_amount,
                    total_discount_amount:
                        this.toNumber(cart.course_discount_amount) + this.toNumber(cart.coupon_discount_amount),
                    payable_amount: cart.payable_amount,
                    discount_code_id: cart.discount_code_id,
                    discount_code_snapshot: cart.discount_code_snapshot,
                    customer_first_name: dto.customer_first_name,
                    customer_last_name: dto.customer_last_name,
                    customer_email: dto.customer_email,
                    customer_phone_number: dto.customer_phone_number,
                    payment_gateway: dto.payment_gateway || PaymentGatewayName.ZARINPAL,
                    expires_at: this.toNumber(cart.payable_amount) > 0 ? expiresAt : null,
                    paid_at: this.toNumber(cart.payable_amount) > 0 ? null : new Date(),
                    payment_verified_at: this.toNumber(cart.payable_amount) > 0 ? null : new Date(),
                    notes: dto.notes,
                }),
            );

            for (const item of cart.items) {
                const couponDiscount = couponAllocations.get(item.id) ?? 0;
                const finalLineAmount = this.roundMoney(item.line_total_amount - couponDiscount);

                await manager.getRepository(OrderItemEntity).save(
                    manager.getRepository(OrderItemEntity).create({
                        order_id: order.id,
                        course_id: item.course_id,
                        course_title_snapshot: item.course_title_snapshot,
                        course_slug_snapshot: item.course_slug_snapshot,
                        quantity: item.quantity,
                        base_unit_price: item.base_unit_price,
                        discounted_unit_price: item.discounted_unit_price,
                        coupon_discount_amount: couponDiscount,
                        final_unit_price: finalLineAmount,
                        line_total_amount: finalLineAmount,
                        has_course_discount: item.has_course_discount,
                    }),
                );
            }

            await manager.getRepository(CartEntity).update(cart.id, {
                checked_out_at: new Date(),
            });

            return manager.getRepository(OrderEntity).findOne({
                where: { id: order.id } as any,
                relations: ['items'],
            });
        });

        if (!pendingOrder) {
            throw new NotFoundException('Order could not be created');
        }

        return this.paymentsService.initiatePaymentForOrder(
            pendingOrder.id,
            dto.payment_gateway || PaymentGatewayName.ZARINPAL,
        );
    }

    private async resolveActiveCart(
        identity: CartIdentityDto,
        createIfMissing: boolean,
    ): Promise<CartWithRelations | null> {
        let userCart = identity.user_id
            ? await this.findActiveCartByUserId(identity.user_id)
            : null;
        let sessionCart = identity.session_token
            ? await this.findActiveCartBySessionToken(identity.session_token)
            : null;

        if (userCart) {
            userCart = await this.expireCartIfNeeded(userCart);
        }

        if (sessionCart) {
            sessionCart = await this.expireCartIfNeeded(sessionCart);
        }

        if (userCart && sessionCart && userCart.id !== sessionCart.id) {
            userCart = await this.mergeCarts(userCart, sessionCart, identity.session_token);
            sessionCart = null;
        }

        const existingCart = userCart || sessionCart;
        if (existingCart) {
            if (identity.user_id && !existingCart.user_id) {
                await this.cartRepository.update(existingCart.id, {
                    user_id: identity.user_id,
                    session_token: identity.session_token || existingCart.session_token,
                });
                return this.loadCartById(existingCart.id);
            }

            return existingCart;
        }

        if (!createIfMissing) {
            return null;
        }

        const sessionToken = identity.session_token || randomUUID();
        const newCart = await this.cartRepository.save(
            this.cartRepository.create({
                user_id: identity.user_id,
                session_token: sessionToken,
                status: CartStatus.ACTIVE,
                currency: 'IRR',
                subtotal_amount: 0,
                course_discount_amount: 0,
                coupon_discount_amount: 0,
                payable_amount: 0,
                expires_at: this.getNextCartExpiry(),
            }),
        );

        return this.loadCartById(newCart.id);
    }

    private async findActiveCartByUserId(userId: number): Promise<CartWithRelations | null> {
        return this.cartRepository.findOne({
            where: {
                user_id: userId,
                status: CartStatus.ACTIVE,
            } as any,
            relations: ['items', 'items.course', 'discount_code'],
            order: { id: 'DESC' },
        }) as Promise<CartWithRelations | null>;
    }

    private async findActiveCartBySessionToken(sessionToken: string): Promise<CartWithRelations | null> {
        return this.cartRepository.findOne({
            where: {
                session_token: sessionToken,
                status: CartStatus.ACTIVE,
            } as any,
            relations: ['items', 'items.course', 'discount_code'],
            order: { id: 'DESC' },
        }) as Promise<CartWithRelations | null>;
    }

    private async expireCartIfNeeded(cart: CartWithRelations): Promise<CartWithRelations | null> {
        if (!cart.expires_at || cart.expires_at > new Date()) {
            return cart;
        }

        await this.cartRepository.update(cart.id, {
            status: CartStatus.EXPIRED,
            session_token: null,
            discount_code_id: null,
            discount_code_snapshot: null,
        });

        return null;
    }

    private async mergeCarts(
        targetCart: CartWithRelations,
        sourceCart: CartWithRelations,
        sessionToken?: string,
    ): Promise<CartWithRelations> {
        const existingCourseIds = new Set(targetCart.items.map((item) => item.course_id));

        for (const item of sourceCart.items) {
            if (!existingCourseIds.has(item.course_id)) {
                await this.cartItemRepository.save(
                    this.cartItemRepository.create({
                        cart_id: targetCart.id,
                        course_id: item.course_id,
                        course_title_snapshot: item.course_title_snapshot,
                        course_slug_snapshot: item.course_slug_snapshot,
                        quantity: 1,
                        base_unit_price: item.base_unit_price,
                        discounted_unit_price: item.discounted_unit_price,
                        final_unit_price: item.final_unit_price,
                        line_total_amount: item.line_total_amount,
                        has_course_discount: item.has_course_discount,
                        is_coupon_eligible: item.is_coupon_eligible,
                    }),
                );
            }
        }

        await this.cartRepository.update(targetCart.id, {
            session_token: sessionToken || targetCart.session_token,
            expires_at: this.getNextCartExpiry(),
        });

        await this.cartRepository.update(sourceCart.id, {
            status: CartStatus.ABANDONED,
            session_token: null,
            discount_code_id: null,
            discount_code_snapshot: null,
        });

        return this.loadCartById(targetCart.id);
    }

    private async recalculateCart(
        cartId: number,
        refreshExpiry = false,
        manager?: EntityManager,
    ): Promise<CartWithRelations> {
        const cartRepository = manager?.getRepository(CartEntity) || this.cartRepository;
        const cartItemRepository = manager?.getRepository(CartItemEntity) || this.cartItemRepository;
        const cart = await this.loadCartById(cartId, manager);

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const itemsToRemove: number[] = [];
        let subtotalAmount = 0;
        let courseDiscountAmount = 0;

        for (const item of cart.items) {
            if (!item.course) {
                itemsToRemove.push(item.id);
                continue;
            }

            const pricing = this.getCoursePricing(item.course);
            const lineTotalAmount = this.roundMoney(pricing.finalPrice * item.quantity);

            subtotalAmount += this.roundMoney(pricing.basePrice * item.quantity);
            courseDiscountAmount += this.roundMoney((pricing.basePrice - pricing.finalPrice) * item.quantity);

            await cartItemRepository.update(item.id, {
                course_title_snapshot: item.course.title,
                course_slug_snapshot: item.course.slug,
                base_unit_price: pricing.basePrice,
                discounted_unit_price: pricing.discountedPrice,
                final_unit_price: pricing.finalPrice,
                line_total_amount: lineTotalAmount,
                has_course_discount: pricing.hasCourseDiscount,
                is_coupon_eligible: !pricing.hasCourseDiscount,
            });
        }

        if (itemsToRemove.length > 0) {
            await cartItemRepository.delete(itemsToRemove);
        }

        let reloadedCart = await this.loadCartById(cartId, manager);
        let couponEvaluation = await this.evaluateCoupon(reloadedCart, reloadedCart.user_id, manager);

        if (reloadedCart.discount_code_id && !couponEvaluation.code) {
            await cartRepository.update(reloadedCart.id, {
                discount_code_id: null,
                discount_code_snapshot: null,
            });
            reloadedCart = await this.loadCartById(cartId, manager);
            couponEvaluation = await this.evaluateCoupon(reloadedCart, reloadedCart.user_id, manager);
        }

        const payableAmount = this.roundMoney(
            subtotalAmount - courseDiscountAmount - couponEvaluation.couponDiscountAmount,
        );

        await cartRepository.update(cartId, {
            subtotal_amount: this.roundMoney(subtotalAmount),
            course_discount_amount: this.roundMoney(courseDiscountAmount),
            coupon_discount_amount: this.roundMoney(couponEvaluation.couponDiscountAmount),
            payable_amount: payableAmount < 0 ? 0 : payableAmount,
            expires_at: refreshExpiry ? this.getNextCartExpiry() : reloadedCart.expires_at,
        });

        return this.loadCartById(cartId, manager);
    }

    private async evaluateCoupon(
        cart: CartWithRelations,
        userId?: number,
        manager?: EntityManager,
        throwOnInvalid = false,
    ): Promise<CouponEvaluation> {
        if (!cart.discount_code_id || !cart.discount_code) {
            return {
                code: null,
                eligibleItems: [],
                eligibleSubtotal: 0,
                couponDiscountAmount: 0,
            };
        }

        try {
            await this.validateDiscountCode(cart.discount_code, cart, userId, manager);
        } catch (error) {
            if (throwOnInvalid) {
                throw error;
            }

            return {
                code: null,
                eligibleItems: [],
                eligibleSubtotal: 0,
                couponDiscountAmount: 0,
            };
        }

        const eligibleItems = this.getEligibleItemsForDiscount(cart.items, cart.discount_code);
        const eligibleSubtotal = this.roundMoney(
            eligibleItems.reduce((sum, item) => sum + this.toNumber(item.line_total_amount), 0),
        );

        return {
            code: cart.discount_code,
            eligibleItems,
            eligibleSubtotal,
            couponDiscountAmount: this.calculateCouponDiscount(cart.discount_code, eligibleSubtotal),
        };
    }

    private async validateDiscountCode(
        discountCode: DiscountCodeEntity,
        cart: CartWithRelations,
        userId?: number,
        manager?: EntityManager,
    ): Promise<void> {
        const now = new Date();

        if (!discountCode.is_active) {
            throw new BadRequestException('Discount code is inactive');
        }

        if (discountCode.starts_at && discountCode.starts_at > now) {
            throw new BadRequestException('Discount code is not active yet');
        }

        if (discountCode.expires_at && discountCode.expires_at < now) {
            throw new BadRequestException('Discount code has expired');
        }

        if (discountCode.max_total_usage && discountCode.used_count >= discountCode.max_total_usage) {
            throw new BadRequestException('Discount code usage limit reached');
        }

        if (discountCode.assigned_user_id && discountCode.assigned_user_id !== userId) {
            throw new BadRequestException('Discount code is assigned to another user');
        }

        if (discountCode.max_usage_per_user) {
            if (!userId) {
                throw new BadRequestException('Login is required to use this discount code');
            }

            const usageRepository = manager?.getRepository(DiscountCodeUsageEntity)
                || this.discountCodeUsageRepository;

            const userUsageCount = await usageRepository.count({
                where: {
                    discount_code_id: discountCode.id,
                    user_id: userId,
                } as any,
            });

            if (userUsageCount >= discountCode.max_usage_per_user) {
                throw new BadRequestException('User usage limit for this discount code has been reached');
            }
        }

        if (!discountCode.allow_on_discounted_courses && cart.items.some((item) => item.has_course_discount)) {
            throw new BadRequestException('Discount code cannot be applied when cart contains discounted courses');
        }

        const eligibleItems = this.getEligibleItemsForDiscount(cart.items, discountCode);
        if (eligibleItems.length === 0) {
            throw new BadRequestException('Discount code is not applicable to current cart items');
        }

        const eligibleSubtotal = this.roundMoney(
            eligibleItems.reduce((sum, item) => sum + this.toNumber(item.line_total_amount), 0),
        );

        if (discountCode.minimum_order_amount && eligibleSubtotal < this.toNumber(discountCode.minimum_order_amount)) {
            throw new BadRequestException('Cart amount is lower than the discount minimum order amount');
        }

        if (this.calculateCouponDiscount(discountCode, eligibleSubtotal) <= 0) {
            throw new BadRequestException('Discount code does not reduce the cart total');
        }
    }

    private getEligibleItemsForDiscount(
        items: Array<CartItemEntity & { course: CourseEntity }>,
        discountCode: DiscountCodeEntity,
    ) {
        switch (discountCode.scope) {
            case DiscountCodeScope.COURSE:
                return items.filter((item) => item.course_id === discountCode.course_id);
            case DiscountCodeScope.CATEGORY:
                return items.filter((item) => item.course?.category_id === discountCode.category_id);
            case DiscountCodeScope.ENTIRE_CART:
            default:
                return items;
        }
    }

    private calculateCouponDiscount(
        discountCode: DiscountCodeEntity,
        eligibleSubtotal: number,
    ): number {
        if (eligibleSubtotal <= 0) {
            return 0;
        }

        let discountAmount = 0;

        if (discountCode.type === DiscountCodeType.PERCENTAGE) {
            discountAmount = this.roundMoney(eligibleSubtotal * (this.toNumber(discountCode.value) / 100));
        } else {
            discountAmount = this.toNumber(discountCode.value);
        }

        if (discountCode.maximum_discount_amount) {
            discountAmount = Math.min(
                discountAmount,
                this.toNumber(discountCode.maximum_discount_amount),
            );
        }

        return this.roundMoney(Math.min(discountAmount, eligibleSubtotal));
    }

    private allocateCouponAcrossItems(
        items: Array<CartItemEntity & { course: CourseEntity }>,
        eligibleItems: Array<CartItemEntity & { course: CourseEntity }>,
        totalDiscountAmount: number,
    ): Map<number, number> {
        const allocations = new Map<number, number>();
        const eligibleIds = new Set(eligibleItems.map((item) => item.id));
        const eligibleSubtotal = eligibleItems.reduce(
            (sum, item) => sum + this.toNumber(item.line_total_amount),
            0,
        );

        let remainingDiscount = this.roundMoney(totalDiscountAmount);
        const eligibleList = items.filter((item) => eligibleIds.has(item.id));

        eligibleList.forEach((item, index) => {
            if (index === eligibleList.length - 1) {
                allocations.set(item.id, this.roundMoney(remainingDiscount));
                return;
            }

            const ratio = eligibleSubtotal > 0
                ? this.toNumber(item.line_total_amount) / eligibleSubtotal
                : 0;
            const allocation = this.roundMoney(totalDiscountAmount * ratio);
            allocations.set(item.id, allocation);
            remainingDiscount = this.roundMoney(remainingDiscount - allocation);
        });

        return allocations;
    }

    private async findDiscountCodeByCode(code: string): Promise<DiscountCodeEntity | null> {
        return this.discountCodeRepository
            .createQueryBuilder('discount_code')
            .where('LOWER(discount_code.code) = LOWER(:code)', { code: code.trim() })
            .getOne();
    }

    private async loadCartById(
        cartId: number,
        manager?: EntityManager,
    ): Promise<CartWithRelations> {
        const repository = manager?.getRepository(CartEntity) || this.cartRepository;
        return repository.findOne({
            where: { id: cartId } as any,
            relations: ['items', 'items.course', 'discount_code'],
        }) as Promise<CartWithRelations>;
    }

    private getCoursePricing(course: CourseEntity) {
        const basePrice = this.toNumber(course.price);
        const discountedPrice = course.has_active_discount && course.discounted_price !== null
            ? this.toNumber(course.discounted_price)
            : null;
        const hasCourseDiscount = discountedPrice !== null && discountedPrice < basePrice;
        const finalPrice = hasCourseDiscount ? discountedPrice : basePrice;

        return {
            basePrice: this.roundMoney(basePrice),
            discountedPrice: discountedPrice !== null ? this.roundMoney(discountedPrice) : null,
            finalPrice: this.roundMoney(finalPrice),
            hasCourseDiscount,
        };
    }

    private calculateEnrollmentDiscountPercentage(basePrice: number, paidPrice: number): number | null {
        const base = this.toNumber(basePrice);
        const paid = this.toNumber(paidPrice);

        if (base <= 0 || paid >= base) {
            return null;
        }

        return Math.min(100, Math.max(0, Math.round(((base - paid) / base) * 100)));
    }

    private buildCartResponse(cart: CartWithRelations) {
        return {
            id: cart.id,
            user_id: cart.user_id,
            session_token: cart.session_token,
            status: cart.status,
            currency: cart.currency,
            expires_at: cart.expires_at,
            subtotal_amount: this.toNumber(cart.subtotal_amount),
            course_discount_amount: this.toNumber(cart.course_discount_amount),
            coupon_discount_amount: this.toNumber(cart.coupon_discount_amount),
            payable_amount: this.toNumber(cart.payable_amount),
            discount_code: cart.discount_code
                ? {
                    id: cart.discount_code.id,
                    code: cart.discount_code.code,
                    scope: cart.discount_code.scope,
                    type: cart.discount_code.type,
                    value: this.toNumber(cart.discount_code.value),
                }
                : null,
            items: cart.items.map((item) => ({
                id: item.id,
                course_id: item.course_id,
                course_title: item.course_title_snapshot,
                course_slug: item.course_slug_snapshot,
                quantity: item.quantity,
                base_unit_price: this.toNumber(item.base_unit_price),
                discounted_unit_price: item.discounted_unit_price !== null
                    ? this.toNumber(item.discounted_unit_price)
                    : null,
                final_unit_price: this.toNumber(item.final_unit_price),
                line_total_amount: this.toNumber(item.line_total_amount),
                has_course_discount: item.has_course_discount,
                is_coupon_eligible: item.is_coupon_eligible,
            })),
        };
    }

    private buildEmptyCartResponse(sessionToken?: string) {
        return {
            id: null,
            user_id: null,
            session_token: sessionToken || null,
            status: CartStatus.ACTIVE,
            currency: 'IRR',
            expires_at: null,
            subtotal_amount: 0,
            course_discount_amount: 0,
            coupon_discount_amount: 0,
            payable_amount: 0,
            discount_code: null,
            items: [],
        };
    }

    private getNextCartExpiry() {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + this.cartLifetimeInDays);
        return expiresAt;
    }

    private generateOrderNumber(): string {
        return `ORD-${Date.now()}-${randomInt(1000, 9999)}`;
    }

    private toNumber(value: unknown): number {
        if (typeof value === 'number') {
            return value;
        }

        return Number(value || 0);
    }

    private roundMoney(value: number): number {
        return Number(this.toNumber(value).toFixed(2));
    }
}