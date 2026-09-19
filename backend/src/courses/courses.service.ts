import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createCourseDto: CreateCourseDto) {
        const { eventDate, ...rest } = createCourseDto;

        return this.prisma.course.create({
        data: {
            ...rest,
            eventDate: new Date(eventDate),
        },
        });
    }

    async findAll() {
        return this.prisma.course.findMany({
            orderBy: { eventDate: 'asc' },
        });
    }

    async findOne(id: string) {
        const course = await this.prisma.course.findUnique({
            where: { id },
        });

        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }

        return course;
    }

    async update(id: string, updateCourseDto: UpdateCourseDto) {
        await this.findOne(id);

        const { eventDate, ...rest } = updateCourseDto;

        return this.prisma.course.update({
            where: { id },
            data: {
                ...rest,
                ...(eventDate && { eventDate: new Date(eventDate) }),
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.course.delete({
            where: { id },
        });
    }
}