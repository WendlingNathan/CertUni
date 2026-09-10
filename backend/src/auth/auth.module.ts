import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'super-secret-key', // definir no .env
      signOptions: { expiresIn: '1d' }, // token expira em 1 dia
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}