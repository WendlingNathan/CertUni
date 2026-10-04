import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { jest } from '@jest/globals';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: { create: jest.Mock };

  beforeEach(() => {
    usersService = { create: jest.fn() };
    service = new AuthService(
      usersService as unknown as UsersService,
      {} as JwtService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('always registers public users as students', async () => {
    usersService.create.mockResolvedValue({ id: 'user-id' });

    await service.register({
      name: 'Aluno Teste',
      email: 'aluno@example.com',
      password: '123456',
    });

    expect(usersService.create).toHaveBeenCalledWith({
      name: 'Aluno Teste',
      email: 'aluno@example.com',
      password: '123456',
      role: Role.STUDENT,
    });
  });
});
