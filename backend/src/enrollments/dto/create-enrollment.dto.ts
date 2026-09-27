import { IsUUID } from 'class-validator';

export class CreateEnrollmentDto {
  @IsUUID()
  courseId: string;
}
