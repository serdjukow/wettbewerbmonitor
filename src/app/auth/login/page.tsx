"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import { useAuth } from "@/src/context/AuthContext"

import { AppProvider } from "@toolpad/core/AppProvider"
import { SignInPage, type SignInPageProps } from "@toolpad/core/SignInPage"
import { useTheme } from "@mui/material/styles"
import AppTheme from "@/src/theme/AppTheme"

import { COMPANIES_ROUTE } from "@/src/utils/consts"

const providers = [
    { id: "credentials", name: "Email and Password" },
    { id: "google", name: "Google" },
]

function LoginPage() {
    const theme = useTheme()
    const { user, error, signInWithEmail, signInWithGoogle } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get("redirect") || COMPANIES_ROUTE

    useEffect(() => {
        if (user) {
            router.replace(redirect)
        }
    }, [user, redirect, router])

    const signIn: SignInPageProps["signIn"] = async (provider, formData) => {
        let result
        if (provider.id === "google") {
            result = await signInWithGoogle()
        } else {
            const email = formData?.get("email") as string
            const password = formData?.get("password") as string
            result = await signInWithEmail(email, password)
        }

        if (result.status === "success") {
            toast.success("You have successfully logged in.")
            router.push(redirect)
        } else {
            toast.error(`Login failed. ${result.error}`)
        }

        return result
    }

    if (error) {
        return <p className="text-red-500">{error}</p>
    }

    return (
        <AppTheme>
            <AppProvider theme={theme}>
                <SignInPage
                    signIn={signIn}
                    providers={providers}
                    slotProps={{ emailField: { autoFocus: false }, rememberMe: { sx: { display: "none" } } }}
                />
            </AppProvider>
        </AppTheme>
    )
}

export default LoginPage
