import { useAuth } from '@/contexts/authprovider'
import { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const Protected = ({ children }: { children: ReactNode }) => {
  const { user, setUser } = useAuth()
  const { data, isLoading, isError, error,isSuccess } = useQuery({
    queryKey:["me"],
    queryFn:async() => {
      const response = await axios.get("http://localhost:3000/api/users/me",{
        withCredentials:true
      })
      return response.data
    },
    enabled:!user
  })
  
  if(isSuccess){
    setUser(data.user)
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
      </div>
    )
  }

  if (isError) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 500) {
        return (
          <div className="flex items-center justify-center min-h-screen flex-col">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Erreur 500</h1>
            <p className="text-lg text-gray-700">Oups ! Une erreur interne est survenue.</p>
          </div>
        )
      }
      if (error.response?.status === 401) {
        return <Navigate to="/login" />
      }
    }
    return <Navigate to="/login" />
  }

  return children
}

export default Protected
