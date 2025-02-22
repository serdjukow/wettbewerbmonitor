"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    Box,
    Button,
    Checkbox,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    TextField,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { type Competitor, type GeneralService } from "@/src/utils/types"

interface CompetitorServicesEditorProps {
    open: boolean
    onClose: () => void
    competitor: Competitor | null
    generalServices: GeneralService[]
    onSave: (selectedServices: GeneralService[]) => void
}

const CompetitorServicesEditor: React.FC<CompetitorServicesEditorProps> = ({ open, onClose, competitor, generalServices, onSave }) => {
    const [selectedServices, setSelectedServices] = useState<GeneralService[]>([])
    const [openAddDialog, setOpenAddDialog] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        if (competitor) {
            setSelectedServices((competitor.products as GeneralService[]) || [])
        } else {
            setSelectedServices([])
        }
    }, [competitor])

    const availableServices = useMemo(() => {
        const selectedTitles = selectedServices.map((s) => s.title).filter(Boolean)
        return generalServices
            .filter((service) => service.title && !selectedTitles.includes(service.title))
            .filter((service) => service.title!.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => a.title!.localeCompare(b.title!))
    }, [generalServices, selectedServices, searchTerm])

    const groupedServices = useMemo(() => {
        return availableServices.reduce<Record<string, GeneralService[]>>((groups, service) => {
            const letter = service.title!.charAt(0).toUpperCase()
            if (!groups[letter]) {
                groups[letter] = []
            }
            groups[letter].push(service)
            return groups
        }, {})
    }, [availableServices])

    const sortedGroupKeys = useMemo(() => {
        return Object.keys(groupedServices).sort()
    }, [groupedServices])

    const handleAddService = (service: GeneralService) => {
        setSelectedServices((prev) => [...prev, { ...service, isCompetitor: false, analysisType: "" }])
    }

    const requestDeleteService = (index: number) => {
        setDeleteIndex(index)
        setDeleteConfirmOpen(true)
    }

    const handleDeleteService = () => {
        if (deleteIndex !== null) {
            setSelectedServices((prev) => prev.filter((_, i) => i !== deleteIndex))
            setDeleteIndex(null)
        }
        setDeleteConfirmOpen(false)
    }

    const handleSave = () => {
        onSave(selectedServices)
        onClose()
    }

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
                <DialogTitle>
                    Assign Services for: {competitor?.domain || ""}
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Edit the selected services. If the competitor does not have any services selected yet, the table will be empty. As
                        you add services, rows will appear where you can edit:
                        <br />
                        – the &quot;Competitor&quot; status (checkbox),
                        <br />
                        – the analysis method (select: Not Processed, Manual, AI),
                        <br />– the service name.
                    </Typography>

                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Service</TableCell>
                                    <TableCell align="center">Competitor</TableCell>
                                    <TableCell align="center">Analysis Method</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedServices.length ? (
                                    selectedServices.map((service, index) => (
                                        <TableRow key={service.title}>
                                            <TableCell>{service.title}</TableCell>
                                            <TableCell align="center">
                                                <Checkbox
                                                    size="small"
                                                    checked={service.isCompetitor || false}
                                                    onChange={(e) => {
                                                        const newServices = [...selectedServices]
                                                        newServices[index] = {
                                                            ...service,
                                                            isCompetitor: e.target.checked,
                                                        }
                                                        setSelectedServices(newServices)
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Select
                                                    size="small"
                                                    value={service.analysisType || ""}
                                                    onChange={(e) => {
                                                        const newServices = [...selectedServices]
                                                        newServices[index] = {
                                                            ...service,
                                                            analysisType: e.target.value as "" | "manual" | "ai",
                                                        }
                                                        setSelectedServices(newServices)
                                                    }}
                                                    displayEmpty
                                                    sx={{ minWidth: 120 }}
                                                >
                                                    <MenuItem value="">Not Processed</MenuItem>
                                                    <MenuItem value="manual">Manual</MenuItem>
                                                    <MenuItem value="ai">AI</MenuItem>
                                                </Select>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button color="error" onClick={() => requestDeleteService(index)}>
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            No services selected.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="outlined" onClick={() => setOpenAddDialog(true)}>
                            Add Service
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Select Service to Add</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        label="Search services"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    {availableServices.length ? (
                        <List>
                            {sortedGroupKeys.map((letter) => (
                                <Box key={letter}>
                                    <Typography variant="subtitle1" sx={{ pl: 2, pt: 1 }}>
                                        {letter}
                                    </Typography>
                                    {groupedServices[letter].map((service) => (
                                        <ListItem key={service.title} disablePadding>
                                            <ListItemButton onClick={() => handleAddService(service)}>
                                                <ListItemText primary={service.title} />
                                                <Box sx={{ marginLeft: "auto", pr: 2 }}>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleAddService(service)
                                                        }}
                                                    >
                                                        Add
                                                    </Button>
                                                </Box>
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </Box>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2">No matching services found or all services have been selected.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent dividers>
                    <Typography>Are you sure you want to delete this service?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteService} variant="contained" color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default CompetitorServicesEditor
