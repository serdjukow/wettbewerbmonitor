"use client"

export const dynamic = "force-dynamic"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/src/store/appStore"
import Link from "next/link"
import PageLoader from "@/src/components/PageLoader"
import { useAuth } from "@/src/context/AuthContext"
import { Card, CardContent, Typography, CardActionArea, CardMedia, Container, Box, Button } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import AddBoxIcon from "@mui/icons-material/AddBox"
import { DASHBOARD_ROUTE, COMPANIES_ROUTE, LOGIN_PAGE_ROUTE } from "@/src/utils/consts"
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
        <Container>
            {!!companies.length && (
                <Box sx={{ textAlign: "end", mt: 2 }}>
                    <Link href={"/companies/quiz"} style={{ textDecoration: "none", color: "inherit" }} title="Add new company">
                        <Button variant="outlined" startIcon={<AddBoxIcon style={{ fontSize: "30px" }} />}>
                            Add new company
                        </Button>
                    </Link>
                </Box>
            )}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "calc(100vh - 130px)",
                    gap: 4,
                    pt: 3,
                    pb: 3,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                        flexWrap: "wrap",
                    }}
                >
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
                                    <CardContent
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            height: "calc(100% - 140px)",
                                        }}
                                    >
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
                    {!companies.length && (
                        <Card sx={{ height: CARD_HEIGHT, width: CARD_WIDTH, mb: "auto" }}>
                            <Link href={"/companies/quiz"} style={{ textDecoration: "none", color: "inherit" }}>
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
                                            Create New Company
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Link>
                        </Card>
                    )}
                </Box>
            </Box>
        </Container>
    )
}

export default CompaniesPage
