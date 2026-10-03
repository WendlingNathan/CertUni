import { Controller, Post, Get, Param, Res } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import type { Response } from 'express';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post('generate/:enrollmentId')
  async generateCertificate(
    @Param('enrollmentId') enrollmentId: string,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.certificatesService.generatePdf(enrollmentId);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=certificado.pdf',
      'Content-Length': pdfBuffer.length,
    });
    
    res.end(pdfBuffer);
  }

  @Get('validate/:code')
  async validateCertificate(@Param('code') code: string) {
    return this.certificatesService.validateCode(code);
  }
}