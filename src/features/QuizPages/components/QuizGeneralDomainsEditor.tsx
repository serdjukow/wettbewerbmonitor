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

const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/

const isValidDomain = (domain: string): boolean => {
    return domainRegex.test(domain)
}

const getDomainHelperText = (domain: string): string => (domain.length > 0 && !isValidDomain(domain) ? "Invalid domain format" : "")

const QuizGeneralDomainsEditor: React.FC<QuizGeneralDomainsEditorProps> = ({ generalDomains, onDomainsChange }) => {
    const [domains, setDomains] = useState<string[]>(generalDomains)
    const [newDomain, setNewDomain] = useState("")

    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [editDomainValue, setEditDomainValue] = useState("")
    const [editDomainIndex, setEditDomainIndex] = useState<number | null>(null)

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [deleteDomainIndex, setDeleteDomainIndex] = useState<number | null>(null)

    useEffect(() => {
        setDomains(generalDomains)
    }, [generalDomains])

    const handleAddDomain = () => {
        const trimmed = newDomain.trim()
        if (!trimmed) return
        if (!isValidDomain(trimmed)) {
            toast.error("Invalid domain format")
            return
        }
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
        if (!isValidDomain(trimmed)) {
            toast.error("Invalid domain format")
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
                    error={newDomain.trim().length > 0 && !isValidDomain(newDomain.trim())}
                    helperText={getDomainHelperText(newDomain.trim())}
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
                        error={editDomainValue.trim().length > 0 && !isValidDomain(editDomainValue.trim())}
                        helperText={getDomainHelperText(editDomainValue.trim())}
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
                    <Button onClick={handleSaveEdit} startIcon={<SaveIcon />} color="primary" variant="contained">
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

export default QuizGeneralDomainsEditor
