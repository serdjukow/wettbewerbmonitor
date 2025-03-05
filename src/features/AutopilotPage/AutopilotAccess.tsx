"use client"

import React, { useMemo } from "react"
import { Box, Button } from "@mui/material"
import { type Competitor } from "@/src/utils/types"
import RequirementDonutCard from "./RequirementDonutCard"
import AutopilotInstructions from "./AutopilotInstructions"
import UnconfirmedCompetitorsCard from "./UnconfirmedCompetitorsCard"
import { useAppStore } from "@/src/store/appStore"

interface AutopilotAccessProps {
    rows: Competitor[]
    projectKeywords: string[]
}

const AutopilotAccess: React.FC<AutopilotAccessProps> = ({ rows, projectKeywords }) => {
    const { selectedCompany } = useAppStore()

    const tabFilters = useMemo(
        () => ({
            not_checked: (row: Competitor) => row.status === "not_checked",
            competitor: (row: Competitor) => row.status === "competitor" && row.products?.length > 0,
            not_competitor: (row: Competitor) => row.status === "not_competitor",
        }),
        []
    )

    const counts = useMemo(
        () => ({
            not_checked: rows.filter(tabFilters.not_checked).length,
            competitor: rows.filter(tabFilters.competitor).length,
            not_competitor: rows.filter(tabFilters.not_competitor).length,
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
        <RequirementDonutCard
            key={index}
            label={req.label}
            current={req.current}
            required={req.required}
            companyUUID={selectedCompany?.uuid || ""}
        />
    ))

    const unconfirmedCompetitors = counts.not_checked

    const unmetRequirements = Object.values(requirements).filter((req) => req.current < req.required)
    const isAccessGranted = unmetRequirements.length === 0 && unconfirmedCompetitors === 0

    const confirmedCompetitors = counts.competitor
    const requiredCompetitors = requirements.competitors.required
    const confirmedNonCompetitors = counts.not_competitor
    const requiredNonCompetitors = requirements.nonCompetitors.required
    const keywordsCount = projectKeywords.length
    const requiredKeywords = requirements.keywords.required

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 3 }}>
                <AutopilotInstructions
                    confirmedCompetitors={confirmedCompetitors}
                    requiredCompetitors={requiredCompetitors}
                    confirmedNonCompetitors={confirmedNonCompetitors}
                    requiredNonCompetitors={requiredNonCompetitors}
                    keywords={keywordsCount}
                    requiredKeywords={requiredKeywords}
                    unconfirmedCompetitors={unconfirmedCompetitors}
                />
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
                {requirementCards}
                <UnconfirmedCompetitorsCard unconfirmedCount={counts.not_checked} companyUUID={selectedCompany?.uuid || ""} />
            </Box>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                <Button variant="contained" disabled={!isAccessGranted}>
                    {isAccessGranted ? "Autopilot access activated" : "Complete all requirements and review unconfirmed competitors"}
                </Button>
            </Box>
        </Box>
    )
}

export default AutopilotAccess
