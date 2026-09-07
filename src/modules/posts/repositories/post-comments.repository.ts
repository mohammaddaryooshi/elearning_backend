import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PostCommentEntity } from '@entities/post-comment.entity';
import { BaseRepository } from '@base/base.repository';
import { PostCommentsQueryDto } from '../dto/post-comments-query.dto';

@Injectable()
export class PostCommentsRepository extends BaseRepository<PostCommentEntity> {
    constructor(
        @InjectRepository(PostCommentEntity)
        private readonly commentRepo: Repository<PostCommentEntity>,
    ) {
        super(commentRepo);
    }

    async findAdminList(query: PostCommentsQueryDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const qb = this.commentRepo
            .createQueryBuilder('c')
            .leftJoin('c.user', 'u')
            .leftJoin('c.post', 'p')
            .select('c.id', 'id')
            .addSelect('c.content', 'content')
            .addSelect('c.status', 'status')
            .addSelect('c.created_at', 'created_at')
            .addSelect('p.title', 'post_title')
            .addSelect('p.slug', 'post_slug')
            .addSelect("TRIM(CONCAT(COALESCE(u.first_name,''), ' ', COALESCE(u.last_name,'')))", 'author_name');

        this.applyFilters(qb, query);

        const totalQb = this.commentRepo
            .createQueryBuilder('c')
            .leftJoin('c.user', 'u')
            .leftJoin('c.post', 'p');

        this.applyFilters(totalQb, query);

        const [rows, totalRaw] = await Promise.all([
            qb.orderBy('c.created_at', 'DESC').offset(skip).limit(limit).getRawMany(),
            totalQb.select('COUNT(DISTINCT c.id)', 'total').getRawOne<{ total: string }>(),
        ]);

        const total = Number(totalRaw?.total ?? 0);

        return {
            items: rows.map((r) => ({
                id: Number(r.id),
                author_name: r.author_name || '-',
                content: r.content,
                created_at: r.created_at,
                post_title: r.post_title,
                link: `/posts/${r.post_slug}#comment-${r.id}`,
                status: r.status,
            })),
            meta: {
                total,
                page,
                limit,
                pageCount: Math.ceil(total / limit),
            },
        };
    }

    private applyFilters(qb: SelectQueryBuilder<PostCommentEntity>, query: PostCommentsQueryDto) {
        if (query.search) {
            qb.andWhere(
                `(c.content LIKE :search OR CONCAT(COALESCE(u.first_name,''), ' ', COALESCE(u.last_name,'')) LIKE :search)`,
                { search: `%${query.search}%` },
            );
        }

        if (query.status) {
            qb.andWhere('c.status = :status', { status: query.status });
        }
    }

    async findAdminById(id: number): Promise<PostCommentEntity | null> {
        return this.commentRepo.findOne({
            where: { id } as any,
            relations: {
                user: true,
                post: true,
                parent: true,
            } as any,
        });
    }
}
