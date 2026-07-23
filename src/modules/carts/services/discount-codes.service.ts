import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiscountCodeEntity } from '@entities/discount-code.entity';
import { DiscountCodeScope, DiscountCodeType } from '@constants/app.constants';
import { CreateDiscountCodeDto } from '../dto/create-discount-code.dto';
import { UpdateDiscountCodeDto } from '../dto/update-discount-code.dto';

@Injectable()
export class DiscountCodesService {
    constructor(
        @InjectRepository(DiscountCodeEntity)
        private readonly discountCodeRepository: Repository<DiscountCodeEntity>,
    ) { }

    async list() {
        return this.discountCodeRepository.find({
            order: { id: 'DESC' },
        });
    }

    async getById(id: number) {
        const discountCode = await this.discountCodeRepository.findOne({
            where: { id } as any,
        });

        if (!discountCode) {
            throw new NotFoundException('Discount code not found');
        }

        return discountCode;
    }

    async create(dto: CreateDiscountCodeDto) {
        await this.ensureUniqueCode(dto.code);
        const payload = this.normalizeAndValidate(dto);
        return this.discountCodeRepository.save(this.discountCodeRepository.create(payload));
    }

    async update(id: number, dto: UpdateDiscountCodeDto) {
        const current = await this.getById(id);
        if (dto.code && dto.code.toLowerCase() !== current.code.toLowerCase()) {
            await this.ensureUniqueCode(dto.code);
        }

        const payload = this.normalizeAndValidate({ ...current, ...dto } as any);
        await this.discountCodeRepository.update(id, payload);
        return this.getById(id);
    }

    private async ensureUniqueCode(code: string) {
        const existing = await this.discountCodeRepository
            .createQueryBuilder('discount_code')
            .where('LOWER(discount_code.code) = LOWER(:code)', { code: code.trim() })
            .getOne();

        if (existing) {
            throw new ConflictException('Discount code already exists');
        }
    }

    private normalizeAndValidate(dto: CreateDiscountCodeDto | UpdateDiscountCodeDto) {
        if (!dto.code?.trim()) {
            throw new BadRequestException('Discount code is required');
        }

        if (dto.type === DiscountCodeType.PERCENTAGE && Number(dto.value) > 100) {
            throw new BadRequestException('Percentage discount code value must be less than or equal to 100');
        }

        if (Number(dto.value) <= 0) {
            throw new BadRequestException('Discount code value must be greater than 0');
        }

        if (dto.starts_at && dto.expires_at && new Date(dto.starts_at) > new Date(dto.expires_at)) {
            throw new BadRequestException('Discount code start date must be before expiration date');
        }

        if (dto.scope === DiscountCodeScope.COURSE && !dto.course_id) {
            throw new BadRequestException('course_id is required for course-scoped discount codes');
        }

        if (dto.scope === DiscountCodeScope.CATEGORY && !dto.category_id) {
            throw new BadRequestException('category_id is required for category-scoped discount codes');
        }

        if (dto.scope === DiscountCodeScope.ENTIRE_CART) {
            dto.course_id = null as any;
            dto.category_id = null as any;
        }

        if (dto.scope === DiscountCodeScope.COURSE) {
            dto.category_id = null as any;
        }

        if (dto.scope === DiscountCodeScope.CATEGORY) {
            dto.course_id = null as any;
        }

        return {
            ...dto,
            code: dto.code.trim().toUpperCase(),
            starts_at: dto.starts_at ? new Date(dto.starts_at) : null,
            expires_at: dto.expires_at ? new Date(dto.expires_at) : null,
        };
    }
}