import { useQuery } from '@tanstack/react-query'
import { getMe } from '@/services/auth.service'

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 min cache
  })
}