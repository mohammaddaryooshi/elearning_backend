// src/modules/users/controllers/users.controller.ts
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
    ApiQuery,
} from '@nestjs/swagger';

import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '@entities/user.entity';
import { PaginatedResult } from '../../../common/base/base.repository';
import { UsersQueryDto } from '../dto/users-query.dto';
import { UserListItemDto } from '../dto/user-list-item.dto';
import { ResponseMessage } from '@decorators/response-message.decorator';
import { USER_MESSAGES } from '../constants/user.messages';

@ApiTags('Admin Users')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token' })
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @ApiOperation({
        summary: 'Get list of users',
        description:
            'Retrieves a paginated, searchable and filterable list of users with registered courses count and role filtering.',
    })
    @ApiQuery({ name: 'search', required: false, description: 'Search in first name, last name, email, phone number', example: 'ali' })
    @ApiQuery({ name: 'roleId', required: false, description: 'Filter by role id', example: 3 })
    @ApiOkResponse({ description: 'Users list retrieved successfully' })
    @ApiBadRequestResponse({ description: 'Invalid sort or query parameters' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    async findAll(@Query() query: UsersQueryDto): Promise<PaginatedResult<UserListItemDto>> {
        return this.usersService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get a user',
        description: 'Returns the details of a user along with their roles.',
    })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'User ID' })
    @ApiOkResponse({ description: 'User retrieved successfully' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiBadRequestResponse({ description: 'Invalid user ID' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
        return this.usersService.findOne(id);
    }

    @Post()
    @ApiOperation({
        summary: 'Create a user',
        description: 'Creates a new user with the selected role.',
    })
    @ApiCreatedResponse({ description: 'User created successfully' })
    @ApiBadRequestResponse({ description: 'Validation error or invalid role' })
    @ApiConflictResponse({ description: 'Email or phone number already exists' })
    @ResponseMessage(USER_MESSAGES.USER_CREATE_SUCCESSFULLY)
    async create(@Body() dto: CreateUserDto): Promise<UserEntity> {
        return this.usersService.create(dto);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Update a user',
        description: 'Updates the profile or role of a user.',
    })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'User ID' })
    @ApiOkResponse({ description: 'User updated successfully' })
    @ApiBadRequestResponse({ description: 'Validation error or invalid role' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiConflictResponse({ description: 'Email or phone number already exists' })
    @ResponseMessage(USER_MESSAGES.USER_UPDATE_SUCCESSFULLY)
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto): Promise<UserEntity> {
        return this.usersService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete a user',
        description: 'Soft-deletes a user.',
    })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'User ID' })
    @ApiOkResponse({ description: 'User soft-deleted successfully' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiBadRequestResponse({ description: 'Invalid user ID' })
    @ResponseMessage(USER_MESSAGES.USER_SOFT_DELETE_SUCCESSFULLY)
    async remove(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
        return this.usersService.remove(id);
    }
}
