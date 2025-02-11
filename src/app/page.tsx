"use client"

import * as React from "react"
import CssBaseline from "@mui/material/CssBaseline"
import Container from "@mui/material/Container"
import AppTheme from "@/theme/AppTheme"
import AppAppBar from "@/components/AppAppBar"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

export default function Home(props: { disableCustomTheme?: boolean }) {
    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <AppAppBar />
            <Box
                id="hero"
                sx={(theme) => ({
                    width: "100%",
                    backgroundRepeat: "no-repeat",
                    backgroundImage:
                        "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
                    ...theme.applyStyles("dark", {
                        backgroundImage:
                            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
                    }),
                })}
            >
                <Container
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh",
                        pt: { xs: 14, sm: 20 },
                        pb: { xs: 8, sm: 12 },
                    }}
                >
                    <Stack
                        spacing={2}
                        useFlexGap
                        sx={{
                            alignItems: "center",
                            width: { xs: "100%", sm: "70%" },
                        }}
                    >
                        <Typography
                            variant="h1"
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                alignItems: "center",
                                fontSize: "clamp(3rem, 10vw, 3.5rem)",
                            }}
                        >
                            Wettbewerb&nbsp;
                            <Typography
                                component="span"
                                variant="h1"
                                sx={(theme) => ({
                                    fontSize: "inherit",
                                    color: "primary.main",
                                    ...theme.applyStyles("dark", {
                                        color: "primary.light",
                                    }),
                                })}
                            >
                                Monitor
                            </Typography>
                        </Typography>
                        <Typography
                            sx={{
                                textAlign: "center",
                                color: "text.secondary",
                                width: { sm: "100%", md: "80%" },
                            }}
                        >
                            WettbewerbMonitor – Wettbewerbsanalyse für Ihr
                            Unternehmen WettbewerbMonitor ist ein
                            leistungsstarkes Tool zur Überwachung von
                            Wettbewerbern und zur Analyse ihrer SEO-Strategien.
                            Das System ermöglicht die Identifizierung von
                            Konkurrenten anhand von Schlüsselwörtern, die
                            Analyse ihrer Suchmaschinenplatzierungen und den
                            Zugriff auf wertvolle SEO-Daten durch die
                            Integration mit der Sistrix API.
                        </Typography>
                    </Stack>
                </Container>
            </Box>
        </AppTheme>
    )
}
