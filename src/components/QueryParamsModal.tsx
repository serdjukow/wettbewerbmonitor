"use client"

import React, { useState, useEffect } from "react"
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material"
import { useAppStore } from "@/src/store/appStore"

interface QueryParamsModalProps {
    open: boolean
    onClose: () => void
}

const QueryParamsModal: React.FC<QueryParamsModalProps> = ({ open, onClose }) => {
    const { queryParams, updateQueryParams } = useAppStore()
    const [limit, setLimit] = useState(queryParams.limit || "10")
    const [country, setCountry] = useState(queryParams.country || "de")
    useEffect(() => {
        if (open) {
            setLimit(queryParams.limit || "10")
            setCountry(queryParams.country || "de")
        }
    }, [open, queryParams])

    const handleSave = () => {
        updateQueryParams({ limit, country })
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Query Parameters</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField label="Limit" type="number" value={limit} onChange={(e) => setLimit(e.target.value)} fullWidth />
                    <FormControl fullWidth>
                        <InputLabel id="country-select-label">Country</InputLabel>
                        <Select labelId="country-select-label" value={country} label="Country" onChange={(e) => setCountry(e.target.value)}>
                            <MenuItem value="de">Germany</MenuItem>
                            <MenuItem value="at">Austria</MenuItem>
                            <MenuItem value="ch">Switzerland</MenuItem>
                            <MenuItem value="nl">Netherlands</MenuItem>
                            <MenuItem value="fr">France</MenuItem>
                            <MenuItem value="it">Italy</MenuItem>
                            <MenuItem value="es">Spain</MenuItem>
                            <MenuItem value="pl">Poland</MenuItem>
                            <MenuItem value="uk">United Kingdom</MenuItem>
                            <MenuItem value="us">USA</MenuItem>
                            <MenuItem value="se">Sweden</MenuItem>
                            <MenuItem value="br">Brazil</MenuItem>
                            <MenuItem value="tr">Turkey</MenuItem>
                            <MenuItem value="be">Belgium</MenuItem>
                            <MenuItem value="ie">Ireland</MenuItem>
                            <MenuItem value="pt">Portugal</MenuItem>
                            <MenuItem value="dk">Denmark</MenuItem>
                            <MenuItem value="no">Norway</MenuItem>
                            <MenuItem value="fi">Finland</MenuItem>
                            <MenuItem value="gr">Greece</MenuItem>
                            <MenuItem value="hu">Hungary</MenuItem>
                            <MenuItem value="sk">Slovakia</MenuItem>
                            <MenuItem value="cz">Czech Republic</MenuItem>
                            <MenuItem value="ca">Canada</MenuItem>
                            <MenuItem value="au">Australia</MenuItem>
                            <MenuItem value="mx">Mexico</MenuItem>
                            <MenuItem value="ru">Russia</MenuItem>
                            <MenuItem value="jp">Japan</MenuItem>
                            <MenuItem value="in">India</MenuItem>
                            <MenuItem value="za">South Africa</MenuItem>
                            <MenuItem value="ro">Romania</MenuItem>
                            <MenuItem value="si">Slovenia</MenuItem>
                            <MenuItem value="hr">Croatia</MenuItem>
                            <MenuItem value="bg">Bulgaria</MenuItem>
                            <MenuItem value="th">Thailand</MenuItem>
                            <MenuItem value="vn">Vietnam</MenuItem>
                            <MenuItem value="id">Indonesia</MenuItem>
                            <MenuItem value="pe">Peru</MenuItem>
                            <MenuItem value="ar">Argentinia</MenuItem>
                            <MenuItem value="co">Colombia</MenuItem>
                            <MenuItem value="cy">Cyprus</MenuItem>
                            <MenuItem value="mt">Malta</MenuItem>
                            <MenuItem value="my">Malaysia</MenuItem>
                            <MenuItem value="ph">Philippines</MenuItem>
                            <MenuItem value="nz">New Zealand</MenuItem>
                            <MenuItem value="ae">United Arab Emirates</MenuItem>
                            <MenuItem value="eg">Egypt</MenuItem>
                            <MenuItem value="cl">Chile</MenuItem>
                            <MenuItem value="pk">Pakistan</MenuItem>
                            <MenuItem value="sg">Singapur</MenuItem>
                            <MenuItem value="ng">Nigeria</MenuItem>
                            <MenuItem value="ve">Venezuela</MenuItem>
                            <MenuItem value="ua">Ukraine</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">
                    Cancel
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default QueryParamsModal
