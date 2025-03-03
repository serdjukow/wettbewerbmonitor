import React from "react"

import RemainingCredits from "@/src/components/RemainingCredits"
import {
    Box,
    Typography,
    Toolbar,
} from "@mui/material"
import { KeywordStatsTableToolbarProps } from "./../KeywordPageTypes"

function KeywordStatsTableToolbar(props: KeywordStatsTableToolbarProps) {
    const { keyword } = props
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
                    Keyword:
                    <span style={{ color: "#3498db", marginLeft: "5px" }}>{keyword}</span>
                </Typography>               
            </Box>
            <RemainingCredits />
        </Toolbar>
    )
}

export default KeywordStatsTableToolbar
