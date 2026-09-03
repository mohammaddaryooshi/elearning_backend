import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
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
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RolesService } from '../services/roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

@ApiTags('Roles')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token' })
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Get()
    @ApiOperation({
        summary: 'List all roles',
        description: 'Returns all roles including their associated permissions.',
    })
    @ApiOkResponse({ description: 'Roles retrieved successfully' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    async findAll() {
        const roles = await this.rolesService.findAll();
        return { data: roles, message: 'لیست نقش‌ها با موفقیت دریافت شد' };
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get a role by ID',
        description: 'Returns a single role with its permissions.',
    })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Role ID' })
    @ApiOkResponse({ description: 'Role retrieved successfully' })
    @ApiNotFoundResponse({ description: 'Role not found' })
    @ApiBadRequestResponse({ description: 'Invalid role ID' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const role = await this.rolesService.findOne(id);
        return { data: role, message: 'نقش با موفقیت دریافت شد' };
    }

    @Post()
    @ApiOperation({
        summary: 'Create a role',
        description: 'Creates a new role with the selected permissions.',
    })
    @ApiCreatedResponse({ description: 'Role created successfully' })
    @ApiBadRequestResponse({ description: 'Validation error or invalid permission ID' })
    @ApiConflictResponse({ description: 'Role name already exists' })
    async create(@Body() dto: CreateRoleDto) {
        const role = await this.rolesService.create(dto);
        return { data: role, message: 'نقش با موفقیت ایجاد شد' };
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Update a role',
        description: 'Updates the name, description, or permissions of an existing role.',
    })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Role ID' })
    @ApiOkResponse({ description: 'Role updated successfully' })
    @ApiBadRequestResponse({ description: 'Validation error or invalid permission ID' })
    @ApiNotFoundResponse({ description: 'Role not found' })
    @ApiConflictResponse({ description: 'Role name already exists' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateRoleDto,
    ) {
        const role = await this.rolesService.update(id, dto);
        return { data: role, message: 'نقش با موفقیت ویرایش شد' };
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Soft-delete a role',
        description: 'Soft-deletes a role. Fails if the role is still assigned to users.',
    })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'Role ID' })
    @ApiOkResponse({ description: 'Role deactivated successfully' })
    @ApiNotFoundResponse({ description: 'Role not found' })
    @ApiConflictResponse({ description: 'Role is assigned to one or more users' })
    @ApiBadRequestResponse({ description: 'Invalid role ID' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        const role = await this.rolesService.remove(id);
        return { data: role, message: 'نقش با موفقیت غیرفعال شد' };
    }
}
