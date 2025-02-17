"use client"

import React, { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAppStore } from "@/src/store/appStore"

import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, IconButton, Stack, Box } from "@mui/material"
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material"
import NoCompetitorsFoundCard from "@/src/components/NoCompetitorsFoundCard"

import { type Competitor } from "@/src/utils/types"

interface Column {
    id: "domain" | "name"
    label: string
    minWidth?: number
    maxWidth?: number
    align?: "right"
}

const columns: readonly Column[] = [
    { id: "domain", label: "Domain" },
    { id: "name", label: "Name" },
]

function createData(uuid: string, domain: string, name: string): Competitor {
    return { uuid, domain, name }
}

const CompetitorsPage = () => {
    const router = useRouter()
    const pathname = usePathname()
    const { selectedCompany, updateCompany } = useAppStore()

    const [rows, setRows] = useState<Competitor[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(100)

    useEffect(() => {
        if (selectedCompany?.seo?.competitors) {
            setRows(selectedCompany.seo.competitors.map((item) => createData(item.uuid || "", item.domain || "", item.name || "")))
        }
    }, [selectedCompany])

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
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
            setRows(updatedCompetitors || [])
        } catch (error) {
            console.error("Ошибка при удалении конкурента:", error)
        }
    }

    const handleCreateCompetitor = () => {
        router.push(`${pathname}/competitor-create`)
    }

    return (
        <Box>
            <Paper sx={{ width: "100%", overflow: "hidden", marginBottom: 3 }}>
                <Stack direction="row" spacing={2} sx={{ padding: 2, justifyContent: "flex-start" }}>
                    <Button onClick={handleCreateCompetitor} variant="contained" color="success">
                        Add new competitor
                    </Button>
                </Stack>
            </Paper>
            {!!rows.length ? (
                <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
                    <TableContainer sx={{ maxHeight: "75vh" }}>
                        <Table stickyHeader aria-label="competitor table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{
                                                minWidth: column.minWidth,
                                                maxWidth: column.maxWidth,
                                            }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                    <TableCell sx={{ width: "140px" }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                    <TableRow key={row.uuid} hover role="checkbox" tabIndex={-1}>
                                        {columns.map((column) => {
                                            const value = row[column.id]
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {value}
                                                </TableCell>
                                            )
                                        })}
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <IconButton
                                                    data-uuid={row.uuid}
                                                    onClick={(e) => {
                                                        const uuid = e.currentTarget.dataset.uuid
                                                        if (uuid) handleEditCompetitor(uuid)
                                                    }}
                                                    color="success"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    data-uuid={row.uuid}
                                                    onClick={(e) => {
                                                        const uuid = e.currentTarget.dataset.uuid
                                                        if (uuid) handleDeleteCompetitor(uuid)
                                                    }}
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            ) : (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "75vh" }}>
                    <NoCompetitorsFoundCard />
                </Box>
            )}
        </Box>
    )
}

export default CompetitorsPage
