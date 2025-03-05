"use client"

import React, { useMemo } from "react"
import { Box, Button } from "@mui/material"
import { type Competitor } from "@/src/utils/types"
import RequirementDonutCard from "./RequirementDonutCard"
import AutopilotInstructions from "./AutopilotInstructions"
import UnconfirmedCompetitorsCard from "./UnconfirmedCompetitorsCard"

interface AutopilotAccessProps {
    rows: Competitor[]
    projectKeywords: string[]
}

const AutopilotAccess: React.FC<AutopilotAccessProps> = ({ rows, projectKeywords }) => {
    const tabFilters = useMemo(
        () => ({
            not_checked: (row: Competitor) => row.status === "not_checked",
            competitor: (row: Competitor) => row.status === "competitor" && row.products?.length > 0,
            not_competitor: (row: Competitor) => row.status === "not_competitor",
            products_not_selected: (row: Competitor) => row.status === "competitor" && row.products?.length === 0,
        }),
        []
    )

    const counts = useMemo(
        () => ({
            not_checked: rows.filter(tabFilters.not_checked).length,
            competitor: rows.filter(tabFilters.competitor).length,
            not_competitor: rows.filter(tabFilters.not_competitor).length,
            products_not_selected: rows.filter(tabFilters.products_not_selected).length,
        }),
        [rows, tabFilters]
    )

    const requirements = {
        competitors: {
            current: counts.competitor,
            required: 100,
            label: "Confirmed Competitors",
        },
        nonCompetitors: {
            current: counts.not_competitor,
            required: 100,
            label: "Confirmed Non-Competitors",
        },
        keywords: {
            current: projectKeywords.length,
            required: 10,
            label: "Keywords",
        },
    }

    const requirementCards = Object.values(requirements).map((req, index) => (
        <RequirementDonutCard key={index} label={req.label} current={req.current} required={req.required} />
    ))

    const unmetRequirements = Object.values(requirements).filter((req) => req.current < req.required)
    const isAccessGranted = unmetRequirements.length === 0

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 3 }}>
                <AutopilotInstructions />
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
                {requirementCards}
                <UnconfirmedCompetitorsCard unconfirmedCount={counts.not_checked} />
            </Box>
            <Box sx={{ mt: 2 }}>
                <Button variant="contained" disabled={!isAccessGranted}>
                    {isAccessGranted ? "Autopilot access activated" : "Complete the requirements to access"}
                </Button>
            </Box>
        </Box>
    )
}

export default AutopilotAccess
