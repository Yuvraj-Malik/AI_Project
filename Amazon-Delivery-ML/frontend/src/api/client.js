import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
})

export function setAuthToken(token) {
    if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`
    } else {
        delete api.defaults.headers.common.Authorization
    }
}

export const apiService = {
    login: (payload) => api.post('/auth/login', payload),
    health: () => api.get('/health'),
    dashboardOverview: () => api.get('/dashboard/overview'),
    analytics: () => api.get('/analytics'),
    metrics: () => api.get('/metrics'),
    history: () => api.get('/history?limit=100'),
    predictLive: (payload) => api.post('/predict/live', payload),
    uploadData: (formData) => api.post('/upload-data', formData),
    reportSummary: () => api.get('/reports/summary'),
    aboutModel: () => api.get('/about-model'),
}

export default api
