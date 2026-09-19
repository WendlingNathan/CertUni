import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString({}, { message: 'Date must be a valid ISO 8601 string' })
    @IsNotEmpty({ message: 'Date is required' })
    date: string;

    @IsInt({ message: 'Workload must be an integer' })
    @Min(1, { message: 'Workload must be at least 1 hour' })
    workload: number;
}