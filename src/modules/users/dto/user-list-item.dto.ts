// src/modules/users/dto/user-list-item.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UserListItemDto {
    @ApiProperty({ description: 'User id', example: 12 })
    id: number;

    @ApiProperty({ description: 'First name', example: 'Ali', nullable: true })
    first_name: string | null;

    @ApiProperty({ description: 'Last name', example: 'Ahmadi', nullable: true })
    last_name: string | null;

    @ApiProperty({ description: 'Email', example: 'ali.ahmadi@example.com' })
    email: string;

    @ApiProperty({ description: 'Phone number', example: '09121234567', nullable: true })
    phone_number: string | null;

    @ApiProperty({
        description: 'Role names assigned to user',
        example: ['student'],
        type: [String],
    })
    roles: { name: string; description: string | null }[];


    @ApiProperty({
        description: 'Number of registered courses',
        example: 4,
    })
    courses_count: number;
}
