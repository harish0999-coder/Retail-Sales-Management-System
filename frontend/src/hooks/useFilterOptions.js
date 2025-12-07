import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setFilterOptions } from '../store/slices/dataSlice'
import { fetchFilterOptions } from '../services/apiClient'

export const useFilterOptions = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const response = await fetchFilterOptions()
        dispatch(setFilterOptions(response.filters))
      } catch (error) {
        console.error('Failed to load filter options:', error)
      }
    }

    loadOptions()
  }, [dispatch])
}