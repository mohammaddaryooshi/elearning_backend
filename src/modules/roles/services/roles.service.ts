import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from '../dto/create-role.dto';

@Injectable()
export class RolesService {
  findAll() {
    return [];
  }

  findOne(id: number) {
    return { id };
  }

  create(dto: CreateRoleDto) {
    return dto;
  }
}
