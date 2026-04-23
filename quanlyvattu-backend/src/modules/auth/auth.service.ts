import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { Repository } from 'typeorm';
import { AuditAction } from '../../common/enums';
import { CurrentUserPayload } from '../../common/types/current-user.type';
import { User } from '../../entities';
import { AuditService } from '../audit/audit.service';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
  ) {}

  private mapUserPayload(user: User): CurrentUserPayload {
    const roleCodes = (user.roles || []).map((role) => role.code);
    const permissions = Array.from(
      new Set((user.roles || []).flatMap((role) => (role.permissions || []).map((permission) => permission.code))),
    );

    return {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
      organizationId: user.organizationId,
      roleCodes,
      permissions,
    };
  }

  async login(dto: LoginDto, req?: any) {
    const user = await this.userRepository.findOne({ where: { email: dto.email.toLowerCase() } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    const payload = this.mapUserPayload(user);
    const accessToken = await this.jwtService.signAsync(payload);

    await this.auditService.log({
      organizationId: user.organizationId,
      userId: user.id,
      action: AuditAction.LOGIN,
      module: 'auth',
      entityId: user.id,
      newValues: { email: user.email },
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return {
      accessToken,
      user: payload,
    };
  }

  async me(payload: CurrentUserPayload) {
    const user = await this.userRepository.findOne({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.mapUserPayload(user);
  }
}
