import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { jest } from '@jest/globals';
import { PrismaService } from '../prisma/prisma.service';
import { EnrollmentsService } from './enrollments.service';

describe('EnrollmentsService', () => {
  const prismaMock = {
    course: {
      findUnique: jest.fn(),
    },
    enrollment: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  };

  let service: EnrollmentsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new EnrollmentsService(prismaMock as unknown as PrismaService);
  });

  describe('create', () => {
    it('rejects an enrollment when the course does not exist', async () => {
      prismaMock.course.findUnique.mockResolvedValue(null);

      await expect(service.create('user-id', 'course-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaMock.enrollment.create).not.toHaveBeenCalled();
    });

    it('rejects a duplicate enrollment with Bad Request', async () => {
      prismaMock.course.findUnique.mockResolvedValue({ id: 'course-id' });
      prismaMock.enrollment.findUnique.mockResolvedValue({
        id: 'enrollment-id',
      });

      await expect(service.create('user-id', 'course-id')).rejects.toThrow(
        BadRequestException,
      );
      expect(prismaMock.enrollment.create).not.toHaveBeenCalled();
    });

    it('creates an enrollment for the authenticated student', async () => {
      const createdEnrollment = {
        id: 'enrollment-id',
        userId: 'user-id',
        courseId: 'course-id',
      };
      prismaMock.course.findUnique.mockResolvedValue({ id: 'course-id' });
      prismaMock.enrollment.findUnique.mockResolvedValue(null);
      prismaMock.enrollment.create.mockResolvedValue(createdEnrollment);

      await expect(service.create('user-id', 'course-id')).resolves.toEqual(
        createdEnrollment,
      );
      expect(prismaMock.enrollment.create).toHaveBeenCalledWith({
        data: { userId: 'user-id', courseId: 'course-id' },
        include: { course: true },
      });
    });
  });

  it('lists only the authenticated student enrollments with course data', async () => {
    prismaMock.enrollment.findMany.mockResolvedValue([]);

    await service.findMyEnrollments('user-id');

    expect(prismaMock.enrollment.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-id' },
      include: { course: true },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('lists course enrollments without exposing user passwords', async () => {
    prismaMock.course.findUnique.mockResolvedValue({ id: 'course-id' });
    prismaMock.enrollment.findMany.mockResolvedValue([]);

    await service.findByCourse('course-id');

    expect(prismaMock.enrollment.findMany).toHaveBeenCalledWith({
      where: { courseId: 'course-id' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  });

  describe('remove', () => {
    it('rejects the cancellation when the enrollment does not exist', async () => {
      prismaMock.enrollment.findUnique.mockResolvedValue(null);

      await expect(
        service.remove('enrollment-id', 'user-id', Role.STUDENT),
      ).rejects.toThrow(NotFoundException);
    });

    it('prevents a student from cancelling another student enrollment', async () => {
      prismaMock.enrollment.findUnique.mockResolvedValue({
        id: 'enrollment-id',
        userId: 'another-user-id',
      });

      await expect(
        service.remove('enrollment-id', 'user-id', Role.STUDENT),
      ).rejects.toThrow(ForbiddenException);
      expect(prismaMock.enrollment.delete).not.toHaveBeenCalled();
    });

    it('allows a student to cancel their own enrollment', async () => {
      const enrollment = { id: 'enrollment-id', userId: 'user-id' };
      prismaMock.enrollment.findUnique.mockResolvedValue(enrollment);
      prismaMock.enrollment.delete.mockResolvedValue(enrollment);

      await expect(
        service.remove('enrollment-id', 'user-id', Role.STUDENT),
      ).resolves.toEqual(enrollment);
    });

    it('allows an admin to cancel any enrollment', async () => {
      const enrollment = {
        id: 'enrollment-id',
        userId: 'another-user-id',
      };
      prismaMock.enrollment.findUnique.mockResolvedValue(enrollment);
      prismaMock.enrollment.delete.mockResolvedValue(enrollment);

      await expect(
        service.remove('enrollment-id', 'admin-id', Role.ADMIN),
      ).resolves.toEqual(enrollment);
      expect(prismaMock.enrollment.delete).toHaveBeenCalledWith({
        where: { id: 'enrollment-id' },
      });
    });
  });
});
