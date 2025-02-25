"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
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
    TextField,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { type Competitor, type GeneralService } from "@/src/utils/types"
import NoDataMessage from "@/src/components/NoDataMessage"

interface CompetitorServicesEditorProps {
    open: boolean
    onClose: () => void
    competitor: Competitor | null
    generalServices: GeneralService[]
    onSave: (selectedServices: GeneralService[]) => void
}

const CompetitorServicesEditor: React.FC<CompetitorServicesEditorProps> = ({ open, onClose, competitor, generalServices, onSave }) => {
    const [selectedServices, setSelectedServices] = useState<GeneralService[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        if (competitor) {
            setSelectedServices((competitor.products as GeneralService[]) || [])
        } else {
            setSelectedServices([])
        }
    }, [competitor])

    const filteredServices = useMemo(() => {
        return generalServices
            .filter((service) => service.title!.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => a.title!.localeCompare(b.title!))
    }, [generalServices, searchTerm])

    const handleToggleService = (service: GeneralService) => {
        const isSelected = selectedServices.some((s) => s.title === service.title)
        if (isSelected) {
            setSelectedServices((prev) => prev.filter((s) => s.title !== service.title))
        } else {
            setSelectedServices((prev) => [...prev, { ...service, analysisType: "" }])
        }
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
                        sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        label="Search services"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                    />

                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Select</TableCell>
                                    <TableCell>Service</TableCell>
                                    <TableCell align="center">Analysis Method</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredServices.length ? (
                                    filteredServices.map((service) => {
                                        const isSelected = selectedServices.some((s) => s.title === service.title)
                                        return (
                                            <TableRow key={service.title}>
                                                <TableCell align="center">
                                                    <Checkbox
                                                        size="small"
                                                        checked={isSelected}
                                                        onChange={() => handleToggleService(service)}
                                                    />
                                                </TableCell>
                                                <TableCell>{service.title}</TableCell>
                                                <TableCell align="center">
                                                    {isSelected && (
                                                        <Select
                                                            size="small"
                                                            value={
                                                                selectedServices.find((s) => s.title === service.title)?.analysisType || ""
                                                            }
                                                            onChange={(e) => {
                                                                setSelectedServices((prev) =>
                                                                    prev.map((s) =>
                                                                        s.title === service.title
                                                                            ? {
                                                                                  ...s,
                                                                                  analysisType: e.target.value as "" | "manual" | "ai",
                                                                              }
                                                                            : s
                                                                    )
                                                                )
                                                            }}
                                                            displayEmpty
                                                            sx={{ minWidth: 120 }}
                                                        >
                                                            <MenuItem value="">Not Processed</MenuItem>
                                                            <MenuItem value="manual">Manual</MenuItem>
                                                            <MenuItem value="ai">AI</MenuItem>
                                                        </Select>
                                                    )}
                                                </TableCell>                    
                                            </TableRow>
                                        )
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            <NoDataMessage />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog> 
        </>
    )
}

export default CompetitorServicesEditor
