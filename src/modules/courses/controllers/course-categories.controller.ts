import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { CourseCategoriesService } from '../services/course-categories.service';
import { CreateCourseCategoryDto } from '../dto/create-course-category.dto';
import { UpdateCourseCategoryDto } from '../dto/update-course-category.dto';
import { CourseCategoriesQueryDto } from '../dto/course-categories-query.dto';
import { COURSE_CATEGORY_MESSAGES } from '../constant/course-category.messages';
import { ResponseMessage } from '@decorators/response-message.decorator';

@ApiTags('Admin Course Categories')
@Controller('course-categories')
export class CourseCategoriesController {
    constructor(private readonly categoriesService: CourseCategoriesService) { }

    @Post()
    @ApiOperation({
        summary: 'Create a new course category',
        description:
            'Creates a new course category record. The slug must be unique. Optionally accepts parent category.',
    })
    @ResponseMessage(COURSE_CATEGORY_MESSAGES.RESPONSE.CREATE_SUCCESS())
    create(@Body() dto: CreateCourseCategoryDto) {
        return this.categoriesService.create(dto);
    }

    @Get()
    @ApiOperation({
        summary: 'Get course categories list',
        description:
            'Returns a paginated list of course categories with optional search, filtering, and sorting.',
    })
    @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number (starts from 1)' })
    @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of items per page' })
    @ApiQuery({ name: 'search', required: false, example: 'frontend', description: 'Search term for category fields' })
    @ApiQuery({ name: 'sortBy', required: false, example: 'created_at', description: 'Sort field' })
    @ApiQuery({ name: 'sortOrder', required: false, example: 'DESC', description: 'Sort direction (ASC or DESC)' })
    @ApiQuery({ name: 'is_active', required: false, example: true, description: 'Filter by active status' })
    @ApiQuery({ name: 'parent_id', required: false, example: 1, description: 'Filter by parent category id' })
    findAll(@Query() query: CourseCategoriesQueryDto) {
        return this.categoriesService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get course category details by id',
        description:
            'Returns a single course category by its id, including related parent/children if configured in service.',
    })
    @ApiParam({ name: 'id', type: Number, example: 12, description: 'Category id' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Update course category by id',
        description:
            'Updates an existing course category. Only provided fields are updated. Slug uniqueness is validated.',
    })
    @ApiParam({ name: 'id', type: Number, example: 12, description: 'Category id' })
    @ResponseMessage(COURSE_CATEGORY_MESSAGES.RESPONSE.UPDATE_SUCCESS())
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCourseCategoryDto) {
        return this.categoriesService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Soft delete course category by id',
        description:
            'Performs soft delete on course category (record is not permanently removed).',
    })
    @ApiParam({ name: 'id', type: Number, example: 12, description: 'Category id' })
    @ResponseMessage(COURSE_CATEGORY_MESSAGES.RESPONSE.SOFT_DELETE_SUCCESS())
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.categoriesService.remove(id);
        return { message: COURSE_CATEGORY_MESSAGES.DELETED(id) };
    }

    @Patch(':id/restore')
    @ApiOperation({
        summary: 'Restore a soft-deleted course category',
        description:
            'Restores a previously soft-deleted course category and makes it active in normal queries again.',
    })
    @ApiParam({ name: 'id', type: Number, example: 12, description: 'Category id' })
    @ResponseMessage(COURSE_CATEGORY_MESSAGES.RESPONSE.RESTORE_SUCCESS())
    restore(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.restore(id);
    }
}
