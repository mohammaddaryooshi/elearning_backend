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
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoriesQueryDto } from '../dto/categories-query.dto';
import { CATEGORY_MESSAGES } from '../constant/category.messages';
import { ResponseMessage } from '@decorators/response-message.decorator';

@ApiTags('Admin Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    @ApiOperation({
        summary: 'Create a new category',
        description:
            'Creates a new category record. The slug must be unique. Optionally accepts parent category and SEO fields.',
    })
    @ResponseMessage(CATEGORY_MESSAGES.RESPONSE.CREATE_SUCCESS())
    create(@Body() dto: CreateCategoryDto) {
        return this.categoriesService.create(dto);
    }

    @Get()
    @ApiOperation({
        summary: 'Get categories list',
        description:
            'Returns a paginated list of categories with optional search, filtering, and sorting.',
    })
    @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number (starts from 1)' })
    @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of items per page' })
    @ApiQuery({ name: 'search', required: false, example: 'programming', description: 'Search term for category fields' })
    @ApiQuery({
        name: 'sortBy',
        required: false,
        example: 'created_at',
        description: 'Sort field',
    })
    @ApiQuery({
        name: 'sortOrder',
        required: false,
        example: 'DESC',
        description: 'Sort direction (ASC or DESC)',
    })
    @ApiQuery({
        name: 'is_active',
        required: false,
        example: true,
        description: 'Filter by active status',
    })
    @ApiQuery({
        name: 'parent_id',
        required: false,
        example: 1,
        description: 'Filter by parent category id',
    })
    findAll(@Query() query: CategoriesQueryDto) {
        return this.categoriesService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get category details by id',
        description:
            'Returns a single category by its id, including related parent/children if configured in service.',
    })
    @ApiParam({ name: 'id', type: Number, example: 12, description: 'Category id' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Update category by id',
        description:
            'Updates an existing category. Only provided fields are updated. Slug uniqueness is validated.',
    })
    @ApiParam({ name: 'id', type: Number, example: 12, description: 'Category id' })
    @ResponseMessage(CATEGORY_MESSAGES.RESPONSE.UPDATE_SUCCESS())
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
        return this.categoriesService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Soft delete category by id',
        description:
            'Performs soft delete on category (record is not permanently removed).',
    })
    @ApiParam({ name: 'id', type: Number, example: 12, description: 'Category id' })
    @ResponseMessage(CATEGORY_MESSAGES.RESPONSE.SOFT_DELETE_SUCCESS())
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.categoriesService.remove(id);
        return { message: CATEGORY_MESSAGES.DELETED(id) };
    }

    @Patch(':id/restore')
    @ApiOperation({
        summary: 'Restore a soft-deleted category',
        description:
            'Restores a previously soft-deleted category and makes it active in normal queries again.',
    })
    @ApiParam({ name: 'id', type: Number, example: 12, description: 'Category id' })
    @ResponseMessage(CATEGORY_MESSAGES.RESPONSE.RESTORE_SUCCESS())
    restore(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.restore(id);
    }
}
