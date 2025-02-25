"use client"

import React from "react"
import { Box, Typography } from "@mui/material"

interface CompetitorStatsProps {
    totalResultsCount: number
    filteredResultsCount: number
    hiddenResultsCount: number
}

const CompetitorStats: React.FC<CompetitorStatsProps> = ({ totalResultsCount, filteredResultsCount, hiddenResultsCount }) => {
    return (
        <Box sx={{ display: "flex", gap: 3, p: 1, pr: 2, pl: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Total Results: {totalResultsCount}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                New Competitors: {filteredResultsCount}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }} color="error">
                Already Added: {hiddenResultsCount}
            </Typography>
        </Box>
    )
}

export default CompetitorStats
