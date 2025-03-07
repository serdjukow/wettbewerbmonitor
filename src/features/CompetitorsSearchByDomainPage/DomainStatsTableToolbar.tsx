"use client"
import React from "react"
import { Toolbar, Typography, Box } from "@mui/material"
import RemainingCredits from "@/src/components/RemainingCredits"

interface DomainStatsTableToolbarProps {
    domain: string
}

const DomainStatsTableToolbar: React.FC<DomainStatsTableToolbarProps> = ({ domain }) => {
    return (
        <Toolbar
            sx={{
                pt: { sm: 2 },
                pb: { sm: 2 },
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
            }}
        >
            <Box sx={{ flex: "1 1 100%" }}>
                <Typography variant="h6" id="tableTitle" component="div">
                    Domain: <span style={{ color: "#3498db", marginLeft: "5px" }}>{domain}</span>
                </Typography>
            </Box>
            <RemainingCredits />
        </Toolbar>
    )
}

export default DomainStatsTableToolbar
