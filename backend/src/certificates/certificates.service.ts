import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { randomUUID } from 'node:crypto';
import PDFDocument from 'pdfkit';
import { Role } from '@prisma/client';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async generatePdf(
    enrollmentId: string,
    authenticatedUserId: string,
    role: Role,
  ): Promise<Buffer> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId }, // Mude para Number(enrollmentId) se for Int no banco
      include: { user: true, course: true },
    });

    if (!enrollment) throw new NotFoundException('Inscrição não encontrada.');
    if (role === Role.STUDENT && enrollment.userId !== authenticatedUserId) {
      throw new ForbiddenException('Você só pode emitir o seu próprio certificado.');
    }
    if (!enrollment.completed) throw new ForbiddenException('Presença não confirmada.');

    const certificateCode = randomUUID();
    
    await this.prisma.certificate.create({
      data: {
        code: certificateCode,
        userId: enrollment.userId,
        courseId: enrollment.courseId,
      },
    });

    return this.renderCertificate({
      studentName: enrollment.user.name,
      courseTitle: enrollment.course.title,
      workload: enrollment.course.workload,
      eventDate: enrollment.course.eventDate,
      certificateCode,
    });
  }

  async validateCode(code: string) {
    const certificate = await this.prisma.certificate.findFirst({
      where: { code: code },
      include: { user: true, course: true },
    });

    if (!certificate) throw new NotFoundException('Certificado inválido.');

    return {
      isValid: true,
      studentName: certificate.user.name,
      courseTitle: certificate.course.title,
      issuedAt: certificate.issuedAt, // Você mencionou que esse campo existe
    };
  }

  private renderCertificate(data: {
    studentName: string;
    courseTitle: string;
    workload: number;
    eventDate: Date;
    certificateCode: string;
  }): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const document = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 48,
      });
      const chunks: Buffer[] = [];

      document.on('data', (chunk: Buffer) => chunks.push(chunk));
      document.on('end', () => resolve(Buffer.concat(chunks)));
      document.on('error', reject);

      const pageWidth = document.page.width;
      const pageHeight = document.page.height;

      document
        .lineWidth(3)
        .strokeColor('#2563eb')
        .rect(28, 28, pageWidth - 56, pageHeight - 56)
        .stroke();

      document
        .fillColor('#1d4ed8')
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('CERTUNI', 0, 72, { align: 'center' });

      document
        .fillColor('#0f172a')
        .fontSize(30)
        .text('Certificado de Conclusão', 70, 118, {
          align: 'center',
          width: pageWidth - 140,
        });

      document
        .font('Helvetica')
        .fontSize(15)
        .fillColor('#475569')
        .text('Certificamos que', 70, 190, {
          align: 'center',
          width: pageWidth - 140,
        });

      document
        .font('Helvetica-Bold')
        .fontSize(24)
        .fillColor('#0f172a')
        .text(data.studentName, 70, 224, {
          align: 'center',
          width: pageWidth - 140,
        });

      document
        .font('Helvetica')
        .fontSize(15)
        .fillColor('#475569')
        .text('concluiu com aproveitamento o curso', 70, 274, {
          align: 'center',
          width: pageWidth - 140,
        });

      document
        .font('Helvetica-Bold')
        .fontSize(21)
        .fillColor('#1d4ed8')
        .text(data.courseTitle, 70, 308, {
          align: 'center',
          width: pageWidth - 140,
        });

      const eventDate = data.eventDate.toLocaleDateString('pt-BR', {
        timeZone: 'UTC',
      });

      document
        .font('Helvetica')
        .fontSize(12)
        .fillColor('#475569')
        .text(
          `Carga horária: ${data.workload} horas  •  Data do evento: ${eventDate}`,
          70,
          378,
          { align: 'center', width: pageWidth - 140 },
        );

      document
        .fontSize(9)
        .fillColor('#64748b')
        .text(`Código de validação: ${data.certificateCode}`, 70, pageHeight - 82, {
          align: 'center',
          width: pageWidth - 140,
        });

      document.end();
    });
  }
}
