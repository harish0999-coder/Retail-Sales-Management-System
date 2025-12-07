# TruEstate Backend - Retail Sales Management System

## Overview
Express.js backend API for the TruEstate Retail Sales Management System. Handles advanced search, filtering, sorting, and pagination of sales data. Built with clean layered architecture separating controllers, services, and utilities for maintainability and scalability.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Data Processing**: JavaScript (in-memory)
- **CSV Parsing**: csv-parser or similar
- **Environment**: .env configuration
- **Port**: 5000 (configurable)

## Search Implementation Summary

**Location**: `src/services/searchService.js`

**Functionality**:
- Case-insensitive full-text search across `customerName` and `phoneNumber` fields
- Uses string methods (toLowerCase, includes) for efficient matching
- Returns matching records filtered from entire dataset
- Works independently and in combination with filters and sorting

**Algorithm**:
```
Input: dataset array, searchTerm string
1. If searchTerm is empty or whitespace, return entire dataset
2. Convert searchTerm to lowercase
3. Filter dataset: keep records where customerName OR phoneNumber includes searchTerm
4. Return filtered results
```

**Performance**: O(n) linear scan - optimal for in-memory search without indexing

**Edge Cases Handled**:
- Empty or null search term (returns all records)
- Special characters in search term (treated as literals)
- Non-existent customer names/phone numbers (returns empty array)
- Mixed case input (normalized to lowercase)

## Filter Implementation Summary

**Location**: `src/services/filterService.js`

**Multi-Select Filters**:
- `customerRegion`: Multiple region selection with OR logic
- `gender`: Multiple gender selection with OR logic
- `productCategory`: Multiple category selection with OR logic
- `tags`: Multiple tag selection with OR logic
- `paymentMethod`: Multiple payment method selection with OR logic

**Range Filters**:
- `age`: Min and max age boundary (inclusive)
- `date`: Start and end date range (inclusive)

**Logic**:
- Multiple active filters combined with AND logic
- Within same filter category, values combined with OR logic
- Record must satisfy ALL filter conditions to be included
- Range filters are inclusive of boundaries

**Algorithm**:
```
Input: dataset array, filters object
1. For each active filter in filters object:
   - Apply filter condition to dataset
   - Keep records matching that specific filter
2. Return records satisfying all active filters (AND logic)
```

**Edge Cases Handled**:
- No filters active (returns entire dataset)
- Conflicting filters (e.g., age 25-30 AND age 35-40) (returns empty array)
- Partial range (only min or only max) (applies single boundary)
- Non-existent filter values (returns empty array)
- Missing optional fields (treats as no value for filter)

## Sorting Implementation Summary

**Location**: `src/services/sortService.js`

**Supported Sort Fields**:
- `date`: Sorts by date in descending order (newest first)
- `quantity`: Sorts by quantity in ascending/descending order
- `customerName`: Sorts alphabetically A-Z (ascending), Z-A (descending)

**Algorithm**:
```
Input: dataset array, sortConfig object { field, direction }
1. Validate sort field is supported
2. Apply appropriate comparison function based on field type:
   - Date: Compare as dates, handle invalid dates
   - Number: Standard numeric comparison
   - String: Case-insensitive alphabetic comparison
3. Sort with specified direction (asc/desc)
4. Return sorted dataset
```

**Implementation Details**:
- Uses JavaScript Array.sort() with custom comparator
- Stable sorting preserves original order for equal elements
- Case-insensitive for string fields
- Handles null/undefined values gracefully

**Edge Cases Handled**:
- Invalid sort field (defaults to no sorting)
- Null/undefined values in sort field (placed at end)
- Invalid date formats (treated as zero/null)
- Empty dataset (returns empty array)

## Pagination Implementation Summary

**Location**: `src/services/paginationService.js`

**Configuration**:
- Fixed page size: 10 items per page
- Page numbering: 1-indexed (page 1 is first page)
- Navigation: Next/Previous buttons

**Algorithm**:
```
Input: dataset array, page number (1-indexed), pageSize (10)
1. Calculate total records count
2. Calculate total pages = ceil(total / pageSize)
3. Validate page number (must be >= 1 and <= totalPages)
4. Calculate offset = (page - 1) * pageSize
5. Slice dataset: records from offset to offset + pageSize
6. Return paginated data + metadata
```

**Metadata Returned**:
- `currentPage`: Current page number
- `totalPages`: Total number of pages
- `pageSize`: Items per page (10)
- `totalRecords`: Total records in entire dataset
- `hasNextPage`: Boolean indicating if next page exists
- `hasPreviousPage`: Boolean indicating if previous page exists

**API Response Structure**:
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 50,
    "pageSize": 10,
    "totalRecords": 500,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Edge Cases Handled**:
- Page number = 0 or negative (treated as page 1)
- Page number > totalPages (returns empty data, valid metadata)
- Empty dataset (totalPages = 0, returns empty array)
- Single record (totalPages = 1)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create .env file**:
   ```bash
   touch .env
   ```

4. **Configure .env**:
   ```
   PORT=5000
   NODE_ENV=development
   DATASET_PATH=./data/sales_data.csv
   ```

5. **Place dataset file**:
   - Download the CSV dataset from the provided Google Drive link
   - Save it to `backend/data/sales_data.csv`
   - Or update `DATASET_PATH` in .env to point to your file location

### Running the Server

**Development mode** (with auto-reload using nodemon):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

Server will start on `http://localhost:5000`

### Testing the API

**Health check**:
```bash
curl http://localhost:5000/health
```

**Basic sales query**:
```bash
curl "http://localhost:5000/api/sales?page=1"
```

**With search**:
```bash
curl "http://localhost:5000/api/sales?search=john&page=1"
```

**With filters**:
```bash
curl "http://localhost:5000/api/sales?filters=%7B%22customerRegion%22:%5B%22North%22%5D%7D&page=1"
```

**With sorting**:
```bash
curl "http://localhost:5000/api/sales?sort=%7B%22field%22:%22date%22,%22direction%22:%22desc%22%7D&page=1"
```

## API Endpoints

### GET /api/sales

**Query Parameters**:
- `search` (string, optional): Search term for customer name or phone number
- `filters` (JSON string, optional): Filter object as JSON string
- `sort` (JSON string, optional): Sort configuration as JSON string
- `page` (number, optional): Page number (default: 1)

**Filter Object Format**:
```json
{
  "customerRegion": ["North", "South"],
  "gender": ["Male"],
  "age": { "min": 25, "max": 45 },
  "productCategory": ["Electronics"],
  "tags": ["Premium", "New"],
  "paymentMethod": ["Credit Card"],
  "date": { "start": "2024-01-01", "end": "2024-12-31" }
}
```

**Sort Object Format**:
```json
{
  "field": "date",
  "direction": "desc"
}
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "customerId": "C001",
      "customerName": "John Doe",
      "phoneNumber": "9876543210",
      ...
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 50,
    "pageSize": 10,
    "totalRecords": 500,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "error": "Invalid filter format"
}
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── salesController.js      # Request handling logic
│   ├── services/
│   │   ├── searchService.js        # Search implementation
│   │   ├── filterService.js        # Filter implementation
│   │   ├── sortService.js          # Sort implementation
│   │   ├── paginationService.js    # Pagination implementation
│   │   └── dataService.js          # Data loading and caching
│   ├── utils/
│   │   ├── dataLoader.js           # CSV parsing
│   │   ├── validators.js           # Input validation
│   │   └── errorHandler.js         # Error response formatting
│   ├── routes/
│   │   └── salesRoutes.js          # API route definitions
│   └── index.js                    # Server entry point
├── data/
│   └── sales_data.csv              # Dataset file
├── package.json                    # Dependencies and scripts
├── .env                            # Environment variables
├── .gitignore                      # Git ignore rules
└── README.md                       # This file
```

## Key Implementation Details

### Data Loading
- Dataset loaded at server startup in `dataService.js`
- Cached in memory for fast access
- CSV parsed with proper type conversions
- Field validation during parsing

### Request Flow
1. Request arrives at route handler in `salesRoutes.js`
2. Route delegates to `salesController.js`
3. Controller validates input and calls appropriate services
4. Services process data independently:
   - `searchService.search()` filters by search term
   - `filterService.applyFilters()` applies all active filters
   - `sortService.sort()` sorts results
   - `paginationService.paginate()` returns page slice
5. Controller formats response and sends to client

### State Preservation
- Search term preserved during filtering/sorting/pagination
- Filters maintained across navigation
- Sort configuration persists with pagination
- Each query parameter independent but combined in backend

### Error Handling
- Input validation in controller
- Service functions return data or throw errors
- Try-catch blocks in controller handle exceptions
- Consistent error response format
- Meaningful error messages for debugging

## Performance Considerations

- **Search**: O(n) scan - acceptable for typical dataset sizes
- **Filtering**: O(n × m) where m = number of active filters
- **Sorting**: O(n log n) using JavaScript's Array.sort()
- **Pagination**: O(1) slice operation
- **Memory**: Entire dataset loaded once, reused for all queries
- **Optimization**: Avoid re-parsing CSV on each request

## Development Notes

### Adding New Filters
1. Add filter logic to `filterService.js`
2. Add validation to `validators.js`
3. Update API documentation
4. Test with frontend

### Adding New Sort Fields
1. Add sort case to `sortService.js`
2. Handle data type appropriately
3. Test edge cases (nulls, invalid formats)
4. Update documentation

### Debugging
- Set `NODE_ENV=development` in .env
- Console.log in service functions
- Use curl or Postman to test API
- Check request parameters in controller

## Common Issues & Solutions

**Issue**: Dataset not loading
- **Solution**: Verify `DATASET_PATH` in .env, ensure CSV file exists

**Issue**: Search returns no results
- **Solution**: Check search term, ensure customerName/phoneNumber fields exist

**Issue**: Filters not working
- **Solution**: Verify filter field names match dataset columns

**Issue**: Pagination returns empty data
- **Solution**: Check page number is within totalPages range

## Dependencies

```json
{
  "express": "^4.18.0",
  "csv-parser": "^3.0.0",
  "dotenv": "^16.0.0",
  "cors": "^2.8.5",
  "body-parser": "^1.20.0"
}
```

## Notes for Developers

- Keep service functions pure and testable
- Return consistent data structures
- Handle null/undefined gracefully
- Validate all user inputs
- Comment complex algorithms
- Test edge cases thoroughly
- Maintain code organization as specified
- Follow naming conventions: camelCase for variables, PascalCase for classes
