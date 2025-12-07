const express = require('express');
const cors = require('cors');
const compression = require('compression');
const fs = require('fs').promises;
const path = require('path');
const Papa = require('papaparse');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json());

// ============================================
// LOAD & CACHE DATA
// ============================================
let cachedData = null;
let cachedFilterOptions = null;

const loadData = async () => {
  if (cachedData) return cachedData;

  try {
    const dataPath = path.join(__dirname, '../data/sales_data.csv');
    const csvData = await fs.readFile(dataPath, 'utf-8');

    console.log('📖 Parsing CSV...');
    const parsed = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      worker: false
    });

    console.log('🔄 Normalizing data...');
    cachedData = parsed.data.map(row => normalizeRow(row));
    console.log(`✅ Loaded ${cachedData.length} records`);

    // Pre-calculate filter options
    console.log('⚙️  Computing filter options...');
    cachedFilterOptions = getDistinctValuesOptimized(cachedData);
    console.log('✅ Filter options ready');

    return cachedData;
  } catch (error) {
    console.error('Error loading data:', error.message);
    throw new Error('Failed to load sales data');
  }
};

const normalizeRow = (row) => {
  return {
    customerId: (row['Customer ID'] || '').trim(),
    customerName: (row['Customer Name'] || '').trim(),
    phoneNumber: (row['Phone Number'] || '').trim(),
    gender: (row['Gender'] || '').trim(),
    age: parseInt(row['Age']) || 0,
    region: (row['Customer Region'] || '').trim(),
    customerType: (row['Customer Type'] || '').trim(),
    productId: (row['Product ID'] || '').trim(),
    productName: (row['Product Name'] || '').trim(),
    brand: (row['Brand'] || '').trim(),
    category: (row['Product Category'] || '').trim(),
    tags: (row['Tags'] || '').split(',').map(t => t.trim()).filter(Boolean),
    quantity: parseInt(row['Quantity']) || 0,
    pricePerUnit: parseFloat(row['Price per Unit']) || 0,
    discountPercentage: parseFloat(row['Discount Percentage']) || 0,
    totalAmount: parseFloat(row['Total Amount']) || 0,
    finalAmount: parseFloat(row['Final Amount']) || 0,
    date: (row['Date'] || '').trim(),
    paymentMethod: (row['Payment Method'] || '').trim(),
    orderStatus: (row['Order Status'] || '').trim(),
    deliveryType: (row['Delivery Type'] || '').trim(),
    storeId: (row['Store ID'] || '').trim(),
    storeLocation: (row['Store Location'] || '').trim(),
    salespersonId: (row['Salesperson ID'] || '').trim(),
    employeeName: (row['Employee Name'] || '').trim()
  };
};

// ============================================
// OPTIMIZED DISTINCT VALUES (NO SPREAD OPERATOR)
// ============================================
const getDistinctValuesOptimized = (items) => {
  // Use Maps to avoid spread operator issues with large arrays
  const regionSet = new Map();
  const genderSet = new Map();
  const categorySet = new Map();
  const paymentSet = new Map();
  const tagSet = new Map();
  let minAge = Infinity;
  let maxAge = -Infinity;
  let minDate = null;
  let maxDate = null;

  for (const item of items) {
    // Regions
    if (item.region) regionSet.set(item.region, true);

    // Genders
    if (item.gender) genderSet.set(item.gender, true);

    // Categories
    if (item.category) categorySet.set(item.category, true);

    // Payment Methods
    if (item.paymentMethod) paymentSet.set(item.paymentMethod, true);

    // Tags
    for (const tag of item.tags) {
      if (tag) tagSet.set(tag, true);
    }

    // Age Range
    if (item.age > 0) {
      if (item.age < minAge) minAge = item.age;
      if (item.age > maxAge) maxAge = item.age;
    }

    // Date Range
    if (item.date) {
      if (!minDate || item.date < minDate) minDate = item.date;
      if (!maxDate || item.date > maxDate) maxDate = item.date;
    }
  }

  return {
    regions: Array.from(regionSet.keys()).sort(),
    genders: Array.from(genderSet.keys()).sort(),
    categories: Array.from(categorySet.keys()).sort(),
    paymentMethods: Array.from(paymentSet.keys()).sort(),
    tags: Array.from(tagSet.keys()).sort(),
    ageRange: {
      min: minAge === Infinity ? 18 : minAge,
      max: maxAge === -Infinity ? 75 : maxAge
    },
    dateRange: {
      from: minDate || null,
      to: maxDate || null
    }
  };
};

// ============================================
// SEARCH SERVICE
// ============================================
const searchService = {
  search: (items, query) => {
    if (!query || query.trim() === '') return items;

    const sanitized = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(sanitized, 'i');

    const results = [];
    for (const item of items) {
      if (regex.test(item.customerName) || regex.test(item.phoneNumber)) {
        results.push(item);
      }
    }
    return results;
  }
};

// ============================================
// FILTER SERVICE
// ============================================
const filterService = {
  applyFilters: (items, filters) => {
    const results = [];

    for (const item of items) {
      let passes = true;

      // Region filter
      if (filters.region?.length > 0) {
        if (!filters.region.includes(item.region)) {
          passes = false;
        }
      }

      // Gender filter
      if (passes && filters.gender?.length > 0) {
        if (!filters.gender.includes(item.gender)) {
          passes = false;
        }
      }

      // Age range filter
      if (passes && filters.ageRange) {
        const { min, max } = filters.ageRange;
        if (item.age < min || item.age > max) {
          passes = false;
        }
      }

      // Category filter
      if (passes && filters.category?.length > 0) {
        if (!filters.category.includes(item.category)) {
          passes = false;
        }
      }

      // Tags filter
      if (passes && filters.tags?.length > 0) {
        const hasTag = filters.tags.some(tag => item.tags.includes(tag));
        if (!hasTag) {
          passes = false;
        }
      }

      // Payment method filter
      if (passes && filters.paymentMethod?.length > 0) {
        if (!filters.paymentMethod.includes(item.paymentMethod)) {
          passes = false;
        }
      }

      // Date range filter
      if (passes && (filters.dateRange?.from || filters.dateRange?.to)) {
        const itemDate = new Date(item.date);

        if (filters.dateRange.from) {
          const fromDate = new Date(filters.dateRange.from);
          if (itemDate < fromDate) {
            passes = false;
          }
        }

        if (passes && filters.dateRange.to) {
          const toDate = new Date(filters.dateRange.to);
          toDate.setDate(toDate.getDate() + 1);
          if (itemDate >= toDate) {
            passes = false;
          }
        }
      }

      if (passes) {
        results.push(item);
      }
    }

    return results;
  }
};

// ============================================
// SORT SERVICE
// ============================================
const sortService = {
  sort: (items, sortBy, sortOrder = 'asc') => {
    const sorted = [...items];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortBy?.toLowerCase()) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'quantity':
          comparison = a.quantity - b.quantity;
          break;
        case 'customername':
          comparison = a.customerName.localeCompare(b.customerName);
          break;
        default:
          return 0;
      }

      return sortOrder.toLowerCase() === 'desc' ? -comparison : comparison;
    });

    return sorted;
  }
};

// ============================================
// PAGINATION SERVICE
// ============================================
const paginationService = {
  paginate: (items, page = 1, pageSize = 10) => {
    const totalRecords = items.length;
    const totalPages = Math.ceil(totalRecords / pageSize) || 1;
    const validPage = Math.max(1, Math.min(page, totalPages));

    const startIndex = (validPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
      items: items.slice(startIndex, endIndex),
      pagination: {
        page: validPage,
        pageSize,
        totalRecords,
        totalPages
      }
    };
  }
};

// ============================================
// COMBINED OPERATIONS
// ============================================
const applyCombinedOperations = (data, options) => {
  let result = data;

  const { search, filters, sortBy, sortOrder, page, limit } = options;

  // 1. Search
  if (search) {
    result = searchService.search(result, search);
  }

  // 2. Filter
  if (filters && Object.keys(filters).some(k => filters[k])) {
    result = filterService.applyFilters(result, filters);
  }

  // 3. Sort
  if (sortBy) {
    result = sortService.sort(result, sortBy, sortOrder || 'asc');
  }

  // 4. Paginate
  const paginationResult = paginationService.paginate(result, page, limit);

  return {
    items: paginationResult.items,
    pagination: paginationResult.pagination
  };
};

// ============================================
// VALIDATION MIDDLEWARE
// ============================================
const validateQuery = (req, res, next) => {
  const { page, limit } = req.query;

  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid page number'
    });
  }

  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid limit'
    });
  }

  next();
};

// ============================================
// API ROUTES
// ============================================

// GET /api/sales
app.get('/api/sales', validateQuery, async (req, res) => {
  try {
    const data = await loadData();

    const {
      search,
      region,
      gender,
      ageMin,
      ageMax,
      category,
      tags,
      paymentMethod,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10
    } = req.query;

    const filters = {
      region: region ? region.split(',').map(r => r.trim()) : [],
      gender: gender ? gender.split(',').map(g => g.trim()) : [],
      ageRange: ageMin || ageMax ? {
        min: parseInt(ageMin) || 0,
        max: parseInt(ageMax) || 999
      } : null,
      category: category ? category.split(',').map(c => c.trim()) : [],
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      paymentMethod: paymentMethod ? paymentMethod.split(',').map(p => p.trim()) : [],
      dateRange: dateFrom || dateTo ? {
        from: dateFrom,
        to: dateTo
      } : null
    };

    const result = applyCombinedOperations(data, {
      search,
      filters,
      sortBy,
      sortOrder,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: result.items,
      pagination: result.pagination,
      filters: cachedFilterOptions
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve data',
      error: error.message
    });
  }
});

// GET /api/filters/options
app.get('/api/filters/options', async (req, res) => {
  try {
    const data = await loadData();
    res.json({
      success: true,
      filters: cachedFilterOptions
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load filter options'
    });
  }
});

// GET /health
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ============================================
// START SERVER
// ============================================
loadData().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API available at http://localhost:${PORT}/api/sales`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});