import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { buildTypeOrmConfig, ensureDatabaseExists } from './config/typeorm.config';
import { AccessModule } from './modules/access/access.module';
import { AuditModule } from './modules/audit/audit.module';
import { AuthModule } from './modules/auth/auth.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { MastersModule } from './modules/masters/masters.module';
import { OperationsModule } from './modules/operations/operations.module';
import { ReportsModule } from './modules/reports/reports.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseSeedModule } from './database/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const env = {
          DB_HOST: configService.get<string>('DB_HOST'),
          DB_PORT: configService.get<string>('DB_PORT'),
          DB_USERNAME: configService.get<string>('DB_USERNAME'),
          DB_PASSWORD: configService.get<string>('DB_PASSWORD'),
          DB_NAME: configService.get<string>('DB_NAME'),
          DB_SYNCHRONIZE: configService.get<string>('DB_SYNCHRONIZE'),
          DB_LOGGING: configService.get<string>('DB_LOGGING'),
        };

        await ensureDatabaseExists(env);
        return buildTypeOrmConfig(env);
      },
    }),
    AuthModule,
    AccessModule,
    UsersModule,
    MastersModule,
    OperationsModule,
    InventoryModule,
    ReportsModule,
    AuditModule,
    DatabaseSeedModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
