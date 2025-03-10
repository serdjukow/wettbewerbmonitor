import { create } from "zustand"
import { persist } from "zustand/middleware"
import { SistrixDomainsKeywordsResult } from "@/src/features/KeywordsSearchByDomainPage/KeywordsSearchByDomainPage"

export interface KeywordSearchCacheItem {
    query: string
    result: SistrixDomainsKeywordsResult[]
}

interface KeywordSearchState {
    pages: Record<string, KeywordSearchCacheItem | undefined>
    setPageResult: (pageId: string, item: KeywordSearchCacheItem) => void
    clearPageResult: (pageId: string) => void
    removeKeywords: (pageId: string, keywordIds: string[]) => void
}

export const useKeywordSearchStore = create<KeywordSearchState>()(
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
            removeKeywords: (pageId, keywordIds) =>
                set((state) => {
                    const current = state.pages[pageId]
                    if (!current) return {}
                    const newResult = current.result.filter((item) => !keywordIds.includes(item.kw))
                    return {
                        pages: {
                            ...state.pages,
                            [pageId]: {
                                ...current,
                                result: newResult,
                            },
                        },
                    }
                }),
        }),
        { name: "keyword-search-store" }
    )
)
