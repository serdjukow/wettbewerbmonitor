"use client"

import React, { useState, useEffect } from "react"
import { Box, TextField, Button, Chip, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { DeleteForever as DeleteForeverIcon, Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material"
import DeleteDialog from "../../../components/DeleteDialog"
import { toast } from "react-toastify"

interface QuizGeneralDomainsEditorProps {
    generalDomains: string[]
    onDomainsChange: (domains: string[]) => void
}

const QuizGeneralDomainsEditor: React.FC<QuizGeneralDomainsEditorProps> = ({ generalDomains, onDomainsChange }) => {
    const [domains, setDomains] = useState<string[]>(generalDomains)
    const [newDomain, setNewDomain] = useState("")

    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [editDomainValue, setEditDomainValue] = useState("")
    const [editDomainIndex, setEditDomainIndex] = useState<number | null>(null)

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [deleteDomainIndex, setDeleteDomainIndex] = useState<number | null>(null)

    // Синхронизируем локальный state с переданным пропсом
    useEffect(() => {
        setDomains(generalDomains)
    }, [generalDomains])

    const handleAddDomain = () => {
        const trimmed = newDomain.trim()
        if (!trimmed) return
        if (domains.includes(trimmed)) {
            toast.error("Domain already exists")
            return
        }
        const updatedDomains = [...domains, trimmed]
        setDomains(updatedDomains)
        setNewDomain("")
        onDomainsChange(updatedDomains)
        toast.success("Domain added")
    }

    const handleOpenEditDialog = (index: number) => {
        setEditDomainIndex(index)
        setEditDomainValue(domains[index])
        setOpenEditDialog(true)
    }

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false)
        setEditDomainValue("")
        setEditDomainIndex(null)
    }

    const handleSaveEdit = () => {
        if (editDomainIndex === null) return
        const trimmed = editDomainValue.trim()
        if (!trimmed) {
            toast.error("Domain cannot be empty")
            return
        }
        const updatedDomains = [...domains]
        updatedDomains[editDomainIndex] = trimmed
        setDomains(updatedDomains)
        setOpenEditDialog(false)
        setEditDomainValue("")
        setEditDomainIndex(null)
        onDomainsChange(updatedDomains)
        toast.success("Domain updated")
    }

    const handleOpenDeleteDialog = (index: number) => {
        setDeleteDomainIndex(index)
        setOpenDeleteDialog(true)
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false)
        setDeleteDomainIndex(null)
    }

    const handleConfirmDelete = () => {
        if (deleteDomainIndex === null) return
        const updatedDomains = domains.filter((_, i) => i !== deleteDomainIndex)
        setDomains(updatedDomains)
        setOpenDeleteDialog(false)
        setDeleteDomainIndex(null)
        onDomainsChange(updatedDomains)
        toast.success("Domain deleted")
    }

    return (
        <>
            <Typography variant="h6" gutterBottom>
                General Domains
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                    label="New Domain"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    fullWidth
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddDomain()
                        }
                    }}
                />
                <Button variant="contained" onClick={handleAddDomain}>
                    Add
                </Button>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {domains.map((domain, index) => (
                    <Chip
                        key={index}
                        label={domain}
                        color="primary"
                        sx={{ borderRadius: "16px", padding: "4px 8px", cursor: "pointer" }}
                        onClick={() => handleOpenEditDialog(index)}
                        onDelete={() => handleOpenDeleteDialog(index)}
                        deleteIcon={<DeleteForeverIcon />}
                    />
                ))}
            </Box>

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Edit Domain</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Domain"
                        value={editDomainValue}
                        onChange={(e) => setEditDomainValue(e.target.value)}
                        fullWidth
                        sx={{ mt: 1 }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault()
                                handleSaveEdit()
                            }
                        }}
                    />
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
            <DeleteDialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} onConfirm={handleConfirmDelete} />
        </>
    )
}

export default QuizGeneralDomainsEditor
