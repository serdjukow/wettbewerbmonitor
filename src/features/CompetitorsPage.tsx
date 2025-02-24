"use client"

export const dynamic = "force-dynamic"

import React, { useEffect, useState, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAppStore } from "@/src/store/appStore"
import { toast } from "react-toastify"
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Stack,
    Tab,
    Tabs,
    Typography,
    Alert,
    Badge,
} from "@mui/material"
import { Delete as DeleteIcon, Edit as EditIcon, RemoveRedEye as RemoveRedEyeIcon, ListAlt as ListAltIcon } from "@mui/icons-material"
import NoCompetitorsFoundCard from "@/src/components/NoCompetitorsFoundCard"
import { type Competitor, type GeneralService } from "@/src/utils/types"
import CompetitorServicesEditor from "@/src/components/CompetitorServicesEditor"

type ExtendedCompetitor = Competitor & { competitorName?: string; keyword?: string }
type TabValue = "not_checked" | "competitor" | "not_competitor" | "products_not_selected"

function createData(
    uuid: string,
    domain?: string,
    url?: string,
    keyword?: string,
    name?: string,
    status: "not_checked" | "competitor" | "not_competitor" = "not_checked",
    products: GeneralService[] = []
): Competitor {
    return {
        uuid,
        domain: domain && domain.trim() !== "" ? domain : "-",
        url: url && url.trim() !== "" ? url : "-",
        keyword: keyword && keyword.trim() !== "" ? keyword : "-",
        name: name && name.trim() !== "" ? name : "-",
        status,
        products,
    }
}

const NoProcessedCompetitorsCard = () => (
    <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6">There are competitors, but none have been processed yet.</Typography>
    </Paper>
)

const CompetitorsPage = () => {
    const router = useRouter()
    const pathname = usePathname()
    const { selectedCompany, updateCompany } = useAppStore()

    const [rows, setRows] = useState<Competitor[]>([])
    const [tab, setTab] = useState<TabValue>("not_checked")
    const [editingCompetitor, setEditingCompetitor] = useState<Competitor | null>(null)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [competitorToDelete, setCompetitorToDelete] = useState<Competitor | null>(null)
    const [openServicesDialog, setOpenServicesDialog] = useState(false)

    useEffect(() => {
        if (selectedCompany?.seo?.competitors) {
            setRows(
                (selectedCompany.seo.competitors as ExtendedCompetitor[]).map((item) =>
                    createData(
                        item.uuid || "-",
                        item.domain || "-",
                        item.url || "-",
                        item.keyword || "-",
                        item.name || "-",
                        (item as Competitor).status || "not_checked",
                        (item as Competitor).products || []
                    )
                )
            )
        }
    }, [selectedCompany])

    const handleTabChange = (_: React.SyntheticEvent, newValue: TabValue) => {
        setTab(newValue)
    }

    const tabFilters = useMemo(
        () => ({
            not_checked: (row: Competitor) => row.status === "not_checked",
            competitor: (row: Competitor) => row.status === "competitor" && row.products?.length > 0,
            not_competitor: (row: Competitor) => row.status === "not_competitor",
            products_not_selected: (row: Competitor) => row.status === "competitor" && row.products?.length === 0,
        }),
        []
    )

    const counts = useMemo(
        () => ({
            not_checked: rows.filter(tabFilters.not_checked).length,
            competitor: rows.filter(tabFilters.competitor).length,
            not_competitor: rows.filter(tabFilters.not_competitor).length,
            products_not_selected: rows.filter(tabFilters.products_not_selected).length,
        }),
        [rows, tabFilters]
    )

    const filteredRows = useMemo(() => (tabFilters[tab] ? rows.filter(tabFilters[tab]) : rows), [rows, tab, tabFilters])

    const handleStatusChange = async (uuid: string, newStatus: "not_checked" | "competitor" | "not_competitor") => {
        const updated = rows.map((row) => (row.uuid === uuid ? { ...row, status: newStatus } : row))
        setRows(updated)
        if (selectedCompany?.uuid) {
            try {
                await updateCompany(selectedCompany.uuid, {
                    seo: { competitors: updated },
                })
            } catch (error) {
                console.error("Error updating status:", error)
            }
        }
    }

    const handleViewCompetitor = (uuid: string) => {
        router.push(`${pathname}/competitor-view?uuid=${uuid}`)
    }

    const handleEditCompetitor = (uuid: string) => {
        router.push(`${pathname}/competitor-edit?uuid=${uuid}`)
    }

    const handleDeleteCompetitor = async (uuid: string) => {
        if (!selectedCompany || !selectedCompany.uuid || !uuid) return
        try {
            const updatedCompetitors = selectedCompany?.seo?.competitors?.filter((c) => c.uuid !== uuid)
            await updateCompany(selectedCompany.uuid, {
                seo: { competitors: updatedCompetitors },
            })
            toast.success("Competitor has been successfully deleted")
            setRows(updatedCompetitors || [])
        } catch (error) {
            toast.error(`Error when deleting a competitor: ${error}`)
            console.error("Error when deleting a competitor:", error)
        }
    }

    const handleCreateCompetitor = () => {
        router.push(`${pathname}/competitor-create`)
    }

    const handleOpenDeleteDialog = (competitor: Competitor) => {
        setCompetitorToDelete(competitor)
        setOpenDeleteDialog(true)
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false)
        setCompetitorToDelete(null)
    }

    const handleConfirmDelete = () => {
        if (competitorToDelete) {
            handleDeleteCompetitor(competitorToDelete.uuid)
        }
        setOpenDeleteDialog(false)
        setCompetitorToDelete(null)
    }

    const handleOpenServicesDialog = (competitor: Competitor) => {
        setEditingCompetitor(competitor)
        setOpenServicesDialog(true)
    }

    const handleCloseServicesDialog = () => {
        setOpenServicesDialog(false)
        setEditingCompetitor(null)
    }

    const handleSaveServices = async (selectedServices: GeneralService[]) => {
        if (selectedCompany?.uuid && editingCompetitor) {
            const updatedCompetitors = (selectedCompany.seo?.competitors || []).map((comp: Competitor) =>
                comp.uuid === editingCompetitor.uuid ? { ...comp, products: selectedServices } : comp
            )
            try {
                await updateCompany(selectedCompany.uuid, {
                    seo: { competitors: updatedCompetitors },
                })
                toast.success("Services updated for competitor")
                handleCloseServicesDialog()
            } catch (error) {
                console.error("Error updating competitor services:", error)
            }
        }
    }

    const generalServices: GeneralService[] = selectedCompany?.generalServices || []

    function shortNumber(num: number): string | number {
        return num > 99 ? "99+" : num || "0"
    }

    return (
        <Box sx={{ p: 2 }}>
            <Paper sx={{ width: "100%", mb: 3, p: 2 }}>
                <Stack direction="row" spacing={2} justifyContent="flex-start">
                    <Button sx={{ color: "white" }} onClick={handleCreateCompetitor} variant="contained" color="success">
                        Add new competitor
                    </Button>
                </Stack>
            </Paper>
            <Paper sx={{ width: "100%", mb: 2, p: 1 }}>
                <Tabs value={tab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="scrollable">
                    <Tab
                        sx={{ pr: 4 }}
                        value="not_checked"
                        label={
                            <Badge
                                badgeContent={shortNumber(counts.not_checked)}
                                color="default"
                                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                                sx={{
                                    "& .MuiBadge-badge": {
                                        transform: "translate(100%, -60%)",
                                        minWidth: "22px",
                                        height: "22px",
                                        borderRadius: "50%",
                                        padding: "0 4px",
                                        backgroundColor: "grey",
                                        color: "white",
                                    },
                                }}
                            >
                                NOT CHECKED
                            </Badge>
                        }
                    />
                    <Tab
                        sx={{ pr: 4 }}
                        value="competitor"
                        label={
                            <Badge
                                badgeContent={shortNumber(counts.competitor)}
                                color="success"
                                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                                sx={{
                                    "& .MuiBadge-badge": {
                                        transform: "translate(100%, -60%)",
                                        minWidth: "22px",
                                        height: "22px",
                                        borderRadius: "50%",
                                        padding: "0 4px",
                                        color: "white",
                                    },
                                }}
                            >
                                COMPETITOR
                            </Badge>
                        }
                    />
                    <Tab
                        sx={{ pr: 4 }}
                        value="not_competitor"
                        label={
                            <Badge
                                badgeContent={shortNumber(counts.not_competitor)}
                                color="warning"
                                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                                sx={{
                                    "& .MuiBadge-badge": {
                                        transform: "translate(100%, -60%)",
                                        minWidth: "22px",
                                        height: "22px",
                                        borderRadius: "50%",
                                        padding: "0 4px",
                                        color: "white",
                                    },
                                }}
                            >
                                NOT COMPETITOR
                            </Badge>
                        }
                    />
                    <Tab
                        sx={{ pr: 4 }}
                        value="products_not_selected"
                        label={
                            <Badge
                                badgeContent={shortNumber(counts.products_not_selected)}
                                color="info"
                                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                                sx={{
                                    "& .MuiBadge-badge": {
                                        transform: "translate(100%, -60%)",
                                        minWidth: "22px",
                                        height: "22px",
                                        borderRadius: "50%",
                                        padding: "0 4px",
                                        color: "white",
                                    },
                                }}
                            >
                                PRODUCTS NOT SELECTED
                            </Badge>
                        }
                    />
                </Tabs>
            </Paper>
            {filteredRows.length > 0 ? (
                <Box>
                    {filteredRows.map((row) => (
                        <Box key={row.uuid} sx={{ mb: 2 }}>
                            <Card variant="outlined">
                                <CardHeader
                                    sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}
                                    title={row.domain}
                                    subheader={row.name}
                                    action={
                                        <FormControl variant="standard" size="small" sx={{ minWidth: 120 }}>
                                            <InputLabel id={`status-label-${row.uuid}`} sx={{ color: "primary.contrastText" }}>
                                                Status
                                            </InputLabel>
                                            <Select
                                                labelId={`status-label-${row.uuid}`}
                                                value={row.status}
                                                onChange={(e: SelectChangeEvent) =>
                                                    handleStatusChange(
                                                        row.uuid,
                                                        e.target.value as "not_checked" | "competitor" | "not_competitor"
                                                    )
                                                }
                                                label="Status"
                                                sx={{ color: "primary.contrastText" }}
                                            >
                                                <MenuItem value="not_checked">Not checked</MenuItem>
                                                <MenuItem value="competitor">Competitor</MenuItem>
                                                <MenuItem value="not_competitor">Not competitor</MenuItem>
                                            </Select>
                                        </FormControl>
                                    }
                                />
                                <CardContent>
                                    <Stack spacing={1}>
                                        <Typography variant="body2" color="text.secondary">
                                            URL: {row.url}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Keyword: {row.keyword}
                                        </Typography>
                                        {row.products && row.products.length > 0 ? (
                                            <>
                                                <Typography variant="body2" color="text.secondary">
                                                    Services / Products:
                                                </Typography>
                                                <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 1 }}>
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <Box
                                                            sx={{
                                                                width: 12,
                                                                height: 12,
                                                                border: 1,
                                                                borderColor: "grey.400",
                                                                borderRadius: "50%",
                                                                mr: 0.5,
                                                            }}
                                                        />
                                                        <Typography variant="caption">Not Processed</Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <Box
                                                            sx={{
                                                                width: 12,
                                                                height: 12,
                                                                border: 1,
                                                                borderColor: "success.main",
                                                                borderRadius: "50%",
                                                                mr: 0.5,
                                                            }}
                                                        />
                                                        <Typography variant="caption">Manual</Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <Box
                                                            sx={{
                                                                width: 12,
                                                                height: 12,
                                                                border: 1,
                                                                borderColor: "primary.main",
                                                                borderRadius: "50%",
                                                                mr: 0.5,
                                                            }}
                                                        />
                                                        <Typography variant="caption">AI</Typography>
                                                    </Box>
                                                </Stack>
                                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                                    {row.products.map((prod, index) => {
                                                        let borderColor = "grey.400"
                                                        let textColor = "grey.600"
                                                        if (prod.analysisType === "manual") {
                                                            borderColor = "success.main"
                                                            textColor = "success.main"
                                                        } else if (prod.analysisType === "ai") {
                                                            borderColor = "primary.main"
                                                            textColor = "primary.main"
                                                        }
                                                        return (
                                                            <Box
                                                                key={prod.title || index}
                                                                sx={{
                                                                    border: 1,
                                                                    borderColor: borderColor,
                                                                    borderRadius: 1,
                                                                    px: 1,
                                                                    py: 0.5,
                                                                    mb: 0.5,
                                                                    backgroundColor: "transparent",
                                                                    color: textColor,
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                <Typography variant="caption">{prod.title}</Typography>
                                                            </Box>
                                                        )
                                                    })}
                                                </Stack>
                                            </>
                                        ) : (
                                            <>
                                                <Typography variant="body2" color="text.secondary">
                                                    Services / Products:
                                                </Typography>
                                                <Alert severity="warning" sx={{ mt: 2 }}>
                                                    Services / Products not filled
                                                </Alert>
                                            </>
                                        )}
                                    </Stack>
                                </CardContent>
                                <CardActions sx={{ justifyContent: "flex-end" }}>
                                    <IconButton onClick={() => handleOpenServicesDialog(row)} color="info">
                                        <ListAltIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleViewCompetitor(row.uuid)} color="success">
                                        <RemoveRedEyeIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleEditCompetitor(row.uuid)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenDeleteDialog(row)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "50vh",
                    }}
                >
                    {rows.length > 0 ? <NoProcessedCompetitorsCard /> : <NoCompetitorsFoundCard />}
                </Box>
            )}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to remove the competitor -{" "}
                        {competitorToDelete?.domain ? `"${competitorToDelete.domain}"` : ""}?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            {openServicesDialog && editingCompetitor && (
                <CompetitorServicesEditor
                    open={openServicesDialog}
                    onClose={handleCloseServicesDialog}
                    competitor={editingCompetitor}
                    generalServices={generalServices}
                    onSave={handleSaveServices}
                />
            )}
        </Box>
    )
}

export default CompetitorsPage
