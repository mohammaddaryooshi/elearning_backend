import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CourseCommentEntity } from '@entities/course-comment.entity';
import { CourseCommentStatus } from '@constants/app.constants';
import { CourseCommentsRepository } from '../repositories/course-comments.repository';
import { CourseCommentsQueryDto } from '../dto/course-comments-query.dto';
import { UpdateCourseCommentStatusDto } from '../dto/update-course-comment-status.dto';
import { ReplyCourseCommentDto } from '../dto/reply-course-comment.dto';
import { COURSE_COMMENT_MESSAGES } from '../constant/course-comment.messages';


@Injectable()
export class CourseCommentsService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly commentsRepository: CourseCommentsRepository,
    ) { }

    async findAll(query: CourseCommentsQueryDto) {
        return this.commentsRepository.findAdminList(query);
    }

    async findOne(id: number) {
        const comment = await this.commentsRepository.findAdminById(id);
        if (!comment) throw new NotFoundException(COURSE_COMMENT_MESSAGES.NOT_FOUND);
        return comment;
    }

    async updateStatus(
        id: number,
        dto: UpdateCourseCommentStatusDto,
    ): Promise<CourseCommentEntity> {
        const comment = await this.commentsRepository.findById(id);
        if (!comment) throw new NotFoundException(COURSE_COMMENT_MESSAGES.NOT_FOUND);

        comment.status = dto.status;
        await this.commentsRepository.save(comment);

        const updated = await this.commentsRepository.findAdminById(id);
        if (!updated) throw new NotFoundException(COURSE_COMMENT_MESSAGES.NOT_FOUND);

        return updated;
    }

    async remove(id: number): Promise<void> {
        const comment = await this.commentsRepository.findById(id);
        if (!comment) throw new NotFoundException(COURSE_COMMENT_MESSAGES.NOT_FOUND);

        await this.commentsRepository.softDelete(id);
    }

    async reply(
        commentId: number,
        dto: ReplyCourseCommentDto,
        adminUserId: number,
    ): Promise<CourseCommentEntity> {
        const parent = await this.commentsRepository.findById(commentId);
        if (!parent) {
            throw new NotFoundException(COURSE_COMMENT_MESSAGES.PARENT_NOT_FOUND);
        }

        if (parent.depth >= 1) {
            throw new BadRequestException(
                COURSE_COMMENT_MESSAGES.REPLY_DEPTH_NOT_ALLOWED,
            );
        }

        const created = await this.dataSource.transaction(async (manager) => {
            const repo = manager.getRepository(CourseCommentEntity);

            const reply = repo.create({
                course_id: parent.course_id,
                user_id: adminUserId,
                parent_id: parent.id,
                depth: 1,
                content: dto.content,
                rating: null,
                status: CourseCommentStatus.APPROVED,
            });

            return repo.save(reply);
        });

        const full = await this.commentsRepository.findAdminById(created.id);
        if (!full) {
            throw new NotFoundException(
                COURSE_COMMENT_MESSAGES.REPLY_CREATED_BUT_NOT_RETRIEVABLE,
            );
        }

        return full;
    }
}
