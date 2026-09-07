import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PostCommentStatus } from '@constants/app.constants';

export class UpdatePostCommentStatusDto {
    @ApiProperty({ enum: PostCommentStatus, example: PostCommentStatus.APPROVED })
    @IsEnum(PostCommentStatus)
    status: PostCommentStatus;
}
