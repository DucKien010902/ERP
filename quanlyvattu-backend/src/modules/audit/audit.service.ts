import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditAction } from '../../common/enums';
import { AuditLog } from '../../entities';

interface AuditParams {
  organizationId: string;
  userId?: string;
  action: AuditAction;
  module: string;
  entityId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}


  list(organizationId: string) {
    return this.auditLogRepository.find({
      where: { organizationId },
      relations: { user: true },
      order: { createdAt: 'DESC' },
      take: 200,
    });
  }

  async log(params: AuditParams) {
    const log = this.auditLogRepository.create({
      organizationId: params.organizationId,
      userId: params.userId,
      action: params.action,
      module: params.module,
      entityId: params.entityId,
      oldValues: params.oldValues,
      newValues: params.newValues,
      ip: params.ip,
      userAgent: params.userAgent,
    });

    return this.auditLogRepository.save(log);
  }
}
