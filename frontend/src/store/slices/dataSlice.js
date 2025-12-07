import { createSlice } from '@reduxjs/toolkit'

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    items: [],
    total: 0,
    loading: false,
    error: null,
    filterOptions: null
  },
  reducers: {
    setLoading: (state) => {
      state.loading = true
      state.error = null
    },
    setData: (state, action) => {
      const { items, total, filterOptions } = action.payload
      state.items = items
      state.total = total
      state.loading = false
    },
    setFilterOptions: (state, action) => {
      state.filterOptions = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    }
  }
})

export const { setLoading, setData, setFilterOptions, setError } = dataSlice.actions
export default dataSlice.reducer