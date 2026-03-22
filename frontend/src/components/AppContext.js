import { useOutletContext } from 'react-router-dom'

export function useAppContext() {
  return useOutletContext()
}
