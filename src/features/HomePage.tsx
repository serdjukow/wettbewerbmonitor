"use client"

export const dynamic = "force-dynamic"

import React from "react"
import CssBaseline from "@mui/material/CssBaseline"
import Container from "@mui/material/Container"
import AppTheme from "@/src//theme/AppTheme"
import AppAppBar from "@/src/components/AppAppBar"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { Button, Link } from "@mui/material"
import { COMPANIES_ROUTE } from "@/src/utils/consts"

const HomePage = () => {
    const disableCustomTheme = false

    return (
        <AppTheme disableCustomTheme={disableCustomTheme}>
            <CssBaseline enableColorScheme />
            <AppAppBar />
            <Box
                id="hero"
                sx={(theme) => ({
                    width: "100%",
                    backgroundRepeat: "no-repeat",
                    backgroundImage: "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
                    ...theme.applyStyles("dark", {
                        backgroundImage: "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
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
                            Analito&nbsp;
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
                                App
                            </Typography>
                        </Typography>
                        <Link
                            href={COMPANIES_ROUTE}
                            style={{
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            <Button variant="contained">Get started</Button>
                        </Link>
                    </Stack>
                </Container>
            </Box>
        </AppTheme>
    )
}

export default HomePage
