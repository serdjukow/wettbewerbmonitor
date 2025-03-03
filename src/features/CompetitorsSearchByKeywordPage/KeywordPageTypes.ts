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

export interface KeywordStatsTableToolbarProps {
    keyword: string
}

export type ExtendedCompetitor = Competitor & { competitorName?: string; keyword?: string }
