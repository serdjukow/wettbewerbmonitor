"use client"

import { useState, useEffect } from "react"
import { Suspense } from "react"
import { QueryClient, QueryClientProvider, QueryClientConfig, QueryObserverOptions, QueryKey } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { persistQueryClient } from "@tanstack/react-query-persist-client"
import { AuthProvider } from "@/src/context/AuthContext"
import { StyledEngineProvider } from "@mui/material/styles"
import { ToastContainer } from "react-toastify"
import "@/src/globals.css"

interface ExtendedQueryObserverOptions<
    TQueryFnData = unknown,
    TError = Error,
    TData = TQueryFnData,
    TQueryData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
> extends QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey> {
    cacheTime?: number
    keepPreviousData?: boolean
}

const defaultQueryOptions: ExtendedQueryObserverOptions = {
    staleTime: 1000 * 60 * 60 * 12, // 12 часов
    cacheTime: 1000 * 60 * 60 * 24, // 24 часа
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    queryKey: []
}

const queryClientConfig: QueryClientConfig = {
    defaultOptions: {
        queries: defaultQueryOptions,
    },
}

function createLocalStoragePersister() {
    return {
        persistClient: async (client: unknown) => {
            localStorage.setItem("REACT_QUERY_OFFLINE_CACHE", JSON.stringify(client))
        },
        restoreClient: async () => {
            const cache = localStorage.getItem("REACT_QUERY_OFFLINE_CACHE")
            return cache ? JSON.parse(cache) : undefined
        },
        removeClient: async () => {
            localStorage.removeItem("REACT_QUERY_OFFLINE_CACHE")
        },
    }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient(queryClientConfig))

    useEffect(() => {
        if (typeof window !== "undefined") {
            const persister = createLocalStoragePersister()
            persistQueryClient({
                queryClient,
                persister,
                maxAge: 1000 * 60 * 60 * 24,
            })
        }
    }, [queryClient])

    return (
        <html lang="en">
            <body>
                <QueryClientProvider client={queryClient}>
                    <StyledEngineProvider injectFirst>
                        <AuthProvider>
                            <Suspense fallback={<div>Загрузка данных RootLayout ...</div>}>{children}</Suspense>
                        </AuthProvider>
                        <ToastContainer position="top-right" autoClose={3000} />
                    </StyledEngineProvider>
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </body>
        </html>
    )
}
