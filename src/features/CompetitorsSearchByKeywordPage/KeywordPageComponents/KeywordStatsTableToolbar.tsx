import React from "react"

import RemainingCredits from "@/src/components/RemainingCredits"
import {
    Box,
    Typography,
    Toolbar,
} from "@mui/material"
import { KeywordStatsTableToolbarProps } from "./../KeywordPageTypes"

function KeywordStatsTableToolbar(props: KeywordStatsTableToolbarProps) {
    const { keyword, keywordStats } = props
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
                <Box sx={{ display: "flex", gap: 2, mt: 1, color: "text.secondary" }}>
                    <Typography variant="body1">Website: {keywordStats.intent_website ?? 0}</Typography>
                    <Typography variant="body1">Know: {keywordStats.intent_know ?? 0}</Typography>
                    <Typography variant="body1">Visit: {keywordStats.intent_visit ?? 0}</Typography>
                    <Typography variant="body1">Do: {keywordStats.intent_do ?? 0}</Typography>
                </Box>
            </Box>
            <RemainingCredits />
        </Toolbar>
    )
}

export default KeywordStatsTableToolbar
