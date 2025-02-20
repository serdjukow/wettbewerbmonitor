"use client"

import React, { useState, useEffect } from "react"
import { Box, TextField, Button, Chip, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { DeleteForever as DeleteForeverIcon, Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material"
import { useAppStore } from "@/src/store/appStore"
import { toast } from "react-toastify"

const GeneralKeyWordsEditor = () => {
    const { selectedCompany, updateCompany } = useAppStore()
    const [keywords, setKeywords] = useState<string[]>([])
    const [newKeyword, setNewKeyword] = useState("")

    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [editKeywordValue, setEditKeywordValue] = useState("")
    const [editKeywordIndex, setEditKeywordIndex] = useState<number | null>(null)

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [deleteKeywordIndex, setDeleteKeywordIndex] = useState<number | null>(null)

    useEffect(() => {
        if (selectedCompany) {
            setKeywords(selectedCompany.generalKeywords || [])
        }
    }, [selectedCompany])

    const handleAddKeyword = async () => {
        const trimmed = newKeyword.trim()
        if (!trimmed) return
        if (keywords.includes(trimmed)) {
            toast.error("Keyword already exists")
            return
        }
        const updatedKeywords = [...keywords, trimmed]
        setKeywords(updatedKeywords)
        setNewKeyword("")
        if (selectedCompany?.uuid) {
            await updateCompany(selectedCompany.uuid, { generalKeywords: updatedKeywords })
            toast.success("Keyword added")
        }
    }

    const handleOpenEditDialog = (index: number) => {
        setEditKeywordIndex(index)
        setEditKeywordValue(keywords[index])
        setOpenEditDialog(true)
    }

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false)
        setEditKeywordValue("")
        setEditKeywordIndex(null)
    }

    const handleSaveEdit = async () => {
        if (editKeywordIndex === null) return
        const trimmed = editKeywordValue.trim()
        if (!trimmed) {
            toast.error("Keyword cannot be empty")
            return
        }
        const updatedKeywords = [...keywords]
        updatedKeywords[editKeywordIndex] = trimmed
        setKeywords(updatedKeywords)
        setOpenEditDialog(false)
        setEditKeywordValue("")
        setEditKeywordIndex(null)
        if (selectedCompany?.uuid) {
            await updateCompany(selectedCompany.uuid, { generalKeywords: updatedKeywords })
            toast.success("Keyword updated")
        }
    }

    const handleOpenDeleteDialog = (index: number) => {
        setDeleteKeywordIndex(index)
        setOpenDeleteDialog(true)
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false)
        setDeleteKeywordIndex(null)
    }

    const handleConfirmDelete = async () => {
        if (deleteKeywordIndex === null) return
        const updatedKeywords = keywords.filter((_, i) => i !== deleteKeywordIndex)
        setKeywords(updatedKeywords)
        setOpenDeleteDialog(false)
        setDeleteKeywordIndex(null)
        if (selectedCompany?.uuid) {
            await updateCompany(selectedCompany.uuid, { generalKeywords: updatedKeywords })
            toast.success("Keyword deleted")
        }
    }

    return (
        <Paper sx={{ p: 2, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                General KeyWords
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField label="New Keyword" value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} fullWidth />
                <Button variant="contained" onClick={handleAddKeyword}>
                    Add
                </Button>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {keywords.map((kw, index) => (
                    <Chip
                        key={index}
                        label={kw}
                        color="primary"
                        sx={{ borderRadius: "16px", padding: "4px 8px", cursor: "pointer" }}
                        onClick={() => handleOpenEditDialog(index)}
                        onDelete={() => handleOpenDeleteDialog(index)}
                        deleteIcon={<DeleteForeverIcon />}
                    />
                ))}
            </Box>

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Edit Keyword</DialogTitle>
                <DialogContent>
                    <TextField label="Keyword" value={editKeywordValue} onChange={(e) => setEditKeywordValue(e.target.value)} fullWidth sx={{ mt: 1 }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog} startIcon={<CancelIcon />} color="error">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveEdit} startIcon={<SaveIcon />} color="primary" variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this keyword?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    )
}

export default GeneralKeyWordsEditor
