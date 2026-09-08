import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CourseEntity } from '@entities/course.entity';
import { CourseCategoryEntity } from '@entities/course-category.entity';
import { CourseInstructorEntity } from '@entities/course-instructor.entity';

import { CourseStatus } from '@constants/app.constants';
import { CourseQueryDto } from '../dto/course-query.dto';
import { CoursesRepository } from '../repositories/courses.repository';
import { CourseMessages } from '../constant/course.messages';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';



@Injectable()
export class CoursesService {
  constructor(
    private readonly coursesRepository: CoursesRepository,
  ) { }

  async findAll(query: CourseQueryDto) {
    const [courses, total] =
      await this.coursesRepository.findCourses(query);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    return {
      items: courses.map((course) => this.toListResponse(course)),
      meta: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<CourseEntity> {
    const course =
      await this.coursesRepository.findCourseById(id);

    if (!course) {
      throw new NotFoundException(
        CourseMessages.COURSE_NOT_FOUND,
      );
    }

    return course;
  }

  async create(dto: CreateCourseDto): Promise<CourseEntity> {
    await this.validateRelations(
      dto.category_id,
      dto.instructor_id,
    );

    const existingBySlug =
      await this.coursesRepository.findBySlug(dto.slug, true);

    if (existingBySlug) {
      throw new ConflictException(
        CourseMessages.SLUG_ALREADY_EXISTS,
      );
    }

    const status = dto.status ?? CourseStatus.DRAFT;

    const publishedAt =
      status === CourseStatus.PUBLISHED
        ? dto.published_at ?? new Date()
        : dto.published_at ?? null;

    const course = this.coursesRepository.create({
      title: dto.title,
      slug: dto.slug,
      description: dto.description ?? null,
      thumbnail_image: dto.thumbnail_image ?? null,
      cover_image: dto.cover_image ?? null,
      duration_hourse: dto.duration_hourse ?? 0,
      total_students_count: dto.total_students_count ?? 0,
      price: dto.price,
      discounted_price: dto.discounted_price ?? null,
      discount_percentage: dto.discount_percentage ?? null,
      has_active_discount: dto.has_active_discount ?? false,
      status,
      published_at: publishedAt,
      category_id: dto.category_id,
      instructor_id: dto.instructor_id,
      // SEO
      seo_title: dto.seo_title ?? null,
      seo_description: dto.seo_description ?? null,
      canonical_url: dto.canonical_url ?? null,
      og_title: dto.og_title ?? null,
      og_description: dto.og_description ?? null,
      og_image: dto.og_image ?? null,
      no_index: dto.no_index ?? false,
      no_follow: dto.no_follow ?? false,
    });

    return this.coursesRepository.save(course);
  }

  async update(
    id: number,
    dto: UpdateCourseDto,
  ): Promise<CourseEntity> {
    const course = await this.findOne(id);

    if (dto.slug && dto.slug !== course.slug) {
      const existingBySlug =
        await this.coursesRepository.findBySlug(
          dto.slug,
          true,
        );

      if (
        existingBySlug &&
        existingBySlug.id !== course.id
      ) {
        throw new ConflictException(
          CourseMessages.SLUG_ALREADY_EXISTS,
        );
      }
    }

    if (
      dto.category_id !== undefined ||
      dto.instructor_id !== undefined
    ) {
      await this.validateRelations(
        dto.category_id ?? course.category_id,
        dto.instructor_id ?? course.instructor_id,
      );
    }

    if (dto.title !== undefined) {
      course.title = dto.title;
    }

    if (dto.slug !== undefined) {
      course.slug = dto.slug;
    }

    if (dto.description !== undefined) {
      course.description = dto.description;
    }

    if (dto.thumbnail_image !== undefined) {
      course.thumbnail_image = dto.thumbnail_image;
    }

    if (dto.cover_image !== undefined) {
      course.cover_image = dto.cover_image;
    }

    if (dto.duration_hourse !== undefined) {
      course.duration_hourse = dto.duration_hourse;
    }

    if (dto.total_students_count !== undefined) {
      course.total_students_count =
        dto.total_students_count;
    }

    if (dto.price !== undefined) {
      course.price = dto.price;
    }

    if (dto.discounted_price !== undefined) {
      course.discounted_price = dto.discounted_price;
    }

    if (dto.discount_percentage !== undefined) {
      course.discount_percentage =
        dto.discount_percentage;
    }

    if (dto.has_active_discount !== undefined) {
      course.has_active_discount =
        dto.has_active_discount;
    }

    if (dto.category_id !== undefined) {
      course.category_id = dto.category_id;
    }

    if (dto.instructor_id !== undefined) {
      course.instructor_id = dto.instructor_id;
    }

    if (dto.status !== undefined) {
      course.status = dto.status;

      if (
        dto.status === CourseStatus.PUBLISHED &&
        dto.published_at === undefined &&
        !course.published_at
      ) {
        course.published_at = new Date();
      }
    }

    if (dto.published_at !== undefined) {
      course.published_at = dto.published_at;
    }

    // SEO
    if (dto.seo_title !== undefined) course.seo_title = dto.seo_title;
    if (dto.seo_description !== undefined) course.seo_description = dto.seo_description;
    if (dto.canonical_url !== undefined) course.canonical_url = dto.canonical_url;
    if (dto.og_title !== undefined) course.og_title = dto.og_title;
    if (dto.og_description !== undefined) course.og_description = dto.og_description;
    if (dto.og_image !== undefined) course.og_image = dto.og_image;
    if (dto.no_index !== undefined) course.no_index = dto.no_index;
    if (dto.no_follow !== undefined) course.no_follow = dto.no_follow;

    return this.coursesRepository.save(course);
  }

  async remove(id: number): Promise<void> {
    const course = await this.findOne(id);

    await this.coursesRepository.softRemove(course);
  }

  async restore(id: number): Promise<CourseEntity> {
    const course =
      await this.coursesRepository.findCourseById(id, true);

    if (!course) {
      throw new NotFoundException(
        CourseMessages.COURSE_NOT_FOUND,
      );
    }

    if (!course.deleted_at) {
      return course;
    }

    await this.coursesRepository.restore(id);

    const restoredCourse =
      await this.coursesRepository.findCourseById(id);

    if (!restoredCourse) {
      throw new NotFoundException(
        CourseMessages.COURSE_NOT_FOUND,
      );
    }

    return restoredCourse;
  }

  private async validateRelations(
    categoryId: number,
    instructorId: number,
  ): Promise<void> {
    const categoryRepository =
      this.coursesRepository.manager.getRepository(
        CourseCategoryEntity,
      );

    const instructorRepository =
      this.coursesRepository.manager.getRepository(
        CourseInstructorEntity,
      );

    const [category, instructor] = await Promise.all([
      categoryRepository.findOne({
        where: {
          id: categoryId,
        },
      }),
      instructorRepository.findOne({
        where: {
          id: instructorId,
        },
      }),
    ]);

    if (!category) {
      throw new NotFoundException(
        CourseMessages.CATEGORY_NOT_FOUND,
      );
    }

    if (!instructor) {
      throw new NotFoundException(
        CourseMessages.INSTRUCTOR_NOT_FOUND,
      );
    }
  }

  private toListResponse(course: CourseEntity) {
    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      created_at: course.created_at,
      status: course.status,
      published_at: course.published_at,
      category: course.category
        ? {
          id: course.category.id,
          name: course.category.name,
          slug: course.category.slug,
        }
        : null,
      instructor: course.instructor
        ? {
          id: course.instructor.id,
          full_name: course.instructor.full_name,
          slug: course.instructor.slug,
          avatar_image:
            course.instructor.avatar_image,
        }
        : null,
      total_students_count:
        course.total_students_count,
      link: `/courses/${course.slug}`,
    };
  }
}
