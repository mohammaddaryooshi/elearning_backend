import { Injectable } from '@nestjs/common';
import { CreateEnrollmentDto } from '../dto/create-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  findAll() {
    return [];
  }

  findOne(id: number) {
    return { id };
  }

  create(dto: CreateEnrollmentDto) {
    return { ...dto, status: 'pending' };
  }
}
