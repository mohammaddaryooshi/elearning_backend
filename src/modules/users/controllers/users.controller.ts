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
import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '@entities/user.entity';
import { PaginatedResult } from '../../../common/base/base.repository';

@ApiTags('کاربران')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'توکن احراز هویت نامعتبر یا موجود نیست' })
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @ApiOperation({
        summary: 'دریافت لیست کاربران',
        description: 'فهرست صفحه‌بندی‌شده کاربران به همراه نقش‌ها را برمی‌گرداند.',
    })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'created_at' })
    @ApiQuery({
        name: 'sortOrder',
        required: false,
        enum: ['ASC', 'DESC'],
        example: 'DESC',
    })
    @ApiQuery({ name: 'email', required: false, type: String, description: 'فیلتر بر اساس ایمیل' })
    @ApiQuery({
        name: 'phone_number',
        required: false,
        type: String,
        description: 'فیلتر بر اساس شماره موبایل',
    })
    @ApiOkResponse({ description: 'لیست کاربران با موفقیت دریافت شد' })
    @ApiBadRequestResponse({ description: 'پارامتر مرتب‌سازی نامعتبر است' })
    @ApiInternalServerErrorResponse({ description: 'خطای داخلی سرور' })
    async findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('sortBy', new DefaultValuePipe('createdAt')) sortBy: string,
        @Query('sortOrder', new DefaultValuePipe('DESC')) sortOrder: 'ASC' | 'DESC',
        @Query('name') name?: string,
    ): Promise<PaginatedResult<UserEntity>> {
        const order: FindOptionsOrder<UserEntity> = {
            [sortBy]: sortOrder,
        } as FindOptionsOrder<UserEntity>;
        const where: FindOptionsWhere<UserEntity> = {};
        return this.usersService.findAll(page, limit, order, where);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'مشاهده یک کاربر',
        description: 'جزئیات یک کاربر به همراه نقش‌های آن را برمی‌گرداند.',
    })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'شناسه کاربر' })
    @ApiOkResponse({ description: 'کاربر با موفقیت دریافت شد' })
    @ApiNotFoundResponse({ description: 'کاربر مورد نظر یافت نشد' })
    @ApiBadRequestResponse({ description: 'شناسه کاربر نامعتبر است' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const user = await this.usersService.findOne(id);
        return { data: user, message: 'کاربر با موفقیت دریافت شد' };
    }

    @Post()
    @ApiOperation({
        summary: 'ایجاد کاربر',
        description: 'یک کاربر جدید با نقش انتخاب‌شده ایجاد می‌کند.',
    })
    @ApiCreatedResponse({ description: 'کاربر با موفقیت ایجاد شد' })
    @ApiBadRequestResponse({ description: 'خطای اعتبارسنجی یا نقش نامعتبر' })
    @ApiConflictResponse({ description: 'ایمیل یا شماره تلفن تکراری است' })
    async create(@Body() dto: CreateUserDto) {
        const user = await this.usersService.create(dto);
        return { data: user, message: 'کاربر با موفقیت ایجاد شد' };
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'ویرایش کاربر',
        description: 'اطلاعات پروفایل یا نقش یک کاربر را به‌روزرسانی می‌کند.',
    })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'شناسه کاربر' })
    @ApiOkResponse({ description: 'کاربر با موفقیت ویرایش شد' })
    @ApiBadRequestResponse({ description: 'خطای اعتبارسنجی یا نقش نامعتبر' })
    @ApiNotFoundResponse({ description: 'کاربر مورد نظر یافت نشد' })
    @ApiConflictResponse({ description: 'ایمیل یا شماره تلفن تکراری است' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateUserDto,
    ) {
        const user = await this.usersService.update(id, dto);
        return { data: user, message: 'کاربر با موفقیت ویرایش شد' };
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'حذف کاربر',
        description: 'کاربر را به‌صورت نرم حذف می‌کند.',
    })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'شناسه کاربر' })
    @ApiOkResponse({ description: 'کاربر با موفقیت غیرفعال شد' })
    @ApiNotFoundResponse({ description: 'کاربر مورد نظر یافت نشد' })
    @ApiBadRequestResponse({ description: 'شناسه کاربر نامعتبر است' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        const user = await this.usersService.remove(id);
        return { data: user, message: 'کاربر با موفقیت غیرفعال شد' };
    }
}
