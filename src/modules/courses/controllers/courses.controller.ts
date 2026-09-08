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
  ApiBearerAuth,
  ApiBody,
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
import { ResponseMessage } from '@decorators/response-message.decorator';
import { CourseMessages } from '../constant/course.messages';

@ApiTags('Admin Courses')
@ApiBearerAuth()
@Controller('admin/courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
  ) { }

  @Get()
  @ApiOperation({
    summary: 'List courses with search, filters, sorting, and pagination',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by course title or instructor name',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: CourseStatus,
    description: 'Filter by course status',
  })
  @ApiQuery({
    name: 'category_id',
    required: false,
    type: Number,
    description: 'Filter by category ID',
  })
  @ApiQuery({
    name: 'instructor_id',
    required: false,
    type: Number,
    description: 'Filter by instructor ID',
  })
  @ApiQuery({
    name: 'price_type',
    required: false,
    enum: CoursePriceType,
    description: 'Filter by course price type',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: CourseSort,
    description: 'Sort order for course list',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 20,
    description: 'Number of items per page',
  })
  async findAll(@Query() query: CourseQueryDto) {
    return this.coursesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get course details',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Course ID',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.coursesService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new course',
  })
  @ApiBody({ type: CreateCourseDto })
  @ResponseMessage(CourseMessages.COURSE_CREATED)
  async create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update course',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Course ID',
  })
  @ApiBody({ type: UpdateCourseDto })
  @ResponseMessage(CourseMessages.COURSE_UPDATED)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft delete course',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Course ID',
  })
  @ResponseMessage(CourseMessages.COURSE_DELETED)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.coursesService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({
    summary: 'Restore deleted course',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Course ID',
  })
  @ResponseMessage(CourseMessages.COURSE_RESTORED)
  async restore(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.coursesService.restore(id);
  }
}
