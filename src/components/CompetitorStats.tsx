"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Box, Typography } from "@mui/material"

interface CompetitorStatsProps {
    totalResultsCount: number
    filteredResultsCount: number
    hiddenResultsCount: number
}

const AnimatedNumber = ({ value }: { value: number }) => {
    const [displayValue, setDisplayValue] = useState(0)

    useEffect(() => {
        setDisplayValue(0)

        let start = -1
        const stepTime = value > 0 ? Math.abs(Math.floor(1000 / value)) : 50

        const timer = setInterval(() => {
            start += 1
            setDisplayValue(start)
            if (start >= value) clearInterval(timer)
        }, stepTime)

        return () => clearInterval(timer)
    }, [value])

    return <motion.span>{displayValue}</motion.span>
}

const CompetitorStats: React.FC<CompetitorStatsProps> = ({ totalResultsCount, filteredResultsCount, hiddenResultsCount }) => {
    return (
        <Box
            sx={{
                display: "flex",
                gap: 3,
                p: 1,
                ml: 2,
                mr: 2,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 2,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box sx={{ flex: "0 0 auto", textAlign: "center" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "warning.main" }}>
                    <AnimatedNumber value={totalResultsCount} />
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "warning.main" }}>
                    Total Results
                </Typography>
            </Box>
            <Box sx={{ flex: "0 0 auto", textAlign: "center" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main", textAlign: "center" }}>
                    <AnimatedNumber value={filteredResultsCount} />
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "primary.main" }}>
                    New Competitors
                </Typography>
            </Box>
            <Box sx={{ flex: "0 0 auto", textAlign: "center" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "error.main" }}>
                    <AnimatedNumber value={hiddenResultsCount} />
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "error.main" }}>
                    Already Added
                </Typography>
            </Box>
        </Box>
    )
}

export default CompetitorStats
