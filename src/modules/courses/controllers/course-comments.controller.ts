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
import { CourseCommentsService } from '../services/course-comments.service';
import { CourseCommentsQueryDto } from '../dto/course-comments-query.dto';
import { UpdateCourseCommentStatusDto } from '../dto/update-course-comment-status.dto';
import { ReplyCourseCommentDto } from '../dto/reply-course-comment.dto';

@ApiTags('Admin Course Comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('course-comments')
export class CourseCommentsController {
    constructor(private readonly commentsService: CourseCommentsService) { }

    @Get()
    @ApiOperation({
        summary: 'Get course comments list',
        description:
            'Paginated comments list with search on comment text and author name + status filter.',
    })
    @ResponseMessage('لیست کامنت‌های دوره با موفقیت دریافت شد.')
    findAll(@Query() query: CourseCommentsQueryDto) {
        return this.commentsService.findAll(query);
    }

    @Get(':id')
    @ApiParam({ name: 'id', example: 12 })
    @ApiResponse({ status: 200, description: 'Course comment details fetched.' })
    @ApiResponse({ status: 404, description: 'Course comment not found.' })
    @ResponseMessage('جزئیات کامنت دوره با موفقیت دریافت شد.')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.commentsService.findOne(id);
    }

    @Patch(':id/status')
    @ApiParam({ name: 'id', example: 12 })
    @ApiBody({ type: UpdateCourseCommentStatusDto })
    @ResponseMessage('وضعیت کامنت دوره با موفقیت تغییر کرد.')
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCourseCommentStatusDto,
    ) {
        return this.commentsService.updateStatus(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiParam({ name: 'id', example: 12 })
    @ResponseMessage('کامنت دوره با موفقیت حذف شد.')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.commentsService.remove(id);
    }

    @Post(':id/reply')
    @ApiParam({ name: 'id', example: 12, description: 'Parent comment id' })
    @ApiBody({ type: ReplyCourseCommentDto })
    @ResponseMessage('پاسخ به کامنت دوره با موفقیت ثبت شد.')
    reply(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ReplyCourseCommentDto,
        @CurrentUser('id') userId: number,
    ) {
        return this.commentsService.reply(id, dto, userId);
    }
}
