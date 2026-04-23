import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material, MaterialCategory, Project, Supplier, Unit, Warehouse } from '../../entities';
import { AuditModule } from '../audit/audit.module';
import { MastersController } from './masters.controller';
import { MastersService } from './masters.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Unit, MaterialCategory, Material, Warehouse, Project, Supplier]),
    AuditModule,
  ],
  providers: [MastersService],
  controllers: [MastersController],
  exports: [MastersService],
})
export class MastersModule {}
