'use strict';

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const STORES = [
  { id: 'store_FL01', name: 'Publix Brickell',       address: '1401 S Miami Ave, Miami, FL 33130',           hours: '07:00-22:00', timezone: 'America/New_York', active: true },
  { id: 'store_FL02', name: 'Publix Coral Gables',   address: '2939 Bird Ave, Coral Gables, FL 33133',       hours: '07:00-22:00', timezone: 'America/New_York', active: true },
  { id: 'store_FL03', name: 'Publix Wynwood',         address: '2800 N Miami Ave, Miami, FL 33127',           hours: '06:00-23:00', timezone: 'America/New_York', active: true },
  { id: 'store_FL04', name: 'Publix Coconut Grove',   address: '3401 Virginia St, Coconut Grove, FL 33133',   hours: '07:00-21:00', timezone: 'America/New_York', active: true },
  { id: 'store_GA01', name: 'Publix Buckhead',        address: '3330 Piedmont Rd NE, Atlanta, GA 30305',      hours: '07:00-22:00', timezone: 'America/New_York', active: true },
  { id: 'store_GA02', name: 'Publix Midtown Atlanta', address: '650 Ponce De Leon Ave NE, Atlanta, GA 30308', hours: '07:00-23:00', timezone: 'America/New_York', active: true },
];

const CATEGORIES = [
  { slug: 'produce',   label: 'Fresh Produce',     subcategories: ['fruits','vegetables','herbs','salads'] },
  { slug: 'dairy',     label: 'Dairy & Eggs',       subcategories: ['milk','cheese','yogurt','eggs','butter'] },
  { slug: 'bakery',    label: 'Bakery',             subcategories: ['bread','pastries','cakes','rolls'] },
  { slug: 'frozen',    label: 'Frozen Foods',       subcategories: ['meals','vegetables','ice-cream','pizza'] },
  { slug: 'beverages', label: 'Beverages',          subcategories: ['juice','water','soda','coffee','tea'] },
  { slug: 'meat',      label: 'Meat & Seafood',     subcategories: ['beef','chicken','pork','fish','shrimp'] },
  { slug: 'pantry',    label: 'Pantry & Dry Goods', subcategories: ['pasta','rice','canned','snacks','condiments'] },
  { slug: 'deli',      label: 'Deli',               subcategories: ['cold-cuts','prepared','cheese','subs'] },
  { slug: 'pharmacy',  label: 'Pharmacy & Health',  subcategories: ['vitamins','otc','personal-care'] },
  { slug: 'floral',    label: 'Floral',             subcategories: ['bouquets','plants','arrangements'] },
];

const PRODUCTS = [
  // Produce
  { sku: 'PRD-BAN-ORG',  name: 'Organic Bananas',           brand: 'Publix Greenwise', category: 'produce',   unit: 'lb',   price: 0.69,  organic: true,  allergens: [],                     description: 'USDA Organic yellow bananas, sold by the pound.' },
  { sku: 'PRD-APL-HON',  name: 'Honeycrisp Apples',         brand: 'SunFresh',         category: 'produce',   unit: 'lb',   price: 2.29,  organic: false, allergens: [],                     description: 'Crisp, sweet-tart Honeycrisp apples. Sold by the pound.' },
  { sku: 'PRD-SPN-BYB',  name: 'Organic Baby Spinach 5oz',  brand: 'Publix Greenwise', category: 'produce',   unit: 'each', price: 3.99,  organic: true,  allergens: [],                     description: 'Pre-washed organic baby spinach in a 5 oz clamshell.' },
  { sku: 'PRD-TOM-ROM',  name: 'Roma Tomatoes',              brand: 'SunFresh',         category: 'produce',   unit: 'lb',   price: 1.29,  organic: false, allergens: [],                     description: 'Firm, meaty Roma tomatoes perfect for sauces and salads.' },
  { sku: 'PRD-AVC-HAS',  name: 'Hass Avocado',              brand: 'SunFresh',         category: 'produce',   unit: 'each', price: 1.49,  organic: false, allergens: [],                     description: 'Ripe Hass avocados sold individually.' },
  { sku: 'PRD-STR-ORG',  name: 'Organic Strawberries 1lb',  brand: 'Publix Greenwise', category: 'produce',   unit: 'each', price: 5.49,  organic: true,  allergens: [],                     description: 'Sweet organic strawberries, 1 lb container.' },
  { sku: 'PRD-BRO-CRW',  name: 'Broccoli Crown',            brand: 'SunFresh',         category: 'produce',   unit: 'each', price: 2.49,  organic: false, allergens: [],                     description: 'Fresh broccoli crown, approximately 1 lb.' },
  { sku: 'PRD-KAL-ORG',  name: 'Organic Kale Bunch',        brand: 'Publix Greenwise', category: 'produce',   unit: 'each', price: 2.99,  organic: true,  allergens: [],                     description: 'Curly organic kale bunch, freshly harvested.' },
  // Dairy & Eggs
  { sku: 'DRY-MLK-WHL',  name: 'Whole Milk Gallon',         brand: 'Publix',           category: 'dairy',     unit: 'each', price: 4.59,  organic: false, allergens: ['milk'],               description: '1-gallon whole milk, pasteurized and homogenized.' },
  { sku: 'DRY-MLK-ALM',  name: 'Almond Milk Unsweetened',   brand: 'Silk',             category: 'dairy',     unit: 'each', price: 4.29,  organic: false, allergens: ['tree nuts'],          description: '64 oz unsweetened almond milk, dairy-free.' },
  { sku: 'DRY-OAT-PLN',  name: 'Oat Milk Barista 32oz',     brand: 'Oatly',            category: 'dairy',     unit: 'each', price: 5.49,  organic: false, allergens: ['oat'],                description: 'Barista-edition oat milk, extra creamy.' },
  { sku: 'DRY-YGT-GRK',  name: 'Greek Yogurt Plain 17.6oz', brand: 'Chobani',          category: 'dairy',     unit: 'each', price: 2.79,  organic: false, allergens: ['milk'],               description: 'Nonfat plain Greek yogurt, 17.6 oz tub.' },
  { sku: 'DRY-EGG-LRG',  name: 'Large Eggs Dozen',          brand: 'Publix Greenwise', category: 'dairy',     unit: 'each', price: 6.29,  organic: true,  allergens: ['egg'],                description: '12 free-range large brown eggs, USDA Organic.' },
  { sku: 'DRY-CHZ-CHD',  name: 'Sharp Cheddar Block 16oz',  brand: 'Publix',           category: 'dairy',     unit: 'each', price: 6.99,  organic: false, allergens: ['milk'],               description: 'Extra-sharp cheddar cheese block, 16 oz.' },
  { sku: 'DRY-BTR-UNS',  name: 'Unsalted Butter 4 sticks',  brand: 'Land O Lakes',     category: 'dairy',     unit: 'each', price: 5.99,  organic: false, allergens: ['milk'],               description: 'Grade A unsalted butter, 4 sticks (1 lb).' },
  // Bakery
  { sku: 'BKR-BRD-SRD',  name: 'Sourdough Loaf',            brand: 'Publix Bakery',    category: 'bakery',    unit: 'each', price: 4.99,  organic: false, allergens: ['gluten'],             description: 'Freshly baked artisan sourdough, 24 oz loaf.' },
  { sku: 'BKR-BRD-WHT',  name: 'Whole Wheat Bread',         brand: 'Publix Bakery',    category: 'bakery',    unit: 'each', price: 3.49,  organic: false, allergens: ['gluten'],             description: 'Soft whole wheat sandwich bread, 20 oz loaf.' },
  { sku: 'BKR-CRW-BUT',  name: 'Butter Croissant',          brand: 'Publix Bakery',    category: 'bakery',    unit: 'each', price: 2.29,  organic: false, allergens: ['gluten','milk','egg'], description: 'Flaky all-butter croissant, baked fresh daily.' },
  { sku: 'BKR-MFN-BLB',  name: 'Blueberry Muffin Jumbo',   brand: 'Publix Bakery',    category: 'bakery',    unit: 'each', price: 2.79,  organic: false, allergens: ['gluten','egg','milk'], description: 'Jumbo blueberry muffin with streusel topping.' },
  { sku: 'BKR-SUB-ITA',  name: 'Italian Sub Roll 6-pack',   brand: 'Publix Bakery',    category: 'bakery',    unit: 'each', price: 3.99,  organic: false, allergens: ['gluten'],             description: '6-pack hoagie rolls, perfect for Publix subs.' },
  // Frozen
  { sku: 'FRZ-PZA-MAR',  name: 'Margherita Thin Pizza',     brand: 'Freschetta',       category: 'frozen',    unit: 'each', price: 8.49,  organic: false, allergens: ['gluten','milk'],      description: '12-inch thin-crust Margherita frozen pizza.' },
  { sku: 'FRZ-VEG-MIX',  name: 'Mixed Vegetables 12oz',     brand: 'Birds Eye',        category: 'frozen',    unit: 'each', price: 2.79,  organic: false, allergens: [],                     description: 'Steam-in-bag mixed vegetables, no salt added.' },
  { sku: 'FRZ-ICE-VNL',  name: 'Vanilla Bean Ice Cream',    brand: 'Publix Premium',   category: 'frozen',    unit: 'each', price: 5.99,  organic: false, allergens: ['milk'],               description: '48 oz premium vanilla bean ice cream.' },
  { sku: 'FRZ-EDM-SHL',  name: 'Edamame Shelled 12oz',      brand: 'Seapoint Farms',   category: 'frozen',    unit: 'each', price: 3.99,  organic: false, allergens: ['soy'],                description: 'Ready-to-eat shelled edamame, lightly salted.' },
  // Beverages
  { sku: 'BEV-OJ-NAT',   name: 'Orange Juice 52oz',         brand: 'Tropicana',        category: 'beverages', unit: 'each', price: 5.79,  organic: false, allergens: [],                     description: 'No-pulp 100% pure squeezed orange juice.' },
  { sku: 'BEV-WTR-SPK',  name: 'Sparkling Water 12pk',      brand: 'LaCroix',          category: 'beverages', unit: 'each', price: 7.49,  organic: false, allergens: [],                     description: '12-pack assorted flavored sparkling water.' },
  { sku: 'BEV-COF-GRD',  name: 'Ground Coffee Medium 12oz', brand: 'Publix',           category: 'beverages', unit: 'each', price: 8.99,  organic: false, allergens: [],                     description: 'Medium roast ground coffee, 12 oz bag.' },
  { sku: 'BEV-TEA-GRN',  name: 'Green Tea 20-bag box',      brand: 'Bigelow',          category: 'beverages', unit: 'each', price: 3.99,  organic: false, allergens: [],                     description: 'Classic green tea bags, 20 count box.' },
  { sku: 'BEV-JUC-APL',  name: 'Apple Juice 64oz',          brand: "Mott's",           category: 'beverages', unit: 'each', price: 4.49,  organic: false, allergens: [],                     description: '100% apple juice, no sugar added, 64 oz.' },
  // Meat & Seafood
  { sku: 'MET-CHK-BRS',  name: 'Chicken Breast Boneless',   brand: 'Publix GreenWise', category: 'meat',      unit: 'lb',   price: 5.99,  organic: true,  allergens: [],                     description: 'Free-range boneless skinless chicken breast.' },
  { sku: 'MET-SAL-ATL',  name: 'Atlantic Salmon Fillet',    brand: 'Publix Seafood',   category: 'meat',      unit: 'lb',   price: 13.99, organic: false, allergens: ['fish'],               description: 'Fresh Atlantic salmon fillet, skin-on.' },
  { sku: 'MET-GBF-8020', name: 'Ground Beef 80/20 1lb',     brand: 'Publix',           category: 'meat',      unit: 'each', price: 6.99,  organic: false, allergens: [],                     description: '80% lean ground beef, 1 lb package.' },
  { sku: 'MET-SHR-LRG',  name: 'Large Shrimp 1lb Raw',      brand: 'Publix Seafood',   category: 'meat',      unit: 'each', price: 11.99, organic: false, allergens: ['shellfish'],          description: 'Raw large shrimp, peeled and deveined, 1 lb.' },
  { sku: 'MET-STK-RIB',  name: 'Ribeye Steak',              brand: 'Publix',           category: 'meat',      unit: 'lb',   price: 16.99, organic: false, allergens: [],                     description: 'USDA Choice ribeye steak, cut to order.' },
  // Pantry
  { sku: 'PNT-PST-SPN',  name: 'Spaghetti 16oz',            brand: 'Barilla',          category: 'pantry',    unit: 'each', price: 1.89,  organic: false, allergens: ['gluten'],             description: 'Classic Barilla spaghetti, 16 oz box.' },
  { sku: 'PNT-RCE-JSM',  name: 'Jasmine Rice 5lb',          brand: 'Publix',           category: 'pantry',    unit: 'each', price: 6.99,  organic: false, allergens: [],                     description: 'Long-grain fragrant jasmine rice, 5 lb bag.' },
  { sku: 'PNT-CAN-TOM',  name: 'Diced Tomatoes 14.5oz',     brand: 'Publix',           category: 'pantry',    unit: 'each', price: 1.09,  organic: false, allergens: [],                     description: 'No-salt-added canned diced tomatoes.' },
  { sku: 'PNT-OLV-OIL',  name: 'Extra Virgin Olive Oil',    brand: 'Publix',           category: 'pantry',    unit: 'each', price: 8.99,  organic: false, allergens: [],                     description: 'Cold-pressed EVOO, 16.9 oz bottle.' },
  { sku: 'PNT-PNB-CRK',  name: 'Creamy Peanut Butter 16oz', brand: 'Jif',              category: 'pantry',    unit: 'each', price: 4.29,  organic: false, allergens: ['peanuts'],            description: 'Creamy peanut butter, 16 oz jar.' },
  // Deli
  { sku: 'DLI-TKY-RST',  name: 'Oven Roasted Turkey Breast', brand: 'Publix Deli',     category: 'deli',      unit: 'lb',   price: 10.99, organic: false, allergens: [],                     description: 'Freshly sliced oven roasted turkey breast.' },
  { sku: 'DLI-HAM-HNY',  name: 'Honey Glazed Ham',          brand: 'Publix Deli',      category: 'deli',      unit: 'lb',   price: 8.99,  organic: false, allergens: [],                     description: 'Sweet honey-glazed ham, sliced to order.' },
  { sku: 'DLI-SUB-ITA',  name: 'Italian Sub 12-inch',       brand: 'Publix Deli',      category: 'deli',      unit: 'each', price: 9.99,  organic: false, allergens: ['gluten','milk'],      description: 'Classic Publix Italian sub on a fresh-baked roll.' },
  // Pharmacy
  { sku: 'PHR-VIT-C',    name: 'Vitamin C 1000mg 100ct',    brand: 'Publix',           category: 'pharmacy',  unit: 'each', price: 9.99,  organic: false, allergens: [],                     description: '100-count Vitamin C 1000mg tablets.' },
  { sku: 'PHR-ADV-200',  name: 'Ibuprofen 200mg 100ct',     brand: 'Publix',           category: 'pharmacy',  unit: 'each', price: 7.49,  organic: false, allergens: [],                     description: 'Ibuprofen 200mg tablets, 100 count.' },
  // Floral
  { sku: 'FLR-RSE-DZN',  name: 'Red Rose Bouquet Dozen',    brand: 'Publix Floral',    category: 'floral',    unit: 'each', price: 19.99, organic: false, allergens: [],                     description: 'Fresh-cut dozen red roses with greenery.' },
  { sku: 'FLR-MIX-SEA',  name: 'Seasonal Mix Bouquet',      brand: 'Publix Floral',    category: 'floral',    unit: 'each', price: 12.99, organic: false, allergens: [],                     description: 'Colorful seasonal flower arrangement.' },
];

// ─── Inventory (seeded deterministic) ────────────────────────────────────────

function seededRand(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const INVENTORY = {};
let seedVal = 42;
for (const product of PRODUCTS) {
  INVENTORY[product.sku] = {};
  for (const store of STORES) {
    const rand = seededRand(++seedVal);
    const qty = Math.floor(rand() * 300);
    INVENTORY[product.sku][store.id] = {
      qty_available: qty,
      low_stock: qty <= 20,
      last_updated: '2026-07-15T09:00:00Z',
    };
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function paginate(items, page = 1, limit = 50) {
  page  = Math.max(1, parseInt(page)  || 1);
  limit = Math.min(100, Math.max(1, parseInt(limit) || 50));
  const total = items.length;
  const start = (page - 1) * limit;
  return { data: items.slice(start, start + limit), page, limit, total, pages: Math.ceil(total / limit) };
}

function buildItem(product, storeId) {
  const inv = (INVENTORY[product.sku] || {})[storeId] || {};
  return {
    sku:           product.sku,
    name:          product.name,
    store_id:      storeId,
    qty_available: inv.qty_available ?? 0,
    low_stock:     inv.low_stock ?? true,
    unit:          product.unit,
    price:         product.price,
    last_updated:  inv.last_updated ?? '2026-07-15T09:00:00Z',
  };
}

function apiErr(res, msg, code) { return res.status(code).json({ error: msg }); }

const storeIds = STORES.map((s) => s.id);
const catSlugs = CATEGORIES.map((c) => c.slug);

// ─── OpenAPI Spec ─────────────────────────────────────────────────────────────

const CAT_ENUM = catSlugs;

function postOp(tag, summary, description, operationId, bodyRef, responseDesc, extra400 = '') {
  return {
    post: {
      tags: [tag],
      summary,
      description,
      operationId,
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: `#/components/schemas/${bodyRef}` } } },
      },
      responses: {
        200: { description: responseDesc },
        400: { description: `Invalid request body${extra400 ? ` — ${extra400}` : ''}` },
        404: { description: 'Resource not found' },
      },
    },
  };
}

const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Publix Inventory Query API',
    version: '2.0.0',
    description:
      'Public, read-only REST API for querying Publix supermarket inventory. ' +
      'All endpoints use POST with a JSON request body. No authentication required. ' +
      'Rate limit: 120 req/min per IP. Stock refreshed every 60 seconds from POS systems.',
    contact: { email: 'api-support@publix.com' },
    license: { name: 'MIT' },
  },
  servers: [
    { url: 'https://publix-inventory-api.onrender.com', description: 'Production (Render)' },
    { url: 'http://localhost:3000', description: 'Local development' },
  ],
  tags: [
    { name: 'Inventory',  description: 'Live stock levels across all stores' },
    { name: 'Products',   description: 'Full product catalog' },
    { name: 'Stores',     description: 'Store locations and snapshots' },
    { name: 'Categories', description: 'Product category browsing' },
  ],
  paths: {
    '/api/inventory': {
      ...postOp('Inventory', 'Browse all stock', 'Returns paginated stock levels across all stores with optional filters.', 'listInventory', 'InventoryRequest', 'Paginated InventoryItem list'),
    },
    '/api/inventory/low-stock': {
      ...postOp('Inventory', 'Low stock alerts', 'Returns items at or below the restock threshold (20 units or fewer).', 'lowStock', 'LowStockRequest', 'Array of low-stock InventoryItems'),
    },
    '/api/inventory/search': {
      ...postOp('Inventory', 'Search inventory', 'Full-text search across name, SKU, brand, and description.', 'searchInventory', 'SearchRequest', 'SearchResponse with results and applied filters', 'q required, min 2 chars'),
    },
    '/api/inventory/sku': {
      ...postOp('Inventory', 'Stock by SKU', 'Stock levels for a single SKU across all (or one) store.', 'inventoryBySku', 'SkuRequest', 'Array of StoreStock objects'),
    },
    '/api/products': {
      ...postOp('Products', 'List products', 'Browse the full Publix product catalog with optional filters.', 'listProducts', 'ProductsRequest', 'Paginated Product list'),
    },
    '/api/products/detail': {
      ...postOp('Products', 'Get product', 'Full detail record for a single product SKU.', 'getProduct', 'SkuRequest', 'Full Product object'),
    },
    '/api/products/availability': {
      ...postOp('Products', 'Product + stock combined', 'Product detail with live stock across all stores in one call.', 'productAvailability', 'SkuRequest', 'Product with embedded store_stock array'),
    },
    '/api/stores': {
      ...postOp('Stores', 'List stores', 'Returns all active Publix store locations. Empty body {} returns all.', 'listStores', 'StoresRequest', 'Array of Store objects'),
    },
    '/api/stores/summary': {
      ...postOp('Stores', 'Store inventory summary', 'High-level inventory snapshot for one store.', 'storeSummary', 'StoreIdRequest', 'StoreSummary object'),
    },
    '/api/categories': {
      ...postOp('Categories', 'List categories', 'Returns all product categories with SKU counts. Empty body {} returns all.', 'listCategories', 'CategoriesRequest', 'Array of Category objects'),
    },
    '/api/categories/inventory': {
      ...postOp('Categories', 'Category inventory', 'Stock overview for all products in a category.', 'categoryInventory', 'CategoryInventoryRequest', 'Array of InventoryItems sorted by qty desc'),
    },
  },
  components: {
    schemas: {
      // ── Shared fields ──
      InventoryItem: {
        type: 'object',
        properties: {
          sku:           { type: 'string',  example: 'PRD-BAN-ORG' },
          name:          { type: 'string',  example: 'Organic Bananas' },
          store_id:      { type: 'string',  example: 'store_FL01' },
          qty_available: { type: 'integer', example: 214 },
          low_stock:     { type: 'boolean', example: false },
          unit:          { type: 'string',  example: 'lb' },
          price:         { type: 'number',  example: 0.69 },
          last_updated:  { type: 'string',  format: 'date-time' },
        },
      },
      Product: {
        type: 'object',
        properties: {
          sku:         { type: 'string' },
          name:        { type: 'string' },
          brand:       { type: 'string' },
          category:    { type: 'string' },
          unit:        { type: 'string' },
          price:       { type: 'number' },
          organic:     { type: 'boolean' },
          allergens:   { type: 'array', items: { type: 'string' } },
          description: { type: 'string' },
        },
      },
      Store: {
        type: 'object',
        properties: {
          id:       { type: 'string' },
          name:     { type: 'string' },
          address:  { type: 'string' },
          hours:    { type: 'string' },
          timezone: { type: 'string' },
          active:   { type: 'boolean' },
        },
      },
      // ── Request bodies ──
      InventoryRequest: {
        type: 'object',
        properties: {
          store_id: { type: 'string', example: 'store_FL01', description: 'Filter to one store' },
          category: { type: 'string', enum: CAT_ENUM,        description: 'Filter by category' },
          in_stock: { type: 'boolean',                        description: 'Only items with qty > 0' },
          page:     { type: 'integer', default: 1 },
          limit:    { type: 'integer', default: 50, maximum: 100 },
        },
      },
      LowStockRequest: {
        type: 'object',
        properties: {
          store_id: { type: 'string', example: 'store_FL01' },
          category: { type: 'string', enum: CAT_ENUM },
        },
      },
      SearchRequest: {
        type: 'object',
        required: ['q'],
        properties: {
          q:        { type: 'string', minLength: 2, example: 'oat milk', description: 'Search term — matches name, SKU, brand, description' },
          store_id: { type: 'string', example: 'store_FL01' },
          category: { type: 'string', enum: CAT_ENUM },
          in_stock: { type: 'boolean', example: true },
          page:     { type: 'integer', default: 1 },
          limit:    { type: 'integer', default: 20, maximum: 100 },
        },
      },
      SearchResponse: {
        type: 'object',
        properties: {
          results: { type: 'array', items: { $ref: '#/components/schemas/InventoryItem' } },
          count:   { type: 'integer', example: 6 },
          query:   { type: 'string',  example: 'oat milk' },
          filters: { type: 'object' },
          page:    { type: 'integer' },
          total:   { type: 'integer' },
          pages:   { type: 'integer' },
        },
      },
      SkuRequest: {
        type: 'object',
        required: ['sku'],
        properties: {
          sku:      { type: 'string', example: 'PRD-BAN-ORG', description: 'Product SKU' },
          store_id: { type: 'string', example: 'store_FL01',  description: 'Optionally scope to one store' },
        },
      },
      ProductsRequest: {
        type: 'object',
        properties: {
          category: { type: 'string', enum: CAT_ENUM },
          brand:    { type: 'string', example: 'Publix' },
          organic:  { type: 'boolean' },
          page:     { type: 'integer', default: 1 },
          limit:    { type: 'integer', default: 20, maximum: 100 },
        },
      },
      StoresRequest: {
        type: 'object',
        properties: {
          active_only: { type: 'boolean', default: true, description: 'Filter to active stores only' },
        },
      },
      StoreIdRequest: {
        type: 'object',
        required: ['store_id'],
        properties: {
          store_id: { type: 'string', example: 'store_FL01', description: 'Store identifier' },
        },
      },
      CategoriesRequest: {
        type: 'object',
        properties: {
          slug: { type: 'string', enum: CAT_ENUM, description: 'Filter to a single category' },
        },
      },
      CategoryInventoryRequest: {
        type: 'object',
        required: ['category'],
        properties: {
          category: { type: 'string', enum: CAT_ENUM, description: 'Category slug' },
          store_id: { type: 'string', example: 'store_FL01' },
          in_stock: { type: 'boolean' },
        },
      },
    },
  },
};

// ─── Swagger UI & spec ────────────────────────────────────────────────────────

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
  customSiteTitle: 'Publix Inventory API',
  customCss: '.topbar { display: none }',
  swaggerOptions: { tryItOutEnabled: true, filter: true, deepLinking: true },
}));

app.get('/api/openapi.json', (req, res) => res.json(openApiSpec));

// ─── Routes: Inventory ────────────────────────────────────────────────────────

// POST /api/inventory — browse all stock
app.post('/api/inventory', (req, res) => {
  const { store_id, category, in_stock, page, limit } = req.body || {};
  if (store_id && !storeIds.includes(store_id)) return apiErr(res, `store_id '${store_id}' not found.`, 400);
  if (category && !catSlugs.includes(category)) return apiErr(res, `category '${category}' not found.`, 400);

  const targets = store_id ? [store_id] : storeIds;
  const items = [];
  for (const product of PRODUCTS) {
    if (category && product.category !== category) continue;
    for (const sid of targets) {
      const item = buildItem(product, sid);
      if (in_stock === true  && item.qty_available === 0) continue;
      if (in_stock === false && item.qty_available > 0)  continue;
      items.push(item);
    }
  }
  res.json(paginate(items, page, limit || 50));
});

// POST /api/inventory/low-stock — items at or below threshold
app.post('/api/inventory/low-stock', (req, res) => {
  const { store_id, category } = req.body || {};
  if (store_id && !storeIds.includes(store_id)) return apiErr(res, `store_id '${store_id}' not found.`, 400);
  if (category && !catSlugs.includes(category)) return apiErr(res, `category '${category}' not found.`, 400);

  const targets = store_id ? [store_id] : storeIds;
  const items = [];
  for (const product of PRODUCTS) {
    if (category && product.category !== category) continue;
    for (const sid of targets) {
      const item = buildItem(product, sid);
      if (item.low_stock) items.push(item);
    }
  }
  res.json({ data: items, total: items.length });
});

// POST /api/inventory/search — full-text search
app.post('/api/inventory/search', (req, res) => {
  const { q, store_id, category, in_stock, page, limit } = req.body || {};
  if (!q || String(q).trim().length < 2) return apiErr(res, "Body field 'q' is required and must be at least 2 characters.", 400);
  if (store_id && !storeIds.includes(store_id)) return apiErr(res, `store_id '${store_id}' not found.`, 400);
  if (category && !catSlugs.includes(category)) return apiErr(res, `category '${category}' not found.`, 400);

  const targets = store_id ? [store_id] : storeIds;
  const ql = String(q).toLowerCase();
  const results = [];
  for (const product of PRODUCTS) {
    if (category && product.category !== category) continue;
    const match = product.name.toLowerCase().includes(ql) ||
                  product.sku.toLowerCase().includes(ql)  ||
                  product.brand.toLowerCase().includes(ql)||
                  product.description.toLowerCase().includes(ql);
    if (!match) continue;
    for (const sid of targets) {
      const item = buildItem(product, sid);
      if (in_stock === true && item.qty_available === 0) continue;
      results.push(item);
    }
  }
  const filters = {};
  if (store_id)            filters.store_id = store_id;
  if (category)            filters.category = category;
  if (in_stock !== undefined) filters.in_stock = in_stock;

  const p = paginate(results, page, limit || 20);
  res.json({ results: p.data, count: p.total, query: q, filters, page: p.page, total: p.total, pages: p.pages });
});

// POST /api/inventory/sku — stock for one SKU
app.post('/api/inventory/sku', (req, res) => {
  const { sku, store_id } = req.body || {};
  if (!sku) return apiErr(res, "Body field 'sku' is required.", 400);
  const product = PRODUCTS.find((p) => p.sku === sku);
  if (!product) return apiErr(res, `SKU '${sku}' not found.`, 404);
  if (store_id && !storeIds.includes(store_id)) return apiErr(res, `store_id '${store_id}' not found.`, 400);

  const storeMap = Object.fromEntries(STORES.map((s) => [s.id, s.name]));
  const targets  = store_id ? [store_id] : storeIds;
  const result   = targets.map((sid) => {
    const inv = (INVENTORY[sku] || {})[sid] || {};
    return { store_id: sid, store_name: storeMap[sid], qty_available: inv.qty_available ?? 0, low_stock: inv.low_stock ?? true, last_updated: inv.last_updated };
  });
  res.json(result);
});

// ─── Routes: Products ─────────────────────────────────────────────────────────

// POST /api/products — list catalog
app.post('/api/products', (req, res) => {
  const { category, brand, organic, page, limit } = req.body || {};
  if (category && !catSlugs.includes(category)) return apiErr(res, `category '${category}' not found.`, 400);
  let items = PRODUCTS;
  if (category)          items = items.filter((p) => p.category === category);
  if (brand)             items = items.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
  if (organic === true)  items = items.filter((p) => p.organic);
  if (organic === false) items = items.filter((p) => !p.organic);
  res.json(paginate(items, page, limit || 20));
});

// POST /api/products/detail — single product
app.post('/api/products/detail', (req, res) => {
  const { sku } = req.body || {};
  if (!sku) return apiErr(res, "Body field 'sku' is required.", 400);
  const product = PRODUCTS.find((p) => p.sku === sku);
  if (!product) return apiErr(res, `SKU '${sku}' not found.`, 404);
  res.json(product);
});

// POST /api/products/availability — product + live stock
app.post('/api/products/availability', (req, res) => {
  const { sku, store_id } = req.body || {};
  if (!sku) return apiErr(res, "Body field 'sku' is required.", 400);
  const product = PRODUCTS.find((p) => p.sku === sku);
  if (!product) return apiErr(res, `SKU '${sku}' not found.`, 404);
  if (store_id && !storeIds.includes(store_id)) return apiErr(res, `store_id '${store_id}' not found.`, 400);

  const storeMap   = Object.fromEntries(STORES.map((s) => [s.id, s.name]));
  const targets    = store_id ? [store_id] : storeIds;
  const store_stock = targets.map((sid) => {
    const inv = (INVENTORY[sku] || {})[sid] || {};
    return { store_id: sid, store_name: storeMap[sid], qty_available: inv.qty_available ?? 0, low_stock: inv.low_stock ?? true, last_updated: inv.last_updated };
  });
  res.json({ ...product, store_stock });
});

// ─── Routes: Stores ───────────────────────────────────────────────────────────

// POST /api/stores — list stores
app.post('/api/stores', (req, res) => {
  const { active_only = true } = req.body || {};
  const result = active_only ? STORES.filter((s) => s.active) : STORES;
  res.json(result);
});

// POST /api/stores/summary — store snapshot
app.post('/api/stores/summary', (req, res) => {
  const { store_id } = req.body || {};
  if (!store_id) return apiErr(res, "Body field 'store_id' is required.", 400);
  const store = STORES.find((s) => s.id === store_id);
  if (!store) return apiErr(res, `store_id '${store_id}' not found.`, 404);

  const sid  = store.id;
  const low  = PRODUCTS.filter((p) => INVENTORY[p.sku]?.[sid]?.low_stock).length;
  const out  = PRODUCTS.filter((p) => (INVENTORY[p.sku]?.[sid]?.qty_available ?? 0) === 0).length;
  const cats = [...new Set(PRODUCTS.map((p) => p.category))].sort();
  res.json({ store_id: sid, store_name: store.name, total_skus: PRODUCTS.length, low_stock_count: low, out_of_stock_count: out, categories_carried: cats });
});

// ─── Routes: Categories ───────────────────────────────────────────────────────

// POST /api/categories — list categories
app.post('/api/categories', (req, res) => {
  const { slug } = req.body || {};
  if (slug && !catSlugs.includes(slug)) return apiErr(res, `category '${slug}' not found.`, 400);
  let result = CATEGORIES.map((cat) => ({ ...cat, product_count: PRODUCTS.filter((p) => p.category === cat.slug).length }));
  if (slug) result = result.filter((c) => c.slug === slug);
  res.json(result);
});

// POST /api/categories/inventory — stock for a category
app.post('/api/categories/inventory', (req, res) => {
  const { category, store_id, in_stock } = req.body || {};
  if (!category) return apiErr(res, "Body field 'category' is required.", 400);
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) return apiErr(res, `Category '${category}' not found.`, 404);
  if (store_id && !storeIds.includes(store_id)) return apiErr(res, `store_id '${store_id}' not found.`, 400);

  const targets = store_id ? [store_id] : storeIds;
  const items   = [];
  for (const product of PRODUCTS) {
    if (product.category !== category) continue;
    for (const sid of targets) {
      const item = buildItem(product, sid);
      if (in_stock === true && item.qty_available === 0) continue;
      items.push(item);
    }
  }
  items.sort((a, b) => b.qty_available - a.qty_available);
  res.json({ category, data: items, total: items.length });
});

// ─── Health & root ────────────────────────────────────────────────────────────

app.get('/health', (req, res) => res.json({ status: 'ok', version: '2.0.0', service: 'publix-inventory-api' }));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Publix Inventory API v2.0.0 running on http://localhost:${PORT}`);
  console.log(`  Swagger UI → http://localhost:${PORT}/docs`);
  console.log(`  OpenAPI    → http://localhost:${PORT}/api/openapi.json`);
});
