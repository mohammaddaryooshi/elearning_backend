import { Module } from '@nestjs/common';
import { LessonsController } from './controllers/lessons.controller';
import { LessonsService } from './services/lessons.service';

@Module({
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
