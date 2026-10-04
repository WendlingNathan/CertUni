import {
  Body,
  Controller,
  Delete,
  Patch,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentsService } from './enrollments.service';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
    role: Role;
  };
}
    
@Controller('enrollments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @Roles(Role.STUDENT)
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createEnrollmentDto: CreateEnrollmentDto,
  ) {
    return this.enrollmentsService.create(
      request.user.sub,
      createEnrollmentDto.courseId,
    );
  }

  
  @Get('my-enrollments')
  @Roles(Role.STUDENT)
  findMyEnrollments(@Req() request: AuthenticatedRequest) {
    return this.enrollmentsService.findMyEnrollments(request.user.sub);
  }

  @Get('course/:courseId')
  @Roles(Role.ADMIN)
  findByCourse(@Param('courseId', ParseUUIDPipe) courseId: string) {
    return this.enrollmentsService.findByCourse(courseId);
  }

  @Delete(':id')
  @Roles(Role.STUDENT, Role.ADMIN)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.enrollmentsService.remove(
      id,
      request.user.sub,
      request.user.role,
    );
  }
  @Patch(':id/check-in')
  @Roles(Role.ADMIN)
  checkIn(@Param('id') id: string) {
    return this.enrollmentsService.checkIn(id); 
  }

}
