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
import { PermissionQueryDto } from '../dto/permission-query.dto';
import { ResponseMessage } from '@decorators/response-message.decorator';

@ApiTags('Permissions')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token' })
@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) { }
    @Get()
    @ApiOperation({
        summary: 'List all Permissions',
        description: 'Returns all Permissions including their associated roles.',
    })
    @ApiOkResponse({ description: 'Permissions retrieved successfully' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    async findAll(@Query() query: PermissionQueryDto): Promise<PaginatedResult<PermissionEntity>> {
        return this.permissionsService.findAll(query);
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
        return await this.permissionsService.findOne(id);

    }

    @Post()
    @ApiOperation({
        summary: 'Create a permission',
        description: 'Creates a new permission entry.',
    })
    @ApiCreatedResponse({ description: 'Permission created successfully' })
    @ApiBadRequestResponse({ description: 'Validation error' })
    @ApiConflictResponse({ description: 'Permission name already exists' })
    @ResponseMessage('دسترسی با موفقیت ایجاد شد')
    async create(@Body() dto: CreatePermissionDto) {
        return await this.permissionsService.create(dto);
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
    @ResponseMessage('دسترسی با موفقیت ویرایش شد')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdatePermissionDto,
    ) {
        return await this.permissionsService.update(id, dto);

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
    @ResponseMessage('دسترسی با موفقیت غیر فعال شد')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.permissionsService.remove(id);
    }
}
