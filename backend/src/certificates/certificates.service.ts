import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { randomUUID } from 'node:crypto';
import * as puppeteer from 'puppeteer';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async generatePdf(enrollmentId: string): Promise<Buffer> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId }, // Mude para Number(enrollmentId) se for Int no banco
      include: { user: true, course: true },
    });

    if (!enrollment) throw new NotFoundException('Inscrição não encontrada.');
    if (!enrollment.completed) throw new ForbiddenException('Presença não confirmada.');

    const certificateCode = randomUUID();
    
    await this.prisma.certificate.create({
      data: {
        code: certificateCode,
        userId: enrollment.userId,
        courseId: enrollment.courseId,
      },
    });

    const htmlContent = `
      <div style="font-family: Arial; text-align: center; padding: 50px;">
        <h1>Certificado de Conclusão</h1>
        <p>Certificamos que</p>
        <h2>${enrollment.user.name}</h2>
        <p>concluiu o curso</p>
        <h2>${enrollment.course.title}</h2>
        <p>Código: <b>${certificateCode}</b></p>
      </div>
    `;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfUint8Array = await page.pdf({ format: 'A4', landscape: true });
    await browser.close();

    return Buffer.from(pdfUint8Array);
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
}