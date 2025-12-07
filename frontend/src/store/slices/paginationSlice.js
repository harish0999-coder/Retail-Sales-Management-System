import { createSlice } from '@reduxjs/toolkit'

const paginationSlice = createSlice({
  name: 'pagination',
  initialState: { page: 1, pageSize: 10 },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload
    },
    nextPage: (state) => {
      state.page += 1
    },
    prevPage: (state) => {
      state.page = Math.max(1, state.page - 1)
    },
    resetPage: (state) => {
      state.page = 1
    }
  }
})

export const { setPage, nextPage, prevPage, resetPage } = paginationSlice.actions
export default paginationSlice.reducer