// Configurazione base
// const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:8000'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Funzione helper per gestire le risposte
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

// Funzione per fare richieste GET
export const get = async (endpoint, headers = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })
  return handleResponse(response)
}

// Funzione per fare richieste POST
export const post = async (endpoint, data = {}, headers = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  })
  return handleResponse(response)
}

// Funzione per fare richieste PUT
export const put = async (endpoint, data = {}, headers = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  })
  return handleResponse(response)
}

// Funzione per fare richieste DELETE
export const del = async (endpoint, headers = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })
  return handleResponse(response)
}

// Funzione per upload file
export const uploadFile = async (endpoint, file, headers = {}) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      ...headers,
    },
    body: formData,
  })
  return handleResponse(response)
}

// Funzione generica per fetch con opzioni personalizzate
export const fetchApi = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  return handleResponse(response)
}

export default {
  get,
  post,
  put,
  del,
  uploadFile,
  fetchApi,
}
