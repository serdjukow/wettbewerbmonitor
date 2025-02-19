"use client"

import { useState, useEffect } from "react"
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    IconButton,
    Button,
} from "@mui/material"
import { Delete, Edit, Save } from "@mui/icons-material"
import { useAppStore } from "@/src/store/appStore"
import { v4 as uuidv4 } from "uuid"

const Keywords = () => {
    const { updateCompany, selectedCompany } = useAppStore()
    const [newKeyword, setNewKeyword] = useState("")
    const [tempKeywords, setTempKeywords] = useState<
        { uuid: string; keyword: string }[]
    >([])
    const [editingUuid, setEditingUuid] = useState<string | null>(null)
    const [editedKeyword, setEditedKeyword] = useState("")

    useEffect(() => {
        if (selectedCompany?.seo?.keywords) {
            setTempKeywords(selectedCompany.seo.keywords)
        } else {
            setTempKeywords([])
        }
    }, [selectedCompany])

    const handleAdd = () => {
        if (newKeyword.trim()) {
            setTempKeywords((prev) => [
                ...prev,
                { uuid: uuidv4(), keyword: newKeyword.trim() },
            ])
            setNewKeyword("")
        }
    }

    const handleEdit = (uuid: string, value: string) => {
        setEditingUuid(uuid)
        setEditedKeyword(value)
    }

    const handleSave = (uuid: string) => {
        if (editedKeyword.trim()) {
            setTempKeywords((prev) =>
                prev.map((keyword) =>
                    keyword.uuid === uuid
                        ? { ...keyword, keyword: editedKeyword.trim() }
                        : keyword
                )
            )
        }
        setEditingUuid(null)
    }

    const handleSaveAll = () => {
        if (selectedCompany?.uuid) {
            updateCompany(selectedCompany?.uuid, {
                seo: { keywords: tempKeywords },
            })
        }
    }

    return (
        <Box sx={{ mx: "auto", mt: 4, width: "100%" }}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                                Keyword {tempKeywords.length}
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{ fontWeight: "bold" }}
                            >
                                Aktionen
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Neues Keyword"
                                    value={newKeyword}
                                    onChange={(e) =>
                                        setNewKeyword(e.target.value)
                                    }
                                />
                            </TableCell>
                            <TableCell align="right">
                                <Button
                                    color="success"
                                    variant="contained"
                                    onClick={handleAdd}
                                >
                                    Hinzufügen
                                </Button>
                            </TableCell>
                        </TableRow>
                        {tempKeywords.length > 0 ? (
                            tempKeywords
                                .map(({ uuid, keyword }) => (
                                    <TableRow key={uuid}>
                                        <TableCell sx={{ width: "100%" }}>
                                            {editingUuid === uuid ? (
                                                <TextField
                                                    fullWidth
                                                    value={editedKeyword}
                                                    onChange={(e) =>
                                                        setEditedKeyword(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            ) : (
                                                keyword
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            {editingUuid === uuid ? (
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        handleSave(uuid)
                                                    }
                                                >
                                                    <Save />
                                                </IconButton>
                                            ) : (
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        handleEdit(
                                                            uuid,
                                                            keyword
                                                        )
                                                    }
                                                >
                                                    <Edit />
                                                </IconButton>
                                            )}
                                            <IconButton
                                                color="error"
                                                onClick={() =>
                                                    setTempKeywords((prev) =>
                                                        prev.filter(
                                                            (k) =>
                                                                k.uuid !== uuid
                                                        )
                                                    )
                                                }
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                                .reverse()
                        ) : (
                            <TableRow>
                                <TableCell colSpan={2} align="center">
                                    Noch keine Keywords
                                </TableCell>
                            </TableRow>
                        )}

                        <TableRow>
                            <TableCell colSpan={2} align="center">
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={handleSaveAll}
                                >
                                    Keywords speichern
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default Keywords
