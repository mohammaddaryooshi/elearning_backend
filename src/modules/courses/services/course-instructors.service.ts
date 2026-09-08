import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CourseInstructorsRepository } from '../repositories/course-instructors.repository';
import { CourseInstructorsQueryDto } from '../dto/course-instructors-query.dto';
import { UpdateCourseInstructorDto } from '../dto/update-course-instructor.dto';
import { COURSE_INSTRUCTOR_MESSAGES } from '../constant/course-instructor.messages';
import { CreateCourseInstructorDto } from '../dto/create-course-instructor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class CourseInstructorsService {
    constructor(
        private readonly instructorsRepository: CourseInstructorsRepository,
        @InjectRepository(UserEntity)
        private readonly usersRepo: Repository<UserEntity>,
    ) { }

    findAll(query: CourseInstructorsQueryDto) {
        return this.instructorsRepository.findAdminList(query);
    }

    async findOne(id: number) {
        const instructor = await this.instructorsRepository.findAdminById(id);
        if (!instructor) {
            throw new NotFoundException(COURSE_INSTRUCTOR_MESSAGES.NOT_FOUND);
        }
        return instructor;
    }
    async create(dto: CreateCourseInstructorDto) {
        const exists = await this.instructorsRepository.findBySlug(dto.slug, true);
        if (exists) {
            throw new BadRequestException(COURSE_INSTRUCTOR_MESSAGES.SLUG_ALREADY_EXISTS);
        }

        if (dto.user_id != null) {
            const user = await this.usersRepo.findOne({
                where: { id: dto.user_id },
            });

            if (!user) {
                throw new BadRequestException('کاربر انتخاب‌شده وجود ندارد.');
            }
        }

        const entity = this.instructorsRepository.createEntity({
            full_name: dto.full_name,
            slug: dto.slug,
            avatar_image: dto.avatar_image ?? null,
            headline: dto.headline ?? null,
            bio: dto.bio ?? null,
            is_active: dto.is_active ?? true,
            user_id: dto.user_id ?? null,
        });

        const created = await this.instructorsRepository.save(entity);
        return this.findOne(created.id);
    }



    async update(id: number, dto: UpdateCourseInstructorDto) {
        const instructor = await this.instructorsRepository.findById(id, {
            withDeleted: true,
        } as any);

        if (!instructor) {
            throw new NotFoundException(COURSE_INSTRUCTOR_MESSAGES.NOT_FOUND);
        }

        Object.assign(instructor, dto);
        await this.instructorsRepository.save(instructor);

        return this.findOne(id);
    }

    async remove(id: number) {
        const instructor = await this.instructorsRepository.findById(id);
        if (!instructor) {
            throw new NotFoundException(COURSE_INSTRUCTOR_MESSAGES.NOT_FOUND);
        }

        return await this.instructorsRepository.softDelete(id);

    }

    async restore(id: number) {
        const instructor = await this.instructorsRepository.findById(id, {
            withDeleted: true,
        } as any);

        if (!instructor) {
            throw new NotFoundException(COURSE_INSTRUCTOR_MESSAGES.NOT_FOUND);
        }

        return await this.instructorsRepository.restore(id);

    }
}
