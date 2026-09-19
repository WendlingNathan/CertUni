import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

    // Restrito a ADMIN
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    create(@Body() createCourseDto: CreateCourseDto) {
        return this.coursesService.create(createCourseDto);
    }

    // Rota pública para listar todos os cursos
    @Get()
    findAll() {
        return this.coursesService.findAll();
    }

    // Rota pública para obter detalhes de um curso
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.coursesService.findOne(id);
    }

    // Restrito a ADMIN
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
        return this.coursesService.update(id, updateCourseDto);
    }

    // Restrito a ADMIN
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.coursesService.remove(id);
    }
}