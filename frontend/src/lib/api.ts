const API_BASE_URL = "http://localhost:5000/api"

/**
 * Get the authentication token from local storage
 */
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

/**
 * Default headers for API requests
 */
const getHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (includeAuth) {
    const token = getToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  return headers
}

/**
 * Generic fetch function with error handling
 */
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, options)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "An error occurred")
    }

    return data as T
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error)
    throw error
  }
}

/**
 * User data model
 */
export interface User {
  id: string
  email: string
}

/**
 * Post data model
 */
export interface Post {
  id: string
  title: string
  content: string
  authorId: string
  authorEmail: string
  createdAt: string
}

/**
 * API endpoints for authentication
 */
export const authAPI = {
  /**
   * Login user
   * POST /login
   */
  login: async (email: string, password: string): Promise<{ userId: string; token: string }> => {
    return fetchAPI("/auth/login", {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    })
  },

  /**
   * Register new user
   * POST /signup
   */
  signup: async (email: string, password: string): Promise<{ userId: string; token: string }> => {
    return fetchAPI("/auth/signup", {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    })
  },
}

/**
 * API endpoints for posts
 */
export const postsAPI = {
  /**
   * Get all posts
   * GET /posts
   */
  getAllPosts: async (): Promise<Post[]> => {
    return fetchAPI("/posts", {
      method: "GET",
      headers: getHeaders(false),
    })
  },

  /**
   * Get posts by user
   * GET /posts?author=userId
   */
  getUserPosts: async (userId: string): Promise<Post[]> => {
    return fetchAPI(`/posts?author=${userId}`, {
      method: "GET",
      headers: getHeaders(),
    })
  },

  /**
   * Create a new post
   * POST /post
   */
  createPost: async (title: string, content: string): Promise<Post> => {
    return fetchAPI("/posts", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ title, content }),
    })
  },
}

