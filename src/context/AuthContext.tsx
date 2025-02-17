"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { setCookie, deleteCookie } from "cookies-next"
import { useRouter, usePathname } from "next/navigation"
import { signInWithPopup, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth"
import { auth, googleProvider } from "@/src/firebase"

interface AuthContextType {
    user: User | null
    loading: boolean
    error: string | null
    signInWithEmail: (email: string, password: string) => Promise<{ status: string; user?: User; error?: string }>
    signInWithGoogle: () => Promise<{ status: string; user?: User; error?: string }>
    logOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true)
            if (user) {
                const token = await user.getIdToken()
                setCookie("auth_token", token)
            } else {
                deleteCookie("auth_token")
            }
            setUser(user)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    useEffect(() => {
        if (user && pathname === "/login") {
            router.replace("/companies")
        }
    }, [user, pathname, router])

    const signInWithEmail = async (email: string, password: string) => {
        try {
            setLoading(true)
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const token = await userCredential.user.getIdToken()
            setCookie("auth_token", token)
            setUser(userCredential.user)
            return { status: "success", user: userCredential.user }
        } catch (err) {
            const message = (err as Error).message
            setError(message)
            return { status: "error", error: message }
        } finally {
            setLoading(false)
        }
    }

    const signInWithGoogle = async () => {
        try {
            setLoading(true)
            const userCredential = await signInWithPopup(auth, googleProvider)
            const token = await userCredential.user.getIdToken()
            setCookie("auth_token", token)
            setUser(userCredential.user)
            return { status: "success", user: userCredential.user }
        } catch (err) {
            const message = (err as Error).message
            setError(message)
            return { status: "error", error: message }
        } finally {
            setLoading(false)
        }
    }

    const logOut = async () => {
        try {
            setLoading(true)
            await signOut(auth)
            deleteCookie("auth_token")
            setUser(null)
            setError(null)
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, error, signInWithEmail, signInWithGoogle, logOut }}>{children}</AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider")
    }
    return context
}
