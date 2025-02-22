"use client"

import React, { useState, useEffect } from "react"
import { useAppStore } from "@/src/store/appStore"
import { Box, Container, Chip, Typography, Divider, Paper } from "@mui/material"
import NoCompetitorsFoundCard from "@/src/components/NoCompetitorsFoundCard"
import CustomNoRowsOverlay from "@/src/components/CustomNoRowsOverlay"
import { DataGrid, GridColDef, GridSortModel, GridPaginationModel } from "@mui/x-data-grid"
import { Competitor } from "@/src/utils/types"
import RemainingCredits from "@/src/components/RemainingCredits"
import { type GeneralService } from "@/src/utils/types"

interface RowData {
    id: string
    domain: string
    name: string
    keyword: string
    services: GeneralService[]
}

type Order = "asc" | "desc"
type OrderByKey = "domain" | "name" | "keyword" | "services"

const createData = (id: string, domain: string, keyword: string, name: string, services: GeneralService[]): RowData => ({
    id,
    domain,
    name,
    keyword,
    services,
})

const DashboardPage = () => {
    const { selectedCompany } = useAppStore()
    const [rows, setRows] = useState<RowData[]>([])
    const [order, setOrder] = useState<Order>("asc")
    const [orderBy, setOrderBy] = useState<OrderByKey>("domain")
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(25)

    useEffect(() => {
        if (selectedCompany?.seo?.competitors) {
            setRows(
                (selectedCompany.seo.competitors as Competitor[]).map((item) =>
                    createData(item.uuid || "-", item.domain || "-", item.keyword || "-", item.name || "-", item.products || [])
                )
            )
        }
    }, [selectedCompany])

    const columns: GridColDef[] = [
        {
            field: "domain",
            headerName: "Website",
            flex: 1,
        },
        {
            field: "name",
            headerName: "Company Name",
            flex: 1,
        },
        {
            field: "keyword",
            headerName: "Keyword",
            flex: 1,
        },
        {
            field: "services",
            headerName: "Services",
            flex: 1,
            sortable: false,
            renderCell: (params) => {
                const services = params.value as GeneralService[]
                return (
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {services.map((service, index) => {
                            let chipColor: "default" | "primary" | "success" = "default"
                            if (service.analysisType === "manual") {
                                chipColor = "primary"
                            } else if (service.analysisType === "ai") {
                                chipColor = "success"
                            } else if (service.analysisType === "") {
                                chipColor = "default"
                            }
                            return <Chip key={index} label={service.title || service.name || "Unknown"} color={chipColor} size="small" />
                        })}
                    </Box>
                )
            },
        },
    ]

    const sortModel: GridSortModel = [
        {
            field: orderBy,
            sort: order,
        },
    ]

    const handlePaginationModelChange = (model: GridPaginationModel) => {
        setPage(model.page)
        setRowsPerPage(model.pageSize)
    }

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 3 }}>
                {selectedCompany && (
                    <Paper elevation={3} sx={{ p: 3, display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
                        <Typography variant="h4" component="h1">
                            {selectedCompany.name || "Selected Company"}
                        </Typography>
                        {selectedCompany.website && (
                            <Typography variant="subtitle1" color="text.secondary">
                                {selectedCompany.website}
                            </Typography>
                        )}
                        <Box sx={{ mt: 2 }}>
                            Sistrix Credits:
                            <RemainingCredits />
                        </Box>
                    </Paper>
                )}
            </Box>

            {selectedCompany?.seo?.competitors?.length ? (
                <>
                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h5" component="h2">
                            Tracked Competitors
                        </Typography>
                    </Box>
                    <Box sx={{ height: "60vh", width: "100%" }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pagination
                            paginationModel={{ page: page, pageSize: rowsPerPage }}
                            onPaginationModelChange={handlePaginationModelChange}
                            sortModel={sortModel}
                            onSortModelChange={(model) => {
                                if (model.length) {
                                    const field = model[0].field
                                    if (field === "domain" || field === "name" || field === "keyword" || field === "services") {
                                        setOrderBy(field)
                                        setOrder(model[0].sort as Order)
                                    }
                                }
                            }}
                            pageSizeOptions={[10, 25, 50, 100]}
                            disableRowSelectionOnClick
                            slots={{ noRowsOverlay: CustomNoRowsOverlay }}
                        />
                    </Box>
                </>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <NoCompetitorsFoundCard />
                </Box>
            )}
        </Container>
    )
}

export default DashboardPage
