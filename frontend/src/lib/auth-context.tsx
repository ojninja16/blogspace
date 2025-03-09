"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { type User, authAPI } from "@/lib/api"

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Call the login API endpoint
      const response = await authAPI.login(email, password)
      console.log("response", response)

      const userObject: User = {
        id: response.userId,
        email: email
        // Add other required User properties if needed
      }

      // Store the token and user data
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(userObject))
      document.cookie = `token=${response.token}; path=/; max-age=86400`;
      document.cookie = `user=${encodeURIComponent(JSON.stringify(userObject))}; path=/; max-age=86400`;
      console.log("localStorage token user", localStorage.getItem("token"), localStorage.getItem("user"))
      setUser(userObject)  
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error) {
      console.error("Login failed:", error)
      throw new Error("Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Call the signup API endpoint
      const response = await authAPI.signup(email, password)
      const userObject: User = {
        id: response.userId,
        email: email
        // Add other required User properties if needed
      }
      // Store the token and user data
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(userObject))
      document.cookie = `token=${response.token}; path=/; max-age=86400`;
      document.cookie = `user=${encodeURIComponent(JSON.stringify(userObject))}; path=/; max-age=86400`;
      

      setUser(userObject)
      router.push("/dashboard")
    } catch (error) {
      console.error("Signup failed:", error)
      throw new Error("Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

