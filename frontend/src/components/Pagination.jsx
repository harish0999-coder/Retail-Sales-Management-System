import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPage, nextPage, prevPage } from '../store/slices/paginationSlice'
import '../styles/Pagination.css'

export default function Pagination({ totalRecords, pageSize = 10 }) {
  const dispatch = useDispatch()
  const currentPage = useSelector(state => state.pagination.page)

  const totalPages = Math.ceil(totalRecords / pageSize)
  const hasNext = currentPage < totalPages
  const hasPrev = currentPage > 1

  const handlePrevious = () => {
    if (hasPrev) dispatch(prevPage())
  }

  const handleNext = () => {
    if (hasNext) dispatch(nextPage())
  }

  const handlePageSelect = (page) => {
    dispatch(setPage(page))
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="pagination">
      <button
        className="pagination-btn prev"
        onClick={handlePrevious}
        disabled={!hasPrev}
      >
        ← Previous
      </button>

      <div className="page-numbers">
        {getPageNumbers().map((page, idx) => (
          <button
            key={idx}
            className={`page-btn ${page === currentPage ? 'active' : ''} ${page === '...' ? 'ellipsis' : ''}`}
            onClick={() => typeof page === 'number' && handlePageSelect(page)}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="pagination-btn next"
        onClick={handleNext}
        disabled={!hasNext}
      >
        Next →
      </button>

      <div className="pagination-info">
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        {totalRecords > 0 && (
          <span> • {totalRecords} total records</span>
        )}
      </div>
    </div>
  )
}