import React from 'react'
import { useSelector } from 'react-redux'
import '../styles/TransactionTable.css'

export default function TransactionTable() {
  const { items, loading, error } = useSelector(state => state.data)

  if (loading) {
    return (
      <div className="table-container">
        <div className="loading">Loading data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="table-container">
        <div className="error">Error: {error}</div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <path d="M9 9h6v6H9z"></path>
          </svg>
          <p>No results found</p>
          <small>Try adjusting your search or filters</small>
        </div>
      </div>
    )
  }

  return (
    <div className="table-container">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Phone</th>
            <th>Product</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price/Unit</th>
            <th>Discount %</th>
            <th>Final Amount</th>
            <th>Date</th>
            <th>Payment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row, idx) => (
            <tr key={`${row.customerId}-${idx}`}>
              <td>{row.customerName}</td>
              <td>{row.phoneNumber}</td>
              <td>{row.productName}</td>
              <td>{row.category}</td>
              <td className="qty">{row.quantity}</td>
              <td>₹{row.pricePerUnit?.toFixed(2) || 0}</td>
              <td>{row.discountPercentage}%</td>
              <td className="amount">₹{row.finalAmount?.toFixed(2) || 0}</td>
              <td className="date">{new Date(row.date).toLocaleDateString()}</td>
              <td>{row.paymentMethod}</td>
              <td><span className={`status ${row.orderStatus?.toLowerCase() || ''}`}>{row.orderStatus}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}