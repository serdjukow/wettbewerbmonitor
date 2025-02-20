"use client"

import React, { useState, useEffect } from "react"
import { Box, TextField, Button, Chip, Typography, Paper, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material"
import { useAppStore } from "@/src/store/appStore"
import { toast } from "react-toastify"

interface Service {
    title: string
    description?: string
}

const GeneralServicesEditor = () => {
    const { selectedCompany, updateCompany } = useAppStore()
    const [services, setServices] = useState<Service[]>([])
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
        if (!titleTrimmed) {
            toast.error("Title is required")
            return
        }
        
        const duplicate = services.some((service) => service.title.toLowerCase() === titleTrimmed.toLowerCase())
        if (duplicate) {
            toast.error("Service with this title already exists")
            return
        }
        const newService: Service = {
            title: titleTrimmed,
            description: newServiceDescription.trim() || "",
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

    const handleEditService = (index: number) => {
        setEditIndex(index)
        setEditTitle(services[index].title)
        setEditDescription(services[index].description || "")
        setOpenEditDialog(true)
    }

    const handleSaveEdit = async () => {
        if (editIndex === null) return
        const titleTrimmed = editTitle.trim()
        if (!titleTrimmed) {
            toast.error("Title is required")
            return
        }
        
        const duplicate = services.some((service, i) => i !== editIndex && service.title.toLowerCase() === titleTrimmed.toLowerCase())
        if (duplicate) {
            toast.error("Service with this title already exists")
            return
        }
        const updatedServices = [...services]
        updatedServices[editIndex] = {
            title: titleTrimmed,
            description: editDescription.trim() || "",
        }
        setServices(updatedServices)
        setOpenEditDialog(false)
        setEditIndex(null)
        setEditTitle("")
        setEditDescription("")
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
                General Services/Produkts
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
                <TextField label="Service Title" value={newServiceTitle} onChange={(e) => setNewServiceTitle(e.target.value)} fullWidth required />
                <TextField
                    label="Service Description"
                    value={newServiceDescription}
                    onChange={(e) => setNewServiceDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Optional description"
                />
                <Button variant="contained" onClick={handleAddService}>
                    Add Service
                </Button>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {services.map((service, index) => (
                    <Tooltip key={index} title={service.description ? service.description : "Not filled"} arrow>
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
                    <TextField label="Service Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} fullWidth required sx={{ mb: 2, mt: 1 }} />
                    <TextField label="Service Description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} fullWidth multiline rows={3} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)} startIcon={<CancelIcon />} color="error">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveEdit} startIcon={<SaveIcon />} color="primary" variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this service?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    )
}

export default GeneralServicesEditor
