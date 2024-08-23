import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDTO {
  @IsOptional()
  @IsPositive()
  @IsNumber()
  page?: number;

  @Min(1)
  @IsOptional()
  @IsPositive()
  @IsNumber()
  limit?: number;
}
