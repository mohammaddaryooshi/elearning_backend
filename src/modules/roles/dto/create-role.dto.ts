import {
    IsArray,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ROLE_MESSAGES } from '../constants/role.messages';
import { VALIDATION_MESSAGES } from '../../../common/messages';

export class CreateRoleDto {
    @ApiProperty({
        description: ROLE_MESSAGES.ROLE_UNIQE_NAME,
        example: 'editor',
        maxLength: 100,
    })
    @IsString({ message: VALIDATION_MESSAGES.MUST_BE_STRING('نام نقش') })
    @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED('نام نقش') })
    @MaxLength(100, { message: VALIDATION_MESSAGES.MAX_LENGTH('نام نقش', 100) })
    @Transform(({ value }: { value: string }) => value?.trim())
    name: string;

    @ApiPropertyOptional({
        description: ROLE_MESSAGES.ROLE_DESCRIPTION,
        example: ROLE_MESSAGES.EDITE_COURSE_CONTENT,
    })
    @IsOptional()
    @IsString({ message: VALIDATION_MESSAGES.MUST_BE_STRING('توضیحات نقش') })
    @Transform(({ value }: { value?: string }) => value?.trim())
    description?: string;

    @ApiPropertyOptional({
        description: ROLE_MESSAGES.ROLE_PERMISSION_IDS_LABEL,
        example: [1, 2],
        type: [Number],
    })
    @IsOptional()
    @IsArray({ message: ROLE_MESSAGES.ROLE_PERMISSION_IDS_MUST_BE_ARRAY })
    @IsInt({ each: true, message: ROLE_MESSAGES.ROLE_PERMISSION_IDS_MUST_BE_INT })
    permissionIds?: number[];
}
