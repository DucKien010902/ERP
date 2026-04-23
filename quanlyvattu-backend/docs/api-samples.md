# Sample API payloads

## 1) Login
```json
{
  "email": "admin@wmkalla.local",
  "password": "Admin@123"
}
```

## 2) Create material request
```json
{
  "projectId": "<project-id>",
  "warehouseId": "<warehouse-id>",
  "neededDate": "2026-04-12",
  "purpose": "Request for floor 6 reinforcement",
  "items": [
    {
      "materialId": "<material-id-rebar>",
      "requestedQty": 850,
      "note": "Rebar D16"
    },
    {
      "materialId": "<material-id-helmet>",
      "requestedQty": 15,
      "note": "New crew PPE"
    }
  ]
}
```

## 3) Create purchase order
```json
{
  "supplierId": "<supplier-id>",
  "projectId": "<project-id>",
  "warehouseId": "<warehouse-id>",
  "orderDate": "2026-04-08",
  "expectedDeliveryDate": "2026-04-10",
  "note": "Rebar + cement batch",
  "items": [
    {
      "materialId": "<material-id-rebar>",
      "qty": 2500,
      "unitPrice": 18100,
      "taxRate": 10
    },
    {
      "materialId": "<material-id-cement>",
      "qty": 300,
      "unitPrice": 82000,
      "taxRate": 10
    }
  ]
}
```

## 4) Create supplier invoice
```json
{
  "invoiceNo": "INV-202604-002",
  "supplierId": "<supplier-id>",
  "purchaseOrderId": "<po-id>",
  "invoiceDate": "2026-04-10",
  "dueDate": "2026-05-10",
  "attachmentUrl": "https://example.com/invoice.pdf",
  "note": "April supply invoice",
  "items": [
    {
      "materialId": "<material-id-rebar>",
      "qty": 2500,
      "unitPrice": 18100,
      "taxRate": 10
    }
  ]
}
```

## 5) Create receipt document
```json
{
  "type": "RECEIPT",
  "supplierId": "<supplier-id>",
  "invoiceId": "<invoice-id>",
  "destinationWarehouseId": "<warehouse-id>",
  "documentDate": "2026-04-10",
  "postingDate": "2026-04-10",
  "referenceNo": "INV-202604-002",
  "note": "GRN for April supply",
  "items": [
    {
      "materialId": "<material-id-rebar>",
      "qty": 2500,
      "unitCost": 18100,
      "taxRate": 10,
      "batchNo": "APR-LOT-02"
    }
  ]
}
```

## 6) Create issue document from request
```json
{
  "type": "ISSUE",
  "projectId": "<project-id>",
  "requestId": "<request-id>",
  "sourceWarehouseId": "<warehouse-id>",
  "documentDate": "2026-04-11",
  "postingDate": "2026-04-11",
  "note": "Issue materials for Tower A",
  "items": [
    {
      "materialId": "<material-id-rebar>",
      "qty": 850,
      "unitCost": 18100
    }
  ]
}
```
