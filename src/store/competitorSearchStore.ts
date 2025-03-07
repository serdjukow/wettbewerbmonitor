import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Competitor } from "@/src/utils/types"

export interface CompetitorSearchCacheItem {
    query: string
    result: Competitor[]
    totalResultsCount: number
    filteredResultsCount: number
    hiddenResultsCount: number
    duplicateDomainsCount: number
}

interface CompetitorSearchState {
    pages: Record<string, CompetitorSearchCacheItem | undefined>
    setPageResult: (pageId: string, item: CompetitorSearchCacheItem) => void
    clearPageResult: (pageId: string) => void
    removeCompetitors: (pageId: string, competitorIds: string[]) => void
}

export const useCompetitorSearchStore = create<CompetitorSearchState>()(
    persist(
        (set) => ({
            pages: {},
            setPageResult: (pageId, item) =>
                set((state) => ({
                    pages: {
                        ...state.pages,
                        [pageId]: item,
                    },
                })),
            clearPageResult: (pageId) =>
                set((state) => ({
                    pages: {
                        ...state.pages,
                        [pageId]: undefined,
                    },
                })),
            removeCompetitors: (pageId, competitorIds) =>
                set((state) => {
                    const current = state.pages[pageId]
                    if (!current) return {}
                    const newResult = current.result.filter((comp) => !competitorIds.includes(comp.uuid))
                    return {
                        pages: {
                            ...state.pages,
                            [pageId]: {
                                ...current,
                                result: newResult,
                                filteredResultsCount: newResult.length,
                            },
                        },
                    }
                }),
        }),
        { name: "competitor-search-store" }
    )
)
