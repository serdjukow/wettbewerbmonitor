import { Suspense } from "react"
import type { Metadata } from "next"
import Head from "next/head"
import { AuthProvider } from "@/context/AuthContext"
import { StyledEngineProvider } from "@mui/material/styles"
import PageLoader from "@/components/PageLoader"
import { ToastContainer } from "react-toastify"
import "@/globals.css"

export const metadata: Metadata = {
    title: "Wettbewerb Monitor",
    description: "Wettbewerb Monitor",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body>
                <StyledEngineProvider injectFirst>
                    <AuthProvider>
                        <Suspense fallback={<PageLoader />}>
                            {children}
                        </Suspense>
                    </AuthProvider>
                    <ToastContainer position="top-right" autoClose={3000} />
                </StyledEngineProvider>
            </body>
        </html>
    )
}
