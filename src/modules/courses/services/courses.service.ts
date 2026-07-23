import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';

@Injectable()
export class CoursesService {
  findAll() {
    return [];
  }

  findOne(id: number) {
    return { id };
  }

  create(dto: CreateCourseDto) {
    return dto;
  }

  
  update(id: number, dto: UpdateCourseDto) {
    return { id, ...dto };
  }

  remove(id: number) {
    return { id, deleted: true };
  }
}
