"use client"

export const dynamic = "force-dynamic"

import React, { useEffect, useState, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAppStore } from "@/src/store/appStore"
import { toast } from "react-toastify"
import {
    Box,
    Button,
    Paper,
    Stack,
    Typography,
} from "@mui/material"
import NoCompetitorsFoundCard from "@/src/components/NoCompetitorsFoundCard"
import { type Competitor, type GeneralService } from "@/src/utils/types"
import CompetitorServicesEditor from "@/src/components/CompetitorServicesEditor"
import DeleteDialog from "../components/DeleteDialog"
import CompetitorTabs from "../components/CompetinorTabs"
import CompetitorCard from "@/src/components/CompetitorCard"

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

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTab(newValue as TabValue)
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

    const handleConfirmDelete = async () => {
        if (competitorToDelete) {
            await handleDeleteCompetitor(competitorToDelete.uuid)
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

    return (
        <Box sx={{ p: 2 }}>
            <Paper sx={{ width: "100%", mb: 3, p: 2 }}>
                <Stack direction="row" spacing={2} justifyContent="flex-start">
                    <Button sx={{ color: "white" }} onClick={handleCreateCompetitor} variant="contained" color="success">
                        Add new competitor
                    </Button>
                </Stack>
            </Paper>
            <CompetitorTabs value={tab} onChange={handleTabChange} counts={counts} />
            {filteredRows.length > 0 ? (
                <Box>
                    {filteredRows.map((row) => (
                        <CompetitorCard
                            key={row.uuid}
                            row={row}
                            handleStatusChange={handleStatusChange}
                            handleOpenServicesDialog={handleOpenServicesDialog}
                            handleViewCompetitor={handleViewCompetitor}
                            handleEditCompetitor={handleEditCompetitor}
                            handleOpenDeleteDialog={handleOpenDeleteDialog}
                        />
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
            <DeleteDialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} onConfirm={handleConfirmDelete} />
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
