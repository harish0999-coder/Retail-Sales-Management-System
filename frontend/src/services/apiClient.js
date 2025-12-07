const API_BASE = 'http://localhost:5000/api'

console.log('API Base URL:', API_BASE)

const buildQueryParams = (filters, search, sort, page, pageSize) => {
  const params = new URLSearchParams()

  if (search) {
    params.append('search', search)
  }
  
  if (page) {
    params.append('page', page)
  }
  
  if (pageSize) {
    params.append('limit', pageSize)
  }

  if (sort && sort.field) {
    params.append('sortBy', sort.field)
    params.append('sortOrder', sort.order || 'asc')
  }

  if (filters) {
    if (filters.region?.length > 0) {
      params.append('region', filters.region.join(','))
    }
    if (filters.gender?.length > 0) {
      params.append('gender', filters.gender.join(','))
    }
    if (filters.category?.length > 0) {
      params.append('category', filters.category.join(','))
    }
    if (filters.tags?.length > 0) {
      params.append('tags', filters.tags.join(','))
    }
    if (filters.paymentMethod?.length > 0) {
      params.append('paymentMethod', filters.paymentMethod.join(','))
    }

    if (filters.ageRange) {
      if (filters.ageRange.min) {
        params.append('ageMin', filters.ageRange.min)
      }
      if (filters.ageRange.max) {
        params.append('ageMax', filters.ageRange.max)
      }
    }

    if (filters.dateRange) {
      if (filters.dateRange.from) {
        params.append('dateFrom', filters.dateRange.from)
      }
      if (filters.dateRange.to) {
        params.append('dateTo', filters.dateRange.to)
      }
    }
  }

  return params.toString()
}

export const fetchSalesData = async (filters, search, sort, page, pageSize) => {
  try {
    const queryString = buildQueryParams(filters, search, sort, page, pageSize)
    const url = `${API_BASE}/sales${queryString ? '?' + queryString : ''}`

    console.log('Fetching from:', url)

    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('API Response:', data)

    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const fetchFilterOptions = async () => {
  try {
    const url = `${API_BASE}/filters/options`
    console.log('Fetching filter options from:', url)

    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    console.log('Filter options:', data)

    return data
  } catch (error) {
    console.error('Filter options error:', error)
    throw error
  }
}