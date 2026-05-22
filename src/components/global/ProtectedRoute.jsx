// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import usePlayerStore from '../store/usePlayerStore'

const ProtectedRoute = () => {
  const token = sessionStorage.getItem("token")
  const uuid = sessionStorage.getItem("uuid")

  useEffect(() => {
    if (uuid) {
      setupRealtime(uuid)
    }

    return () => {
      cleanupRealtime()
    }
  }, [uuid, setupRealtime, cleanupRealtime])

  if (!token) return <Navigate to='/' replace />

  return <Outlet />
}

export default ProtectedRoute