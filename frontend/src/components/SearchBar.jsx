import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchQuery } from '../store/slices/searchSlice'
import { resetPage } from '../store/slices/paginationSlice'
import '../styles/SearchBar.css'

export default function SearchBar() {
  const dispatch = useDispatch()
  const query = useSelector(state => state.search.query)

  const handleChange = (e) => {
    const value = e.target.value
    dispatch(setSearchQuery(value))
    dispatch(resetPage())
  }

  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search by Customer Name or Phone Number..."
        value={query}
        onChange={handleChange}
      />
      <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
    </div>
  )
}