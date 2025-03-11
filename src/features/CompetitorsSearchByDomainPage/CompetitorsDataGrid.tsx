"use client"
import React, { useMemo } from "react"
import { Box, Alert } from "@mui/material"
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid"
import CustomOverlay from "@/src/components/CustomOverlay"
import { type Competitor } from "@/src/utils/types"

interface CompetitorsDataGridProps {
    competitors: Competitor[]
    selected: string[]
    onRowSelectionModelChange: (newSelection: string[]) => void
    page: number
    rowsPerPage: number
    onPaginationModelChange: (model: { page: number; pageSize: number }) => void
    orderBy: "match" | "domain"
    order: "asc" | "desc"
    onSortModelChange: (model: GridSortModel) => void
    isLoading: boolean
    isError: boolean
    error?: Error | null
}

const CompetitorsDataGrid: React.FC<CompetitorsDataGridProps> = ({
    competitors,
    selected,
    onRowSelectionModelChange,
    page,
    rowsPerPage,
    onPaginationModelChange,
    orderBy,
    order,
    onSortModelChange,
    isLoading,
    isError,
    error,
}) => {
    const gridRows = useMemo(() => {
        return competitors.map((comp) => ({
            id: comp.uuid,
            domain: comp.domain,
            match: comp.match ?? 0,
        }))
    }, [competitors])

    const columns: GridColDef[] = useMemo(
        () => [
            { field: "domain", headerName: "Domain", flex: 1 },
            { field: "match", headerName: "Match", flex: 1 },
        ],
        []
    )

    const sortModel: GridSortModel = useMemo(
        () => [
            {
                field: orderBy,
                sort: order,
            },
        ],
        [orderBy, order]
    )

    return (
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
                    paginationModel={{ page, pageSize: rowsPerPage }}
                    onPaginationModelChange={onPaginationModelChange}
                    sortModel={sortModel}
                    onSortModelChange={onSortModelChange}
                    rowSelectionModel={selected}
                    onRowSelectionModelChange={(newSelection) => onRowSelectionModelChange(newSelection as string[])}
                    slots={{ noRowsOverlay: () => <CustomOverlay data={null} /> }}
                />
            )}
        </Box>
    )
}

export default CompetitorsDataGrid
