import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '@base/base.repository';
import { CourseCommentEntity } from '@entities/course-comment.entity';
import { CourseCommentsQueryDto } from '../dto/course-comments-query.dto';

@Injectable()
export class CourseCommentsRepository extends BaseRepository<CourseCommentEntity> {
    constructor(
        @InjectRepository(CourseCommentEntity)
        private readonly commentRepo: Repository<CourseCommentEntity>,
    ) {
        super(commentRepo);
    }

    async findAdminList(query: CourseCommentsQueryDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const qb = this.commentRepo
            .createQueryBuilder('c')
            .leftJoin('c.user', 'u')
            .leftJoin('c.course', 'course')
            .select('c.id', 'id')
            .addSelect('c.content', 'content')
            .addSelect('c.status', 'status')
            .addSelect('c.rating', 'rating')
            .addSelect('c.created_at', 'created_at')
            .addSelect('course.title', 'course_title')
            .addSelect('course.slug', 'course_slug')
            .addSelect(
                "TRIM(CONCAT(COALESCE(u.first_name,''), ' ', COALESCE(u.last_name,'')))",
                'author_name',
            );

        this.applyFilters(qb, query);

        const totalQb = this.commentRepo
            .createQueryBuilder('c')
            .leftJoin('c.user', 'u')
            .leftJoin('c.course', 'course');

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
                rating: r.rating !== null ? Number(r.rating) : null,
                created_at: r.created_at,
                course_title: r.course_title,
                link: `/courses/${r.course_slug}#comment-${r.id}`,
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

    private applyFilters(
        qb: SelectQueryBuilder<CourseCommentEntity>,
        query: CourseCommentsQueryDto,
    ) {
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

    async findAdminById(id: number): Promise<CourseCommentEntity | null> {
        return this.commentRepo.findOne({
            where: { id } as any,
            relations: {
                user: true,
                course: true,
                parent: true,
            } as any,
        });
    }
}
