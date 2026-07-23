import { IsNotEmpty, IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { CATEGORY_CONSTANTS } from '../../../common/constants/app.constants';

export class CreateCategoryDto {
    @IsNotEmpty({ message: 'نام دسته‌بندی الزامی است' })
    @IsString({ message: 'نام دسته‌بندی باید رشته‌ای باشد' })
    @MinLength(CATEGORY_CONSTANTS.MIN_NAME_LENGTH, {
        message: `نام دسته‌بندی باید حداقل ${CATEGORY_CONSTANTS.MIN_NAME_LENGTH} کاراکتر باشد`,
    })
    @MaxLength(CATEGORY_CONSTANTS.MAX_NAME_LENGTH, {
        message: `نام دسته‌بندی نمی‌تواند بیشتر از ${CATEGORY_CONSTANTS.MAX_NAME_LENGTH} کاراکتر باشد`,
    })
    name: string;

    @IsOptional()
    @IsString({ message: 'توضیح باید رشته‌ای باشد' })
    @MaxLength(CATEGORY_CONSTANTS.MAX_DESCRIPTION_LENGTH, {
        message: `توضیح نمی‌تواند بیشتر از ${CATEGORY_CONSTANTS.MAX_DESCRIPTION_LENGTH} کاراکتر باشد`,
    })
    description?: string;
}
