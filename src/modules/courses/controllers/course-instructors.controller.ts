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
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { ResponseMessage } from '@decorators/response-message.decorator';
import { CourseInstructorsService } from '../services/course-instructors.service';
import { CourseInstructorsQueryDto } from '../dto/course-instructors-query.dto';
import { UpdateCourseInstructorDto } from '../dto/update-course-instructor.dto';
import { CreateCourseInstructorDto } from '../dto/create-course-instructor.dto';

@ApiTags('Admin Course Instructors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('course-instructors')
export class CourseInstructorsController {
    constructor(private readonly instructorsService: CourseInstructorsService) { }

    @Get()
    @ApiOperation({
        summary: 'Get course instructors list',
        description:
            'Columns: مدرس، عنوان، دوره‌ها، وضعیت، تاریخ ثبت. Search by full_name/headline + filter by active + sort by courses count.',
    })
    @ResponseMessage('لیست مدرس‌ها با موفقیت دریافت شد.')
    findAll(@Query() query: CourseInstructorsQueryDto) {
        return this.instructorsService.findAll(query);
    }

    @Get(':id')
    @ApiParam({ name: 'id', example: 10 })
    @ResponseMessage('جزئیات مدرس با موفقیت دریافت شد.')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.instructorsService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create course instructor' })
    @ApiBody({ type: CreateCourseInstructorDto })
    @ResponseMessage('مدرس با موفقیت ایجاد شد.')
    create(@Body() dto: CreateCourseInstructorDto) {
        return this.instructorsService.create(dto);
    }

    @Patch(':id')
    @ApiParam({ name: 'id', example: 10 })
    @ApiBody({ type: UpdateCourseInstructorDto })
    @ResponseMessage('مدرس با موفقیت بروزرسانی شد.')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCourseInstructorDto,
    ) {
        return this.instructorsService.update(id, dto);
    }

    @Delete(':id')
    @ResponseMessage('مدرس با موفقیت حذف شد.')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.instructorsService.remove(id);
    }

    @Patch(':id/restore')
    @ResponseMessage('مدرس با موفقیت بازیابی شد.')
    restore(@Param('id', ParseIntPipe) id: number) {
        return this.instructorsService.restore(id);
    }
}
