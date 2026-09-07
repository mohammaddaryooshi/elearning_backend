import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PostCommentsRepository } from '../repositories/post-comments.repository';
import { PostCommentsQueryDto } from '../dto/post-comments-query.dto';
import { UpdatePostCommentStatusDto } from '../dto/update-post-comment-status.dto';
import { ReplyPostCommentDto } from '../dto/reply-post-comment.dto';
import { PostCommentEntity } from '@entities/post-comment.entity';
import { PostCommentStatus } from '@constants/app.constants';
import { POST_COMMENT_MESSAGES } from '../constants/post-comment.messages';

@Injectable()
export class PostCommentsService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly commentsRepository: PostCommentsRepository,
    ) { }

    async findAll(query: PostCommentsQueryDto) {
        return this.commentsRepository.findAdminList(query);
    }

    async findOne(id: number) {
        const comment = await this.commentsRepository.findAdminById(id);
        if (!comment) throw new NotFoundException(POST_COMMENT_MESSAGES.NOT_FOUND);
        return comment;
    }

    async updateStatus(
        id: number,
        dto: UpdatePostCommentStatusDto,
    ): Promise<PostCommentEntity> {
        const comment = await this.commentsRepository.findById(id);
        if (!comment) throw new NotFoundException(POST_COMMENT_MESSAGES.NOT_FOUND);

        comment.status = dto.status;
        await this.commentsRepository.save(comment);

        const updated = await this.commentsRepository.findAdminById(id);
        if (!updated) throw new NotFoundException(POST_COMMENT_MESSAGES.NOT_FOUND);
        return updated;
    }

    async remove(id: number): Promise<void> {
        const comment = await this.commentsRepository.findById(id);
        if (!comment) throw new NotFoundException(POST_COMMENT_MESSAGES.NOT_FOUND);
        await this.commentsRepository.softDelete(id);
    }

    async reply(
        commentId: number,
        dto: ReplyPostCommentDto,
        adminUserId: number,
    ): Promise<PostCommentEntity> {
        const parent = await this.commentsRepository.findById(commentId);
        if (!parent) {
            throw new NotFoundException(POST_COMMENT_MESSAGES.PARENT_NOT_FOUND);
        }

        if (parent.depth >= 1) {
            throw new BadRequestException(POST_COMMENT_MESSAGES.REPLY_DEPTH_NOT_ALLOWED);
        }

        const created = await this.dataSource.transaction(async (manager) => {
            const repo = manager.getRepository(PostCommentEntity);

            const reply = repo.create({
                post_id: parent.post_id,
                user_id: adminUserId,
                parent_id: parent.id,
                depth: 1,
                content: dto.content,
                status: PostCommentStatus.APPROVED,
            });

            return repo.save(reply);
        });

        const full = await this.commentsRepository.findAdminById(created.id);
        if (!full) {
            throw new NotFoundException(
                POST_COMMENT_MESSAGES.REPLY_CREATED_BUT_NOT_RETRIEVABLE,
            );
        }

        return full;
    }
}
