import { useQuery, UseQueryOptions, QueryKey } from "@tanstack/react-query"
import axios from "axios"

export interface DomainSistrixResponse {
    method: string[][]
    info: Array<{ country: string; device: string; domain: string }>
    answer: Array<{
        result: Array<{
            domain: string
            match: number
        }>
    }>
    credits: Array<{ used: number }>
}

export interface ExtendedUseQueryOptions<TQueryFnData, TError, TData, TQueryKey extends QueryKey = QueryKey>
    extends UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> {
    cacheTime?: number
    keepPreviousData?: boolean
}

const fetchSistrixData = async (params: Record<string, string>): Promise<DomainSistrixResponse> => {
    const { data } = await axios.get("/api/sistrix/domains", { params })
    return data
}

export const useSistrixDomainsData = (
    domain: string,
    country: string = "de",
    options: Record<string, string> = {},
    queryOptions?: Partial<ExtendedUseQueryOptions<DomainSistrixResponse, Error, DomainSistrixResponse, unknown[]>>
) => {
    return useQuery<DomainSistrixResponse, Error, DomainSistrixResponse, unknown[]>({
        queryKey: ["sistrix", domain || null, country, JSON.stringify(options)],
        queryFn: () => fetchSistrixData({ domain, country, ...options }),
        enabled: !!domain,
        staleTime: 1000 * 60 * 60 * 12,
        cacheTime: 1000 * 60 * 60 * 24,
        keepPreviousData: true,
        refetchOnWindowFocus: true,
        ...queryOptions,
    })
}
