import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '@base/base.repository';
import { CourseInstructorEntity } from '@entities/course-instructor.entity';
import {
    CourseInstructorsQueryDto,
    InstructorActiveFilter,
    InstructorCoursesSort,
} from '../dto/course-instructors-query.dto';

@Injectable()
export class CourseInstructorsRepository extends BaseRepository<CourseInstructorEntity> {
    constructor(
        @InjectRepository(CourseInstructorEntity)
        private readonly instructorRepo: Repository<CourseInstructorEntity>,
    ) {
        super(instructorRepo);
    }

    async findAdminList(query: CourseInstructorsQueryDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const qb = this.instructorRepo
            .createQueryBuilder('i')
            .leftJoin('i.courses', 'c')
            .select('i.id', 'id')
            .addSelect('i.full_name', 'full_name')
            .addSelect('i.headline', 'headline')
            .addSelect('i.is_active', 'is_active')
            .addSelect('i.created_at', 'created_at')
            .addSelect('COUNT(c.id)', 'courses_count')
            .groupBy('i.id');

        this.applyFilters(qb, query);

        if (query.courses_sort === InstructorCoursesSort.MIN) {
            qb.orderBy('COUNT(c.id)', 'ASC');
        } else if (query.courses_sort === InstructorCoursesSort.MAX) {
            qb.orderBy('COUNT(c.id)', 'DESC');
        } else {
            qb.orderBy('i.created_at', 'DESC');
        }

        qb.offset(skip).limit(limit);

        const totalQb = this.instructorRepo.createQueryBuilder('i');
        this.applyFilters(totalQb, query);
        const total = await totalQb.getCount();

        const rows = await qb.getRawMany();

        return {
            items: rows.map((r) => ({
                id: Number(r.id),
                instructor: r.full_name,
                title: r.headline ?? '-',
                courses_count: Number(r.courses_count ?? 0),
                status: Boolean(r.is_active),
                created_at: r.created_at,
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
        qb: SelectQueryBuilder<CourseInstructorEntity>,
        query: CourseInstructorsQueryDto,
    ) {
        if (query.search) {
            qb.andWhere('(i.full_name LIKE :search OR i.headline LIKE :search)', {
                search: `%${query.search}%`,
            });
        }

        if (query.is_active === InstructorActiveFilter.ACTIVE) {
            qb.andWhere('i.is_active = :active', { active: true });
        } else if (query.is_active === InstructorActiveFilter.INACTIVE) {
            qb.andWhere('i.is_active = :active', { active: false });
        }
    }

    async findBySlug(slug: string, withDeleted = false) {
        return this.instructorRepo.findOne({
            where: { slug } as any,
            withDeleted,
        });
    }

    createEntity(payload: Partial<CourseInstructorEntity>) {
        return this.instructorRepo.create(payload);
    }


    async findAdminById(id: number) {
        return this.instructorRepo.findOne({
            where: { id } as any,
            relations: {
                user: true,
                courses: true,
            } as any,
            withDeleted: true,
        });
    }
}
