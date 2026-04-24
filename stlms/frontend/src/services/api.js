import axios from 'axios'

/**
 * Axios instance pre-configured for the STLMS REST API.
 * Base URL uses a relative path so it works both in development (proxied by Vite)
 * and in production (served by Spring Boot on the same origin).
 */
const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 second timeout
})

// ── Response interceptor — normalize error shape ──────────────────────────────
api.interceptors.response.use(
  response => response,
  error => {
    // RFC 7807 Problem Details: backend sends { title, detail, status }
    const problemDetail = error.response?.data
    if (problemDetail?.detail) {
      error.message = problemDetail.detail
    }
    return Promise.reject(error)
  }
)

// ── Traffic Lights ────────────────────────────────────────────────────────────
export const trafficLightApi = {
  getAll:      ()     => api.get('/traffic-lights'),
  getById:     (id)   => api.get(`/traffic-lights/${id}`),
  create:      (data) => api.post('/traffic-lights', data),
  nextState:   (id)   => api.patch(`/traffic-lights/${id}/next`),
  emergency:   (id)   => api.patch(`/traffic-lights/${id}/emergency`),
  restore:     (id)   => api.patch(`/traffic-lights/${id}/restore`),
  maintenance: (id)   => api.patch(`/traffic-lights/${id}/maintenance`),
  delete:      (id)   => api.delete(`/traffic-lights/${id}`),
}

// ── Intersections ─────────────────────────────────────────────────────────────
export const intersectionApi = {
  getAll:    ()     => api.get('/intersections'),
  getById:   (id)   => api.get(`/intersections/${id}`),
  create:    (data) => api.post('/intersections', data),
  emergency: (id)   => api.patch(`/intersections/${id}/emergency`),
}

// ── State History ─────────────────────────────────────────────────────────────
export const historyApi = {
  getAll:    (page = 0, size = 20) => api.get(`/history?page=${page}&size=${size}`),
  getByLight: (id)                 => api.get(`/history/traffic-light/${id}`),
  getStats:  ()                    => api.get('/history/stats'),
}

export default api
