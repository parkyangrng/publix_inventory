# Publix Inventory API

Public, read-only REST API for querying Publix supermarket inventory across all store locations. No authentication required.

Built with **Node.js + Express**, interactive docs via **Swagger UI**, deployed on **Render**.

**Live:** https://publix-inventory-api.onrender.com  
**Swagger UI:** https://publix-inventory-api.onrender.com/docs  
**OpenAPI spec:** https://publix-inventory-api.onrender.com/api/openapi.json

---

## Project structure

```
publix-inventory-api/
├── package.json        Express + swagger-ui-express
├── server.js           Express app, all routes, mock data, OpenAPI spec
├── public/
│   └── index.html      Landing page with endpoint reference
├── render.yaml         Render Blueprint (Node.js web service)
└── README.md
```

---

## Quick start

```bash
git clone https://github.com/your-username/publix-inventory-api.git
cd publix-inventory-api
npm install
npm start
# → http://localhost:3000
# → http://localhost:3000/docs  (Swagger UI)
```

---

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/inventory` | Browse stock across all stores |
| GET | `/api/inventory/{sku}` | Stock for one SKU |
| GET | `/api/inventory/low-stock` | Items at or below restock threshold |
| GET | `/api/inventory/search` | Full-text search by name or SKU |
| GET | `/api/products` | Full product catalog |
| GET | `/api/products/{sku}` | Single product detail |
| GET | `/api/products/{sku}/availability` | Product + live stock combined |
| GET | `/api/stores` | All store locations |
| GET | `/api/stores/{storeId}/summary` | Store inventory snapshot |
| GET | `/api/categories` | All categories with counts |
| GET | `/api/categories/{slug}/inventory` | Category stock overview |
| GET | `/api/openapi.json` | OpenAPI 3.1 spec |
| GET | `/health` | Health check |

---

## Example requests

```bash
# All produce in stock at Brickell store
curl "https://publix-inventory-api.onrender.com/api/inventory?store_id=store_FL01&category=produce&in_stock=true"

# Search for oat milk
curl "https://publix-inventory-api.onrender.com/api/inventory/search?q=oat+milk"

# Product detail + stock across all stores
curl "https://publix-inventory-api.onrender.com/api/products/PRD-BAN-ORG/availability"

# Low-stock alerts at Wynwood store
curl "https://publix-inventory-api.onrender.com/api/inventory/low-stock?store_id=store_FL03"

# Inventory snapshot for a store
curl "https://publix-inventory-api.onrender.com/api/stores/store_FL01/summary"

# All dairy products, organic only
curl "https://publix-inventory-api.onrender.com/api/products?category=dairy&organic=true"
```

---

## Mock data

| Resource | Count |
|---|---|
| Products (SKUs) | 44 |
| Stores | 6 (Miami, Coral Gables, Wynwood, Coconut Grove, Atlanta Buckhead, Atlanta Midtown) |
| Categories | 10 (produce, dairy, bakery, frozen, beverages, meat, pantry, deli, pharmacy, floral) |

Inventory quantities are generated deterministically per SKU/store (seeded, reproducible). No database required.

---

## Deploy to Render

### Option 1 — render.yaml (recommended)

1. Push this repo to GitHub
2. Go to [dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service**
3. Connect your GitHub repo
4. Render detects `render.yaml` automatically → click **Create Web Service**

### Option 2 — Manual settings

| Setting | Value |
|---|---|
| Runtime | Node |
| Build command | `npm install` |
| Start command | `npm start` |
| Health check path | `/health` |

---

## Rate limits

120 requests / minute per IP (enforced at Render's edge). All endpoints are read-only — no writes or deletes.

---

## License

MIT
