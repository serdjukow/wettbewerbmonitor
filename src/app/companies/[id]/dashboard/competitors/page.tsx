"use client"

import React, { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAppStore } from "@/src/store/appStore"
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
    TextField,
    Typography,
    Alert,
} from "@mui/material"

import {
    Close as CloseIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    RemoveRedEye as RemoveRedEyeIcon,
    ListAlt as ListAltIcon,
} from "@mui/icons-material"
import NoCompetitorsFoundCard from "@/src/components/NoCompetitorsFoundCard"
import { type Competitor } from "@/src/utils/types"

type ExtendedCompetitor = Competitor & { competitorName?: string; keyword?: string }

type TabValue = "not_checked" | "competitor" | "not_competitor" | "products_not_selected"

function createData(
    uuid: string,
    domain?: string,
    url?: string,
    keyword?: string,
    name?: string,
    status: "not_checked" | "competitor" | "not_competitor" = "not_checked",
    products: string[] = []
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

    const [openProductsDialog, setOpenProductsDialog] = useState(false)
    const [editingCompetitor, setEditingCompetitor] = useState<Competitor | null>(null)
    const [productsList, setProductsList] = useState<string[]>([])
    const [newProduct, setNewProduct] = useState("")

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [competitorToDelete, setCompetitorToDelete] = useState<Competitor | null>(null)

    useEffect(() => {
        if (selectedCompany?.seo?.competitorsByKeyword) {
            setRows(
                (selectedCompany.seo.competitorsByKeyword as ExtendedCompetitor[]).map((item) =>
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

    const filteredRows = rows.filter((row) => {
        if (tab === "not_checked") return row.status === "not_checked"
        if (tab === "competitor") return row.status === "competitor" && row.products && row.products.length > 0
        if (tab === "not_competitor") return row.status === "not_competitor"
        if (tab === "products_not_selected") return row.status === "competitor" && row.products.length === 0

        return true
    })

    const handleStatusChange = async (uuid: string, newStatus: "not_checked" | "competitor" | "not_competitor") => {
        const updated = rows.map((row) => (row.uuid === uuid ? { ...row, status: newStatus } : row))
        setRows(updated)
        if (selectedCompany?.uuid) {
            try {
                await updateCompany(selectedCompany.uuid, {
                    seo: { competitorsByKeyword: updated },
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
            const updatedCompetitors = selectedCompany?.seo?.competitorsByKeyword?.filter((c) => c.uuid !== uuid)
            await updateCompany(selectedCompany.uuid, {
                seo: { competitorsByKeyword: updatedCompetitors },
            })
            setRows(updatedCompetitors || [])
        } catch (error) {
            console.error("Error when deleting a competitor:", error)
        }
    }

    const handleCreateCompetitor = () => {
        router.push(`${pathname}/competitor-create`)
    }

    const handleOpenProductsDialog = (competitor: Competitor) => {
        setEditingCompetitor(competitor)
        setProductsList(competitor.products || [])
        setNewProduct("")
        setOpenProductsDialog(true)
    }

    const handleCloseProductsDialog = () => {
        setOpenProductsDialog(false)
        setEditingCompetitor(null)
        setProductsList([])
        setNewProduct("")
    }

    const handleAddNewProduct = () => {
        const trimmed = newProduct.trim()
        if (trimmed && !productsList.includes(trimmed)) {
            setProductsList([...productsList, trimmed])
            setNewProduct("")
        }
    }

    const handleRemoveProduct = (product: string) => {
        setProductsList(productsList.filter((p) => p !== product))
    }

    const handleSaveProducts = async () => {
        if (editingCompetitor) {
            const updatedRows = rows.map((row) => (row.uuid === editingCompetitor.uuid ? { ...row, products: productsList } : row))
            setRows(updatedRows)
            if (!selectedCompany || !selectedCompany.uuid) {
                console.error("Selected company is null or its uuid is undefined")
                return
            }
            await updateCompany(selectedCompany.uuid, {
                seo: { competitorsByKeyword: updatedRows },
            })
            handleCloseProductsDialog()
        }
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

    return (
        <Box sx={{ p: 2 }}>
            <Paper sx={{ width: "100%", mb: 3, p: 2 }}>
                <Stack direction="row" spacing={2} justifyContent="flex-start">
                    <Button onClick={handleCreateCompetitor} variant="contained" color="success">
                        Add new competitor
                    </Button>
                </Stack>
            </Paper>

            <Paper sx={{ width: "100%", mb: 2, p: 1 }}>
                <Tabs value={tab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="scrollable">
                    <Tab label="Not checked" value="not_checked" />
                    <Tab label="Competitor" value="competitor" />
                    <Tab label="Not competitor" value="not_competitor" />
                    <Tab label="Products not selected" value="products_not_selected" />
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
                                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                                    {row.products.map((prod) => (
                                                        <Box
                                                            key={prod}
                                                            sx={{
                                                                border: "1px solid",
                                                                borderColor: "grey.400",
                                                                borderRadius: 1,
                                                                px: 1,
                                                                py: 0.5,
                                                                mb: 0.5,
                                                            }}
                                                        >
                                                            <Typography variant="caption">{prod}</Typography>
                                                        </Box>
                                                    ))}
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
                                    <IconButton onClick={() => handleViewCompetitor(row.uuid)} color="success">
                                        <RemoveRedEyeIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleEditCompetitor(row.uuid)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenDeleteDialog(row)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenProductsDialog(row)} color="info">
                                        <ListAltIcon />
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
                    {(rows.length > 0) ? <NoProcessedCompetitorsCard /> : <NoCompetitorsFoundCard />}
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

            <Dialog open={openProductsDialog} onClose={handleCloseProductsDialog} fullWidth maxWidth="sm">
                <DialogTitle>
                    Editing products for: {editingCompetitor ? editingCompetitor.domain : ""}
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseProductsDialog}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Already added products:
                    </Typography>
                    {productsList.length > 0 ? (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {productsList.map((product) => (
                                <Box
                                    key={product}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        border: "1px solid",
                                        borderColor: "grey.400",
                                        borderRadius: 1,
                                        px: 1,
                                        py: 0.5,
                                    }}
                                >
                                    <Typography variant="body2">{product}</Typography>
                                    <IconButton size="small" onClick={() => handleRemoveProduct(product)} sx={{ ml: 0.5 }}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No products added.
                        </Typography>
                    )}
                    <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                        <TextField
                            label="New product"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={newProduct}
                            onChange={(e) => setNewProduct(e.target.value)}
                        />
                        <Button variant="contained" onClick={handleAddNewProduct}>
                            Add
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseProductsDialog}>Cancel</Button>
                    <Button onClick={handleSaveProducts} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default CompetitorsPage
