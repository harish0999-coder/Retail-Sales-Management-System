import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  region: [],
  gender: [],
  ageRange: { min: 18, max: 75 },
  category: [],
  tags: [],
  paymentMethod: [],
  dateRange: { from: null, to: null }
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setRegionFilter: (state, action) => {
      state.region = action.payload
    },
    setGenderFilter: (state, action) => {
      state.gender = action.payload
    },
    setAgeRangeFilter: (state, action) => {
      state.ageRange = action.payload
    },
    setCategoryFilter: (state, action) => {
      state.category = action.payload
    },
    setTagsFilter: (state, action) => {
      state.tags = action.payload
    },
    setPaymentMethodFilter: (state, action) => {
      state.paymentMethod = action.payload
    },
    setDateRangeFilter: (state, action) => {
      state.dateRange = action.payload
    },
    clearAllFilters: (state) => {
      return initialState
    }
  }
})

export const {
  setRegionFilter,
  setGenderFilter,
  setAgeRangeFilter,
  setCategoryFilter,
  setTagsFilter,
  setPaymentMethodFilter,
  setDateRangeFilter,
  clearAllFilters
} = filtersSlice.actions

export default filtersSlice.reducer

// ============================================
// frontend/src/store/slices/searchSlice.js
// ============================================
import { createSlice } from '@reduxjs/toolkit'

const searchSlice = createSlice({
  name: 'search',
  initialState: { query: '' },
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload
    },
    clearSearch: (state) => {
      state.query = ''
    }
  }
})

export const { setSearchQuery, clearSearch } = searchSlice.actions
export default searchSlice.reducer
