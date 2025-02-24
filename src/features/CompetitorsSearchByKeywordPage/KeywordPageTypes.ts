import { type Competitor } from "@/src/utils/types"

export interface SistrixCompetitorResult {
    uuid?: string
    position: number
    name?: string
    url?: string
    domain?: string
}

export type Order = "asc" | "desc"

export interface EnhancedTableToolbarProps {
    numSelected: number
    onAddCompetitors?: () => void
}

interface KeywordStats {
    intent_website?: number
    intent_know?: number
    intent_visit?: number
    intent_do?: number
}

export interface KeywordStatsTableToolbarProps {
    keyword: string
    keywordStats: KeywordStats
}

export type ExtendedCompetitor = Competitor & { competitorName?: string; keyword?: string }
