import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PermissionsService } from '../services/permissions.service';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { PermissionEntity } from '@entities/permission.entity';
import { PaginatedResult } from '@base/base.repository';
import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';

@ApiTags('Permissions')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token' })
@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) { }
    @Get()
    @ApiOperation({
        summary: 'List all permissions',
        description: 'Returns a paginated list of all registered permissions.',
    })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'createdAt' })
    @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], example: 'DESC' })
    @ApiQuery({ name: 'name', required: false, type: String, description: 'Filter by permission name' })
    @ApiOkResponse({ description: 'Permissions retrieved successfully' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    async findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('sortBy', new DefaultValuePipe('createdAt')) sortBy: string,
        @Query('sortOrder', new DefaultValuePipe('DESC')) sortOrder: 'ASC' | 'DESC',
        @Query('name') name?: string,
    ): Promise<PaginatedResult<PermissionEntity>> {
        const order: FindOptionsOrder<PermissionEntity> = {
            [sortBy]: sortOrder,
        } as FindOptionsOrder<PermissionEntity>;

        const where: FindOptionsWhere<PermissionEntity> = {};
        if (name) where.name = name;

        return this.permissionsService.findAll(page, limit, order, where);
    }


    @Get(':id')
    @ApiOperation({
        summary: 'Get a permission by ID',
        description: 'Returns a single permission by its ID.',
    })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Permission ID' })
    @ApiOkResponse({ description: 'Permission retrieved successfully' })
    @ApiNotFoundResponse({ description: 'Permission not found' })
    @ApiBadRequestResponse({ description: 'Invalid permission ID' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const permission = await this.permissionsService.findOne(id);
        return { data: permission, message: 'دسترسی با موفقیت دریافت شد' };
    }

    @Post()
    @ApiOperation({
        summary: 'Create a permission',
        description: 'Creates a new permission entry.',
    })
    @ApiCreatedResponse({ description: 'Permission created successfully' })
    @ApiBadRequestResponse({ description: 'Validation error' })
    @ApiConflictResponse({ description: 'Permission name already exists' })
    async create(@Body() dto: CreatePermissionDto) {
        const permission = await this.permissionsService.create(dto);
        return { permission, message: 'دسترسی با موفقیت ایجاد شد' };
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Update a permission',
        description: 'Updates the name or description of an existing permission.',
    })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Permission ID' })
    @ApiOkResponse({ description: 'Permission updated successfully' })
    @ApiBadRequestResponse({ description: 'Validation error' })
    @ApiNotFoundResponse({ description: 'Permission not found' })
    @ApiConflictResponse({ description: 'Permission name already exists' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdatePermissionDto,
    ) {
        const permission = await this.permissionsService.update(id, dto);
        return { data: permission, message: 'دسترسی با موفقیت ویرایش شد' };
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Soft-delete a permission',
        description: 'Soft-deletes a permission. Fails if assigned to any role.',
    })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Permission ID' })
    @ApiOkResponse({ description: 'Permission deactivated successfully' })
    @ApiNotFoundResponse({ description: 'Permission not found' })
    @ApiConflictResponse({ description: 'Permission is assigned to one or more roles' })
    @ApiBadRequestResponse({ description: 'Invalid permission ID' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        const permission = await this.permissionsService.remove(id);
        return { permission, message: 'دسترسی با موفقیت غیرفعال شد' };
    }
}
