"use client"

import React, { useEffect, useState } from "react"
import {
    Box,
    Button,
    Chip,
    Typography,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material"
import { DeleteForever as DeleteForeverIcon } from "@mui/icons-material"
import { useAppStore } from "@/src/store/appStore"
import { toast } from "react-toastify"
import { type TrackedCountry } from "@/src/utils/types"

const countryOptions: TrackedCountry[] = [
    { country: "de", country_name: "Germany" },
    { country: "at", country_name: "Austria" },
    { country: "ch", country_name: "Switzerland" },
    { country: "nl", country_name: "Netherlands" },
    { country: "fr", country_name: "France" },
    { country: "it", country_name: "Italy" },
    { country: "es", country_name: "Spain" },
    { country: "pl", country_name: "Poland" },
    { country: "uk", country_name: "United Kingdom" },
    { country: "us", country_name: "USA" },
    { country: "se", country_name: "Sweden" },
    { country: "br", country_name: "Brazil" },
    { country: "tr", country_name: "Turkey" },
    { country: "be", country_name: "Belgium" },
    { country: "ie", country_name: "Ireland" },
    { country: "pt", country_name: "Portugal" },
    { country: "dk", country_name: "Denmark" },
    { country: "no", country_name: "Norway" },
    { country: "fi", country_name: "Finland" },
    { country: "gr", country_name: "Greece" },
    { country: "hu", country_name: "Hungary" },
    { country: "sk", country_name: "Slovakia" },
    { country: "cz", country_name: "Czech Republic" },
    { country: "ca", country_name: "Canada" },
    { country: "au", country_name: "Australia" },
    { country: "mx", country_name: "Mexico" },
    { country: "ru", country_name: "Russia" },
    { country: "jp", country_name: "Japan" },
    { country: "in", country_name: "India" },
    { country: "za", country_name: "South Africa" },
    { country: "ro", country_name: "Romania" },
    { country: "si", country_name: "Slovenia" },
    { country: "hr", country_name: "Croatia" },
    { country: "bg", country_name: "Bulgaria" },
    { country: "th", country_name: "Thailand" },
    { country: "vn", country_name: "Vietnam" },
    { country: "id", country_name: "Indonesia" },
    { country: "pe", country_name: "Peru" },
    { country: "ar", country_name: "Argentina" },
    { country: "co", country_name: "Colombia" },
    { country: "cy", country_name: "Cyprus" },
    { country: "mt", country_name: "Malta" },
    { country: "my", country_name: "Malaysia" },
    { country: "ph", country_name: "Philippines" },
    { country: "nz", country_name: "New Zealand" },
    { country: "ae", country_name: "United Arab Emirates" },
    { country: "eg", country_name: "Egypt" },
    { country: "cl", country_name: "Chile" },
    { country: "pk", country_name: "Pakistan" },
    { country: "sg", country_name: "Singapore" },
    { country: "ng", country_name: "Nigeria" },
    { country: "ve", country_name: "Venezuela" },
    { country: "ua", country_name: "Ukraine" },
]

const TrackedCountriesEditor = () => {
    const { selectedCompany, updateCompany } = useAppStore()
    const [trackedCountries, setTrackedCountries] = useState<TrackedCountry[]>([])
    const [newCountry, setNewCountry] = useState<string>("")

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteCountryIndex, setDeleteCountryIndex] = useState<number | null>(null)

    useEffect(() => {
        const fetchDefaultCountry = async () => {
            try {
                const response = await fetch("https://ipinfo.io/json/")
                const data = await response.json()

                if (data && data.country) {
                    const detectedCountry: TrackedCountry = {
                        country: data.country.toLowerCase(),
                        country_name: data.country_name,
                    }

                    if (!trackedCountries.some((c) => c.country === detectedCountry.country)) {
                        setTrackedCountries([detectedCountry])
                    }
                }
            } catch (error) {
                console.error("Error detecting country:", error)
            }
        }

        if (trackedCountries.length === 0) {
            fetchDefaultCountry()
        }
    }, [trackedCountries])

    useEffect(() => {
        if (selectedCompany && selectedCompany.trackedCountries) {
            setTrackedCountries(selectedCompany.trackedCountries)
        }
    }, [selectedCompany])

    const handleAddCountry = () => {
        const selectedCountry = countryOptions.find((c) => c.country === newCountry)

        if (!selectedCountry) {
            toast.error("Please select a valid country")
            return
        }

        if (trackedCountries.some((c) => c.country === selectedCountry.country)) {
            toast.error("Country already tracked")
            return
        }

        if (trackedCountries.length >= 3) {
            toast.error("Maximum of 3 countries allowed")
            return
        }

        setTrackedCountries([...trackedCountries, selectedCountry])
        setNewCountry("")
    }

    const handleOpenDeleteDialog = (index: number) => {
        setDeleteCountryIndex(index)
        setDeleteDialogOpen(true)
    }

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false)
        setDeleteCountryIndex(null)
    }

    const handleConfirmDelete = async () => {
        if (deleteCountryIndex === null) return
        const updatedCountries = trackedCountries.filter((_, i) => i !== deleteCountryIndex)
        setTrackedCountries(updatedCountries)
        setDeleteDialogOpen(false)
        setDeleteCountryIndex(null)

        if (selectedCompany?.uuid) {
            await updateCompany(selectedCompany.uuid, { trackedCountries: updatedCountries })
            toast.success("Country removed from tracking")
        }
    }

    return (
        <Paper sx={{ p: 2, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Tracked Countries (Max 3)
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <FormControl fullWidth>
                    <InputLabel id="country-select-label">Select Country</InputLabel>
                    <Select
                        labelId="country-select-label"
                        value={newCountry}
                        label="Select Country"
                        onChange={(e) => setNewCountry(e.target.value)}
                    >
                        {countryOptions.map((country) => (
                            <MenuItem key={country.country} value={country.country}>
                                {country.country_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button variant="contained" onClick={handleAddCountry} disabled={trackedCountries.length >= 3 || !newCountry}>
                    Add
                </Button>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {trackedCountries.map((country, index) => (
                    <Chip
                        key={index}
                        label={country.country_name}
                        color="primary"
                        sx={{ borderRadius: "16px", padding: "4px 8px" }}
                        onDelete={() => handleOpenDeleteDialog(index)}
                        deleteIcon={<DeleteForeverIcon />}
                    />
                ))}
            </Box>

            <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to remove this country from tracking?</Typography>
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

export default TrackedCountriesEditor
