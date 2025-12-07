# TruEstate Frontend - Retail Sales Management System

## Overview
React-based frontend for the TruEstate Retail Sales Management System. Provides an interactive UI for searching, filtering, sorting, and paginating sales data. Built with clean component-based architecture and custom hooks for efficient state management and data fetching.

## Tech Stack
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: CSS Modules / Tailwind CSS
- **HTTP Client**: Fetch API
- **State Management**: React Hooks (useState, useEffect, useReducer)
- **Bundler**: Vite
- **Dev Server**: Vite dev server
- **Package Manager**: npm or yarn

## Search Implementation Summary

**Location**: `src/components/SearchBar.jsx`

**Functionality**:
- Controlled input component for entering search terms
- Debounced onChange handler to prevent excessive API calls
- Search triggers on both enter key and after typing delay
- Clear button to reset search
- Case-insensitive search handled on backend

**User Flow**:
1. User types in search input
2. onChange handler triggered
3. Input debounced for 500ms
4. After delay, setSearch updates state
5. useSalesData hook detects change
6. API call triggered with search parameter
7. Results fetched and displayed
8. Page reset to 1 on new search

**Integration**:
- Imported in `SalesPage.jsx`
- Receives search state from `useSalesData` hook
- Calls setSearch callback on input change
- Works alongside filters, sorting, and pagination

**Features**:
- Placeholder text: "Search by customer name or phone number"
- Real-time search indication
- Clear all button
- Prevents empty searches with trim()
- Maintains search term in input field

## Filter Implementation Summary

**Location**: `src/components/FilterPanel.jsx`

**Supported Filters**:
- **customerRegion**: Multi-select checkboxes (e.g., North, South, East, West)
- **gender**: Multi-select checkboxes (Male, Female, Other)
- **age**: Range slider with min/max inputs
- **productCategory**: Multi-select checkboxes (Electronics, Clothing, etc.)
- **tags**: Multi-select checkboxes (Premium, New, Sale, etc.)
- **paymentMethod**: Multi-select checkboxes (Credit Card, Cash, etc.)
- **date**: Date range picker with start and end date

**UI Components**:
- Collapsible filter sections for better UX
- Checkboxes for categorical filters
- Range sliders for numeric filters (age)
- Date pickers for temporal filters (date)
- Active filter count badge
- Clear all filters button

**State Structure**:
```javascript
{
  customerRegion: [],
  gender: [],
  age: { min: null, max: null },
  productCategory: [],
  tags: [],
  paymentMethod: [],
  date: { start: null, end: null }
}
```

**User Interactions**:
1. User clicks checkbox or adjusts slider
2. onChange handler updates filters state
3. useSalesData detects filter change
4. API call triggered with filters parameter
5. Results updated based on filter combination
6. Page reset to 1 when filters change

**Features**:
- Multiple selections within same filter (OR logic)
- Multiple active filters combined (AND logic)
- Real-time updates
- Visual indication of active filters
- Reset individual filter
- Reset all filters button
- Disable conflicting filters (optional UI enhancement)

## Sorting Implementation Summary

**Location**: `src/components/SortDropdown.jsx`

**Supported Sort Fields**:
- **Date**: Newest First (descending) / Oldest First (ascending)
- **Quantity**: Low to High / High to Low
- **Customer Name**: A-Z / Z-A

**UI Components**:
- Field selector dropdown showing available sort fields
- Direction toggle (ascending/descending)
- Current sort indication
- Icon indicating sort direction

**State Structure**:
```javascript
{
  field: "date",        // "date", "quantity", "customerName"
  direction: "desc"     // "asc" or "desc"
}
```

**User Interactions**:
1. User selects sort field from dropdown
2. onChange handler updates sort state
3. User clicks direction toggle (optional)
4. useSalesData detects sort change
5. API call triggered with sort parameter
6. Results re-sorted accordingly
7. Page reset to 1 on sort change

**Default Behavior**:
- Default sort: By date, newest first
- Clicking same field toggles direction
- Visual indication of current sort
- Icon showing asc/desc direction

**Features**:
- Intuitive field selection
- Easy direction toggle
- Clear current sort indication
- Smooth transition of results
- Maintains sort during pagination

## Pagination Implementation Summary

**Location**: `src/components/PaginationControls.jsx`

**Configuration**:
- Fixed page size: 10 items per page (set by backend)
- Navigation style: Previous/Next buttons
- Page indicator: "Page X of Y"
- One-indexed pages (1, 2, 3...)

**State Management**:
- currentPage stored in useSalesData hook
- Updates when user clicks Previous/Next
- Resets to 1 when search/filters/sort change

**UI Components**:
- Previous button (disabled on page 1)
- Page indicator showing current page and total pages
- Next button (disabled on last page)
- Page jump input (optional enhancement)
- Records count display

**User Interactions**:
1. User clicks Previous button
2. setCurrentPage(currentPage - 1) called
3. useSalesData hook detects page change
4. API call triggered with new page parameter
5. New page data fetched
6. Component re-renders with new data
7. Table scrolls to top automatically

**Features**:
- Smart button disabling (no clicking beyond boundaries)
- Clear page indicator
- Smooth navigation
- Maintains search/filters/sort state
- Auto-scrolls to top on page change
- Shows total records available

**Response Format**:
```javascript
{
  data: [...],
  pagination: {
    currentPage: 1,
    totalPages: 50,
    pageSize: 10,
    totalRecords: 500,
    hasNextPage: true,
    hasPreviousPage: false
  }
}
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API running on http://localhost:5000

### Installation

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
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
   VITE_API_URL=http://localhost:5000/api
   VITE_API_BASE=http://localhost:5000
   ```

5. **Verify backend is running**:
   ```bash
   curl http://localhost:5000/health
   ```

### Running the Application

**Development mode** (with hot reload):
```bash
npm run dev
```

Application will start on `http://localhost:5173` (or next available port)

**Production build**:
```bash
npm run build
```

**Preview production build**:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx              # Search input component
│   │   ├── FilterPanel.jsx            # All filter components
│   │   ├── SortDropdown.jsx           # Sort field and direction selector
│   │   ├── SalesTable.jsx             # Results table/grid display
│   │   └── PaginationControls.jsx     # Page navigation controls
│   │
│   ├── pages/
│   │   └── SalesPage.jsx              # Main page container
│   │
│   ├── services/
│   │   └── apiService.js              # API communication functions
│   │
│   ├── hooks/
│   │   └── useSalesData.js            # Custom hook for data & state
│   │
│   ├── utils/
│   │   └── queryBuilder.js            # Query parameter construction
│   │
│   ├── styles/
│   │   ├── global.css                 # Global styles
│   │   ├── components.css             # Component-specific styles
│   │   └── layout.css                 # Layout and spacing
│   │
│   ├── App.jsx                        # Root component
│   └── main.jsx                       # React entry point
│
├── public/
│   ├── favicon.ico                    # Site favicon
│   └── vite.svg                       # Vite logo
│
├── index.html                         # HTML template
├── package.json                       # Dependencies and scripts
├── vite.config.js                     # Vite configuration
├── .env                               # Environment variables
├── .gitignore                         # Git ignore rules
└── README.md                          # This file
```

## Component Architecture

### Data Flow
```
useSalesData Hook (State Management)
        ↓
SalesPage Component (Layout)
        ├→ SearchBar (Input)
        ├→ FilterPanel (Input)
        ├→ SortDropdown (Input)
        ├→ SalesTable (Display)
        └→ PaginationControls (Input)
```

### Component Details

**SearchBar**:
- Props: `value`, `onChange`, `onClear`
- State: Controlled input value
- Behavior: Debounced onChange
- Renders: Input field with label and clear button

**FilterPanel**:
- Props: `filters`, `onChange`
- State: All active filters
- Behavior: Updates on checkbox/slider change
- Renders: Collapsible filter sections with controls

**SortDropdown**:
- Props: `sort`, `onChange`
- State: Sort field and direction
- Behavior: Updates on dropdown/button change
- Renders: Dropdown and direction toggle

**SalesTable**:
- Props: `data`, `loading`, `error`
- State: None (pure display)
- Behavior: Renders rows from data array
- Renders: Table with headers and rows

**PaginationControls**:
- Props: `currentPage`, `totalPages`, `onChange`
- State: None (controlled from parent)
- Behavior: Button click triggers onChange
- Renders: Previous/Next buttons and page indicator

**SalesPage**:
- Props: None
- State: Managed by useSalesData hook
- Behavior: Composes all components
- Renders: Full layout with all components

### Custom Hook: useSalesData

**Location**: `src/hooks/useSalesData.js`

**State Variables**:
```javascript
const [search, setSearch] = useState('');
const [filters, setFilters] = useState({...});
const [sort, setSort] = useState({ field: 'date', direction: 'desc' });
const [currentPage, setCurrentPage] = useState(1);
const [data, setData] = useState([]);
const [totalPages, setTotalPages] = useState(0);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

**Effects**:
```javascript
useEffect(() => {
  // Fetch data whenever search, filters, sort, or page changes
}, [search, filters, sort, currentPage]);
```

**Return Value**:
```javascript
{
  search, setSearch,
  filters, setFilters,
  sort, setSort,
  currentPage, setCurrentPage,
  data,
  totalPages,
  loading,
  error
}
```

**Behavior**:
1. Detects when any query parameter changes
2. Calls apiService.fetchSalesData() with current state
3. Updates data state with response
4. Updates pagination metadata
5. Handles loading and error states

## API Service

**Location**: `src/services/apiService.js`

**Main Function**: `fetchSalesData(search, filters, sort, page)`

**Process**:
1. Builds query string from parameters
2. Makes GET request to /api/sales
3. Parses JSON response
4. Returns { data, pagination, metadata }
5. Catches and logs errors

**Example Call**:
```javascript
const result = await apiService.fetchSalesData(
  'john',                           // search
  { customerRegion: ['North'] },    // filters
  { field: 'date', direction: 'desc' },  // sort
  1                                 // page
);
```

## Query Builder Utility

**Location**: `src/utils/queryBuilder.js`

**Function**: `buildQueryString(search, filters, sort, page)`

**Process**:
1. Serializes search string to query param
2. Converts filters object to JSON string
3. Converts sort object to JSON string
4. Combines all params with &
5. URL encodes special characters

**Example Output**:
```
?search=john&filters=%7B%22customerRegion%22:%5B%22North%22%5D%7D&sort=%7B%22field%22:%22date%22%7D&page=1
```

## Styling Approach

### Global Styles (`styles/global.css`)
- CSS resets
- Base typography
- Color variables
- Utility classes

### Component Styles (`styles/components.css`)
- Individual component styling
- Modular CSS
- Component-specific variables

### Layout Styles (`styles/layout.css`)
- Grid and flexbox layouts
- Spacing and alignment
- Responsive design rules

### Tailwind Alternative
If using Tailwind CSS:
- Install: `npm install -D tailwindcss postcss autoprefixer`
- Initialize: `npx tailwindcss init -p`
- Use utility classes in components
- Configure `tailwind.config.js` as needed

## Key Implementation Details

### Debounced Search
```javascript
const [searchTerm, setSearchTerm] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setSearch(searchTerm);
  }, 500);
  
  return () => clearTimeout(timer);
}, [searchTerm]);
```

### Controlled Components
```javascript
<input
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
```

### Conditional Rendering
```javascript
{loading && <LoadingSpinner />}
{error && <ErrorMessage error={error} />}
{data.length === 0 && <EmptyState />}
{data.length > 0 && <SalesTable data={data} />}
```

### Pagination Reset Logic
```javascript
useEffect(() => {
  setCurrentPage(1);  // Reset to page 1 when search/filters/sort change
}, [search, filters, sort]);
```

## State Management Strategy

**Single Responsibility**: Each component manages only its UI state
**Shared State**: All query state managed in useSalesData hook
**Data Flow**: One-way flow from parent to child via props
**Communication**: Child-to-parent via callback functions

## Error Handling

**API Errors**:
- Caught in apiService.js
- Passed to component via error state
- Displayed to user in error boundary

**Validation**:
- Input validation in components
- Backend validation for actual queries
- Graceful fallbacks for invalid inputs

**Loading States**:
- Loading spinner during data fetch
- Disabled buttons during requests
- Skeleton loading (optional enhancement)

## Performance Optimizations

**Debouncing**:
- Search input debounced 500ms
- Prevents excessive API calls

**Memoization** (Optional):
- useMemo for expensive computations
- React.memo for component memoization
- useCallback for stable function references

**Lazy Loading** (Optional):
- Code splitting with React.lazy
- Suspense boundaries for components

**Query Optimization**:
- Efficient state updates
- Minimal re-renders
- Avoid prop drilling with context (if needed)

## Common Issues & Solutions

**Issue**: API not responding
- **Solution**: Check backend is running on correct port, verify VITE_API_URL

**Issue**: Search not working
- **Solution**: Verify backend has data, check network tab for API calls

**Issue**: Filters not applying
- **Solution**: Confirm filter field names match backend, check filter values sent

**Issue**: Pagination not updating
- **Solution**: Verify API returns pagination metadata, check totalPages calculation

**Issue**: Styling not applied
- **Solution**: Check CSS import paths, verify Tailwind/CSS Modules setup

## Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "vite": "^4.0.0"
}
```

**Optional**:
```json
{
  "tailwindcss": "^3.0.0",
  "axios": "^1.0.0",
  "date-fns": "^2.30.0"
}
```

## Development Best Practices

- Keep components focused on single responsibility
- Use custom hooks for shared logic
- Prop drilling should be minimal
- State updates should be clear and predictable
- Comments for complex logic
- Console logs removed in production
- Error boundaries for crash prevention

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript support required
- CSS Grid and Flexbox support required
- LocalStorage/SessionStorage recommended for enhancements

## Notes for Developers

- Ensure backend API is running before starting frontend
- Use browser DevTools Network tab to debug API calls
- React DevTools extension helpful for component debugging
- Maintain separation between UI and data fetching logic
- Test all state transitions thoroughly
- Handle edge cases (empty data, network errors, etc.)
- Keep components small and reusable
- Document complex component props and behavior