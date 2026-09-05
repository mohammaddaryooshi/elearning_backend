import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
    @ApiProperty({ example: 120, description: 'Total items count' })
    total: number;

    @ApiProperty({ example: 1, description: 'Current page number' })
    page: number;

    @ApiProperty({ example: 10, description: 'Items per page' })
    limit: number;

    @ApiProperty({ example: 12, description: 'Total pages count' })
    totalPages: number;

    @ApiProperty({ example: true, description: 'Has next page?' })
    hasNextPage: boolean;

    @ApiProperty({ example: false, description: 'Has previous page?' })
    hasPrevPage: boolean;
}
