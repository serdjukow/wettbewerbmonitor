"use client"

import React from "react"
import { Box, Button, Stack, Typography } from "@mui/material"
import GroupIcon from "@mui/icons-material/Group"
import PersonSearchIcon from "@mui/icons-material/PersonSearch"

export type SurveyType = "competitors" | "clients"

interface SurveyStartProps {
    selectedSurveyType: SurveyType | null
    onSelect: (type: SurveyType) => void
}

const SurveyStart: React.FC<SurveyStartProps> = ({ selectedSurveyType, onSelect }) => {
    console.log("onSelect", selectedSurveyType)
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Typography variant="h4" gutterBottom>
                Please choose your survey type
            </Typography>
            <Stack spacing={3} direction="row">
                <Button
                    variant={selectedSurveyType === "competitors" ? "contained" : "outlined"}
                    color="primary"
                    startIcon={<GroupIcon />}
                    onClick={() => onSelect("competitors")}
                    sx={{ minWidth: 200, fontSize: "1.2rem" }}
                >
                    Search for Competitors
                </Button>
                <Button
                    variant={selectedSurveyType === "clients" ? "contained" : "outlined"}
                    color="secondary"
                    startIcon={<PersonSearchIcon />}
                    onClick={() => onSelect("clients")}
                    sx={{ minWidth: 200, fontSize: "1.2rem" }}
                >
                    Search for Potential Clients
                </Button>
            </Stack>
        </Box>
    )
}

export default SurveyStart
