import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PostEntity } from '@entities/post.entity';
import { PostsQueryDto } from '../dto/posts-query.dto';
import { BaseRepository } from '@base/base.repository';
import { PostViewEntity } from '@entities/post-views.entity';

@Injectable()
export class PostsRepository extends BaseRepository<PostEntity> {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepo: Repository<PostEntity>,
    ) {
        super(postRepo);
    }

    async findPostsList(query: PostsQueryDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const qb = this.postRepo
            .createQueryBuilder('post')
            .leftJoin('post.author', 'author')
            .leftJoin('post.categories', 'category')
            .leftJoin(PostViewEntity, 'pv', 'pv.post_id = post.id')
            .select('post.id', 'id')
            .addSelect('post.title', 'title')
            .addSelect('post.slug', 'slug')
            .addSelect('post.status', 'status')
            .addSelect('post.created_at', 'created_at')
            .addSelect('post.published_at', 'published_at')
            .addSelect("CONCAT(COALESCE(author.first_name, ''), ' ', COALESCE(author.last_name, ''))", 'author_name')
            .addSelect('COUNT(DISTINCT pv.id)', 'views_count')
            .addSelect('GROUP_CONCAT(DISTINCT category.name ORDER BY category.name ASC SEPARATOR ", ")', 'categories')
            .groupBy('post.id')
            .addGroupBy('author.id');

        this.applyFilters(qb, query);
        this.applySort(qb, query);

        const totalQb = this.postRepo
            .createQueryBuilder('post')
            .leftJoin('post.author', 'author')
            .leftJoin('post.categories', 'category');

        this.applyFilters(totalQb, query);

        const total = await totalQb.select('COUNT(DISTINCT post.id)', 'total').getRawOne<{ total: string }>();
        const rows = await qb.offset(skip).limit(limit).getRawMany();

        return {
            items: rows.map((r) => ({
                id: Number(r.id),
                title: r.title,
                status: r.status,
                created_at: r.created_at,
                published_at: r.published_at,
                categories: r.categories ? String(r.categories).split(', ') : [],
                views_count: Number(r.views_count ?? 0),
                author_name: (r.author_name || '').trim(),
                article_link: `/posts/${r.slug}`,
            })),
            meta: {
                total: Number(total?.total ?? 0),
                page,
                limit,
                pageCount: Math.ceil(Number(total?.total ?? 0) / limit),
            },
        };
    }

    private applyFilters(qb: SelectQueryBuilder<PostEntity>, query: PostsQueryDto) {
        if (query.search) {
            qb.andWhere(
                `(post.title LIKE :search
          OR CONCAT(COALESCE(author.first_name, ''), ' ', COALESCE(author.last_name, '')) LIKE :search
          OR category.name LIKE :search)`,
                { search: `%${query.search}%` },
            );
        }

        if (query.status) {
            qb.andWhere('post.status = :status', { status: query.status });
        }

        if (query.category_id) {
            qb.andWhere('category.id = :categoryId', { categoryId: query.category_id });
        }
    }

    private applySort(qb: SelectQueryBuilder<PostEntity>, query: PostsQueryDto) {
        const sortBy = query.sortBy ?? 'default';
        const sortOrder = query.sortOrder ?? 'DESC';

        if (sortBy === 'most_viewed') {
            qb.orderBy('views_count', 'DESC');
            return;
        }

        if (sortBy === 'least_viewed') {
            qb.orderBy('views_count', 'ASC');
            return;
        }

        const sortMap: Record<string, string> = {
            default: 'post.created_at',
            created_at: 'post.created_at',
            published_at: 'post.published_at',
            title: 'post.title',
        };

        qb.orderBy(sortMap[sortBy] ?? 'post.created_at', sortOrder);
    }

    async findBySlug(slug: string): Promise<PostEntity | null> {
        return this.findOne({ slug } as any);
    }

    async findAdminPostById(id: number): Promise<PostEntity | null> {
        return this.postRepo.findOne({
            where: { id } as any,
            relations: {
                author: true,
                categories: true,
                seo: true,
            } as any,
        });
    }

    async existsBySlugExceptId(slug: string, postId: number): Promise<boolean> {
        const count = await this.postRepo
            .createQueryBuilder('post')
            .where('post.slug = :slug', { slug })
            .andWhere('post.id != :postId', { postId })
            .getCount();

        return count > 0;
    }
}
