"use client"

import * as React from "react"
import AppTheme from "@/theme/AppTheme"
import DashboardMenuBar from "@/components/DashboardMenuBar"
import { Box, CssBaseline, Toolbar, Container } from "@mui/material"

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AppTheme>
            <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <DashboardMenuBar />
                <Box
                    component="main"
                    sx={{
                        minHeight: "100vh",
                        flexGrow: 1,
                        p: 3,
                        ms: 0,
                    }}
                >
                    <Toolbar />
                    <Container
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "80vh",
                            pt: { xs: 14, sm: 20 },
                            pb: { xs: 8, sm: 12 },
                        }}
                    >
                        {children}
                    </Container>
                </Box>
            </Box>
        </AppTheme>
    )
}
