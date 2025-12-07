import { createSlice } from '@reduxjs/toolkit'

const sortSlice = createSlice({
  name: 'sort',
  initialState: { field: 'date', order: 'desc' },
  reducers: {
    setSort: (state, action) => {
      const { field, order } = action.payload
      state.field = field
      state.order = order || 'asc'
    },
    clearSort: (state) => {
      state.field = null
      state.order = 'asc'
    }
  }
})

export const { setSort, clearSort } = sortSlice.actions
export default sortSlice.reducer