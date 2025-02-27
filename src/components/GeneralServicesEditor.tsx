"use client"

import React, { useState, useEffect } from "react"
import { Box, TextField, Button, Chip, Typography, Paper, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material"
import { useAppStore } from "@/src/store/appStore"
import { toast } from "react-toastify"
import { type GeneralService } from "@/src/utils/types"
import DeleteDialog from "./DeleteDialog"

const MIN_SERVICE_TITLE_LENGTH = 3
const MIN_SERVICE_DESCRIPTION_LENGTH = 30

const isValidServiceTitle = (value: string): boolean => value.trim().length >= MIN_SERVICE_TITLE_LENGTH

const getServiceTitleHelperText = (value: string): string =>
    value.trim().length > 0 && !isValidServiceTitle(value) ? `Minimum ${MIN_SERVICE_TITLE_LENGTH} characters required` : ""

const isValidServiceDescription = (value: string): boolean => value.trim().length >= MIN_SERVICE_DESCRIPTION_LENGTH

const getServiceDescriptionHelperText = (value: string): string =>
    value.trim().length > 0 && !isValidServiceDescription(value) ? `Minimum ${MIN_SERVICE_DESCRIPTION_LENGTH} characters required` : ""

const GeneralServicesEditor: React.FC = () => {
    const { selectedCompany, updateCompany } = useAppStore()
    const [services, setServices] = useState<GeneralService[]>([])
    const [newServiceTitle, setNewServiceTitle] = useState("")
    const [newServiceDescription, setNewServiceDescription] = useState("")

    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [editIndex, setEditIndex] = useState<number | null>(null)
    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription] = useState("")

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

    useEffect(() => {
        if (selectedCompany) {
            setServices(selectedCompany.generalServices || [])
        }
    }, [selectedCompany])

    const handleAddService = async () => {
        const titleTrimmed = newServiceTitle.trim()
        const descriptionTrimmed = newServiceDescription.trim()
        if (!titleTrimmed) {
            toast.error("Title is required")
            return
        } else if (!descriptionTrimmed) {
            toast.error("Description is required")
            return
        }
        if (!isValidServiceTitle(newServiceTitle)) {
            toast.error(`Title must be at least ${MIN_SERVICE_TITLE_LENGTH} characters long`)
            return
        }
        if (!isValidServiceDescription(newServiceDescription)) {
            toast.error(`Description must be at least ${MIN_SERVICE_DESCRIPTION_LENGTH} characters long`)
            return
        }
        const duplicate = services.some((service) => service.title.toLowerCase() === titleTrimmed.toLowerCase())
        if (duplicate) {
            toast.error("Service with this title already exists")
            return
        }
        const newService: GeneralService = {
            title: titleTrimmed,
            description: descriptionTrimmed,
            analysisType: "not_processed",
        }
        const updatedServices = [...services, newService]
        setServices(updatedServices)
        setNewServiceTitle("")
        setNewServiceDescription("")
        if (selectedCompany?.uuid) {
            await updateCompany(selectedCompany.uuid, { generalServices: updatedServices })
            toast.success("Service added")
        }
    }

    const handleOpenEditDialog = (index: number) => {
        setEditIndex(index)
        setEditTitle(services[index].title)
        setEditDescription(services[index].description || "")
        setOpenEditDialog(true)
    }

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false)
        setEditTitle("")
        setEditDescription("")
        setEditIndex(null)
    }

    const handleSaveEdit = async () => {
        if (editIndex === null) return
        const titleTrimmed = editTitle.trim()
        const descriptionTrimmed = editDescription.trim()
        if (!titleTrimmed) {
            toast.error("Title is required")
            return
        } else if (!descriptionTrimmed) {
            toast.error("Description is required")
            return
        }
        if (!isValidServiceTitle(editTitle)) {
            toast.error(`Title must be at least ${MIN_SERVICE_TITLE_LENGTH} characters long`)
            return
        }
        if (!isValidServiceDescription(editDescription)) {
            toast.error(`Description must be at least ${MIN_SERVICE_DESCRIPTION_LENGTH} characters long`)
            return
        }
        const duplicate = services.some((service, i) => i !== editIndex && service.title.toLowerCase() === titleTrimmed.toLowerCase())
        if (duplicate) {
            toast.error("Service with this title already exists")
            return
        }
        const updatedServices = [...services]
        updatedServices[editIndex] = {
            ...updatedServices[editIndex],
            title: titleTrimmed,
            description: descriptionTrimmed,
        }
        setServices(updatedServices)
        setOpenEditDialog(false)
        setEditTitle("")
        setEditDescription("")
        setEditIndex(null)
        if (selectedCompany?.uuid) {
            await updateCompany(selectedCompany.uuid, { generalServices: updatedServices })
            toast.success("Service updated")
        }
    }

    const handleOpenDeleteDialog = (index: number) => {
        setDeleteIndex(index)
        setOpenDeleteDialog(true)
    }

    const handleConfirmDelete = async () => {
        if (deleteIndex === null) return
        const updatedServices = services.filter((_, i) => i !== deleteIndex)
        setServices(updatedServices)
        setOpenDeleteDialog(false)
        setDeleteIndex(null)
        if (selectedCompany?.uuid) {
            await updateCompany(selectedCompany.uuid, { generalServices: updatedServices })
            toast.success("Service deleted")
        }
    }

    return (
        <Paper sx={{ p: 2, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                General Services/Products
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
                <TextField
                    label="Service Title"
                    value={newServiceTitle}
                    onChange={(e) => setNewServiceTitle(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddService()
                        }
                    }}
                    fullWidth
                    required
                    error={newServiceTitle.trim().length > 0 && !isValidServiceTitle(newServiceTitle)}
                    helperText={getServiceTitleHelperText(newServiceTitle)}
                />
                <TextField
                    label="Service Description"
                    value={newServiceDescription}
                    onChange={(e) => setNewServiceDescription(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddService()
                        }
                    }}
                    fullWidth
                    multiline
                    rows={3}
                    required
                    error={newServiceDescription.trim().length > 0 && !isValidServiceDescription(newServiceDescription)}
                    helperText={getServiceDescriptionHelperText(newServiceDescription)}
                />
                <Button variant="contained" onClick={handleAddService}>
                    Add Service
                </Button>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {services.map((service, index) => (
                    <Tooltip key={index} title={service.description || "Not filled"} arrow>
                        <Chip
                            label={service.title}
                            color="primary"
                            sx={{ borderRadius: "16px", padding: "4px 8px", cursor: "pointer" }}
                            onClick={() => handleOpenEditDialog(index)}
                            onDelete={() => handleOpenDeleteDialog(index)}
                        />
                    </Tooltip>
                ))}
            </Box>

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Edit Service</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Service Title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        fullWidth
                        required
                        sx={{ mb: 2, mt: 1 }}
                        error={editTitle.trim().length > 0 && !isValidServiceTitle(editTitle)}
                        helperText={getServiceTitleHelperText(editTitle)}
                    />
                    <TextField
                        label="Service Description"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        fullWidth
                        multiline
                        required
                        rows={3}
                        error={editDescription.trim().length > 0 && !isValidServiceDescription(editDescription)}
                        helperText={getServiceDescriptionHelperText(editDescription)}
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
            <DeleteDialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} onConfirm={handleConfirmDelete} />
        </Paper>
    )
}

export default GeneralServicesEditor
