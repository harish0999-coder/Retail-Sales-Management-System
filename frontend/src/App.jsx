// ============================================
// frontend/src/App.jsx - WITH ALL 7 FILTERS
// ============================================
import React, { useEffect, useState } from 'react'
import './styles/App.css'

export default function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [filterOptions, setFilterOptions] = useState(null)

  // Filter states
  const [selectedRegions, setSelectedRegions] = useState([])
  const [selectedGenders, setSelectedGenders] = useState([])
  const [ageRange, setAgeRange] = useState({ min: '', max: '' })
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([])
  const [dateRange, setDateRange] = useState({ from: '', to: '' })

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/filters/options')
        const data = await response.json()
        if (data.success) {
          setFilterOptions(data.filters)
        }
      } catch (err) {
        console.error('Failed to load filters:', err)
      }
    }
    fetchFilterOptions()
  }, [])

  // Fetch data whenever filters or search changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        params.append('page', page)
        params.append('limit', 10)

        // Search
        if (search) params.append('search', search)

        // Filters
        if (selectedRegions.length > 0) params.append('region', selectedRegions.join(','))
        if (selectedGenders.length > 0) params.append('gender', selectedGenders.join(','))
        if (selectedCategories.length > 0) params.append('category', selectedCategories.join(','))
        if (selectedTags.length > 0) params.append('tags', selectedTags.join(','))
        if (selectedPaymentMethods.length > 0) params.append('paymentMethod', selectedPaymentMethods.join(','))

        if (ageRange.min) params.append('ageMin', ageRange.min)
        if (ageRange.max) params.append('ageMax', ageRange.max)

        if (dateRange.from) params.append('dateFrom', dateRange.from)
        if (dateRange.to) params.append('dateTo', dateRange.to)

        // Sort
        if (sortBy) {
          params.append('sortBy', sortBy)
          params.append('sortOrder', sortOrder)
        }

        const url = `http://localhost:5000/api/sales?${params.toString()}`
        const response = await fetch(url)
        const data = await response.json()

        if (data.success && data.data) {
          setItems(data.data)
          setTotal(data.pagination?.totalRecords || 0)
        } else {
          setError('Failed to load data')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [page, search, sortBy, sortOrder, selectedRegions, selectedGenders, selectedCategories, selectedTags, selectedPaymentMethods, ageRange, dateRange])

  const totalPages = Math.ceil(total / 10)
  const activeFiltersCount = [
    selectedRegions.length,
    selectedGenders.length,
    selectedCategories.length,
    selectedTags.length,
    selectedPaymentMethods.length,
    ageRange.min ? 1 : 0,
    ageRange.max ? 1 : 0,
    dateRange.from ? 1 : 0,
    dateRange.to ? 1 : 0
  ].reduce((a, b) => a + b, 0)

  const clearAllFilters = () => {
    setSelectedRegions([])
    setSelectedGenders([])
    setAgeRange({ min: '', max: '' })
    setSelectedCategories([])
    setSelectedTags([])
    setSelectedPaymentMethods([])
    setDateRange({ from: '', to: '' })
    setPage(1)
  }

  const handleSearch = (value) => {
    setSearch(value)
    setPage(1)
  }

  // Multi-select checkbox component
  const FilterCheckboxGroup = ({ label, options, selected, onChange }) => {
    return (
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
          {label}
        </label>
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {options && options.length > 0 ? (
            options.map(option => (
              <label key={option} style={{ display: 'flex', alignItems: 'center', padding: '0.25rem 0', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...selected, option])
                    } else {
                      onChange(selected.filter(s => s !== option))
                    }
                    setPage(1)
                  }}
                  style={{ marginRight: '0.5rem', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.9rem' }}>{option}</span>
              </label>
            ))
          ) : (
            <p style={{ color: '#999', fontSize: '0.9rem' }}>No options available</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1>Retail Sales Management System</h1>
        <p>Advanced Search, Filtering, and Analytics</p>
      </header>

      <div className="app-container">
        {/* Sidebar - Filters */}
        <aside className="sidebar">
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Filters</h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  style={{
                    padding: '0.25rem 0.75rem',
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Clear All ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* Region Filter */}
            <FilterCheckboxGroup
              label="Region"
              options={filterOptions?.regions}
              selected={selectedRegions}
              onChange={setSelectedRegions}
            />

            {/* Gender Filter */}
            <FilterCheckboxGroup
              label="Gender"
              options={filterOptions?.genders}
              selected={selectedGenders}
              onChange={setSelectedGenders}
            />

            {/* Age Range Filter */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                Age Range
              </label>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', justifyContent: 'space-between' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={ageRange.min}
                  onChange={(e) => {
                    setAgeRange({ ...ageRange, min: e.target.value })
                    setPage(1)
                  }}
                  style={{ width: 'calc(50% - 0.2rem)', padding: '0.5rem 0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
                <span style={{ color: '#999', fontWeight: '600', fontSize: '0.9rem' }}>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={ageRange.max}
                  onChange={(e) => {
                    setAgeRange({ ...ageRange, max: e.target.value })
                    setPage(1)
                  }}
                  style={{ width: 'calc(50% - 0.2rem)', padding: '0.5rem 0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Category Filter */}
            <FilterCheckboxGroup
              label="Product Category"
              options={filterOptions?.categories}
              selected={selectedCategories}
              onChange={setSelectedCategories}
            />

            {/* Tags Filter */}
            <FilterCheckboxGroup
              label="Tags"
              options={filterOptions?.tags}
              selected={selectedTags}
              onChange={setSelectedTags}
            />

            {/* Payment Method Filter */}
            <FilterCheckboxGroup
              label="Payment Method"
              options={filterOptions?.paymentMethods}
              selected={selectedPaymentMethods}
              onChange={setSelectedPaymentMethods}
            />

            {/* Date Range Filter */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                Date Range
              </label>
              <div style={{ marginBottom: '0.5rem' }}>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => {
                    setDateRange({ ...dateRange, from: e.target.value })
                    setPage(1)
                  }}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                  placeholder="From"
                />
              </div>
              <div>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => {
                    setDateRange({ ...dateRange, to: e.target.value })
                    setPage(1)
                  }}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                  placeholder="To"
                />
              </div>
            </div>

            {/* Stats */}
            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              background: '#f0f0f0',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#666'
            }}>
              Total Records: <strong>{total.toLocaleString()}</strong>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Controls Bar */}
          <div className="controls">
            {/* Search Input */}
            <div style={{
              position: 'relative',
              flex: 1,
              minWidth: '200px',
              maxWidth: '500px'
            }}>
              <input
                type="text"
                placeholder="Search by customer name or phone..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
              <span style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#999',
                pointerEvents: 'none'
              }}>
                🔍
              </span>
            </div>

            {/* Sort Dropdown */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field)
                setSortOrder(order)
              }}
              style={{
                padding: '0.75rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '0.95rem',
                minWidth: '200px',
                fontFamily: 'inherit',
                cursor: 'pointer'
              }}
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="quantity-desc">Quantity (High to Low)</option>
              <option value="quantity-asc">Quantity (Low to High)</option>
              <option value="customername-asc">Customer Name (A-Z)</option>
              <option value="customername-desc">Customer Name (Z-A)</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              ⚠️ Error: {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div style={{
              background: 'white',
              padding: '3rem',
              borderRadius: '0.75rem',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              color: '#666'
            }}>
              ⏳ Loading data...
            </div>
          ) : items.length === 0 ? (
            <div style={{
              background: 'white',
              padding: '3rem',
              borderRadius: '0.75rem',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              color: '#666'
            }}>
              📭 No results found. Try different search or filters.
            </div>
          ) : (
            <>
              {/* Data Table */}
              <div style={{
                background: 'white',
                borderRadius: '0.75rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'auto'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.9rem'
                }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap' }}>Customer</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap' }}>Phone</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap' }}>Product</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap' }}>Category</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', whiteSpace: 'nowrap' }}>Qty</th>
                      <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', whiteSpace: 'nowrap' }}>Amount</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap' }}>Date</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap' }}>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '1rem' }}>{item.customerName || '-'}</td>
                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{item.phoneNumber || '-'}</td>
                        <td style={{ padding: '1rem' }}>{item.productName || '-'}</td>
                        <td style={{ padding: '1rem' }}>{item.category || '-'}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#2563eb' }}>
                          {item.quantity || 0}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#059669' }}>
                          ₹{parseFloat(item.finalAmount || 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#6b7280' }}>
                          {item.date ? new Date(item.date).toLocaleDateString() : '-'}
                        </td>
                        <td style={{ padding: '1rem' }}>{item.paymentMethod || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {total > 0 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.5rem',
                  background: 'white',
                  borderRadius: '0.75rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  marginTop: '1.5rem',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    style={{
                      padding: '0.5rem 1rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem',
                      background: page === 1 ? '#f3f4f6' : 'white',
                      cursor: page === 1 ? 'not-allowed' : 'pointer',
                      opacity: page === 1 ? 0.5 : 1,
                      fontFamily: 'inherit'
                    }}
                  >
                    ← Previous
                  </button>

                  <span style={{ fontSize: '0.9rem', color: '#6b7280', whiteSpace: 'nowrap' }}>
                    Page <strong>{page}</strong> of <strong>{totalPages}</strong> • {total.toLocaleString()} records
                  </span>

                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    style={{
                      padding: '0.5rem 1rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem',
                      background: page === totalPages ? '#f3f4f6' : 'white',
                      cursor: page === totalPages ? 'not-allowed' : 'pointer',
                      opacity: page === totalPages ? 0.5 : 1,
                      fontFamily: 'inherit'
                    }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}