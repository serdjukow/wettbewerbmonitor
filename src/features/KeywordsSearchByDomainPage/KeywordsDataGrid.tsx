"use client"
import React from "react"
import { Box, Alert } from "@mui/material"
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid"
import { SistrixDomainsKeywordsResult } from "./KeywordsSearchByDomainPage"

interface KeywordsDataGridProps {
    keywords: SistrixDomainsKeywordsResult[]
    selected: string[]
    onRowSelectionModelChange: (newSelection: string[]) => void
    page: number
    rowsPerPage: number
    onPaginationModelChange: (model: { page: number; pageSize: number }) => void
    orderBy: "position" | "kw"
    order: "asc" | "desc"
    onSortModelChange: (model: GridSortModel) => void
    isLoading: boolean
    isError: boolean
    error?: Error | null
}

const KeywordsDataGrid: React.FC<KeywordsDataGridProps> = ({
    keywords,
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
                />
            )}
        </Box>
    )
}

export default KeywordsDataGrid
