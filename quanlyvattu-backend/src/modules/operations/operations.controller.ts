import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import {
  CreateMaterialRequestDto,
  CreatePurchaseOrderDto,
  CreateStockDocumentDto,
  CreateSupplierInvoiceDto,
} from './dto';
import { OperationsService } from './operations.service';

@ApiTags('Operations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Get('material-requests')
  @Permissions('requests.read')
  listMaterialRequests(@Req() req: any) {
    return this.operationsService.listMaterialRequests(req.user.organizationId);
  }

  @Get('material-requests/:id')
  @Permissions('requests.read')
  getMaterialRequest(@Param('id') id: string, @Req() req: any) {
    return this.operationsService.getMaterialRequest(id, req.user.organizationId);
  }

  @Post('material-requests')
  @Permissions('requests.write')
  createMaterialRequest(@Body() dto: CreateMaterialRequestDto, @Req() req: any) {
    return this.operationsService.createMaterialRequest(dto, req.user, req);
  }

  @Patch('material-requests/:id/submit')
  @Permissions('requests.submit')
  submitMaterialRequest(@Param('id') id: string, @Req() req: any) {
    return this.operationsService.submitMaterialRequest(id, req.user, req);
  }

  @Patch('material-requests/:id/approve')
  @Permissions('requests.approve')
  approveMaterialRequest(@Param('id') id: string, @Req() req: any) {
    return this.operationsService.approveMaterialRequest(id, req.user, req);
  }

  @Get('purchase-orders')
  @Permissions('purchase-orders.read')
  listPurchaseOrders(@Req() req: any) {
    return this.operationsService.listPurchaseOrders(req.user.organizationId);
  }

  @Get('purchase-orders/:id')
  @Permissions('purchase-orders.read')
  getPurchaseOrder(@Param('id') id: string, @Req() req: any) {
    return this.operationsService.getPurchaseOrder(id, req.user.organizationId);
  }

  @Post('purchase-orders')
  @Permissions('purchase-orders.write')
  createPurchaseOrder(@Body() dto: CreatePurchaseOrderDto, @Req() req: any) {
    return this.operationsService.createPurchaseOrder(dto, req.user, req);
  }

  @Patch('purchase-orders/:id/approve')
  @Permissions('purchase-orders.approve')
  approvePurchaseOrder(@Param('id') id: string, @Req() req: any) {
    return this.operationsService.approvePurchaseOrder(id, req.user, req);
  }

  @Get('supplier-invoices')
  @Permissions('invoices.read')
  listSupplierInvoices(@Req() req: any) {
    return this.operationsService.listSupplierInvoices(req.user.organizationId);
  }

  @Get('supplier-invoices/:id')
  @Permissions('invoices.read')
  getSupplierInvoice(@Param('id') id: string, @Req() req: any) {
    return this.operationsService.getSupplierInvoice(id, req.user.organizationId);
  }

  @Post('supplier-invoices')
  @Permissions('invoices.write')
  createSupplierInvoice(@Body() dto: CreateSupplierInvoiceDto, @Req() req: any) {
    return this.operationsService.createSupplierInvoice(dto, req.user, req);
  }

  @Patch('supplier-invoices/:id/approve')
  @Permissions('invoices.approve')
  approveSupplierInvoice(@Param('id') id: string, @Req() req: any) {
    return this.operationsService.approveSupplierInvoice(id, req.user, req);
  }

  @Get('stock-documents')
  @Permissions('stock-documents.read')
  listStockDocuments(@Req() req: any) {
    return this.operationsService.listStockDocuments(req.user.organizationId);
  }

  @Get('stock-documents/:id')
  @Permissions('stock-documents.read')
  getStockDocument(@Param('id') id: string, @Req() req: any) {
    return this.operationsService.getStockDocument(id, req.user.organizationId);
  }

  @Post('stock-documents')
  @Permissions('stock-documents.write')
  createStockDocument(@Body() dto: CreateStockDocumentDto, @Req() req: any) {
    return this.operationsService.createStockDocument(dto, req.user, req);
  }

  @Patch('stock-documents/:id/submit')
  @Permissions('stock-documents.submit')
  submitStockDocument(@Param('id') id: string, @Req() req: any) {
    return this.operationsService.submitStockDocument(id, req.user, req);
  }

  @Patch('stock-documents/:id/approve')
  @Permissions('stock-documents.approve')
  approveStockDocument(@Param('id') id: string, @Req() req: any) {
    return this.operationsService.approveStockDocument(id, req.user, req);
  }

  @Patch('stock-documents/:id/post')
  @Permissions('stock-documents.post')
  postStockDocument(@Param('id') id: string, @Req() req: any) {
    return this.operationsService.postStockDocument(id, req.user, req);
  }
}
