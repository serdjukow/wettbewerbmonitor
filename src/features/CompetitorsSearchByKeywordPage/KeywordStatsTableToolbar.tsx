"use client"
import React from "react"
import { Toolbar, Typography, Box } from "@mui/material"
import RemainingCredits from "@/src/components/RemainingCredits"

interface KeywordStatsTableToolbarProps {
    keyword: string
}

const KeywordStatsTableToolbar: React.FC<KeywordStatsTableToolbarProps> = ({ keyword }) => {
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
                <Typography variant="h6" component="div">
                    Keyword:
                    <span style={{ color: "#3498db", marginLeft: "5px" }}>{keyword}</span>
                </Typography>
            </Box>
            <RemainingCredits />
        </Toolbar>
    )
}

export default KeywordStatsTableToolbar
