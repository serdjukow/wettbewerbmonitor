import { useQuery, UseQueryOptions, QueryKey } from "@tanstack/react-query"
import axios from "axios"

export interface SistrixResponse {
    method: string[][]
    info: Array<{ country: string; device: string }>
    answer: Array<{
        kw: string
        result: Array<{
            position: number
            domain: string
            url: string
        }>
    }>
    credits: Array<{ used: number }>
    keywordStats?: {
        intent_website: number
        intent_know: number
        intent_visit: number
        intent_do: number
    }
}

export interface ExtendedUseQueryOptions<TQueryFnData, TError, TData, TQueryKey extends QueryKey = QueryKey>
    extends UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> {
    cacheTime?: number
    keepPreviousData?: boolean
}

const fetchSistrixData = async (params: Record<string, string>): Promise<SistrixResponse> => {
    const { data } = await axios.get("/api/sistrix/keywords", { params })
    return data
}

export const useSistrixData = (
    keyword: string,
    country: string = "de",
    options: Record<string, string> = {},
    queryOptions?: Partial<ExtendedUseQueryOptions<SistrixResponse, Error, SistrixResponse, unknown[]>>
) => {
    return useQuery<SistrixResponse, Error, SistrixResponse, unknown[]>({
        queryKey: ["sistrix", keyword || null, country, JSON.stringify(options)],
        queryFn: () => fetchSistrixData({ kw: keyword, country, ...options }),
        enabled: !!keyword,
        staleTime: 1000 * 60 * 60 * 12,
        cacheTime: 1000 * 60 * 60 * 24,
        keepPreviousData: true,
        refetchOnWindowFocus: true,
        ...queryOptions,
    })
}
