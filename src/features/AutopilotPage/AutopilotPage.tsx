"use client"
export const dynamic = "force-dynamic"

import React, { useEffect, useState } from "react"
import { useAppStore } from "@/src/store/appStore"
import { type Competitor, type GeneralService } from "@/src/utils/types"
import AutopilotAccess from "./AutopilotAccess"
import { Box, Container } from "@mui/material"

type ExtendedCompetitor = Competitor & { competitorName?: string }

function createData(
    uuid: string,
    domain?: string,
    url?: string,
    name?: string,
    status: "not_checked" | "competitor" | "not_competitor" = "not_checked",
    products: GeneralService[] = []
): Competitor {
    return {
        uuid,
        domain: domain && domain.trim() !== "" ? domain : "-",
        url: url && url.trim() !== "" ? url : "-",
        name: name && name.trim() !== "" ? name : "-",
        status,
        products,
    }
}

const AutopilotPage = () => {
    const { selectedCompany } = useAppStore()

    const [rows, setRows] = useState<Competitor[]>([])

    useEffect(() => {
        if (selectedCompany?.seo?.competitors) {
            setRows(
                (selectedCompany.seo.competitors as ExtendedCompetitor[]).map((item) =>
                    createData(
                        item.uuid || "-",
                        item.domain || "-",
                        item.url || "-",
                        item.name || "-",
                        (item as Competitor).status || "not_checked",
                        (item as Competitor).products || []
                    )
                )
            )
        }
    }, [selectedCompany])

    return (
        <Container>
            <Box sx={{ p: 2 }}>
                <AutopilotAccess rows={rows} projectKeywords={selectedCompany?.generalKeywords ?? []} />
            </Box>
        </Container>
    )
}

export default AutopilotPage
