import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { In, Repository } from 'typeorm';
import { AuditAction } from '../../common/enums';
import { CurrentUserPayload } from '../../common/types/current-user.type';
import { Role, User } from '../../entities';
import { AuditService } from '../audit/audit.service';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly auditService: AuditService,
  ) {}

  list(organizationId: string) {
    return this.userRepository.find({
      where: { organizationId },
      relations: { organization: true },
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: CreateUserDto, actor: CurrentUserPayload, req?: any) {
    const existingUser = await this.userRepository.findOne({ where: { email: dto.email.toLowerCase() } });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const roles = await this.roleRepository.find({ where: { id: In(dto.roleIds || []) } });
    if (!roles.length) {
      throw new BadRequestException('At least one valid role is required');
    }

    const user = this.userRepository.create({
      organizationId: actor.organizationId,
      fullName: dto.fullName,
      email: dto.email.toLowerCase(),
      phone: dto.phone,
      passwordHash: await hash(dto.password, 10),
      roles,
      isActive: true,
    });

    const saved = await this.userRepository.save(user);
    await this.auditService.log({
      organizationId: actor.organizationId,
      userId: actor.sub,
      action: AuditAction.CREATE,
      module: 'users',
      entityId: saved.id,
      newValues: { fullName: saved.fullName, email: saved.email, roleIds: dto.roleIds },
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return saved;
  }

  async toggleActive(id: string, actor: CurrentUserPayload, req?: any) {
    const user = await this.userRepository.findOne({ where: { id, organizationId: actor.organizationId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const previous = { isActive: user.isActive };
    user.isActive = !user.isActive;
    const saved = await this.userRepository.save(user);

    await this.auditService.log({
      organizationId: actor.organizationId,
      userId: actor.sub,
      action: AuditAction.UPDATE,
      module: 'users',
      entityId: saved.id,
      oldValues: previous,
      newValues: { isActive: saved.isActive },
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return saved;
  }
}
