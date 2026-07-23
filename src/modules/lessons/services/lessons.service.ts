import { Injectable } from '@nestjs/common';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { UpdateLessonDto } from '../dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  findAll() {
    return [];
  }

  findOne(id: number) {
    return { id };
  }

  create(dto: CreateLessonDto) {
    return dto;
  }

  update(id: number, dto: UpdateLessonDto) {
    return { id, ...dto };
  }

  remove(id: number) {
    return { id, deleted: true };
  }
}
