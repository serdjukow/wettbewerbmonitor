"use client"

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
} from "@mui/material"
import ListAltIcon from "@mui/icons-material/ListAlt"
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent"
import { v4 as uuidv4 } from "uuid"
import { useSistrixDomainsData } from "@/src/hooks/useSistrixDomainsQuery"
import { type Competitor } from "@/src/utils/types"
import { useAppStore } from "@/src/store/appStore"
import RemainingCredits from "@/src/components/RemainingCredits"
import CustomOverlay from "@/src/components/CustomOverlay"
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid"
import QueryParamsModal from "@/src/components/QueryParamsModal"
import NoDataMessage from "@/src/components/NoDataMessage"

interface SistrixDomainResult {
    uuid?: string
    domain: string
    match: number
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

type ExtendedCompetitor = Competitor & { competitorName?: string; domain?: string }

export default function CompetitorsSearchByDomainPage() {
    const [domainInput, setDomainInput] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [competitors, setCompetitors] = useState<Competitor[]>([])
    const [order, setOrder] = useState<Order>("asc")
    const [orderBy, setOrderBy] = useState<"match" | "domain">("match")
    const [selected, setSelected] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(100)
    const { updateCompany, selectedCompany, queryParams } = useAppStore()
    const [openModal, setOpenModal] = useState(false)

    const [openGeneralDomainsModal, setOpenGeneralDomainsModal] = useState(false)
    const handleOpenGeneralDomainsModal = () => setOpenGeneralDomainsModal(true)
    const handleCloseGeneralDomainsModal = () => {
        setOpenGeneralDomainsModal(false)
        setGeneralSearchQuery("")
    }
    const handleSelectGeneralDomain = (word: string) => {
        setDomainInput(word)
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

    const { data, isLoading, isError, error } = useSistrixDomainsData(
        searchTerm,
        queryParams.country,
        { limit: queryParams.limit, history: "false" },
        { enabled: !!searchTerm }
    )

    useEffect(() => {
        if (data) {
            if ("status" in data && data.status === "fail") {
                setCompetitors([])
            } else if ("answer" in data && data.answer?.[0]?.result) {
                const competitorResults = data.answer[0].result as SistrixDomainResult[]
                const validResults = competitorResults.filter((item) => Boolean(item.domain))
                const addedCompetitors = selectedCompany?.seo?.competitors || []

                const filteredResults = validResults.filter((item) => {
                    return !addedCompetitors.some((comp) => {
                        const compDomain = (comp as ExtendedCompetitor).domain || ""
                        return compDomain === item.domain
                    })
                })

                const fetchedCompetitors: Competitor[] = filteredResults.map((item) => ({
                    uuid: item.uuid || uuidv4(),
                    match: item.match,
                    domain: item.domain,
                    url: "",
                    keyword: "",
                    name: "",
                    status: "not_checked",
                    products: [],
                    address: { street: "", houseNumber: "", postalCode: "", city: "" },
                    contact: { phone: "", email: "" },
                    socialNetworks: { facebook: "", instagram: "", linkedin: "", twitter: "" },
                }))
                setCompetitors(fetchedCompetitors)
            }
        }
    }, [data, selectedCompany])

    const handleSearch = () => {
        setSearchTerm(domainInput)
    }

    const handleSaveCompetitors = (competitors: Competitor[]) => {
        if (selectedCompany?.uuid) {
            const currentCompetitors = selectedCompany?.seo?.competitors || []
            const formattedCompetitors = competitors.map((comp) => ({
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
        setCompetitors([])
    }

    const gridRows = competitors.map((comp) => ({
        id: comp.uuid,
        domain: comp.domain,
        match: comp.match,
    }))

    const columns: GridColDef[] = [
        { field: "domain", headerName: "Domain", flex: 1 },
        { field: "match", headerName: "Match", flex: 1 },
    ]

    const sortModel: GridSortModel = [
        {
            field: orderBy,
            sort: order,
        },
    ]

    if (isError) return <Typography color="error">Error: {error?.message}</Typography>

    return (
        <>
            <Box sx={{ p: 2 }}>
                <Dialog open={openGeneralDomainsModal} onClose={handleCloseGeneralDomainsModal} fullWidth maxWidth="sm">
                    <DialogTitle>Select a Domain</DialogTitle>

                    {selectedCompany?.generalDomains || selectedCompany?.generalDomains?.length ? (
                        <DialogContent dividers>
                            <TextField
                                label="Search domains"
                                fullWidth
                                value={generalSearchQuery}
                                onChange={(e) => setGeneralSearchQuery(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            {Object.keys(groupedGeneralDomains)
                                .sort()
                                .map((letter) => {
                                    const filteredWords = groupedGeneralDomains[letter].filter((word) =>
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
                        <Button variant="outlined" color="secondary" onClick={handleCloseGeneralDomainsModal}>
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
                            <IconButton color="secondary" onClick={() => setOpenModal(true)}>
                                <SettingsInputComponentIcon />
                            </IconButton>
                            <Button variant="contained" onClick={handleSearch}>
                                Search
                            </Button>
                        </Box>
                        <DomainStatsTableToolbar domain={domainInput} />
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
                                        if (field === "match" || field === "domain") {
                                            setOrderBy(field as "match" | "domain")
                                            setOrder(model[0].sort as Order)
                                        }
                                    }
                                }}
                                rowSelectionModel={selected}
                                onRowSelectionModelChange={(newSelection) => setSelected(newSelection as string[])}
                                slots={{ noRowsOverlay: () => <CustomOverlay data={data ?? null} /> }}
                            />
                        </Box>
                    </Paper>
                </Box>
            </Box>
            <QueryParamsModal open={openModal} onClose={() => setOpenModal(false)} />
        </>
    )
}
