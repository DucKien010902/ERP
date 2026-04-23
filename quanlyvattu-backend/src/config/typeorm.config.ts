import mysql from 'mysql2/promise';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  Attachment,
  AuditLog,
  InventoryBalance,
  Material,
  MaterialCategory,
  MaterialRequest,
  MaterialRequestItem,
  Organization,
  Permission,
  Project,
  PurchaseOrder,
  PurchaseOrderItem,
  Role,
  StockDocument,
  StockDocumentItem,
  StockLedger,
  Supplier,
  SupplierInvoice,
  SupplierInvoiceItem,
  Unit,
  User,
  Warehouse,
} from '../entities';

export interface DatabaseEnv {
  DB_HOST?: string;
  DB_PORT?: string;
  DB_USERNAME?: string;
  DB_PASSWORD?: string;
  DB_NAME?: string;
  DB_SYNCHRONIZE?: string;
  DB_LOGGING?: string;
}

export const ensureDatabaseExists = async (env: DatabaseEnv) => {
  const database = env.DB_NAME || 'wm_kalla_materials';
  const connection = await mysql.createConnection({
    host: env.DB_HOST || '127.0.0.1',
    port: Number(env.DB_PORT || 3306),
    user: env.DB_USERNAME || 'root',
    password: env.DB_PASSWORD || 'root',
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  } finally {
    await connection.end();
  }
};

export const buildTypeOrmConfig = (env: DatabaseEnv): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: env.DB_HOST || '127.0.0.1',
  port: Number(env.DB_PORT || 3306),
  username: env.DB_USERNAME || 'root',
  password: env.DB_PASSWORD || 'root',
  database: env.DB_NAME || 'wm_kalla_materials',
  synchronize: String(env.DB_SYNCHRONIZE || 'true') === 'true',
  logging: String(env.DB_LOGGING || 'false') === 'true',
  autoLoadEntities: false,
  entities: [
    Attachment,
    AuditLog,
    InventoryBalance,
    Material,
    MaterialCategory,
    MaterialRequest,
    MaterialRequestItem,
    Organization,
    Permission,
    Project,
    PurchaseOrder,
    PurchaseOrderItem,
    Role,
    StockDocument,
    StockDocumentItem,
    StockLedger,
    Supplier,
    SupplierInvoice,
    SupplierInvoiceItem,
    Unit,
    User,
    Warehouse,
  ],
});
