"use client"
import React, { useState, useEffect, useMemo } from "react"
import { Box, Button, TextField, Paper, IconButton, Alert } from "@mui/material"
import ListAltIcon from "@mui/icons-material/ListAlt"
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
import { useCompetitorSearchStore } from "@/src/store/competitorSearchStore"

const CompetitorsSearchByKeywordPage = () => {
    const pathname = usePathname()
    const pageId = useMemo(() => {
        const parts = pathname.split("/").filter(Boolean)
        return parts.pop() || "defaultPage"
    }, [pathname])

    const { pages, setPageResult, removeCompetitors } = useCompetitorSearchStore()
    const storedSearch = pages[pageId]

    const [keyword, setKeyword] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [competitors, setCompetitors] = useState<Competitor[]>([])
    const [order, setOrder] = useState<Order>("asc")
    const [orderBy, setOrderBy] = useState<keyof Pick<Competitor, "position" | "domain" | "url">>("position")
    const [selected, setSelected] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(100)
    const { updateCompany, selectedCompany } = useAppStore()
    const [totalResultsCount, setTotalResultsCount] = useState(0)
    const [filteredResultsCount, setFilteredResultsCount] = useState(0)
    const [hiddenResultsCount, setHiddenResultsCount] = useState(0)
    const [duplicateDomainsCount, setDuplicateDomainsCount] = useState(0)

    const [openGeneralWordsModal, setOpenGeneralWordsModal] = useState(false)
    const handleOpenGeneralWordsModal = () => setOpenGeneralWordsModal(true)
    const handleCloseGeneralWordsModal = () => {
        setOpenGeneralWordsModal(false)
        setGeneralSearchQuery("")
    }
    const handleSelectGeneralWord = (word: string) => {
        setKeyword(word.trim())
        setOpenGeneralWordsModal(false)
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

    useEffect(() => {
        if (storedSearch) {
            setKeyword(storedSearch.query)
            setCompetitors(storedSearch.result)
            setTotalResultsCount(storedSearch.totalResultsCount)
            setFilteredResultsCount(storedSearch.filteredResultsCount)
            setHiddenResultsCount(storedSearch.hiddenResultsCount)
            setDuplicateDomainsCount(storedSearch.duplicateDomainsCount)
        }
    }, [storedSearch])

    useEffect(() => {
        if (data) {
            if ("status" in data && data.status === "fail") {
                setCompetitors([])
                setTotalResultsCount(0)
                setFilteredResultsCount(0)
                setHiddenResultsCount(0)
                setDuplicateDomainsCount(0)
            } else if ("answer" in data && data.answer?.[0]?.result) {
                const competitorResults = data.answer[0].result as SistrixCompetitorResult[]
                const validResults = competitorResults.filter((item) => Boolean(item.domain))
                setTotalResultsCount(validResults.length)

                const candidateKeyword = data.answer[0].kw || ""
                const addedCompetitors = selectedCompany?.seo?.competitors || []

                const uniqueDomains = new Set<string>()
                const uniqueResults: SistrixCompetitorResult[] = []
                let duplicateCount = 0
                for (const item of validResults) {
                    if (!item.domain) continue
                    if (uniqueDomains.has(item.domain)) {
                        duplicateCount++
                        continue
                    }
                    uniqueDomains.add(item.domain)
                    uniqueResults.push(item)
                }

                let hiddenCount = 0
                const filteredResults = uniqueResults.filter((item) => {
                    const isAlreadyAdded = addedCompetitors.some((comp) => {
                        const compKeyword = (comp as ExtendedCompetitor).keyword || ""
                        return comp.domain === item.domain && compKeyword === candidateKeyword
                    })
                    if (isAlreadyAdded) {
                        hiddenCount++
                    }
                    return !isAlreadyAdded
                })

                setDuplicateDomainsCount(duplicateCount)
                setHiddenResultsCount(hiddenCount)
                setFilteredResultsCount(filteredResults.length)

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

                setPageResult(pageId, {
                    query: searchTerm,
                    result: fetchedCompetitors,
                    totalResultsCount: validResults.length,
                    filteredResultsCount: filteredResults.length,
                    hiddenResultsCount: hiddenCount,
                    duplicateDomainsCount: duplicateCount,
                })
            }
        }
    }, [data, selectedCompany, searchTerm, pageId, setPageResult])

    const handleSearch = () => {
        const trimmedKeyword = keyword.trim()
        setSearchTerm(trimmedKeyword)
        setKeyword(trimmedKeyword)
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

        const removedIds = selectedCompetitors.map((comp) => comp.uuid)
        removeCompetitors(pageId, removedIds)

        const updated = useCompetitorSearchStore.getState().pages[pageId]
        if (updated) {
            setCompetitors(updated.result)
            setFilteredResultsCount(updated.filteredResultsCount)
            setTotalResultsCount(updated.totalResultsCount)
            setHiddenResultsCount(updated.hiddenResultsCount)
            setDuplicateDomainsCount(updated.duplicateDomainsCount)
        }
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
                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                flexWrap: "wrap",
                                alignItems: "center",
                                pt: 2,
                                pr: 2,
                                pl: 2,
                            }}
                        >
                            <TextField
                                label="Enter keyword"
                                variant="outlined"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearch()
                                    }
                                }}
                                sx={{ flex: 1 }}
                            />
                            <IconButton color="primary" onClick={handleOpenGeneralWordsModal}>
                                <ListAltIcon />
                            </IconButton>
                            <Button variant="contained" onClick={handleSearch}>
                                Search
                            </Button>
                        </Box>
                        <KeywordStatsTableToolbar keyword={keyword} />
                        <CompetitorStats
                            totalResultsCount={totalResultsCount}
                            filteredResultsCount={filteredResultsCount}
                            hiddenResultsCount={hiddenResultsCount}
                            duplicateDomainsCount={duplicateDomainsCount}
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
                open={openGeneralWordsModal}
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
