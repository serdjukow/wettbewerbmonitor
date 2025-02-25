"use client"

export const dynamic = "force-dynamic"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/src/store/appStore"
import Link from "next/link"
import PageLoader from "@/src/components/PageLoader"
import { useAuth } from "@/src/context/AuthContext"
import { Grid2, Card, CardContent, Typography, CardActionArea, CardMedia, Container, Box } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { DASHBOARD_ROUTE, COMPANIES_ROUTE, CREATE_COMPANY_ROUTE, LOGIN_PAGE_ROUTE } from "@/src/utils/consts"
import { type Company } from "../utils/types"

const CARD_HEIGHT = 250
const CARD_WIDTH = 300

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

    const handleSelectCompany = (company: Company) => {
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
            <Grid2 container spacing={{ xs: 2, md: 3 }} justifyContent="center">
                {companies.map((company) => (
                    <Box key={company.uuid}>
                        <Card sx={{ height: CARD_HEIGHT, width: CARD_WIDTH }}>
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
                                <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "calc(100% - 140px)" }}>
                                    <Typography gutterBottom variant="h5" component="div" noWrap>
                                        {company.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
                                        {company.address?.city}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: "text.secondary" }} noWrap>
                                        {company.contact?.email}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Box>
                ))}

                {/* Add New Company Card */}
                <Grid2>
                    <Card sx={{ height: CARD_HEIGHT, width: CARD_WIDTH }}>
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
                                <CardContent sx={{ textAlign: "center" }}>
                                    <AddIcon sx={{ fontSize: 40 }} />
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 20, mt: 1 }}>
                                        Add New Company
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Link>
                    </Card>
                </Grid2>
            </Grid2>
        </Container>
    )
}

export default CompaniesPage
