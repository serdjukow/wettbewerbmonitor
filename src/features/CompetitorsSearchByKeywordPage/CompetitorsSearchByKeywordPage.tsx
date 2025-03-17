"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Box, Paper, Alert } from "@mui/material"
import { v4 as uuidv4 } from "uuid"
import { useSistrixData } from "@/src/hooks/useSistrixKeywordQuery"
import { Competitor } from "@/src/utils/types"
import { useAppStore } from "@/src/store/appStore"
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid"
import CustomOverlay from "@/src/components/CustomOverlay"
import { SistrixCompetitorResult, Order, ExtendedCompetitor } from "./KeywordPageTypes"
import KeywordStatsTableToolbar from "./KeywordStatsTableToolbar"
import GeneralKeywordsDialog from "./GeneralKeywordsDialog"
import CompetitorStats from "@/src/components/CompetitorStats"
import EnhancedTableToolbar from "./EnhancedTableToolbar"
import { usePathname } from "next/navigation"
// import { useCompetitorSearchStore } from "@/src/store/competitorSearchStore"
import SearchBar from "./SearchBar"

const CompetitorsSearchByKeywordPage = () => {
    const pathname = usePathname()
    const pageId = useMemo(() => {
        const parts = pathname.split("/").filter(Boolean)
        return parts.pop() || "defaultPage"
    }, [pathname])

    // const { pages, setPageResult, removeCompetitors } = useCompetitorSearchStore()
    // const storedSearch = pages[pageId]

    const [searchBarInput, setSearchBarInput] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [competitors, setCompetitors] = useState<Competitor[]>([])
    const [order, setOrder] = useState<Order>("asc")
    const [orderBy, setOrderBy] = useState<keyof Pick<Competitor, "position" | "domain" | "url">>("position")
    const [selected, setSelected] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(100)
    const { updateCompany, selectedCompany } = useAppStore()

    const [openGeneralModal, setOpenGeneralModal] = useState(false)
    const handleOpenGeneralModal = () => setOpenGeneralModal(true)
    const handleCloseGeneralWordsModal = () => {
        setOpenGeneralModal(false)
        setGeneralSearchQuery("")
    }
    const handleSelectGeneralWord = (word: string) => {
        setSearchBarInput(word.trim())
        setOpenGeneralModal(false)
        setGeneralSearchQuery("")
    }
    const [generalSearchQuery, setGeneralSearchQuery] = useState("")

    const groupedGeneralKeywords = useMemo(() => {
        const words = (selectedCompany?.generalKeywords || []).slice()
        words.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
        const groups: { [letter: string]: string[] } = {}
        words.forEach((w) => {
            const letter = w.charAt(0).toUpperCase()
            if (!groups[letter]) groups[letter] = []
            groups[letter].push(w)
        })
        return groups
    }, [selectedCompany])

    const { data, isLoading, isError, error } = useSistrixData(searchTerm)

    // useEffect(() => {
    //     if (storedSearch && !searchTerm) {
    //         setSearchTerm(storedSearch.query)
    //     }
    // }, [storedSearch, searchTerm])

    // useEffect(() => {
    //     if (storedSearch) {
    //         setSearchBarInput(storedSearch.query)
    //         setCompetitors(storedSearch.result)
    //     }
    // }, [storedSearch])

    useEffect(() => {
        if (data) {
            if ("status" in data && data.status === "fail") {
                setCompetitors([])
            } else if ("answer" in data && data.answer?.[0]?.result) {
                const competitorResults = data.answer[0].result as SistrixCompetitorResult[]
                const validResults = competitorResults.filter((item) => Boolean(item.domain))

                const candidateKeyword = (data.answer[0].kw || "").toLowerCase().trim()
                const addedCompetitors = selectedCompany?.seo?.competitors || []

                const uniqueDomains = new Set<string>()
                const uniqueResults: SistrixCompetitorResult[] = []
                for (const item of validResults) {
                    if (!item.domain) continue
                    const lowerDomain = item.domain.toLowerCase()
                    if (uniqueDomains.has(lowerDomain)) continue
                    uniqueDomains.add(lowerDomain)
                    uniqueResults.push(item)
                }

                const filteredResults = uniqueResults.filter((item) => {
                    const lowerItemDomain = item.domain?.toLowerCase() || ""
                    if (candidateKeyword) {
                        return !addedCompetitors.some((comp) => {
                            const compKeyword = ((comp as ExtendedCompetitor).keyword || "").toLowerCase().trim()
                            return comp.domain.toLowerCase() === lowerItemDomain && compKeyword === candidateKeyword
                        })
                    } else {
                        return !addedCompetitors.some((comp) => comp.domain.toLowerCase() === lowerItemDomain)
                    }
                })

                const fetchedCompetitors: Competitor[] = filteredResults.map((item) => ({
                    uuid: item.uuid || uuidv4(),
                    position: item.position,
                    url: item.url || "",
                    domain: item.domain || "",
                    name: item.name || "",
                    status: "not_checked",
                    products: [],
                }))

                setCompetitors(fetchedCompetitors)
                // setPageResult(pageId, {
                //     query: searchTerm,
                //     result: fetchedCompetitors,
                // })
            }
        }
    }, [data, selectedCompany, searchTerm, pageId])

    const stats = useMemo(() => {
        if (data && "answer" in data && data.answer?.[0]?.result) {
            const competitorResults = data.answer[0].result as SistrixCompetitorResult[]
            const validResults = competitorResults.filter((item) => Boolean(item.domain))
            let duplicateCount = 0
            const uniqueDomains = new Set<string>()
            const uniqueResults: SistrixCompetitorResult[] = []
            for (const item of validResults) {
                if (!item.domain) continue
                if (uniqueDomains.has(item.domain)) {
                    duplicateCount++
                } else {
                    uniqueDomains.add(item.domain)
                    uniqueResults.push(item)
                }
            }
            const candidateKeyword = data.answer[0].kw || ""
            const addedCompetitors = selectedCompany?.seo?.competitors || []
            let hiddenCount = 0
            const filteredResults = uniqueResults.filter((item) => {
                const isAlreadyAdded = addedCompetitors.some((comp) => {
                    const compKeyword = (comp as ExtendedCompetitor).keyword || ""
                    return comp.domain === item.domain && compKeyword === candidateKeyword
                })
                if (isAlreadyAdded) hiddenCount++
                return !isAlreadyAdded
            })
            return {
                totalResultsCount: validResults.length,
                filteredResultsCount: filteredResults.length,
                hiddenResultsCount: hiddenCount,
                duplicateCount: duplicateCount,
            }
        } else {
            return {
                totalResultsCount: competitors.length,
                filteredResultsCount: competitors.length,
                hiddenResultsCount: 0,
                duplicateCount: 0,
            }
        }
    }, [data, competitors, selectedCompany])

    const handleSearch = () => {
        const trimmed = searchBarInput.trim()
        setSearchTerm(trimmed)
    }

    const handleSaveCompetitors = (competitorsToSave: Competitor[]) => {
        if (selectedCompany?.uuid) {
            const currentCompetitors = selectedCompany?.seo?.competitors || []
            const formattedCompetitors = competitorsToSave.map((comp) => ({
                keyword: data?.answer?.[0]?.kw || "",
                uuid: comp.uuid || "",
                name: comp.name || (comp as ExtendedCompetitor).competitorName || "",
                status: comp.status,
                products: comp.products,
                domain: comp.domain || "",
                url: comp.url || "",
                position: comp.position !== undefined ? comp.position : 0,
            }))

            updateCompany(selectedCompany.uuid, {
                seo: {
                    competitors: [...currentCompetitors, ...formattedCompetitors],
                },
            })
            setSelected([])
        }
    }

    const handleAddCompetitors = () => {
        const selectedCompetitors = competitors.filter((comp) => comp.uuid && selected.includes(comp.uuid))
        handleSaveCompetitors(selectedCompetitors)

        // const removedIds = selectedCompetitors.map((comp) => comp.uuid)
        // removeCompetitors(pageId, removedIds)

        // const updated = useCompetitorSearchStore.getState().pages[pageId]
        // if (updated) {
        //     setCompetitors(updated.result)
        // }
        setSelected([])
    }

    const gridRows = competitors.map((comp) => ({
        id: comp.uuid,
        position: comp.position,
        domain: comp.domain,
        url: comp.url,
    }))

    const columns: GridColDef[] = [
        { field: "position", headerName: "Position", flex: 1 },
        {
            field: "domain",
            headerName: "Domain",
            flex: 1,
            renderCell: (params) => {
                let url = params.value
                if (!/^https?:\/\//i.test(url)) {
                    url = "https://" + url
                }
                return (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        {params.value}
                    </a>
                )
            },
        },
        {
            field: "url",
            headerName: "URL",
            flex: 1,
            renderCell: (params) => (
                <a href={params.value} target="_blank" rel="noopener noreferrer">
                    {params.value}
                </a>
            ),
        },
    ]

    const sortModel: GridSortModel = [
        {
            field: orderBy,
            sort: order,
        },
    ]

    return (
        <>
            <Box sx={{ p: 2 }}>
                <Box sx={{ mb: 2 }}>
                    <Paper sx={{ width: "100%" }}>
                        <SearchBar searchBarInput={searchBarInput} onSearchBarInputChange={setSearchBarInput} onSearch={handleSearch} onOpenGeneralModal={handleOpenGeneralModal} />
                        <KeywordStatsTableToolbar keyword={searchBarInput} />
                        <CompetitorStats
                            totalResultsCount={stats.totalResultsCount}
                            filteredResultsCount={stats.filteredResultsCount}
                            hiddenResultsCount={stats.hiddenResultsCount}
                            duplicateCount={stats.duplicateCount}
                        />
                        <EnhancedTableToolbar numSelected={selected.length} onAddKeywords={handleAddCompetitors} />
                        <Box sx={{ height: "55vh", width: "100%" }}>
                            {isError ? (
                                <Box sx={{ p: 3 }}>
                                    <Alert severity="error">Request error: {error?.message}</Alert>
                                </Box>
                            ) : (
                                <DataGrid
                                    rows={gridRows}
                                    columns={columns}
                                    checkboxSelection
                                    loading={isLoading}
                                    pagination
                                    paginationModel={{ page: page, pageSize: rowsPerPage }}
                                    onPaginationModelChange={(model) => {
                                        setPage(model.page)
                                        setRowsPerPage(model.pageSize)
                                    }}
                                    sortModel={sortModel}
                                    onSortModelChange={(model) => {
                                        if (model.length) {
                                            const field = model[0].field
                                            if (field === "position" || field === "domain" || field === "url") {
                                                setOrderBy(field)
                                                setOrder(model[0].sort as Order)
                                            }
                                        }
                                    }}
                                    rowSelectionModel={selected}
                                    onRowSelectionModelChange={(newSelection) => setSelected(newSelection as string[])}
                                    slots={{ noRowsOverlay: () => <CustomOverlay data={data ?? null} /> }}
                                />
                            )}
                        </Box>
                    </Paper>
                </Box>
            </Box>
            <GeneralKeywordsDialog
                open={openGeneralModal}
                onClose={handleCloseGeneralWordsModal}
                searchQuery={generalSearchQuery}
                onSearchQueryChange={setGeneralSearchQuery}
                groupedGeneralKeywords={groupedGeneralKeywords}
                onSelectKeyword={handleSelectGeneralWord}
            />
        </>
    )
}

export default CompetitorsSearchByKeywordPage
