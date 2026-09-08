import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CourseCommentStatus } from '@constants/app.constants';

export class UpdateCourseCommentStatusDto {
    @ApiProperty({
        enum: CourseCommentStatus,
        example: CourseCommentStatus.APPROVED,
    })
    @IsEnum(CourseCommentStatus)
    status: CourseCommentStatus;
}
