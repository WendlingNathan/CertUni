import { IsDateString, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: 'Description is required' })
    description: string;

    @IsString()
    @IsNotEmpty({ message: 'Speaker is required' })
    speaker: string;

    @IsDateString({}, { message: 'Date must be a valid ISO 8601 string' })
    @IsNotEmpty({ message: 'Event date is required' })
    eventDate: string;

    @IsInt({ message: 'Workload must be an integer' })
    @Min(1, { message: 'Workload must be at least 1 hour' })
    workload: number;
}