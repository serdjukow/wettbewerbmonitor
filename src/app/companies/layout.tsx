"use client"

import * as React from "react"
import AppTheme from "@/src/theme/AppTheme"
import DashboardMenuBar from "@/src/components/DashboardMenuBar"

import { Box, CssBaseline, Toolbar } from "@mui/material"

export default function CompaniesLayout({
    children,
}: {
    children: React.ReactNode
}) {
     const disableCustomTheme = false
    return (
        <AppTheme disableCustomTheme={disableCustomTheme}>
            <Box>
                <CssBaseline />
                <DashboardMenuBar />
                <Box>
                    <Toolbar />
                    <Box>{children}</Box>
                </Box>
            </Box>
        </AppTheme>
    )
}
