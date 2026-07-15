# Publix Inventory API

Public, read-only REST API for querying Publix supermarket inventory across all store locations. No authentication required. **All API endpoints use `POST` with a JSON request body.**

Built with **Node.js + Express**, interactive docs via **Swagger UI**, deployed on **Render**.

**Live:** https://publix-inventory-api.onrender.com  
**Swagger UI:** https://publix-inventory-api.onrender.com/docs  
**OpenAPI spec:** https://publix-inventory-api.onrender.com/api/openapi.json

---

## Project structure

```
publix-inventory-api/
├── package.json        Express + swagger-ui-express
├── server.js           Express app — all routes, mock data, OpenAPI spec
├── public/
│   └── index.html      Landing page
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
# → http://localhost:3000/docs   (Swagger UI)
```

---

## Endpoints

All endpoints accept `Content-Type: application/json` and return JSON.

| Method | Path | Description |
|---|---|---|
| POST | `/api/inventory` | Browse stock levels across all stores |
| POST | `/api/inventory/low-stock` | Items at or below restock threshold |
| POST | `/api/inventory/search` | Full-text search by name, SKU, brand, description |
| POST | `/api/inventory/sku` | Stock for a single SKU across stores |
| POST | `/api/products` | Full product catalog with filters |
| POST | `/api/products/detail` | Single product record |
| POST | `/api/products/availability` | Product detail + live stock in one call |
| POST | `/api/stores` | All active store locations |
| POST | `/api/stores/summary` | Store-level inventory snapshot |
| POST | `/api/categories` | All categories with product counts |
| POST | `/api/categories/inventory` | Stock overview for a category |
| GET | `/api/openapi.json` | OpenAPI 3.1 machine-readable spec |
| GET | `/health` | Health check |

---

## Request body reference

### `POST /api/inventory`
```json
{
  "store_id": "store_FL01",
  "category": "produce",
  "in_stock": true,
  "page": 1,
  "limit": 50
}
```

### `POST /api/inventory/low-stock`
```json
{
  "store_id": "store_FL01",
  "category": "dairy"
}
```

### `POST /api/inventory/search`
```json
{
  "q": "oat milk",
  "store_id": "store_FL01",
  "category": "dairy",
  "in_stock": true,
  "page": 1,
  "limit": 20
}
```
| Field | Type | Required | Description |
|---|---|---|---|
| `q` | string | ✅ | Search term, min 2 chars. Matches name, SKU, brand, description |
| `store_id` | string | no | Scope to one store |
| `category` | string | no | Filter by category slug |
| `in_stock` | boolean | no | Only items with qty > 0 |
| `page` | integer | no | Default 1 |
| `limit` | integer | no | Default 20, max 100 |

### `POST /api/inventory/sku`
```json
{
  "sku": "PRD-BAN-ORG",
  "store_id": "store_FL01"
}
```
| Field | Type | Required | Description |
|---|---|---|---|
| `sku` | string | ✅ | Product SKU |
| `store_id` | string | no | Scope to one store; omit for all stores |

### `POST /api/products`
```json
{
  "category": "dairy",
  "brand": "Publix",
  "organic": true,
  "page": 1,
  "limit": 20
}
```

### `POST /api/products/detail`
```json
{ "sku": "PRD-BAN-ORG" }
```

### `POST /api/products/availability`
```json
{
  "sku": "PRD-BAN-ORG",
  "store_id": "store_FL01"
}
```

### `POST /api/stores`
```json
{ "active_only": true }
```

### `POST /api/stores/summary`
```json
{ "store_id": "store_FL01" }
```
`store_id` is **required**.

### `POST /api/categories`
```json
{ "slug": "produce" }
```
Empty body `{}` returns all categories.

### `POST /api/categories/inventory`
```json
{
  "category": "produce",
  "store_id": "store_FL01",
  "in_stock": true
}
```
`category` is **required**.

---

## curl examples

```bash
BASE=https://publix-inventory-api.onrender.com

# Browse produce in stock at Brickell
curl -X POST $BASE/api/inventory \
  -H "Content-Type: application/json" \
  -d '{"category":"produce","store_id":"store_FL01","in_stock":true}'

# Search for oat milk
curl -X POST $BASE/api/inventory/search \
  -H "Content-Type: application/json" \
  -d '{"q":"oat milk","category":"dairy"}'

# Stock for one SKU across all stores
curl -X POST $BASE/api/inventory/sku \
  -H "Content-Type: application/json" \
  -d '{"sku":"PRD-BAN-ORG"}'

# Low-stock items at Wynwood
curl -X POST $BASE/api/inventory/low-stock \
  -H "Content-Type: application/json" \
  -d '{"store_id":"store_FL03"}'

# Product detail + live stock
curl -X POST $BASE/api/products/availability \
  -H "Content-Type: application/json" \
  -d '{"sku":"DRY-OAT-PLN"}'

# Store inventory snapshot
curl -X POST $BASE/api/stores/summary \
  -H "Content-Type: application/json" \
  -d '{"store_id":"store_FL01"}'

# All dairy products
curl -X POST $BASE/api/categories/inventory \
  -H "Content-Type: application/json" \
  -d '{"category":"dairy","in_stock":true}'

# All stores
curl -X POST $BASE/api/stores \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## Mock data

| Resource | Count | Details |
|---|---|---|
| Products (SKUs) | 46 | Across 10 categories |
| Stores | 6 | FL: Brickell, Coral Gables, Wynwood, Coconut Grove · GA: Buckhead, Midtown Atlanta |
| Categories | 10 | produce, dairy, bakery, frozen, beverages, meat, pantry, deli, pharmacy, floral |

### Store IDs

| ID | Name | City |
|---|---|---|
| `store_FL01` | Publix Brickell | Miami, FL |
| `store_FL02` | Publix Coral Gables | Coral Gables, FL |
| `store_FL03` | Publix Wynwood | Miami, FL |
| `store_FL04` | Publix Coconut Grove | Coconut Grove, FL |
| `store_GA01` | Publix Buckhead | Atlanta, GA |
| `store_GA02` | Publix Midtown Atlanta | Atlanta, GA |

### Category slugs

`produce` · `dairy` · `bakery` · `frozen` · `beverages` · `meat` · `pantry` · `deli` · `pharmacy` · `floral`

---

## Deploy to Render

### Option 1 — render.yaml (recommended)

1. Push all files to GitHub (ensure `public/index.html` is inside a `public/` subfolder)
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

## Changelog

### v2.0.0
- **All API endpoints converted to POST** — parameters moved from URL query strings and path params to JSON request body
- Path-based routes (e.g. `/api/inventory/:sku`) replaced with body-based equivalents (`/api/inventory/sku` with `{"sku":"..."}`)
- `/api/products/:sku` → `POST /api/products/detail`
- `/api/products/:sku/availability` → `POST /api/products/availability`
- `/api/stores/:storeId/summary` → `POST /api/stores/summary`
- `/api/categories/:slug/inventory` → `POST /api/categories/inventory`
- Full request body schemas added to OpenAPI spec for all endpoints
- Version bumped to `2.0.0`

### v1.1.0
- `POST /api/inventory/search` introduced (search endpoint changed from GET to POST)
- Search expanded to match brand and description fields

### v1.0.0
- Initial release

---

## Rate limits

120 requests / minute per IP. All endpoints are read-only — no writes or deletes.

---

## License

MIT
