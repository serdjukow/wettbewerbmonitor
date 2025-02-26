"use client"

import React from "react"
import { Box, Button, Stack, Typography } from "@mui/material"
import GroupIcon from "@mui/icons-material/Group"
import PersonSearchIcon from "@mui/icons-material/PersonSearch"

export type SurveyType = "competitors" | "clients"

interface SurveyStartProps {
    onSelect: (type: SurveyType) => void
}

const SurveyStart: React.FC<SurveyStartProps> = ({ onSelect }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                pt: 4,
            }}
        >
            <Typography variant="h4" gutterBottom>
                Please choose your survey type
            </Typography>
            <Stack spacing={3} direction="row">
                <Button variant="contained" color="primary" startIcon={<GroupIcon />} onClick={() => onSelect("competitors")} sx={{ minWidth: 200, fontSize: "1.2rem" }}>
                    Search for Competitors
                </Button>
                <Button variant="contained" color="secondary" startIcon={<PersonSearchIcon />} onClick={() => onSelect("clients")} sx={{ minWidth: 200, fontSize: "1.2rem" }}>
                    Search for Potential Clients
                </Button>
            </Stack>
        </Box>
    )
}

export default SurveyStart
