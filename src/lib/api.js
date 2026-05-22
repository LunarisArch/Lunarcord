const DEV_URL = import.meta.env.VITE_API_DEV
const PROD_URL = import.meta.env.VITE_API_PROD

const ENV = 'development'
const BASE_URL = ENV === 'production' ? PROD_URL : DEV_URL

let lastLatency = 0

const getHeaders = () => {
  const token = sessionStorage.getItem('accessToken')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }
}

const handleResponse = async (res, startTime) => {
  lastLatency = Math.round(performance.now() - startTime)

  if (!res.ok) throw { status: res.status, message: 'Latency check failed' }
  return lastLatency
}

const api = {
  // Returns the cached latency from the last request
  getLastLatency: () => lastLatency,

  // NEW: Triggers a HEAD request to '/' and returns the duration
  latency: async () => {
    const start = performance.now()
    try {
      // Using HEAD method is faster as it ignores the response body
      const res = await fetch(`${BASE_URL}/`, {
        method: 'HEAD',
        headers: getHeaders(),
        credentials: 'include'
      })
      return handleResponse(res, start)
    } catch (err) {
      console.error('Latency check failed:', err)
      return null
    }
  },

  get: async (endpoint) => {
    const start = performance.now()
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include'
    })
    // Updated to return the latency-tracked response
    await handleResponse(res, start)
    return await res.json()
  },

  // ... keep post, put, patch, delete as previously defined
}

export default api