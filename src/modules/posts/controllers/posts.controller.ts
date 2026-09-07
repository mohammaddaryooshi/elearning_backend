import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '@decorators/response-message.decorator';
import { PostsService } from '../services/posts.service';
import { PostsQueryDto } from '../dto/posts-query.dto';
import { POST_MESSAGES } from '../constants/post.messages';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { CreatePostDto } from '../dto/create-post.dto';
import { CurrentUser } from '@decorators/current-user.decorator';
import { UpdatePostDto } from '../dto/update-post.dto';


@ApiTags('Admin Posts')
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Get()
    @ApiOperation({
        summary: 'Get posts list',
        description:
            'Returns paginated posts list with combined search (title, author name, category), filters, and sorting.',
    })
    @ResponseMessage(POST_MESSAGES.RESPONSE.LIST_SUCCESS())
    findAll(@Query() query: PostsQueryDto) {
        return this.postsService.findAll(query);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Create a new post',
        description:
            'Creates a new post with categories and SEO meta data. The authenticated user will be set as the author.',
    })
    @ResponseMessage(POST_MESSAGES.RESPONSE.CREATE_SUCCESS())
    create(@Body() dto: CreatePostDto, @CurrentUser('id') userId: number,) {
        return this.postsService.create(dto, userId);
    }

    @Get(':id')
    @ResponseMessage('جزئیات پست با موفقیت دریافت شد.')
    @ApiOperation({
        summary: 'Get post details for admin panel',
        description: 'Returns full post detail including author, categories, and SEO metadata.',
    })
    @ApiParam({ name: 'id', description: 'Post ID', example: 15 })
    @ApiResponse({ status: 200, description: 'Post details fetched successfully.' })
    @ApiResponse({ status: 404, description: 'Post not found.' })
    async getOne(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return await this.postsService.getAdminPostDetails(id);

    }

    @Patch(':id')
    @ApiBody({ type: UpdatePostDto })
    @ResponseMessage('پست با موفقیت ویرایش شد.')
    @ApiOperation({
        summary: 'Update a post for admin panel',
        description: 'Updates post base fields, categories, and SEO metadata.',
    })
    @ApiParam({ name: 'id', description: 'Post ID', example: 15 })
    @ApiResponse({ status: 200, description: 'Post updated successfully.' })
    @ApiResponse({ status: 400, description: 'Validation error or invalid category IDs.' })
    @ApiResponse({ status: 404, description: 'Post not found.' })
    @ApiResponse({ status: 409, description: 'Slug conflict.' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdatePostDto,
    ) {
        return await this.postsService.updateAdminPost(id, dto);

    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('پست با موفقیت حذف شد.')
    @ApiOperation({
        summary: 'Delete a post for admin panel',
        description: 'Soft deletes a post by ID.',
    })
    @ApiParam({ name: 'id', description: 'Post ID', example: 15 })
    @ApiResponse({ status: 200, description: 'Post deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Post not found.' })
    async remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return await this.postsService.deleteAdminPost(id);

    }
}
