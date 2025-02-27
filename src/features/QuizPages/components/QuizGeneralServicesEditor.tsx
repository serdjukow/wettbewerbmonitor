"use client"

import React, { useState, useEffect } from "react"
import { Box, TextField, Button, Chip, Typography, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material"
import DeleteDialog from "../../../components/DeleteDialog"
import { toast } from "react-toastify"
import { type GeneralService } from "@/src/utils/types"

interface QuizGeneralServicesEditorProps {
    generalServices: GeneralService[]
    onServicesChange: (services: GeneralService[]) => void
}

const QuizGeneralServicesEditor: React.FC<QuizGeneralServicesEditorProps> = ({ generalServices, onServicesChange }) => {
    const [services, setServices] = useState<GeneralService[]>(generalServices)
    const [newServiceTitle, setNewServiceTitle] = useState("")
    const [newServiceDescription, setNewServiceDescription] = useState("")

    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [editIndex, setEditIndex] = useState<number | null>(null)
    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription] = useState("")

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

    // Синхронизируем локальный state с переданным пропсом
    useEffect(() => {
        setServices(generalServices)
    }, [generalServices])

    const handleAddService = () => {
        const titleTrimmed = newServiceTitle.trim()
        const descriptionTrimmed = newServiceDescription.trim()
        if (titleTrimmed.length < 3) {
            toast.error("Title must be at least 3 characters long")
            return
        } else if (descriptionTrimmed.length < 30) {
            toast.error("Description must be at least 30 characters long")
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
        onServicesChange(updatedServices)
        toast.success("Service added")
    }

    const handleEditService = (index: number) => {
        setEditIndex(index)
        setEditTitle(services[index].title)
        setEditDescription(services[index].description || "")
        setOpenEditDialog(true)
    }

    const handleSaveEdit = () => {
        if (editIndex === null) return
        const titleTrimmed = editTitle.trim()
        const descriptionTrimmed = editDescription.trim()
        if (titleTrimmed.length < 3) {
            toast.error("Title must be at least 3 characters long")
            return
        } else if (descriptionTrimmed.length < 30) {
            toast.error("Description must be at least 30 characters long")
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
        setEditIndex(null)
        setEditTitle("")
        setEditDescription("")
        onServicesChange(updatedServices)
        toast.success("Service updated")
    }

    const handleOpenDeleteDialog = (index: number) => {
        setDeleteIndex(index)
        setOpenDeleteDialog(true)
    }

    const handleConfirmDelete = () => {
        if (deleteIndex === null) return
        const updatedServices = services.filter((_, i) => i !== deleteIndex)
        setServices(updatedServices)
        setOpenDeleteDialog(false)
        setDeleteIndex(null)
        onServicesChange(updatedServices)
        toast.success("Service deleted")
    }

    return (
        <>
            <Typography variant="h6" gutterBottom>
                What services do you want to offer to your target group?
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
                    error={newServiceTitle.length > 0 && newServiceTitle.length < 3}
                    helperText={newServiceTitle.length > 0 && newServiceTitle.length < 3 ? "Minimum 3 characters required" : ""}
                    fullWidth
                    required
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
                    error={newServiceDescription.length > 0 && newServiceDescription.length < 30}
                    helperText={newServiceDescription.length > 0 && newServiceDescription.length < 30 ? "Minimum 30 characters required" : ""}
                    fullWidth
                    multiline
                    rows={3}
                    required
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
                            onClick={() => handleEditService(index)}
                            onDelete={() => handleOpenDeleteDialog(index)}
                        />
                    </Tooltip>
                ))}
            </Box>

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Edit Service</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Service Title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        error={editTitle.length > 0 && editTitle.length < 3}
                        helperText={editTitle.length > 0 && editTitle.length < 3 ? "Minimum 3 characters required" : ""}
                        fullWidth
                        required
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <TextField
                        label="Service Description"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        error={editDescription.length > 0 && editDescription.length < 30}
                        helperText={editDescription.length > 0 && editDescription.length < 30 ? "Minimum 30 characters required" : ""}
                        fullWidth
                        multiline
                        required
                        rows={3}
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
                    <Button onClick={() => setOpenEditDialog(false)} startIcon={<CancelIcon />} color="error" variant="contained">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <DeleteDialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} onConfirm={handleConfirmDelete} />
        </>
    )
}

export default QuizGeneralServicesEditor
