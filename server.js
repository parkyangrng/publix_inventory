'use strict';

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

// ─── Mock Data ───────────────────────────────────────────────────────────────

const STORES = [
  { id: 'store_FL01', name: 'Publix Brickell',       address: '1401 S Miami Ave, Miami, FL 33130',         hours: '07:00-22:00', timezone: 'America/New_York', active: true },
  { id: 'store_FL02', name: 'Publix Coral Gables',   address: '2939 Bird Ave, Coral Gables, FL 33133',     hours: '07:00-22:00', timezone: 'America/New_York', active: true },
  { id: 'store_FL03', name: 'Publix Wynwood',         address: '2800 N Miami Ave, Miami, FL 33127',         hours: '06:00-23:00', timezone: 'America/New_York', active: true },
  { id: 'store_FL04', name: 'Publix Coconut Grove',   address: '3401 Virginia St, Coconut Grove, FL 33133', hours: '07:00-21:00', timezone: 'America/New_York', active: true },
  { id: 'store_GA01', name: 'Publix Buckhead',        address: '3330 Piedmont Rd NE, Atlanta, GA 30305',    hours: '07:00-22:00', timezone: 'America/New_York', active: true },
  { id: 'store_GA02', name: 'Publix Midtown Atlanta', address: '650 Ponce De Leon Ave NE, Atlanta, GA 30308', hours: '07:00-23:00', timezone: 'America/New_York', active: true },
];

const CATEGORIES = [
  { slug: 'produce',    label: 'Fresh Produce',      subcategories: ['fruits', 'vegetables', 'herbs', 'salads'] },
  { slug: 'dairy',      label: 'Dairy & Eggs',        subcategories: ['milk', 'cheese', 'yogurt', 'eggs', 'butter'] },
  { slug: 'bakery',     label: 'Bakery',              subcategories: ['bread', 'pastries', 'cakes', 'rolls'] },
  { slug: 'frozen',     label: 'Frozen Foods',        subcategories: ['meals', 'vegetables', 'ice-cream', 'pizza'] },
  { slug: 'beverages',  label: 'Beverages',           subcategories: ['juice', 'water', 'soda', 'coffee', 'tea'] },
  { slug: 'meat',       label: 'Meat & Seafood',      subcategories: ['beef', 'chicken', 'pork', 'fish', 'shrimp'] },
  { slug: 'pantry',     label: 'Pantry & Dry Goods',  subcategories: ['pasta', 'rice', 'canned', 'snacks', 'condiments'] },
  { slug: 'deli',       label: 'Deli',                subcategories: ['cold-cuts', 'prepared', 'cheese', 'subs'] },
  { slug: 'pharmacy',   label: 'Pharmacy & Health',   subcategories: ['vitamins', 'otc', 'personal-care'] },
  { slug: 'floral',     label: 'Floral',              subcategories: ['bouquets', 'plants', 'arrangements'] },
];

const PRODUCTS = [
  // Produce
  { sku: 'PRD-BAN-ORG', name: 'Organic Bananas',           brand: 'Publix Greenwise', category: 'produce',   unit: 'lb',   price: 0.69, organic: true,  allergens: [],                    description: 'USDA Organic yellow bananas, sold by the pound.' },
  { sku: 'PRD-APL-HON', name: 'Honeycrisp Apples',         brand: 'SunFresh',         category: 'produce',   unit: 'lb',   price: 2.29, organic: false, allergens: [],                    description: 'Crisp, sweet-tart Honeycrisp apples. Sold by the pound.' },
  { sku: 'PRD-SPN-BYB', name: 'Organic Baby Spinach 5oz',  brand: 'Publix Greenwise', category: 'produce',   unit: 'each', price: 3.99, organic: true,  allergens: [],                    description: 'Pre-washed organic baby spinach in a 5 oz clamshell.' },
  { sku: 'PRD-TOM-ROM', name: 'Roma Tomatoes',              brand: 'SunFresh',         category: 'produce',   unit: 'lb',   price: 1.29, organic: false, allergens: [],                    description: 'Firm, meaty Roma tomatoes perfect for sauces and salads.' },
  { sku: 'PRD-AVC-HAS', name: 'Hass Avocado',              brand: 'SunFresh',         category: 'produce',   unit: 'each', price: 1.49, organic: false, allergens: [],                    description: 'Ripe Hass avocados sold individually.' },
  { sku: 'PRD-STR-ORG', name: 'Organic Strawberries 1lb',  brand: 'Publix Greenwise', category: 'produce',   unit: 'each', price: 5.49, organic: true,  allergens: [],                    description: 'Sweet organic strawberries, 1 lb container.' },
  { sku: 'PRD-BRO-CRW', name: 'Broccoli Crown',            brand: 'SunFresh',         category: 'produce',   unit: 'each', price: 2.49, organic: false, allergens: [],                    description: 'Fresh broccoli crown, approximately 1 lb.' },
  { sku: 'PRD-KAL-ORG', name: 'Organic Kale Bunch',        brand: 'Publix Greenwise', category: 'produce',   unit: 'each', price: 2.99, organic: true,  allergens: [],                    description: 'Curly organic kale bunch, freshly harvested.' },
  // Dairy & Eggs
  { sku: 'DRY-MLK-WHL', name: 'Whole Milk Gallon',         brand: 'Publix',           category: 'dairy',     unit: 'each', price: 4.59, organic: false, allergens: ['milk'],              description: '1-gallon whole milk, pasteurized and homogenized.' },
  { sku: 'DRY-MLK-ALM', name: 'Almond Milk Unsweetened',   brand: 'Silk',             category: 'dairy',     unit: 'each', price: 4.29, organic: false, allergens: ['tree nuts'],         description: '64 oz unsweetened almond milk, dairy-free.' },
  { sku: 'DRY-OAT-PLN', name: 'Oat Milk Barista 32oz',     brand: 'Oatly',            category: 'dairy',     unit: 'each', price: 5.49, organic: false, allergens: ['oat'],               description: 'Barista-edition oat milk, extra creamy.' },
  { sku: 'DRY-YGT-GRK', name: 'Greek Yogurt Plain 17.6oz', brand: 'Chobani',          category: 'dairy',     unit: 'each', price: 2.79, organic: false, allergens: ['milk'],              description: 'Nonfat plain Greek yogurt, 17.6 oz tub.' },
  { sku: 'DRY-EGG-LRG', name: 'Large Eggs Dozen',          brand: 'Publix Greenwise', category: 'dairy',     unit: 'each', price: 6.29, organic: true,  allergens: ['egg'],               description: '12 free-range large brown eggs, USDA Organic.' },
  { sku: 'DRY-CHZ-CHD', name: 'Sharp Cheddar Block 16oz',  brand: 'Publix',           category: 'dairy',     unit: 'each', price: 6.99, organic: false, allergens: ['milk'],              description: 'Extra-sharp cheddar cheese block, 16 oz.' },
  { sku: 'DRY-BTR-UNS', name: 'Unsalted Butter 4 sticks',  brand: 'Land O Lakes',     category: 'dairy',     unit: 'each', price: 5.99, organic: false, allergens: ['milk'],              description: 'Grade A unsalted butter, 4 sticks (1 lb).' },
  // Bakery
  { sku: 'BKR-BRD-SRD', name: 'Sourdough Loaf',            brand: 'Publix Bakery',    category: 'bakery',    unit: 'each', price: 4.99, organic: false, allergens: ['gluten'],            description: 'Freshly baked artisan sourdough, 24 oz loaf.' },
  { sku: 'BKR-BRD-WHT', name: 'Whole Wheat Bread',         brand: 'Publix Bakery',    category: 'bakery',    unit: 'each', price: 3.49, organic: false, allergens: ['gluten'],            description: 'Soft whole wheat sandwich bread, 20 oz loaf.' },
  { sku: 'BKR-CRW-BUT', name: 'Butter Croissant',          brand: 'Publix Bakery',    category: 'bakery',    unit: 'each', price: 2.29, organic: false, allergens: ['gluten','milk','egg'], description: 'Flaky all-butter croissant, baked fresh daily.' },
  { sku: 'BKR-MFN-BLB', name: 'Blueberry Muffin Jumbo',   brand: 'Publix Bakery',    category: 'bakery',    unit: 'each', price: 2.79, organic: false, allergens: ['gluten','egg','milk'], description: 'Jumbo blueberry muffin with streusel topping.' },
  { sku: 'BKR-SUB-ITA', name: 'Italian Sub Roll 6-pack',   brand: 'Publix Bakery',    category: 'bakery',    unit: 'each', price: 3.99, organic: false, allergens: ['gluten'],            description: '6-pack hoagie rolls, perfect for Publix subs.' },
  // Frozen
  { sku: 'FRZ-PZA-MAR', name: 'Margherita Thin Pizza',     brand: 'Freschetta',       category: 'frozen',    unit: 'each', price: 8.49, organic: false, allergens: ['gluten','milk'],     description: '12-inch thin-crust Margherita frozen pizza.' },
  { sku: 'FRZ-VEG-MIX', name: 'Mixed Vegetables 12oz',     brand: "Birds Eye",        category: 'frozen',    unit: 'each', price: 2.79, organic: false, allergens: [],                    description: 'Steam-in-bag mixed vegetables, no salt added.' },
  { sku: 'FRZ-ICE-VNL', name: 'Vanilla Bean Ice Cream',    brand: 'Publix Premium',   category: 'frozen',    unit: 'each', price: 5.99, organic: false, allergens: ['milk'],              description: '48 oz premium vanilla bean ice cream.' },
  { sku: 'FRZ-EDM-SHL', name: 'Edamame Shelled 12oz',      brand: 'Seapoint Farms',   category: 'frozen',    unit: 'each', price: 3.99, organic: false, allergens: ['soy'],               description: 'Ready-to-eat shelled edamame, lightly salted.' },
  // Beverages
  { sku: 'BEV-OJ-NAT',  name: 'Orange Juice 52oz',         brand: 'Tropicana',        category: 'beverages', unit: 'each', price: 5.79, organic: false, allergens: [],                    description: 'No-pulp 100% pure squeezed orange juice.' },
  { sku: 'BEV-WTR-SPK', name: 'Sparkling Water 12pk',      brand: 'LaCroix',          category: 'beverages', unit: 'each', price: 7.49, organic: false, allergens: [],                    description: '12-pack assorted flavored sparkling water.' },
  { sku: 'BEV-COF-GRD', name: 'Ground Coffee Medium 12oz', brand: 'Publix',           category: 'beverages', unit: 'each', price: 8.99, organic: false, allergens: [],                    description: 'Medium roast ground coffee, 12 oz bag.' },
  { sku: 'BEV-TEA-GRN', name: 'Green Tea 20-bag box',      brand: 'Bigelow',          category: 'beverages', unit: 'each', price: 3.99, organic: false, allergens: [],                    description: 'Classic green tea bags, 20 count box.' },
  { sku: 'BEV-JUC-APL', name: 'Apple Juice 64oz',          brand: "Mott's",           category: 'beverages', unit: 'each', price: 4.49, organic: false, allergens: [],                    description: '100% apple juice, no sugar added, 64 oz.' },
  // Meat & Seafood
  { sku: 'MET-CHK-BRS', name: 'Chicken Breast Boneless',   brand: 'Publix GreenWise', category: 'meat',      unit: 'lb',   price: 5.99, organic: true,  allergens: [],                    description: 'Free-range boneless skinless chicken breast.' },
  { sku: 'MET-SAL-ATL', name: 'Atlantic Salmon Fillet',    brand: 'Publix Seafood',   category: 'meat',      unit: 'lb',   price: 13.99, organic: false, allergens: ['fish'],             description: 'Fresh Atlantic salmon fillet, skin-on.' },
  { sku: 'MET-GBF-8020', name: 'Ground Beef 80/20 1lb',    brand: 'Publix',           category: 'meat',      unit: 'each', price: 6.99, organic: false, allergens: [],                    description: '80% lean ground beef, 1 lb package.' },
  { sku: 'MET-SHR-LRG', name: 'Large Shrimp 1lb Raw',      brand: 'Publix Seafood',   category: 'meat',      unit: 'each', price: 11.99, organic: false, allergens: ['shellfish'],        description: 'Raw large shrimp, peeled and deveined, 1 lb.' },
  { sku: 'MET-STK-RIB', name: 'Ribeye Steak',              brand: 'Publix',           category: 'meat',      unit: 'lb',   price: 16.99, organic: false, allergens: [],                   description: 'USDA Choice ribeye steak, cut to order.' },
  // Pantry
  { sku: 'PNT-PST-SPN', name: 'Spaghetti 16oz',            brand: 'Barilla',          category: 'pantry',    unit: 'each', price: 1.89, organic: false, allergens: ['gluten'],            description: 'Classic Barilla spaghetti, 16 oz box.' },
  { sku: 'PNT-RCE-JSM', name: 'Jasmine Rice 5lb',          brand: 'Publix',           category: 'pantry',    unit: 'each', price: 6.99, organic: false, allergens: [],                    description: 'Long-grain fragrant jasmine rice, 5 lb bag.' },
  { sku: 'PNT-CAN-TOM', name: 'Diced Tomatoes 14.5oz',     brand: 'Publix',           category: 'pantry',    unit: 'each', price: 1.09, organic: false, allergens: [],                    description: 'No-salt-added canned diced tomatoes.' },
  { sku: 'PNT-OLV-OIL', name: 'Extra Virgin Olive Oil',    brand: 'Publix',           category: 'pantry',    unit: 'each', price: 8.99, organic: false, allergens: [],                    description: 'Cold-pressed EVOO, 16.9 oz bottle.' },
  { sku: 'PNT-PNB-CRK', name: 'Creamy Peanut Butter 16oz', brand: 'Jif',              category: 'pantry',    unit: 'each', price: 4.29, organic: false, allergens: ['peanuts'],           description: 'Creamy peanut butter, 16 oz jar.' },
  // Deli
  { sku: 'DLI-TKY-RST', name: 'Oven Roasted Turkey Breast', brand: 'Publix Deli',     category: 'deli',      unit: 'lb',   price: 10.99, organic: false, allergens: [],                   description: 'Freshly sliced oven roasted turkey breast.' },
  { sku: 'DLI-HAM-HNY', name: 'Honey Glazed Ham',          brand: 'Publix Deli',      category: 'deli',      unit: 'lb',   price: 8.99, organic: false, allergens: [],                    description: 'Sweet honey-glazed ham, sliced to order.' },
  { sku: 'DLI-SUB-ITA', name: 'Italian Sub 12-inch',       brand: 'Publix Deli',      category: 'deli',      unit: 'each', price: 9.99, organic: false, allergens: ['gluten','milk'],     description: 'Classic Publix Italian sub on a fresh-baked roll.' },
  // Pharmacy / Health
  { sku: 'PHR-VIT-C',   name: 'Vitamin C 1000mg 100ct',    brand: 'Publix',           category: 'pharmacy',  unit: 'each', price: 9.99, organic: false, allergens: [],                    description: '100-count Vitamin C 1000mg tablets.' },
  { sku: 'PHR-ADV-200', name: 'Ibuprofen 200mg 100ct',     brand: 'Publix',           category: 'pharmacy',  unit: 'each', price: 7.49, organic: false, allergens: [],                    description: 'Ibuprofen 200mg tablets, 100 count.' },
  // Floral
  { sku: 'FLR-RSE-DZN', name: 'Red Rose Bouquet Dozen',    brand: 'Publix Floral',    category: 'floral',    unit: 'each', price: 19.99, organic: false, allergens: [],                   description: 'Fresh-cut dozen red roses with greenery.' },
  { sku: 'FLR-MIX-SEA', name: 'Seasonal Mix Bouquet',      brand: 'Publix Floral',    category: 'floral',    unit: 'each', price: 12.99, organic: false, allergens: [],                   description: 'Colorful seasonal flower arrangement.' },
];

// ─── Generate Inventory ───────────────────────────────────────────────────────
// Deterministic pseudo-random using a seeded approach
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
      last_updated: '2026-07-14T09:00:00Z',
    };
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function paginate(items, page = 1, limit = 50) {
  page = Math.max(1, parseInt(page) || 1);
  limit = Math.min(100, Math.max(1, parseInt(limit) || 50));
  const total = items.length;
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };
}

function buildItem(product, storeId) {
  const inv = (INVENTORY[product.sku] || {})[storeId] || {};
  return {
    sku: product.sku,
    name: product.name,
    store_id: storeId,
    qty_available: inv.qty_available ?? 0,
    low_stock: inv.low_stock ?? true,
    unit: product.unit,
    price: product.price,
    last_updated: inv.last_updated ?? '2026-07-14T09:00:00Z',
  };
}

function apiErr(res, msg, code) {
  return res.status(code).json({ error: msg });
}

const storeIds = STORES.map((s) => s.id);
const catSlugs = CATEGORIES.map((c) => c.slug);

// ─── OpenAPI Spec ─────────────────────────────────────────────────────────────

const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Publix Inventory Query API',
    version: '1.0.0',
    description:
      'Public, read-only REST API for querying Publix supermarket inventory across all store locations. ' +
      'No authentication required. Rate limit: 120 req/min per IP. ' +
      'Stock data refreshed every 60 seconds from POS systems.',
    contact: { email: 'api-support@publix.com' },
    license: { name: 'MIT' },
  },
  servers: [
    { url: 'https://publix-inventory-api.onrender.com', description: 'Production (Render)' },
    { url: 'http://localhost:3000', description: 'Local development' },
  ],
  tags: [
    { name: 'Inventory',   description: 'Live stock levels across all stores' },
    { name: 'Products',    description: 'Full product catalog' },
    { name: 'Stores',      description: 'Store locations and snapshots' },
    { name: 'Categories',  description: 'Product category browsing' },
  ],
  paths: {
    '/api/inventory': {
      get: {
        tags: ['Inventory'],
        summary: 'Browse all stock',
        description: 'Returns current stock levels across all Publix stores. Supports filtering by store, category, and availability.',
        operationId: 'listInventory',
        parameters: [
          { name: 'store_id',  in: 'query', schema: { type: 'string' },                                                                                   description: 'Filter to one store ID (e.g. store_FL01)' },
          { name: 'category',  in: 'query', schema: { type: 'string', enum: catSlugs },                                                                    description: 'Filter by product category' },
          { name: 'in_stock',  in: 'query', schema: { type: 'boolean' },                                                                                   description: 'Only return items with qty > 0' },
          { name: 'page',      in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit',     in: 'query', schema: { type: 'integer', default: 50, maximum: 100 } },
        ],
        responses: {
          200: { description: 'Paginated list of inventory items' },
          400: { description: 'Invalid query parameter' },
        },
      },
    },
    '/api/inventory/low-stock': {
      get: {
        tags: ['Inventory'],
        summary: 'Low stock alerts',
        description: 'Returns all items at or below the restock threshold (20 units or fewer).',
        operationId: 'lowStock',
        parameters: [
          { name: 'store_id', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Array of low-stock items' } },
      },
    },
    '/api/inventory/search': {
      get: {
        tags: ['Inventory'],
        summary: 'Search inventory',
        description: 'Full-text search across product names and SKUs.',
        operationId: 'searchInventory',
        parameters: [
          { name: 'q',        in: 'query', required: true, schema: { type: 'string', minLength: 2 }, description: 'Search term (min 2 chars)' },
          { name: 'store_id', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Search results with count' },
          400: { description: 'Query too short or missing' },
        },
      },
    },
    '/api/inventory/{sku}': {
      get: {
        tags: ['Inventory'],
        summary: 'Stock by SKU',
        description: 'Stock levels for a single SKU across all stores, or one store.',
        operationId: 'inventoryBySku',
        parameters: [
          { name: 'sku',      in: 'path',  required: true, schema: { type: 'string' }, example: 'PRD-BAN-ORG' },
          { name: 'store_id', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Array of StoreStock objects' },
          404: { description: 'SKU not found' },
        },
      },
    },
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'List products',
        description: 'Browse the full Publix product catalog.',
        operationId: 'listProducts',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'brand',    in: 'query', schema: { type: 'string' } },
          { name: 'organic',  in: 'query', schema: { type: 'boolean' } },
          { name: 'page',     in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit',    in: 'query', schema: { type: 'integer', default: 20, maximum: 100 } },
        ],
        responses: { 200: { description: 'Paginated product list' } },
      },
    },
    '/api/products/{sku}': {
      get: {
        tags: ['Products'],
        summary: 'Get product',
        operationId: 'getProduct',
        parameters: [{ name: 'sku', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Full product record' },
          404: { description: 'SKU not found' },
        },
      },
    },
    '/api/products/{sku}/availability': {
      get: {
        tags: ['Products'],
        summary: 'Product + stock combined',
        description: 'Product detail with live stock across all stores in one response.',
        operationId: 'productAvailability',
        parameters: [{ name: 'sku', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Product with embedded store_stock array' },
          404: { description: 'SKU not found' },
        },
      },
    },
    '/api/stores': {
      get: {
        tags: ['Stores'],
        summary: 'List stores',
        operationId: 'listStores',
        responses: { 200: { description: 'All active Publix locations' } },
      },
    },
    '/api/stores/{storeId}/summary': {
      get: {
        tags: ['Stores'],
        summary: 'Store inventory summary',
        operationId: 'storeSummary',
        parameters: [{ name: 'storeId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'High-level inventory snapshot for the store' },
          404: { description: 'Store not found' },
        },
      },
    },
    '/api/categories': {
      get: {
        tags: ['Categories'],
        summary: 'List categories',
        operationId: 'listCategories',
        responses: { 200: { description: 'All categories with product counts' } },
      },
    },
    '/api/categories/{slug}/inventory': {
      get: {
        tags: ['Categories'],
        summary: 'Category inventory',
        operationId: 'categoryInventory',
        parameters: [
          { name: 'slug',     in: 'path',  required: true, schema: { type: 'string' } },
          { name: 'store_id', in: 'query', schema: { type: 'string' } },
          { name: 'in_stock', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: {
          200: { description: 'Stock for all products in the category' },
          404: { description: 'Category not found' },
        },
      },
    },
  },
  components: {
    schemas: {
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
    },
  },
};

// ─── Swagger UI ───────────────────────────────────────────────────────────────

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
  customSiteTitle: 'Publix Inventory API',
  customCss: '.topbar { display: none }',
  swaggerOptions: { tryItOutEnabled: true, filter: true, deepLinking: true },
}));

app.get('/api/openapi.json', (req, res) => res.json(openApiSpec));

// ─── Routes: Inventory ────────────────────────────────────────────────────────

app.get('/api/inventory', (req, res) => {
  const { store_id, category, in_stock, page, limit } = req.query;

  if (store_id && !storeIds.includes(store_id))
    return apiErr(res, `store_id '${store_id}' not found.`, 400);
  if (category && !catSlugs.includes(category))
    return apiErr(res, `category '${category}' not found.`, 400);

  const targets = store_id ? [store_id] : storeIds;
  let items = [];

  for (const product of PRODUCTS) {
    if (category && product.category !== category) continue;
    for (const sid of targets) {
      const item = buildItem(product, sid);
      if (in_stock === 'true'  && item.qty_available === 0) continue;
      if (in_stock === 'false' && item.qty_available > 0)  continue;
      items.push(item);
    }
  }

  res.json(paginate(items, page, limit));
});

app.get('/api/inventory/low-stock', (req, res) => {
  const { store_id, category } = req.query;
  if (store_id && !storeIds.includes(store_id))
    return apiErr(res, `store_id '${store_id}' not found.`, 400);

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

app.get('/api/inventory/search', (req, res) => {
  const { q, store_id, category } = req.query;
  if (!q || q.trim().length < 2)
    return apiErr(res, "Query 'q' must be at least 2 characters.", 400);

  const targets = store_id ? [store_id] : storeIds;
  const ql = q.toLowerCase();
  const results = [];

  for (const product of PRODUCTS) {
    if (category && product.category !== category) continue;
    if (!product.name.toLowerCase().includes(ql) && !product.sku.toLowerCase().includes(ql)) continue;
    for (const sid of targets) results.push(buildItem(product, sid));
  }

  res.json({ results, count: results.length, query: q });
});

app.get('/api/inventory/:sku', (req, res) => {
  const product = PRODUCTS.find((p) => p.sku === req.params.sku);
  if (!product) return apiErr(res, `SKU '${req.params.sku}' not found.`, 404);

  const { store_id } = req.query;
  if (store_id && !storeIds.includes(store_id))
    return apiErr(res, `store_id '${store_id}' not found.`, 400);

  const storeMap = Object.fromEntries(STORES.map((s) => [s.id, s.name]));
  const targets = store_id ? [store_id] : storeIds;

  const result = targets.map((sid) => {
    const inv = (INVENTORY[product.sku] || {})[sid] || {};
    return {
      store_id: sid,
      store_name: storeMap[sid],
      qty_available: inv.qty_available ?? 0,
      low_stock: inv.low_stock ?? true,
      last_updated: inv.last_updated ?? '2026-07-14T09:00:00Z',
    };
  });

  res.json(result);
});

// ─── Routes: Products ─────────────────────────────────────────────────────────

app.get('/api/products', (req, res) => {
  const { category, brand, organic, page, limit } = req.query;
  let items = PRODUCTS;
  if (category) items = items.filter((p) => p.category === category);
  if (brand)    items = items.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
  if (organic === 'true')  items = items.filter((p) => p.organic);
  if (organic === 'false') items = items.filter((p) => !p.organic);
  res.json(paginate(items, page, limit || 20));
});

app.get('/api/products/:sku/availability', (req, res) => {
  const product = PRODUCTS.find((p) => p.sku === req.params.sku);
  if (!product) return apiErr(res, `SKU '${req.params.sku}' not found.`, 404);

  const storeMap = Object.fromEntries(STORES.map((s) => [s.id, s.name]));
  const store_stock = storeIds.map((sid) => {
    const inv = (INVENTORY[product.sku] || {})[sid] || {};
    return { store_id: sid, store_name: storeMap[sid], qty_available: inv.qty_available ?? 0, low_stock: inv.low_stock ?? true, last_updated: inv.last_updated };
  });

  res.json({ ...product, store_stock });
});

app.get('/api/products/:sku', (req, res) => {
  const product = PRODUCTS.find((p) => p.sku === req.params.sku);
  if (!product) return apiErr(res, `SKU '${req.params.sku}' not found.`, 404);
  res.json(product);
});

// ─── Routes: Stores ───────────────────────────────────────────────────────────

app.get('/api/stores', (req, res) => res.json(STORES));

app.get('/api/stores/:storeId/summary', (req, res) => {
  const store = STORES.find((s) => s.id === req.params.storeId);
  if (!store) return apiErr(res, `store_id '${req.params.storeId}' not found.`, 404);

  const sid = store.id;
  const low  = PRODUCTS.filter((p) => (INVENTORY[p.sku]?.[sid]?.low_stock)).length;
  const out  = PRODUCTS.filter((p) => (INVENTORY[p.sku]?.[sid]?.qty_available ?? 0) === 0).length;
  const cats = [...new Set(PRODUCTS.map((p) => p.category))].sort();

  res.json({
    store_id: sid,
    store_name: store.name,
    total_skus: PRODUCTS.length,
    low_stock_count: low,
    out_of_stock_count: out,
    categories_carried: cats,
  });
});

// ─── Routes: Categories ───────────────────────────────────────────────────────

app.get('/api/categories', (req, res) => {
  const result = CATEGORIES.map((cat) => ({
    ...cat,
    product_count: PRODUCTS.filter((p) => p.category === cat.slug).length,
  }));
  res.json(result);
});

app.get('/api/categories/:slug/inventory', (req, res) => {
  const cat = CATEGORIES.find((c) => c.slug === req.params.slug);
  if (!cat) return apiErr(res, `Category '${req.params.slug}' not found.`, 404);

  const { store_id, in_stock } = req.query;
  const targets = store_id ? [store_id] : storeIds;
  let items = [];

  for (const product of PRODUCTS) {
    if (product.category !== cat.slug) continue;
    for (const sid of targets) {
      const item = buildItem(product, sid);
      if (in_stock === 'true' && item.qty_available === 0) continue;
      items.push(item);
    }
  }

  items.sort((a, b) => b.qty_available - a.qty_available);
  res.json({ category: cat.slug, data: items, total: items.length });
});

// ─── Health & root ────────────────────────────────────────────────────────────

app.get('/health', (req, res) => res.json({ status: 'ok', version: '1.0.0', service: 'publix-inventory-api' }));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Publix Inventory API running on http://localhost:${PORT}`);
  console.log(`  Swagger UI → http://localhost:${PORT}/docs`);
  console.log(`  OpenAPI    → http://localhost:${PORT}/api/openapi.json`);
});
