const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  const text = await response.text();
  return text ? { message: text } : null;
}

export async function apiFetch(path, { method = 'GET', token, body, headers } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  const payload = await parseResponse(response);
  if (!response.ok) {
    const message = payload?.message || payload?.error || 'Yêu cầu thất bại';
    throw new ApiError(Array.isArray(message) ? message.join(', ') : message, response.status, payload);
  }
  return payload;
}

export const api = {
  auth: {
    login: (body) => apiFetch('/auth/login', { method: 'POST', body }),
    me: (token) => apiFetch('/auth/me', { token }),
  },
  access: {
    roles: (token) => apiFetch('/access/roles', { token }),
    permissions: (token) => apiFetch('/access/permissions', { token }),
  },
  users: {
    list: (token) => apiFetch('/users', { token }),
    create: (token, body) => apiFetch('/users', { method: 'POST', token, body }),
    toggleActive: (token, id) => apiFetch(`/users/${id}/toggle-active`, { method: 'PATCH', token }),
  },
  masters: {
    units: (token) => apiFetch('/masters/units', { token }),
    createUnit: (token, body) => apiFetch('/masters/units', { method: 'POST', token, body }),
    categories: (token) => apiFetch('/masters/categories', { token }),
    createCategory: (token, body) => apiFetch('/masters/categories', { method: 'POST', token, body }),
    materials: (token) => apiFetch('/masters/materials', { token }),
    createMaterial: (token, body) => apiFetch('/masters/materials', { method: 'POST', token, body }),
    warehouses: (token) => apiFetch('/masters/warehouses', { token }),
    createWarehouse: (token, body) => apiFetch('/masters/warehouses', { method: 'POST', token, body }),
    projects: (token) => apiFetch('/masters/projects', { token }),
    createProject: (token, body) => apiFetch('/masters/projects', { method: 'POST', token, body }),
    suppliers: (token) => apiFetch('/masters/suppliers', { token }),
    createSupplier: (token, body) => apiFetch('/masters/suppliers', { method: 'POST', token, body }),
  },
  operations: {
    listMaterialRequests: (token) => apiFetch('/operations/material-requests', { token }),
    getMaterialRequest: (token, id) => apiFetch(`/operations/material-requests/${id}`, { token }),
    createMaterialRequest: (token, body) => apiFetch('/operations/material-requests', { method: 'POST', token, body }),
    submitMaterialRequest: (token, id) => apiFetch(`/operations/material-requests/${id}/submit`, { method: 'PATCH', token }),
    approveMaterialRequest: (token, id) => apiFetch(`/operations/material-requests/${id}/approve`, { method: 'PATCH', token }),

    listPurchaseOrders: (token) => apiFetch('/operations/purchase-orders', { token }),
    getPurchaseOrder: (token, id) => apiFetch(`/operations/purchase-orders/${id}`, { token }),
    createPurchaseOrder: (token, body) => apiFetch('/operations/purchase-orders', { method: 'POST', token, body }),
    approvePurchaseOrder: (token, id) => apiFetch(`/operations/purchase-orders/${id}/approve`, { method: 'PATCH', token }),

    listSupplierInvoices: (token) => apiFetch('/operations/supplier-invoices', { token }),
    getSupplierInvoice: (token, id) => apiFetch(`/operations/supplier-invoices/${id}`, { token }),
    createSupplierInvoice: (token, body) => apiFetch('/operations/supplier-invoices', { method: 'POST', token, body }),
    approveSupplierInvoice: (token, id) => apiFetch(`/operations/supplier-invoices/${id}/approve`, { method: 'PATCH', token }),

    listStockDocuments: (token) => apiFetch('/operations/stock-documents', { token }),
    getStockDocument: (token, id) => apiFetch(`/operations/stock-documents/${id}`, { token }),
    createStockDocument: (token, body) => apiFetch('/operations/stock-documents', { method: 'POST', token, body }),
    submitStockDocument: (token, id) => apiFetch(`/operations/stock-documents/${id}/submit`, { method: 'PATCH', token }),
    approveStockDocument: (token, id) => apiFetch(`/operations/stock-documents/${id}/approve`, { method: 'PATCH', token }),
    postStockDocument: (token, id) => apiFetch(`/operations/stock-documents/${id}/post`, { method: 'PATCH', token }),
  },
  inventory: {
    balances: (token) => apiFetch('/inventory/balances', { token }),
    ledger: (token) => apiFetch('/inventory/ledger', { token }),
    lowStock: (token) => apiFetch('/inventory/low-stock', { token }),
    valuation: (token) => apiFetch('/inventory/valuation', { token }),
  },
  reports: {
    dashboard: (token) => apiFetch('/reports/dashboard', { token }),
    projectConsumption: (token) => apiFetch('/reports/project-consumption', { token }),
    movementSummary: (token) => apiFetch('/reports/movement-summary', { token }),
  },
  audit: {
    logs: (token) => apiFetch('/audit/logs', { token }),
  },
};
