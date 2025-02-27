"use client"

import React, { useState, useEffect } from "react"
import { Box, TextField, Button, Chip, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { DeleteForever as DeleteForeverIcon, Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material"
import DeleteDialog from "../../../components/DeleteDialog"
import { toast } from "react-toastify"

interface QuizGeneralKeyWordsEditorProps {
    generalKeywords: string[]
    onKeywordsChange: (keywords: string[]) => void
}

const QuizGeneralKeyWordsEditor: React.FC<QuizGeneralKeyWordsEditorProps> = ({ generalKeywords, onKeywordsChange }) => {
    const [keywords, setKeywords] = useState<string[]>(generalKeywords)
    const [newKeyword, setNewKeyword] = useState("")

    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [editKeywordValue, setEditKeywordValue] = useState("")
    const [editKeywordIndex, setEditKeywordIndex] = useState<number | null>(null)

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [deleteKeywordIndex, setDeleteKeywordIndex] = useState<number | null>(null)

    useEffect(() => {
        setKeywords(generalKeywords)
    }, [generalKeywords])

    const handleAddKeyword = () => {
        const trimmed = newKeyword.trim()
        if (!trimmed) return
        if (trimmed.trim().length < 3) {
            toast.error("Keyword must be at least 3 characters long")
            return
        }
        if (keywords.includes(trimmed)) {
            toast.error("Keyword already exists")
            return
        }
        const updatedKeywords = [...keywords, trimmed]
        setKeywords(updatedKeywords)
        setNewKeyword("")
        onKeywordsChange(updatedKeywords)
        toast.success("Keyword added")
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

    const handleSaveEdit = () => {
        if (editKeywordIndex === null) return
        const trimmed = editKeywordValue.trim()
        if (!trimmed) {
            toast.error("Keyword cannot be empty")
            return
        }
        if (trimmed.trim().length < 3) {
            toast.error("Keyword must be at least 3 characters long")
            return
        }
        const updatedKeywords = [...keywords]
        updatedKeywords[editKeywordIndex] = trimmed
        setKeywords(updatedKeywords)
        setOpenEditDialog(false)
        setEditKeywordValue("")
        setEditKeywordIndex(null)
        onKeywordsChange(updatedKeywords)
        toast.success("Keyword updated")
    }

    const handleOpenDeleteDialog = (index: number) => {
        setDeleteKeywordIndex(index)
        setOpenDeleteDialog(true)
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false)
        setDeleteKeywordIndex(null)
    }

    const handleConfirmDelete = () => {
        if (deleteKeywordIndex === null) return
        const updatedKeywords = keywords.filter((_, i) => i !== deleteKeywordIndex)
        setKeywords(updatedKeywords)
        setOpenDeleteDialog(false)
        setDeleteKeywordIndex(null)
        onKeywordsChange(updatedKeywords)
        toast.success("Keyword deleted")
    }

    return (
        <>
            <Typography variant="h6" gutterBottom>
                What kind of companies should we look for with offers?
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                    label="New Keyword"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    fullWidth
                    error={newKeyword.length > 0 && newKeyword.length < 3}
                    helperText={newKeyword.length > 0 && newKeyword.length < 3 ? "Minimum 3 characters required" : ""}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddKeyword()
                        }
                    }}
                />
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
                    <TextField
                        label="Keyword"
                        value={editKeywordValue}
                        onChange={(e) => setEditKeywordValue(e.target.value)}
                        error={editKeywordValue.length > 0 && editKeywordValue.length < 3}
                        helperText={editKeywordValue.length > 0 && editKeywordValue.length < 3 ? "Minimum 3 characters required" : ""}
                        fullWidth
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleSaveEdit}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault()
                                handleSaveEdit()
                            }
                        }}
                        startIcon={<SaveIcon />}
                        color="primary"
                        variant="contained"
                    >
                        Save
                    </Button>
                    <Button onClick={handleCloseEditDialog} startIcon={<CancelIcon />} color="error" variant="contained">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <DeleteDialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} onConfirm={handleConfirmDelete} />
        </>
    )
}

export default QuizGeneralKeyWordsEditor
