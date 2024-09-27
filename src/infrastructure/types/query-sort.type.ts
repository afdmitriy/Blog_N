import { Transform, TransformFnParams } from 'class-transformer';
import { IsIn, IsOptional, IsPositive, IsString } from 'class-validator';

export class QueryPaginationType {
  @IsOptional()
  @IsString()
  searchLoginTerm?: string;

  @IsOptional()
  @IsString()
  searchEmailTerm?: string;

  @IsOptional()
  @IsString()
  searchNameTerm?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc', 'ASC', 'DESC'])
  sortDirection?: 'asc' | 'desc' | 'ASC' | 'DESC';

  @IsOptional()
  @Transform((value: TransformFnParams) => parseInt(value.value, 10))
  @IsPositive()
  pageNumber: number;

  @IsOptional()
  @Transform((value: TransformFnParams) => parseInt(value.value, 10))
  @IsPositive()
  pageSize: number
}

export class QueryPaginationResult {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  searchNameTerm: string | null;
  sortBy: string;
  sortDirection: 'ASC' | 'DESC';
  pageNumber: number
  pageSize: number
}

// Новый подход, в рамках обучения не переписываю старый код
export class QueryBaseClass {

  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';

  @Transform(({ value }) => {
    if (value.toLowerCase() === 'asc') {
      return 'ASC';
    } else {
      return 'DESC';
    }
  })
  sortDirection: 'ASC' | 'DESC' = 'DESC';

  @Transform(({ value }) => {
    if (Number(value)) {
      return Number(value);
    } else {
      return 1;
    }
  })
  pageNumber = 1;

  @Transform(({ value }) => {
    if (Number(value)) {
      return Number(value);
    } else {
      return 10;
    }
  })
  pageSize = 10;
}