import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CourseEntity } from '@entities/course.entity';
import {
  CoursePriceType,
  CourseQueryDto,
  CourseSort,
} from '../dto/course-query.dto';

@Injectable()
export class CoursesRepository extends Repository<CourseEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CourseEntity, dataSource.createEntityManager());
  }

  async findCourses(
    query: CourseQueryDto,
  ): Promise<[CourseEntity[], number]> {
    const {
      search,
      status,
      category_id,
      instructor_id,
      price_type = CoursePriceType.ALL,
      sort = CourseSort.DEFAULT,
      page = 1,
      limit = 20,
    } = query;

    const queryBuilder = this.createQueryBuilder('course')
      .leftJoinAndSelect('course.category', 'category')
      .leftJoinAndSelect('course.instructor', 'instructor')
      .where('course.deleted_at IS NULL');

    if (search?.trim()) {
      queryBuilder.andWhere(
        `
                (
                    course.title LIKE :search
                    OR instructor.full_name LIKE :search
                    OR course.slug LIKE :search
                )
                `,
        {
          search: `%${search.trim()}%`,
        },
      );
    }

    if (status) {
      queryBuilder.andWhere('course.status = :status', {
        status,
      });
    }

    if (category_id) {
      queryBuilder.andWhere('course.category_id = :category_id', {
        category_id,
      });
    }

    if (instructor_id) {
      queryBuilder.andWhere('course.instructor_id = :instructor_id', {
        instructor_id,
      });
    }

    if (price_type === CoursePriceType.FREE) {
      queryBuilder.andWhere('course.price = 0');
    }

    if (price_type === CoursePriceType.PAID) {
      queryBuilder.andWhere('course.price > 0');
    }

    switch (sort) {
      case CourseSort.NEWEST:
        queryBuilder.orderBy('course.created_at', 'DESC');
        break;

      case CourseSort.OLDEST:
        queryBuilder.orderBy('course.created_at', 'ASC');
        break;

      case CourseSort.MOST_SOLD:
        queryBuilder.orderBy('course.total_students_count', 'DESC');
        break;

      case CourseSort.LEAST_SOLD:
        queryBuilder.orderBy('course.total_students_count', 'ASC');
        break;

      case CourseSort.DEFAULT:
      default:
        queryBuilder.orderBy('course.created_at', 'DESC');
        break;
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    return queryBuilder.getManyAndCount();
  }

  async findCourseById(
    id: number,
    withDeleted = false,
  ): Promise<CourseEntity | null> {
    const queryBuilder = this.createQueryBuilder('course')
      .leftJoinAndSelect('course.category', 'category')
      .leftJoinAndSelect('course.instructor', 'instructor')
      .leftJoinAndSelect('course.chapters', 'chapters')
      .leftJoinAndSelect('chapters.lessons', 'chapterLessons')
      .where('course.id = :id', { id });

    if (withDeleted) {
      queryBuilder.withDeleted();
    } else {
      queryBuilder.andWhere('course.deleted_at IS NULL');
    }

    return queryBuilder.getOne();
  }

  async findBySlug(
    slug: string,
    withDeleted = false,
  ): Promise<CourseEntity | null> {
    const queryBuilder = this.createQueryBuilder('course').where('course.slug = :slug', {
      slug,
    });

    if (withDeleted) {
      queryBuilder.withDeleted();
    } else {
      queryBuilder.andWhere('course.deleted_at IS NULL');
    }

    return queryBuilder.getOne();
  }
}
