"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth"
import { auth } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signUp: async () => {},
  signIn: async () => {},
  logOut: async () => {},
  resetPassword: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if auth is initialized
    if (!auth) {
      setError("Firebase authentication is not initialized. This may be because you're viewing on the server side.")
      setLoading(false)
      return () => {}
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user)
        setLoading(false)
      },
      (error) => {
        console.error("Auth state change error:", error)
        setError("Authentication error: " + error.message)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase authentication is not initialized")
    await createUserWithEmailAndPassword(auth, email, password)
  }

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase authentication is not initialized")
    await signInWithEmailAndPassword(auth, email, password)
  }

  const logOut = async () => {
    if (!auth) throw new Error("Firebase authentication is not initialized")
    await signOut(auth)
  }

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error("Firebase authentication is not initialized")
    await sendPasswordResetEmail(auth, email)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signUp, signIn, logOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
