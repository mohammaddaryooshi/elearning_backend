import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { ResponseMessage } from '@decorators/response-message.decorator';
import { CurrentUser } from '@decorators/current-user.decorator';
import { PostCommentsService } from '../services/post-comments.service';
import { PostCommentsQueryDto } from '../dto/post-comments-query.dto';
import { UpdatePostCommentStatusDto } from '../dto/update-post-comment-status.dto';
import { ReplyPostCommentDto } from '../dto/reply-post-comment.dto';

@ApiTags('Admin Post Comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('post-comments')
export class PostCommentsController {
    constructor(private readonly commentsService: PostCommentsService) { }

    @Get()
    @ApiOperation({
        summary: 'Get comments list',
        description: 'Paginated comments list with search on comment text and author name + status filter.',
    })
    @ResponseMessage('لیست کامنت‌ها با موفقیت دریافت شد.')
    findAll(@Query() query: PostCommentsQueryDto) {
        return this.commentsService.findAll(query);
    }

    @Get(':id')
    @ApiParam({ name: 'id', example: 12 })
    @ApiResponse({ status: 200, description: 'Comment details fetched.' })
    @ApiResponse({ status: 404, description: 'Comment not found.' })
    @ResponseMessage('جزئیات کامنت با موفقیت دریافت شد.')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.commentsService.findOne(id);
    }

    @Patch(':id/status')
    @ApiParam({ name: 'id', example: 12 })
    @ApiBody({ type: UpdatePostCommentStatusDto })
    @ResponseMessage('وضعیت کامنت با موفقیت تغییر کرد.')
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdatePostCommentStatusDto,
    ) {
        return this.commentsService.updateStatus(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiParam({ name: 'id', example: 12 })
    @ResponseMessage('کامنت با موفقیت حذف شد.')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.commentsService.remove(id);
    }

    @Post(':id/reply')
    @ApiParam({ name: 'id', example: 12, description: 'Parent comment id' })
    @ApiBody({ type: ReplyPostCommentDto })
    @ResponseMessage('پاسخ با موفقیت ثبت شد.')
    reply(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ReplyPostCommentDto,
        @CurrentUser('id') userId: number,
    ) {
        return this.commentsService.reply(id, dto, userId);
    }
}
