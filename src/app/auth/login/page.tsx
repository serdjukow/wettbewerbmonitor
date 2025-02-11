"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { setCookie } from "cookies-next"
import { useAuth } from "@/context/AuthContext"
import { toast } from "react-toastify"

import { AppProvider } from "@toolpad/core/AppProvider"
import { SignInPage, type AuthProvider } from "@toolpad/core/SignInPage"
import { useTheme } from "@mui/material/styles"
import PageLoader from "@/components/PageLoader"
import AppTheme from "@/theme/AppTheme"

import { COMPANIES_ROUTE } from "@/utils/consts"

const providers = [{ id: "credentials", name: "Email and Password" }]

function LoginPage() {
    const { signInWithEmail, user, loading, error } = useAuth()

    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get("redirect") || COMPANIES_ROUTE

    const theme = useTheme()

    const signIn: (provider: AuthProvider, formData: FormData) => void = async (
        provider,
        formData
    ) => {
        const email = (formData.get("email") as string) ?? ""
        const password = (formData.get("password") as string) ?? ""

        try {
            await signInWithEmail(email, password)
            const token = user?.email
            setCookie("auth_token", token)
            router.push(redirect)
            toast.success("You have successfully logged in.")
        } catch (error) {
            toast.error(
                "Login failed. Please check your credentials and try again."
            )
            throw error
        }
    }

    if (error) {
        return "Error!!!"
    }

    return (
        <AppTheme>
            {!loading ? (
                <AppProvider theme={theme}>
                    <SignInPage
                        signIn={signIn}
                        providers={providers}
                        slotProps={{ emailField: { autoFocus: false } }}
                    />
                </AppProvider>
            ) : (
                <PageLoader />
            )}
        </AppTheme>
    )
}

export default LoginPage
