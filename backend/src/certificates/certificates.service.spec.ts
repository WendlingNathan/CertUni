import { ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { jest } from '@jest/globals';
import { PrismaService } from '../prisma/prisma.service';
import { CertificatesService } from './certificates.service';

describe('CertificatesService', () => {
  let service: CertificatesService;
  let prisma: {
    enrollment: { findUnique: jest.Mock };
    certificate: { create: jest.Mock };
  };

  beforeEach(() => {
    prisma = {
      enrollment: { findUnique: jest.fn() },
      certificate: { create: jest.fn() },
    };
    service = new CertificatesService(prisma as unknown as PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('prevents a student from generating another user certificate', async () => {
    prisma.enrollment.findUnique.mockResolvedValue({
      id: 'enrollment-id',
      userId: 'another-user',
      courseId: 'course-id',
      completed: true,
      user: { name: 'Outro aluno' },
      course: {
        title: 'Curso',
        workload: 10,
        eventDate: new Date('2026-10-04T12:00:00.000Z'),
      },
    });

    await expect(
      service.generatePdf('enrollment-id', 'student-id', Role.STUDENT),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.certificate.create).not.toHaveBeenCalled();
  });
});
