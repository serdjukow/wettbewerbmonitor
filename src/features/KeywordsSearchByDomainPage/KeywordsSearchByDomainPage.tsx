"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Box, Paper } from "@mui/material"
import { usePathname } from "next/navigation"
import SearchBar from "./SearchBar"
import DomainSelectionModal from "./DomainSelectionModal"
import DomainStatsTableToolbar from "./DomainStatsTableToolbar"
import EnhancedTableToolbar from "./EnhancedTableToolbar"
import CompetitorStats from "@/src/components/CompetitorStats"
import KeywordsDataGrid from "./KeywordsDataGrid"
import { useSistrixDomainKeywordsData } from "@/src/hooks/useSistrixDomainKeywordsQuery"
import { useAppStore } from "@/src/store/appStore"
import { useKeywordSearchStore } from "@/src/store/keywordSearchStore"

export interface SistrixDomainsKeywordsResult {
    kw: string
    position: number
    competition: number
    traffic: number
    url: string
}

type Order = "asc" | "desc"

export default function KeywordsSearchByDomainPage() {
    const pathname = usePathname()
    const pageId = useMemo(() => {
        const parts = pathname.split("/").filter(Boolean)
        return parts.pop() || "defaultPage"
    }, [pathname])

    const { updateCompany, selectedCompany } = useAppStore()
    const { pages, setPageResult, removeKeywords } = useKeywordSearchStore()
    const storedSearch = pages[pageId]

    const [searchBarInput, setSearchBarInput] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [keywords, setKeywords] = useState<SistrixDomainsKeywordsResult[]>([])
    const [order, setOrder] = useState<Order>("asc")
    const [orderBy, setOrderBy] = useState<"position" | "kw">("position")
    const [selected, setSelected] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(100)

    const [openGeneralModal, setOpenGeneralModal] = useState(false)
    const handleOpenGeneralModal = () => setOpenGeneralModal(true)
    const handleCloseGeneralModal = () => {
        setOpenGeneralModal(false)
        setGeneralSearchQuery("")
    }
    const handleSelectGeneralDomain = (word: string) => {
        setSearchBarInput(word.trim())
        setOpenGeneralModal(false)
        setGeneralSearchQuery("")
    }
    const [generalSearchQuery, setGeneralSearchQuery] = useState("")

    useEffect(() => {
        if (storedSearch && !searchTerm) {
            setSearchTerm(storedSearch.query)
        }
    }, [storedSearch, searchTerm])

    useEffect(() => {
        if (storedSearch) {
            setSearchBarInput(storedSearch.query)
            setKeywords(storedSearch.result)
        }
    }, [storedSearch])

    const { data, isLoading, isError, error } = useSistrixDomainKeywordsData(searchTerm)

    useEffect(() => {
        if (data) {
            if ("status" in data && data.status === "fail") {
                setKeywords([])
            } else if ("answer" in data && data.answer?.[0]?.result) {
                const keywordResults = data.answer[0].result as SistrixDomainsKeywordsResult[]
                const validResults = keywordResults.filter((item) => Boolean(item.kw))
                const addedKeywords = selectedCompany?.generalKeywords || []
                const filteredResults = validResults.filter((item) => {
                    const isAlreadyAdded = addedKeywords.includes(item.kw)
                    return !isAlreadyAdded
                })
                setKeywords(filteredResults)
                setPageResult(pageId, {
                    query: searchTerm,
                    result: filteredResults,
                })
            }
        }
    }, [data, selectedCompany, searchTerm, pageId, setPageResult])

    const stats = useMemo(() => {
        if (data && "answer" in data && data.answer?.[0]?.result) {
            const keywordResults = data.answer[0].result as SistrixDomainsKeywordsResult[]
            const validResults = keywordResults.filter((item) => Boolean(item.kw))
            const totalResultsCount = validResults.length
            const addedKeywords = selectedCompany?.generalKeywords || []
            let hiddenCount = 0
            const filteredResults = validResults.filter((item) => {
                const isAlreadyAdded = addedKeywords.includes(item.kw)
                if (isAlreadyAdded) hiddenCount++
                return !isAlreadyAdded
            })
            return {
                totalResultsCount,
                filteredResultsCount: filteredResults.length,
                hiddenResultsCount: hiddenCount,
            }
        } else {
            return {
                totalResultsCount: keywords.length,
                filteredResultsCount: keywords.length,
                hiddenResultsCount: 0,
            }
        }
    }, [data, selectedCompany, keywords])

    const handleSearch = () => {
        const trimmed = searchBarInput.trim()
        setSearchTerm(trimmed)
        setSearchBarInput(trimmed)
    }

    const handleSaveKeywords = (keywordsToSave: SistrixDomainsKeywordsResult[]) => {
        if (selectedCompany?.uuid) {
            const currentGeneralKeywords = selectedCompany.generalKeywords || []
            const newGeneralKeywords = keywordsToSave.map((keyword) => keyword.kw)
            updateCompany(selectedCompany.uuid, {
                generalKeywords: [...currentGeneralKeywords, ...newGeneralKeywords],
            })
            setSelected([])
        }
    }

    const handleAddKeywords = () => {
        const selectedKeywords = keywords.filter((item) => item.kw && selected.includes(item.kw))
        handleSaveKeywords(selectedKeywords)

        const removedKeywords = selectedKeywords.map((item) => item.kw)
        removeKeywords(pageId, removedKeywords)

        const updated = useKeywordSearchStore.getState().pages[pageId]
        if (updated) {
            setKeywords(updated.result)
        }
        setSelected([])
    }

    return (
        <>
            <Box sx={{ p: 2 }}>
                <Box sx={{ mb: 2 }}>
                    <Paper sx={{ width: "100%" }}>
                        <SearchBar searchBarInput={searchBarInput} onSearchBarInputChange={setSearchBarInput} onSearch={handleSearch} onOpenGeneralModal={handleOpenGeneralModal} />
                        <DomainStatsTableToolbar domain={searchBarInput} />
                        <CompetitorStats
                            totalResultsCount={stats.totalResultsCount}
                            filteredResultsCount={stats.filteredResultsCount}
                            hiddenResultsCount={stats.hiddenResultsCount}
                        />
                        <EnhancedTableToolbar numSelected={selected.length} onAddKeywords={handleAddKeywords} />
                        <KeywordsDataGrid
                            keywords={keywords}
                            selected={selected}
                            onRowSelectionModelChange={setSelected}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPaginationModelChange={({ page, pageSize }) => {
                                setPage(page)
                                setRowsPerPage(pageSize)
                            }}
                            orderBy={orderBy}
                            order={order}
                            onSortModelChange={(model) => {
                                if (model.length) {
                                    const field = model[0].field
                                    if (field === "position" || field === "kw") {
                                        setOrderBy(field as "position" | "kw")
                                        setOrder(model[0].sort as Order)
                                    }
                                }
                            }}
                            isLoading={isLoading}
                            isError={isError}
                            error={error}
                        />
                    </Paper>
                </Box>
            </Box>
            <DomainSelectionModal
                open={openGeneralModal}
                onClose={handleCloseGeneralModal}
                generalDomains={selectedCompany?.generalDomains || []}
                generalSearchQuery={generalSearchQuery}
                onGeneralSearchQueryChange={setGeneralSearchQuery}
                onSelectDomain={handleSelectGeneralDomain}
            />
        </>
    )
}
