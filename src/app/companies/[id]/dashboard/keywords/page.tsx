"use client"

import React, { useState, useEffect } from "react"
import { alpha, styled } from "@mui/material/styles"
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
} from "@mui/material"
import ListAltIcon from "@mui/icons-material/ListAlt"
import { v4 as uuidv4 } from "uuid"
import { useSistrixData } from "@/src/hooks/useSistrixQuery"
import { type Competitor } from "@/src/utils/types"
import { useAppStore } from "@/src/store/appStore"
import RemainingCredits from "@/src/components/RemainingCredits"
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid"

interface SistrixCompetitorResult {
    uuid?: string
    position: number
    name?: string
    url?: string
    domain?: string
}

type Order = "asc" | "desc"

interface EnhancedTableToolbarProps {
    numSelected: number
    onAddCompetitors?: () => void
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, onAddCompetitors } = props
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
                    <Tooltip title="Add competitors">
                        <Button
                            onClick={onAddCompetitors}
                            variant="contained"
                            size="small"
                            color="success"
                            sx={{
                                "&:hover": {
                                    color: "white",
                                },
                            }}
                        >
                            Save competitors
                        </Button>
                    </Tooltip>
                </>
            ) : (
                <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
                    Competitors
                </Typography>
            )}
        </Toolbar>
    )
}

interface KeywordStats {
    intent_website?: number
    intent_know?: number
    intent_visit?: number
    intent_do?: number
}

interface KeywordStatsTableToolbarProps {
    keyword: string
    keywordStats: KeywordStats
}

function KeywordStatsTableToolbar(props: KeywordStatsTableToolbarProps) {
    const { keyword, keywordStats } = props
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
                    Keyword:
                    <span style={{ color: "#3498db", marginLeft: "5px" }}>{keyword}</span>
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 1, color: "text.secondary" }}>
                    <Typography variant="body1">Website: {keywordStats.intent_website ?? 0}</Typography>
                    <Typography variant="body1">Know: {keywordStats.intent_know ?? 0}</Typography>
                    <Typography variant="body1">Visit: {keywordStats.intent_visit ?? 0}</Typography>
                    <Typography variant="body1">Do: {keywordStats.intent_do ?? 0}</Typography>
                </Box>
            </Box>
            <RemainingCredits />
        </Toolbar>
    )
}

type ExtendedCompetitor = Competitor & { competitorName?: string; keyword?: string }

export default function CompetitorsManager() {
    const [keyword, setKeyword] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [competitors, setCompetitors] = useState<Competitor[]>([])
    const [order, setOrder] = useState<Order>("asc")
    const [orderBy, setOrderBy] = useState<keyof Pick<Competitor, "position" | "domain" | "url">>("position")
    const [selected, setSelected] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(100)
    const { updateCompany, selectedCompany } = useAppStore()

    const [openGeneralWordsModal, setOpenGeneralWordsModal] = useState(false)
    const handleOpenGeneralWordsModal = () => setOpenGeneralWordsModal(true)
    const handleCloseGeneralWordsModal = () => {
        setOpenGeneralWordsModal(false)
        setGeneralSearchQuery("")
    }
    const handleSelectGeneralWord = (word: string) => {
        setKeyword(word)
        setOpenGeneralWordsModal(false)
        setGeneralSearchQuery("")
    }
    const [generalSearchQuery, setGeneralSearchQuery] = useState("")
    const groupedGeneralKeywords = React.useMemo(() => {
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

    const { data, isLoading, isError, error } = useSistrixData(
        searchTerm,
        "de",
        { limit: "5", history: "false" },
        { enabled: !!searchTerm }
    )

    useEffect(() => {
        if (data?.answer?.[0]?.result) {
            const competitorResults = data.answer[0].result as SistrixCompetitorResult[]
            const validResults = competitorResults.filter((item) => Boolean(item.domain && item.url))
            const candidateKeyword = data?.answer?.[0]?.kw || ""
            const addedCompetitors = selectedCompany?.seo?.competitorsByKeyword || []

            const filteredResults = validResults.filter((item) => {
                return !addedCompetitors.some((comp) => {
                    const compKeyword = (comp as ExtendedCompetitor).keyword || ""
                    return comp.domain === item.domain && compKeyword === candidateKeyword
                })
            })

            const fetchedCompetitors: Competitor[] = filteredResults.map((item) => ({
                uuid: item.uuid || uuidv4(),
                position: item.position,
                url: item.url || "",
                domain: item.domain || "",
                keyword: "",
                name: item.name || "",
                status: "not_checked",
                products: [],
                address: { street: "", houseNumber: "", postalCode: "", city: "" },
                contact: { phone: "", email: "" },
                socialNetworks: { facebook: "", instagram: "", linkedin: "", twitter: "" },
            }))
            setCompetitors(fetchedCompetitors)
        }
    }, [data, selectedCompany])

    const handleSearch = () => {
        setSearchTerm(keyword)
    }

    const handleSaveCompetitorsByKeyword = (competitors: Competitor[]) => {
        if (selectedCompany?.uuid) {
            const currentCompetitorsByKeyword = selectedCompany?.seo?.competitorsByKeyword || []
            const formattedCompetitors = competitors.map((comp) => ({
                keyword: data?.answer?.[0]?.kw || "",
                uuid: comp.uuid || "",
                name: comp.name || (comp as ExtendedCompetitor).competitorName || "",
                status: comp.status,
                products: comp.products,
                domain: comp.domain || "",
                url: comp.url || "",
                position: comp.position !== undefined ? comp.position : 0,
                address: {
                    street: comp.address?.street || "",
                    houseNumber: comp.address?.houseNumber || "",
                    postalCode: comp.address?.postalCode || "",
                    city: comp.address?.city || "",
                },
                contact: {
                    phone: comp.contact?.phone || "",
                    email: comp.contact?.email || "",
                },
                socialNetworks: {
                    facebook: comp.socialNetworks?.facebook || "",
                    instagram: comp.socialNetworks?.instagram || "",
                    linkedin: comp.socialNetworks?.linkedin || "",
                    twitter: comp.socialNetworks?.twitter || "",
                },
            }))

            updateCompany(selectedCompany.uuid, {
                seo: { competitorsByKeyword: [...currentCompetitorsByKeyword, ...formattedCompetitors] },
            })
            setSelected([])
        }
    }

    const handleAddCompetitors = () => {
        const selectedCompetitors = competitors.filter((comp) => comp.uuid && selected.includes(comp.uuid))
        handleSaveCompetitorsByKeyword(selectedCompetitors)
        setCompetitors([])
    }

    const gridRows = competitors.map((comp) => ({
        id: comp.uuid,
        position: comp.position,
        domain: comp.domain,
        url: comp.url,
    }))

    const columns: GridColDef[] = [
        { field: "position", headerName: "Position", flex: 1 },
        { field: "domain", headerName: "Domain", flex: 1 },
        { field: "url", headerName: "Url", flex: 1 },
    ]

    const sortModel: GridSortModel = [
        {
            field: orderBy,
            sort: order,
        },
    ]

    const StyledGridOverlay = styled("div")(({ theme }) => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        "& .no-rows-primary": {
            fill: "#3D4751",
            ...theme.applyStyles("light", {
                fill: "#AEB8C2",
            }),
        },
        "& .no-rows-secondary": {
            fill: "#1D2126",
            ...theme.applyStyles("light", {
                fill: "#E8EAED",
            }),
        },
    }))

    function CustomNoRowsOverlay() {
        return (
            <StyledGridOverlay>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={96} viewBox="0 0 452 257" aria-hidden focusable="false">
                    <path
                        className="no-rows-primary"
                        d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
                    />
                    <path
                        className="no-rows-primary"
                        d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
                    />
                    <path
                        className="no-rows-primary"
                        d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
                    />
                    <path
                        className="no-rows-secondary"
                        d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
                    />
                </svg>
                <Box sx={{ mt: 2 }}>No rows</Box>
            </StyledGridOverlay>
        )
    }

    if (isError) return <Typography color="error">Error: {error?.message}</Typography>

    return (
        <>
            <Box sx={{ p: 2 }}>
                <Dialog open={openGeneralWordsModal} onClose={handleCloseGeneralWordsModal} fullWidth maxWidth="sm">
                    <DialogTitle>Select a General Keyword</DialogTitle>
                    <DialogContent dividers>
                        <TextField
                            label="Search keywords"
                            fullWidth
                            value={generalSearchQuery}
                            onChange={(e) => setGeneralSearchQuery(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        {Object.keys(groupedGeneralKeywords)
                            .sort()
                            .map((letter) => {
                                const filteredWords = groupedGeneralKeywords[letter].filter((word) =>
                                    word.toLowerCase().includes(generalSearchQuery.toLowerCase())
                                )
                                if (filteredWords.length === 0) return null
                                return (
                                    <Box key={letter} sx={{ mb: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                            {letter}
                                        </Typography>
                                        <Divider sx={{ mb: 0 }} />
                                        <List>
                                            {filteredWords.map((word, index) => (
                                                <ListItem key={index} disablePadding>
                                                    <ListItemButton onClick={() => handleSelectGeneralWord(word)}>
                                                        <ListItemText primary={word} />
                                                    </ListItemButton>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                )
                            })}
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" color="secondary" onClick={handleCloseGeneralWordsModal}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

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
                        <KeywordStatsTableToolbar keyword={keyword} keywordStats={data?.keywordStats ?? {}} />
                        <EnhancedTableToolbar numSelected={selected.length} onAddCompetitors={handleAddCompetitors} />
                        <Box sx={{ height: "65vh", width: "100%" }}>
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
                                slots={{ noRowsOverlay: CustomNoRowsOverlay }}
                            />
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </>
    )
}
