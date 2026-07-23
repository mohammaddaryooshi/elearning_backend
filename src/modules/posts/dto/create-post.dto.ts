import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsArray,
    IsNumber,
    MinLength,
    MaxLength,
    IsBoolean,
} from 'class-validator';
import { POST_CONSTANTS } from '../../../common/constants/app.constants';

export class CreatePostDto {
    @IsNotEmpty({ message: 'عنوان الزامی است' })
    @IsString({ message: 'عنوان باید رشته‌ای باشد' })
    @MinLength(POST_CONSTANTS.MIN_TITLE_LENGTH, {
        message: `عنوان باید حداقل ${POST_CONSTANTS.MIN_TITLE_LENGTH} کاراکتر باشد`,
    })
    @MaxLength(POST_CONSTANTS.MAX_TITLE_LENGTH, {
        message: `عنوان نمی‌تواند بیشتر از ${POST_CONSTANTS.MAX_TITLE_LENGTH} کاراکتر باشد`,
    })
    title: string;

    @IsNotEmpty({ message: 'محتوا الزامی است' })
    @IsString({ message: 'محتوا باید رشته‌ای باشد' })
    @MinLength(POST_CONSTANTS.MIN_CONTENT_LENGTH, {
        message: `محتوا باید حداقل ${POST_CONSTANTS.MIN_CONTENT_LENGTH} کاراکتر باشد`,
    })
    content: string;

    @IsOptional()
    @IsString({ message: 'خلاصه باید رشته‌ای باشد' })
    @MaxLength(POST_CONSTANTS.MAX_EXCERPT_LENGTH, {
        message: `خلاصه نمی‌تواند بیشتر از ${POST_CONSTANTS.MAX_EXCERPT_LENGTH} کاراکتر باشد`,
    })
    excerpt?: string;

    @IsOptional()
    @IsArray({ message: 'دسته‌بندی‌ها باید آرایه‌ای باشد' })
    @IsNumber({}, { each: true, message: 'هر دسته‌بندی باید عدد باشد' })
    categoryIds?: number[];

    @IsOptional()
    @IsBoolean({ message: 'is_published باید boolean باشد' })
    is_published?: boolean = false;
}
