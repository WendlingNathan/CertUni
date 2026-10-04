import { Controller, Post, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import type { Response } from 'express';
import type { Request } from 'express';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
    role: Role;
  };
}

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post('generate/:enrollmentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT, Role.ADMIN)
  async generateCertificate(
    @Param('enrollmentId') enrollmentId: string,
    @Req() request: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.certificatesService.generatePdf(
      enrollmentId,
      request.user.sub,
      request.user.role,
    );
    
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
