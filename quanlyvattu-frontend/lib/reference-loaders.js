import { api } from './api';
import { buildOptions } from './helpers';
import { STOCK_DOCUMENT_TYPES } from './constants';

export async function loadMasterReferences(token) {
  const [units, categories, materials, warehouses, projects, suppliers] = await Promise.all([
    api.masters.units(token),
    api.masters.categories(token),
    api.masters.materials(token),
    api.masters.warehouses(token),
    api.masters.projects(token),
    api.masters.suppliers(token),
  ]);

  return {
    units,
    categories,
    materials,
    warehouses,
    projects,
    suppliers,
    unitOptions: buildOptions(units, 'name', 'id', (item) => `${item.name} (${item.symbol || item.code})`),
    categoryOptions: buildOptions(categories, 'name', 'id', (item) => `${item.code} · ${item.name}`),
    materialOptions: buildOptions(materials, 'name', 'id', (item) => `${item.code} · ${item.name}`),
    warehouseOptions: buildOptions(warehouses, 'name', 'id', (item) => `${item.code} · ${item.name}`),
    projectOptions: buildOptions(projects, 'name', 'id', (item) => `${item.code} · ${item.name}`),
    supplierOptions: buildOptions(suppliers, 'name', 'id', (item) => `${item.code} · ${item.name}`),
    stockDocumentTypeOptions: STOCK_DOCUMENT_TYPES.map((item) => ({ value: item.value, label: item.label })),
  };
}

export async function loadAccessReferences(token) {
  const [roles, permissions] = await Promise.all([api.access.roles(token), api.access.permissions(token)]);
  return {
    roles,
    permissions,
    roleOptions: buildOptions(roles, 'name', 'id', (item) => `${item.name} (${item.code})`),
  };
}

export async function loadOperationReferences(token) {
  const [masters, purchaseOrders, invoices, requests] = await Promise.all([
    loadMasterReferences(token),
    api.operations.listPurchaseOrders(token),
    api.operations.listSupplierInvoices(token),
    api.operations.listMaterialRequests(token),
  ]);

  return {
    ...masters,
    purchaseOrders,
    invoices,
    requests,
    purchaseOrderOptions: buildOptions(purchaseOrders, 'poNo', 'id', (item) => `${item.poNo} · ${item.supplier?.name || 'N/A'}`),
    invoiceOptions: buildOptions(invoices, 'invoiceNo', 'id', (item) => `${item.invoiceNo} · ${item.supplier?.name || 'N/A'}`),
    requestOptions: buildOptions(requests, 'requestNo', 'id', (item) => `${item.requestNo} · ${item.project?.name || 'N/A'}`),
  };
}
