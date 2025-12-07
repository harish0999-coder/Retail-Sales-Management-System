import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setData, setError } from '../store/slices/dataSlice'
import { fetchSalesData } from '../services/apiClient'

export const useFetchData = () => {
  const dispatch = useDispatch()
  const filters = useSelector(state => state.filters)
  const search = useSelector(state => state.search.query)
  const sort = useSelector(state => state.sort)
  const pagination = useSelector(state => state.pagination)

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading())
      try {
        const response = await fetchSalesData(
          filters,
          search,
          sort,
          pagination.page,
          pagination.pageSize
        )

        dispatch(setData({
          items: response.data,
          total: response.pagination.totalRecords
        }))
      } catch (error) {
        dispatch(setError(error.message))
      }
    }

    fetchData()
  }, [filters, search, sort, pagination, dispatch])
}