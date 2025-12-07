import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setRegionFilter,
  setGenderFilter,
  setAgeRangeFilter,
  setCategoryFilter,
  setTagsFilter,
  setPaymentMethodFilter,
  setDateRangeFilter,
  clearAllFilters
} from '../store/slices/filtersSlice'
import { resetPage } from '../store/slices/paginationSlice'
import MultiSelectDropdown from './MultiSelectDropdown'
import '../styles/FilterPanel.css'

export default function FilterPanel() {
  const dispatch = useDispatch()
  const filters = useSelector(state => state.filters)
  const filterOptions = useSelector(state => state.data.filterOptions)

  const handleMultiSelect = (filterType, values) => {
    dispatch(resetPage())

    switch (filterType) {
      case 'region':
        dispatch(setRegionFilter(values))
        break
      case 'gender':
        dispatch(setGenderFilter(values))
        break
      case 'category':
        dispatch(setCategoryFilter(values))
        break
      case 'tags':
        dispatch(setTagsFilter(values))
        break
      case 'paymentMethod':
        dispatch(setPaymentMethodFilter(values))
        break
      default:
        break
    }
  }

  const handleAgeRangeChange = (min, max) => {
    dispatch(setAgeRangeFilter({ min, max }))
    dispatch(resetPage())
  }

  const handleDateRangeChange = (from, to) => {
    dispatch(setDateRangeFilter({ from, to }))
    dispatch(resetPage())
  }

  const handleClearAll = () => {
    dispatch(clearAllFilters())
    dispatch(resetPage())
  }

  if (!filterOptions) return <div className="filter-panel">Loading filters...</div>

  const activeFiltersCount = [
    filters.region.length,
    filters.gender.length,
    filters.category.length,
    filters.tags.length,
    filters.paymentMethod.length,
    filters.dateRange.from ? 1 : 0,
    filters.dateRange.to ? 1 : 0
  ].reduce((a, b) => a + b, 0)

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        {activeFiltersCount > 0 && (
          <button className="clear-filters-btn" onClick={handleClearAll}>
            Clear All ({activeFiltersCount})
          </button>
        )}
      </div>

      <div className="filter-group">
        <label>Region</label>
        <MultiSelectDropdown
          options={filterOptions.regions || []}
          selected={filters.region}
          onChange={(values) => handleMultiSelect('region', values)}
          placeholder="Select regions..."
        />
      </div>

      <div className="filter-group">
        <label>Gender</label>
        <MultiSelectDropdown
          options={filterOptions.genders || []}
          selected={filters.gender}
          onChange={(values) => handleMultiSelect('gender', values)}
          placeholder="Select genders..."
        />
      </div>

      <div className="filter-group">
        <label>Age Range</label>
        <div className="range-inputs">
          <input
            type="number"
            min="0"
            max="120"
            value={filters.ageRange.min}
            onChange={(e) => handleAgeRangeChange(parseInt(e.target.value), filters.ageRange.max)}
            placeholder="Min age"
          />
          <span>-</span>
          <input
            type="number"
            min="0"
            max="120"
            value={filters.ageRange.max}
            onChange={(e) => handleAgeRangeChange(filters.ageRange.min, parseInt(e.target.value))}
            placeholder="Max age"
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Product Category</label>
        <MultiSelectDropdown
          options={filterOptions.categories || []}
          selected={filters.category}
          onChange={(values) => handleMultiSelect('category', values)}
          placeholder="Select categories..."
        />
      </div>

      <div className="filter-group">
        <label>Tags</label>
        <MultiSelectDropdown
          options={filterOptions.tags || []}
          selected={filters.tags}
          onChange={(values) => handleMultiSelect('tags', values)}
          placeholder="Select tags..."
        />
      </div>

      <div className="filter-group">
        <label>Payment Method</label>
        <MultiSelectDropdown
          options={filterOptions.paymentMethods || []}
          selected={filters.paymentMethod}
          onChange={(values) => handleMultiSelect('paymentMethod', values)}
          placeholder="Select payment methods..."
        />
      </div>

      <div className="filter-group">
        <label>Date Range</label>
        <div className="date-inputs">
          <input
            type="date"
            value={filters.dateRange.from || ''}
            onChange={(e) => handleDateRangeChange(e.target.value, filters.dateRange.to)}
          />
          <input
            type="date"
            value={filters.dateRange.to || ''}
            onChange={(e) => handleDateRangeChange(filters.dateRange.from, e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
