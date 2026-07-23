import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiConflictResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // ──────────────────────────────────────────────────────────────────────────
    // GET /users
    // ──────────────────────────────────────────────────────────────────────────
    @Get()
    @ApiOperation({ summary: 'List all users (paginated)' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiOkResponse({
        description: 'Paginated list of users',
        schema: {
            example: {
                data: [{ id: 1, email: 'user@example.com', name: 'John', role: 'user' }],
                total: 1,
                page: 1,
                lastPage: 1,
            },
        },
    })
    async findAll(
        @Query('page', new ParseIntPipe({ optional: true })) page = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
    ) {
        const result = await this.usersService.findPaginated(page, limit);
        return {
            ...result,
            data: result.data.map((u) => this.usersService.sanitize(u)),
        };
    }

    // ──────────────────────────────────────────────────────────────────────────
    // GET /users/:id
    // ──────────────────────────────────────────────────────────────────────────
    @Get(':id')
    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiOkResponse({ description: 'User found' })
    @ApiNotFoundResponse({ description: 'User not found' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const user = await this.usersService.findById(id);
        return this.usersService.sanitize(user);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // POST /users
    // ──────────────────────────────────────────────────────────────────────────
    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiCreatedResponse({ description: 'User created successfully' })
    @ApiBadRequestResponse({ description: 'Validation error' })
    @ApiConflictResponse({ description: 'Email already in use' })
    async create(@Body() dto: CreateUserDto) {
        const user = await this.usersService.create(dto);
        return this.usersService.sanitize(user);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // PATCH /users/:id
    // ──────────────────────────────────────────────────────────────────────────
    @Patch(':id')
    @ApiOperation({ summary: 'Update a user (partial update)' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiOkResponse({ description: 'User updated successfully' })
    @ApiBadRequestResponse({ description: 'Validation error' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiConflictResponse({ description: 'Email already in use' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateUserDto,
    ) {
        const user = await this.usersService.update(id, dto);
        return this.usersService.sanitize(user);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // DELETE /users/:id  (soft-delete)
    // ──────────────────────────────────────────────────────────────────────────
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Soft-delete a user by ID' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiNoContentResponse({ description: 'User deleted successfully' })
    @ApiNotFoundResponse({ description: 'User not found' })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.usersService.remove(id);
    }
}
