"use client"

export const dynamic = "force-dynamic"

import React, { useState, useEffect } from "react"
import { alpha } from "@mui/material/styles"
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
    Tooltip,
    Toolbar,
    Alert,
} from "@mui/material"
import ListAltIcon from "@mui/icons-material/ListAlt"
import { useSistrixDomainKeywordsData } from "@/src/hooks/useSistrixDomainKeywordsQuery"
import { useAppStore } from "@/src/store/appStore"
import RemainingCredits from "@/src/components/RemainingCredits"
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid"
import NoDataMessage from "@/src/components/NoDataMessage"
import CompetitorStats from "@/src/components/CompetitorStats"

export interface SistrixDomainsKeywordsResult {
    kw: string
    position: number
    competition: number
    traffic: number
    url: string
}

type Order = "asc" | "desc"

interface EnhancedTableToolbarProps {
    numSelected: number
    onAddKeywords?: () => void
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, onAddKeywords } = props
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <>
                    <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1" component="div">
                        {numSelected} selected
                    </Typography>
                    <Tooltip title="Add keywords">
                        <Button
                            onClick={onAddKeywords}
                            variant="contained"
                            size="small"
                            color="success"
                            sx={{
                                "&:hover": {
                                    color: "white",
                                },
                            }}
                        >
                            Save keywords
                        </Button>
                    </Tooltip>
                </>
            ) : (
                <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
                    Keywords
                </Typography>
            )}
        </Toolbar>
    )
}

interface DomainStatsTableToolbarProps {
    domain: string
}

function DomainStatsTableToolbar(props: DomainStatsTableToolbarProps) {
    const { domain } = props
    return (
        <Toolbar
            sx={{
                pt: { sm: 2 },
                pb: { sm: 2 },
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
            }}
        >
            <Box sx={{ flex: "1 1 100%" }}>
                <Typography variant="h6" id="tableTitle" component="div">
                    Domain:
                    <span style={{ color: "#3498db", marginLeft: "5px" }}>{domain}</span>
                </Typography>
            </Box>
            <RemainingCredits />
        </Toolbar>
    )
}

export default function KeywordsSearchByDomainPage() {
    const [domainInput, setDomainInput] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [keywords, setKeywords] = useState<SistrixDomainsKeywordsResult[]>([])
    const [order, setOrder] = useState<Order>("asc")
    const [orderBy, setOrderBy] = useState<"position" | "kw">("position")
    const [selected, setSelected] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(100)
    const { updateCompany, selectedCompany, queryParams } = useAppStore()
    const [totalResultsCount, setTotalResultsCount] = useState(0)
    const [filteredResultsCount, setFilteredResultsCount] = useState(0)
    const [hiddenResultsCount, setHiddenResultsCount] = useState(0)

    const [openGeneralDomainsModal, setOpenGeneralDomainsModal] = useState(false)
    const handleOpenGeneralDomainsModal = () => setOpenGeneralDomainsModal(true)
    const handleCloseGeneralDomainsModal = () => {
        setOpenGeneralDomainsModal(false)
        setGeneralSearchQuery("")
    }
    const handleSelectGeneralDomain = (word: string) => {
        setDomainInput(word.trim())
        setOpenGeneralDomainsModal(false)
        setGeneralSearchQuery("")
    }
    const [generalSearchQuery, setGeneralSearchQuery] = useState("")
    const groupedGeneralDomains = React.useMemo(() => {
        const domains = (selectedCompany?.generalDomains || []).slice()
        domains.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
        const groups: { [letter: string]: string[] } = {}
        domains.forEach((w) => {
            const letter = w.charAt(0).toUpperCase()
            if (!groups[letter]) groups[letter] = []
            groups[letter].push(w)
        })
        return groups
    }, [selectedCompany])

    const { data, isLoading, isError, error } = useSistrixDomainKeywordsData(
        searchTerm,
        queryParams.country,
        { limit: queryParams.limit, history: "false" },
        { enabled: !!searchTerm }
    )

    useEffect(() => {
        if (data) {
            if ("status" in data && data.status === "fail") {
                setKeywords([])
                setTotalResultsCount(0)
                setFilteredResultsCount(0)
                setHiddenResultsCount(0)
            } else if ("answer" in data && data.answer?.[0]?.result) {
                const keywordResults = data.answer[0].result as SistrixDomainsKeywordsResult[]
                const validResults = keywordResults.filter((item) => Boolean(item.kw))
                setTotalResultsCount(validResults.length)
                const addedKeywords = selectedCompany?.generalKeywords || []

                let hiddenCount = 0

                const filteredResults = validResults.filter((item) => {
                    const isAlreadyAdded = addedKeywords.includes(item.kw)
                    if (isAlreadyAdded) {
                        hiddenCount++
                    }
                    return !isAlreadyAdded
                })

                setFilteredResultsCount(filteredResults.length)
                setHiddenResultsCount(hiddenCount)
                setKeywords(filteredResults)
            }
        }
    }, [data, selectedCompany])

    const handleSearch = () => {
        const trimmedDomainInput = domainInput.trim()
        setSearchTerm(trimmedDomainInput)
        setDomainInput(trimmedDomainInput)
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
        setKeywords([])
    }

    const gridRows = keywords.map((item) => ({
        id: item.kw,
        kw: item.kw,
        position: item.position,
        competition: item.competition,
        traffic: item.traffic,
        url: item.url,
    }))

    const columns: GridColDef[] = [
        { field: "kw", headerName: "Keyword", flex: 1 },
        { field: "position", headerName: "Position", flex: 1 },
        { field: "competition", headerName: "Competition", flex: 1 },
        { field: "traffic", headerName: "Traffic", flex: 1 },
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
                                label="Enter domain"
                                variant="outlined"
                                value={domainInput}
                                onChange={(e) => setDomainInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearch()
                                    }
                                }}
                                sx={{ flex: 1 }}
                            />
                            <IconButton color="primary" onClick={handleOpenGeneralDomainsModal}>
                                <ListAltIcon />
                            </IconButton>
                            <Button variant="contained" onClick={handleSearch}>
                                Search
                            </Button>
                        </Box>
                        <DomainStatsTableToolbar domain={domainInput} />
                        <CompetitorStats totalResultsCount={totalResultsCount} filteredResultsCount={filteredResultsCount} hiddenResultsCount={hiddenResultsCount} />
                        <EnhancedTableToolbar numSelected={selected.length} onAddKeywords={handleAddKeywords} />

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
                                            if (field === "position" || field === "kw") {
                                                setOrderBy(field as "position" | "kw")
                                                setOrder(model[0].sort as Order)
                                            }
                                        }
                                    }}
                                    rowSelectionModel={selected}
                                    onRowSelectionModelChange={(newSelection) => setSelected(newSelection as string[])}
                                    // slots={{ noRowsOverlay: () => <CustomOverlay data={data ?? null} /> }}
                                />
                            )}
                        </Box>
                    </Paper>
                </Box>
            </Box>
            <Dialog open={openGeneralDomainsModal} onClose={handleCloseGeneralDomainsModal} fullWidth maxWidth="sm">
                <DialogTitle>Select a Domain</DialogTitle>
                {selectedCompany?.generalDomains && selectedCompany.generalDomains.length ? (
                    <DialogContent dividers>
                        <TextField label="Search domains" fullWidth value={generalSearchQuery} onChange={(e) => setGeneralSearchQuery(e.target.value)} sx={{ mb: 2 }} />
                        {Object.keys(groupedGeneralDomains)
                            .sort()
                            .map((letter) => {
                                const filteredDomains = groupedGeneralDomains[letter].filter((word) => word.toLowerCase().includes(generalSearchQuery.toLowerCase()))
                                if (filteredDomains.length === 0) return null
                                return (
                                    <Box key={letter} sx={{ mb: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                            {letter}
                                        </Typography>
                                        <Divider sx={{ mb: 0 }} />
                                        <List>
                                            {filteredDomains.map((word, index) => (
                                                <ListItem key={index} disablePadding>
                                                    <ListItemButton onClick={() => handleSelectGeneralDomain(word)}>
                                                        <ListItemText primary={word} />
                                                    </ListItemButton>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                )
                            })}
                    </DialogContent>
                ) : (
                    <NoDataMessage />
                )}
                <DialogActions>
                    <Button color="secondary" onClick={handleCloseGeneralDomainsModal} variant="contained" style={{ color: "#ffffff" }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
