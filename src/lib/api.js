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

const handleResponse = async (res) => {
  const data = await res.json()
  if (!res.ok) throw { status: res.status, message: data.error || 'Something went wrong' }
  return data
}

const api = {

  // Returns the cached latency from the last request
  getLastLatency: () => lastLatency,

  // Triggers a HEAD request and returns round trip ms
  latency: async () => {
    const start = performance.now()
    try {
      await fetch(`${BASE_URL}/health`, {
        method: 'HEAD',
        credentials: 'include'
      })
      lastLatency = Math.round(performance.now() - start)
      return lastLatency
    } catch (err) {
      console.error('[API] Latency check failed:', err)
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
    lastLatency = Math.round(performance.now() - start)
    return handleResponse(res)
  },

  post: async (endpoint, body) => {
    const start = performance.now()
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(body)
    })
    lastLatency = Math.round(performance.now() - start)
    return handleResponse(res)
  },

  put: async (endpoint, body) => {
    const start = performance.now()
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(body)
    })
    lastLatency = Math.round(performance.now() - start)
    return handleResponse(res)
  },

  patch: async (endpoint, body) => {
    const start = performance.now()
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(body)
    })
    lastLatency = Math.round(performance.now() - start)
    return handleResponse(res)
  },

  delete: async (endpoint) => {
    const start = performance.now()
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include'
    })
    lastLatency = Math.round(performance.now() - start)
    return handleResponse(res)
  }
}

export default api