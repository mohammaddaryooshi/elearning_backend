import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../repositories/posts.repository';
import { PostsQueryDto } from '../dto/posts-query.dto';
import { DataSource, In, QueryFailedError } from 'typeorm';
import { CategoriesRepository } from '@modules/categories/repositories/categories.repository';
import { UsersRepository } from '@modules/users/repositories/users.repository';
import { PostStatus, RobotsDirective } from '@constants/app.constants';
import { PostEntity } from '@entities/post.entity';
import { PostMetaEntity } from '@entities/post-meta.entity';
import { POST_MESSAGES } from '../constants/post.messages';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { CategoryEntity } from '@entities/category.entity';

@Injectable()
export class PostsService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly postsRepository: PostsRepository,
        private readonly categoriesRepository: CategoriesRepository,
        private readonly usersRepository: UsersRepository,
    ) { }
    async findAll(query: PostsQueryDto) {
        return this.postsRepository.findPostsList(query);
    }

    async create(dto: CreatePostDto, userId: number): Promise<PostEntity> {
        // 1) Guardهای اولیه ورودی
        if (!userId || Number.isNaN(Number(userId))) {
            throw new BadRequestException('شناسه نویسنده نامعتبر است.');
        }

        if (!Array.isArray(dto.category_ids) || dto.category_ids.length === 0) {
            throw new BadRequestException('حداقل یک دسته‌بندی الزامی است.');
        }

        // نرمال‌سازی category_ids: تبدیل به number + حذف مقادیر نامعتبر + حذف تکراری
        const categoryIds = [...new Set(dto.category_ids.map(Number))]
            .filter((id) => Number.isInteger(id) && id > 0);

        if (categoryIds.length === 0) {
            throw new BadRequestException('شناسه دسته‌بندی‌ها نامعتبر است.');
        }

        // 2) چک slug و نویسنده
        const [slugExists, author] = await Promise.all([
            this.postsRepository.findBySlug(dto.slug),
            this.usersRepository.findById(Number(userId)),
        ]);

        if (slugExists) {
            throw new ConflictException(
                POST_MESSAGES.ERRORS.SLUG_ALREADY_EXISTS(dto.slug),
            );
        }

        if (!author) {
            throw new NotFoundException(
                POST_MESSAGES.ERRORS.AUTHOR_NOT_FOUND(Number(userId)),
            );
        }

        // 3) اعتبارسنجی وضعیت انتشار
        if (dto.status === PostStatus.PUBLISHED && !dto.published_at) {
            throw new BadRequestException(
                POST_MESSAGES.ERRORS.PUBLISHED_AT_REQUIRED_FOR_PUBLISHED(),
            );
        }

        const categoryEntities = await this.categoriesRepository.findByIds(categoryIds);
        console.log('categoryIds input:', categoryIds);
        console.log('categoryEntities found:', categoryEntities.map(c => c.id));

        // 5) بررسی اینکه همه‌ی idها واقعاً وجود داشته باشند
        const foundIds = new Set<number>(
            categoryEntities.map((c) => Number(c.id)),
        );
        const missed = categoryIds.find((id) => !foundIds.has(id));

        if (missed) {
            throw new NotFoundException(
                POST_MESSAGES.ERRORS.CATEGORY_NOT_FOUND(missed),
            );
        }

        // 6) تراکنش ساخت پست + سئو
        return this.dataSource.transaction(async (manager) => {
            const postRepo = manager.getRepository(PostEntity);
            const metaRepo = manager.getRepository(PostMetaEntity);

            const post = postRepo.create({
                title: dto.title,
                slug: dto.slug,
                content: dto.content,
                excerpt: dto.excerpt ?? null,
                cover_image: dto.cover_image ?? null,
                reading_time: dto.reading_time ?? null,
                status: dto.status ?? PostStatus.DRAFT,
                published_at: dto.published_at ? new Date(dto.published_at) : null,
                user_id: Number(userId),
                categories: categoryEntities,
            });

            const savedPost = await postRepo.save(post);

            const meta = metaRepo.create({
                post_id: savedPost.id,
                meta_title: dto.meta_title ?? null,
                meta_description: dto.meta_description ?? null,
                canonical_url: dto.canonical_url ?? null,
                robots: dto.robots ?? RobotsDirective.INDEX,
                og_title: dto.og_title ?? null,
                og_description: dto.og_description ?? null,
                og_image: dto.og_image ?? null,
                schema_markup: dto.schema_markup ?? null,
                focus_keyword: dto.focus_keyword ?? null,
            });

            await metaRepo.save(meta);

            const fullPost = await postRepo.findOne({
                where: { id: savedPost.id },
                relations: { categories: true, author: true, seo: true },
            });

            if (!fullPost) {
                throw new NotFoundException(
                    POST_MESSAGES.ERRORS.POST_NOT_FOUND(savedPost.id),
                );
            }

            return fullPost;
        });
    }

    async getAdminPostDetails(postId: number): Promise<PostEntity> {
        const post = await this.postsRepository.findAdminPostById(postId);
        if (!post) throw new NotFoundException('پست مورد نظر یافت نشد.');
        return post;
    }



    async updateAdminPost(postId: number, dto: UpdatePostDto): Promise<PostEntity> {
        const savedPostId = await this.dataSource.transaction(async (manager) => {
            const postRepo = manager.getRepository(PostEntity);
            const metaRepo = manager.getRepository(PostMetaEntity);
            const categoryRepo = manager.getRepository(CategoryEntity);

            const post = await postRepo.findOne({
                where: { id: postId },
                relations: {
                    categories: true,
                },
            });

            if (!post) {
                throw new NotFoundException('پست مورد نظر یافت نشد.');
            }

            // slug: فقط اگر واقعاً تغییر کرده باشد
            if (dto.slug !== undefined && dto.slug !== post.slug) {
                const duplicated = await postRepo
                    .createQueryBuilder('post')
                    .where('post.slug = :slug', { slug: dto.slug })
                    .andWhere('post.id != :postId', { postId })
                    .getCount();

                if (duplicated > 0) {
                    throw new ConflictException('اسلاگ وارد شده قبلاً استفاده شده است.');
                }
            }

            // categories
            if (dto.category_ids !== undefined) {
                if (dto.category_ids.length > 0) {
                    const categories = await categoryRepo.findBy({
                        id: In(dto.category_ids),
                    });

                    if (categories.length !== dto.category_ids.length) {
                        throw new BadRequestException('یک یا چند دسته‌بندی معتبر نیست.');
                    }

                    post.categories = categories;
                } else {
                    post.categories = [];
                }
            }

            // main fields
            if (dto.title !== undefined) post.title = dto.title;
            if (dto.slug !== undefined) post.slug = dto.slug;
            if (dto.content !== undefined) post.content = dto.content;
            if (dto.excerpt !== undefined) post.excerpt = dto.excerpt;
            if (dto.cover_image !== undefined) post.cover_image = dto.cover_image;
            if (dto.reading_time !== undefined) post.reading_time = dto.reading_time;
            if (dto.status !== undefined) post.status = dto.status;

            // published_at
            if (dto.published_at !== undefined) {
                post.published_at = dto.published_at ? new Date(dto.published_at) : null;
            } else if (dto.status === PostStatus.PUBLISHED && !post.published_at) {
                post.published_at = new Date();
            }

            // save post
            try {
                await postRepo.save(post);
            } catch (e) {
                if (
                    e instanceof QueryFailedError &&
                    (e as any).driverError?.code === 'ER_DUP_ENTRY'
                ) {
                    throw new ConflictException('اسلاگ وارد شده قبلاً استفاده شده است.');
                }
                throw e;
            }

            // meta payload
            const metaPayload = {
                meta_title: dto.meta_title,
                meta_description: dto.meta_description,
                canonical_url: dto.canonical_url,
                robots: dto.robots,
                og_title: dto.og_title,
                og_description: dto.og_description,
                og_image: dto.og_image,
                schema_markup: dto.schema_markup,
                focus_keyword: dto.focus_keyword,
            };

            const metaUpdates = Object.fromEntries(
                Object.entries(metaPayload).filter(([, value]) => value !== undefined),
            );

            const hasMetaUpdate = Object.keys(metaUpdates).length > 0;

            if (hasMetaUpdate) {
                const currentMeta = await metaRepo.findOne({
                    where: { post_id: post.id },
                });

                if (!currentMeta) {
                    const newMeta = metaRepo.create({
                        post_id: post.id,
                        ...metaUpdates,
                    });
                    await metaRepo.save(newMeta);
                } else {
                    Object.assign(currentMeta, metaUpdates);
                    await metaRepo.save(currentMeta);
                }
            }

            return post.id;
        });

        const updated = await this.postsRepository.findAdminPostById(savedPostId);
        if (!updated) {
            throw new NotFoundException('پست مورد نظر یافت نشد.');
        }

        return updated;
    }



    async deleteAdminPost(postId: number): Promise<void> {
        const post = await this.postsRepository.findById(postId);
        if (!post) throw new NotFoundException('پست مورد نظر یافت نشد.');

        await this.postsRepository.softDelete(postId);
    }

}
