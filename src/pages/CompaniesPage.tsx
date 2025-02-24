"use client"

export const dynamic = "force-dynamic"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/src/store/appStore"
import Link from "next/link"
import PageLoader from "@/src/components/PageLoader"
import { useAuth } from "@/src/context/AuthContext"
import { Box, Card, CardContent, Typography, CardActionArea, CardMedia, Container } from "@mui/material"
import Grid from "@mui/material/Grid2"
import AddIcon from "@mui/icons-material/Add"
import { DASHBOARD_ROUTE, COMPANIES_ROUTE, CREATE_COMPANY_ROUTE, LOGIN_PAGE_ROUTE } from "@/src/utils/consts"

const CompaniesPage = () => {
    const router = useRouter()
    const { setSelectedCompany, selectedCompany, companies, fetchCompanies } = useAppStore()
    const { user, loading } = useAuth()

    useEffect(() => {
        if (!user && !loading) {
            router.push(LOGIN_PAGE_ROUTE)
        } else if (user) {
            fetchCompanies()
        }
    }, [user, router, fetchCompanies, loading])

    const handleSelectCompany = (company: { uuid?: string; name: string }) => {
        setSelectedCompany(company)
        if (company.uuid) {
            router.push(`${COMPANIES_ROUTE}/${company.uuid}${DASHBOARD_ROUTE}`)
        }
    }

    if (loading) return <PageLoader />

    if (!user) {
        return null
    }

    return (
        <Container sx={{ display: "flex", alignItems: "center", minHeight: "calc(100vh - 68px)", pt: 3, pb: 3 }}>
            <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {companies.map((company) => (
                    <Grid key={company.uuid} size={{ xs: 2, sm: 4, md: 4 }}>
                        <Card>
                            <CardActionArea
                                onClick={() => company.uuid && handleSelectCompany(company)}
                                data-active={selectedCompany?.uuid === company.uuid ? "" : undefined}
                                sx={{
                                    height: "100%",
                                    "&[data-active]": {
                                        backgroundColor: "action.selected",
                                        "&:hover": {
                                            backgroundColor: "action.selectedHover",
                                        },
                                    },
                                }}
                            >
                                <CardMedia component="img" height="140" image={"/company.png"} alt="Company Image" />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {company.name}
                                    </Typography>
                                    <Typography gutterBottom variant="body2" sx={{ color: "text.secondary" }}>
                                        {company.address?.city}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                                        {company.contact?.email}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
                <Card>
                    <Link href={CREATE_COMPANY_ROUTE} style={{ textDecoration: "none", color: "inherit" }}>
                        <CardActionArea
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                "&:hover": {
                                    backgroundColor: "action.selectedHover",
                                },
                            }}
                        >
                            <CardContent>
                                <Box sx={{ textAlign: "center" }}>
                                    <AddIcon sx={{ fontSize: 40 }} />
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 30 }}>
                                    Add new company
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Link>
                </Card>
            </Grid>
        </Container>
    )
}

export default CompaniesPage
