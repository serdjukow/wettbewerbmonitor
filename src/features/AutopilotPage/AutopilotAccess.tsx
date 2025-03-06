"use client"

import React, { useMemo, useEffect, useState } from "react"
import { Box, Button } from "@mui/material"
import { type Competitor } from "@/src/utils/types"
import RequirementDonutCard from "./RequirementDonutCard"
import AutopilotInstructions from "./AutopilotInstructions"
import UnconfirmedCompetitorsCard from "./UnconfirmedCompetitorsCard"
import AutopilotRun from "./AutopilotRun"
import { useAppStore } from "@/src/store/appStore"

interface AutopilotAccessProps {
    rows: Competitor[]
    projectKeywords: string[]
}

const AutopilotAccess: React.FC<AutopilotAccessProps> = ({ rows, projectKeywords }) => {
    const { selectedCompany, isAutopilotActive, setAutopilotActive } = useAppStore()
    const [initialLoad, setInitialLoad] = useState(true)

    const counts = useMemo(
        () => ({
            not_checked: rows.filter((row) => row.status === "not_checked").length,
            competitor: rows.filter((row) => row.status === "competitor" && row.products?.length > 0).length,
            not_competitor: rows.filter((row) => row.status === "not_competitor").length,
        }),
        [rows]
    )

    const requirements = useMemo(
        () => ({
            competitors: {
                current: counts.competitor,
                required: 10,
                label: "Confirmed Competitors",
            },
            nonCompetitors: {
                current: counts.not_competitor,
                required: 10,
                label: "Confirmed Non-Competitors",
            },
            keywords: {
                current: projectKeywords.length,
                required: 10,
                label: "Keywords",
            },
        }),
        [counts, projectKeywords]
    )

    const isAccessGranted = useMemo(() => {
        const unmet = Object.values(requirements).filter((req) => req.current < req.required)
        return unmet.length === 0 && counts.not_checked === 0
    }, [requirements, counts.not_checked])

    useEffect(() => {
        if (initialLoad) {
            setInitialLoad(false)
            return
        }
        if (!isAccessGranted && isAutopilotActive) {
            setAutopilotActive(false)
        }
    }, [initialLoad, isAccessGranted, isAutopilotActive, setAutopilotActive])

    const requirementCards = useMemo(
        () =>
            Object.values(requirements).map((req, index) => (
                <RequirementDonutCard key={index} label={req.label} current={req.current} required={req.required} companyUUID={selectedCompany?.uuid || ""} />
            )),
        [requirements, selectedCompany]
    )

    if (isAutopilotActive) {
        return <AutopilotRun />
    }

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 3 }}>
                <AutopilotInstructions
                    confirmedCompetitors={requirements.competitors.current}
                    requiredCompetitors={requirements.competitors.required}
                    confirmedNonCompetitors={requirements.nonCompetitors.current}
                    requiredNonCompetitors={requirements.nonCompetitors.required}
                    keywords={requirements.keywords.current}
                    requiredKeywords={requirements.keywords.required}
                    unconfirmedCompetitors={counts.not_checked}
                />
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
                {requirementCards}
                <UnconfirmedCompetitorsCard unconfirmedCount={counts.not_checked} companyUUID={selectedCompany?.uuid || ""} />
            </Box>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                <Button variant="contained" disabled={!isAccessGranted} onClick={() => setAutopilotActive(true)}>
                    {isAccessGranted ? "Activate Autopilot" : "Complete all requirements and review unconfirmed competitors"}
                </Button>
            </Box>
        </Box>
    )
}

export default AutopilotAccess
