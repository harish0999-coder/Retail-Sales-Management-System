import { configureStore } from '@reduxjs/toolkit'
import filtersReducer from './slices/filtersSlice'
import searchReducer from './slices/searchSlice'
import paginationReducer from './slices/paginationSlice'
import sortReducer from './slices/sortSlice'
import dataReducer from './slices/dataSlice'

export default configureStore({
  reducer: {
    filters: filtersReducer,
    search: searchReducer,
    pagination: paginationReducer,
    sort: sortReducer,
    data: dataReducer
  }
})