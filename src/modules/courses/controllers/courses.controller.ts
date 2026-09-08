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
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { CourseStatus } from '@constants/app.constants';
import { CoursesService } from '../services/courses.service';
import { CoursePriceType, CourseQueryDto, CourseSort } from '../dto/course-query.dto';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';

@ApiTags('Admin Courses')
@ApiBearerAuth()
@Controller('admin/courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
  ) { }

  @Get()
  @ApiOperation({
    summary:
      'لیست دوره‌ها با سرچ، فیلتر، مرتب‌سازی و pagination',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'جستجو بر اساس نام دوره یا نام مدرس',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: CourseStatus,
  })
  @ApiQuery({
    name: 'category_id',
    required: false,



    type: Number,
  })
  @ApiQuery({
    name: 'instructor_id',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'price_type',
    required: false,
    enum: CoursePriceType,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: CourseSort,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 20,
  })
  async findAll(@Query() query: CourseQueryDto) {
    return this.coursesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'نمایش جزئیات یک دوره',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.coursesService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'ایجاد دوره جدید',
  })
  async create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'ویرایش دوره',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'حذف نرم دوره',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.coursesService.remove(id);

    return {
      message: 'دوره با موفقیت حذف شد.',
    };
  }

  @Patch(':id/restore')
  @ApiOperation({
    summary: 'بازیابی دوره حذف‌شده',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  async restore(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.coursesService.restore(id);
  }
}
