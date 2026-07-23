import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  findAll() {
    return [];
  }

  findOne(id: number) {
    return { id };
  }

  create(dto: CreateNotificationDto) {
    return { ...dto, isRead: false };
  }
}
