import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role, User } from '../../entities';
import { AuditModule } from '../audit/audit.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), AuditModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
