import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Competitor } from "@/src/utils/types"

export interface SearchCacheItem {
    companyId: string
    query: string
    result: Competitor[]
}

interface SearchState {
    companies: Record<string, SearchCacheItem | undefined>
    currentCompanyId: string | null
    setSearchResult: (companyId: string, item: SearchCacheItem) => void
    clearSearchResult: (companyId: string) => void
    removeCompetitors: (companyId: string, competitorIds: string[]) => void
    setCurrentCompanyId: (companyId: string) => void
}

export const useSearchStore = create<SearchState>()(
    persist(
        (set) => ({
            companies: {},
            currentCompanyId: null,
            setSearchResult: (companyId, item) =>
                set((state) => ({
                    companies: {
                        ...state.companies,
                        [companyId]: {
                            companyId,
                            query: item.query,
                            result: item.result,
                        },
                    },
                })),
            clearSearchResult: (companyId) =>
                set((state) => ({
                    companies: {
                        ...state.companies,
                        [companyId]: undefined,
                    },
                })),
            removeCompetitors: (companyId, competitorIds) =>
                set((state) => {
                    const current = state.companies[companyId]
                    if (!current) return {}
                    const newResult = current.result.filter((comp) => !competitorIds.includes(comp.uuid))
                    return {
                        companies: {
                            ...state.companies,
                            [companyId]: {
                                companyId,
                                query: current.query,
                                result: newResult,
                            },
                        },
                    }
                }),
            setCurrentCompanyId: (companyId) => set({ currentCompanyId: companyId }),
        }),
        { name: "search-store" }
    )
)
