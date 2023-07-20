import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';


export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Min(1)
    limit?: number;//catidad de registros

    @IsOptional()
    @IsNumber()
    @IsPositive()
    offset?: number;//paginacion

}