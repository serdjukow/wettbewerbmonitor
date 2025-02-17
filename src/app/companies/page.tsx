"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/src/store/appStore"
import Link from "next/link"
import PageLoader from "@/src/components/PageLoader"
import { useAuth } from "@/src/context/AuthContext"

import { Box, Card, CardContent, Typography, CardActionArea } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { DASHBOARD_ROUTE, COMPANIES_ROUTE, CREATE_COMPANY_ROUTE, LOGIN_PAGE_ROUTE } from "@/src/utils/consts"

const Companies = () => {
    const router = useRouter()
    const { setSelectedCompany, selectedCompany, companies, fetchCompanies } = useAppStore()
    const { user, loading } = useAuth()

    useEffect(() => {
        if (!user) {
            router.push(LOGIN_PAGE_ROUTE)
        } else {
            fetchCompanies()
        }
    }, [user, router, fetchCompanies])

    const handleSelectCompany = (company: { uuid?: string; name: string }) => {
        setSelectedCompany(company)
        if (company.uuid) {
            router.push(`${COMPANIES_ROUTE}/${company.uuid}${DASHBOARD_ROUTE}`)
        }
    }

    if (loading) return <PageLoader />

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "90vh",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                {companies.map((company) => (
                    <Card key={company.uuid}>
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
                            <CardContent sx={{ height: "100%" }}>
                                <Typography variant="h5" component="div">
                                    {company.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {company.contact?.email}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
                <Card>
                    <Link href={CREATE_COMPANY_ROUTE} style={{ textDecoration: "none", color: "inherit" }}>
                        <CardContent sx={{ height: "100%" }}>
                            <Box sx={{ textAlign: "center" }}>
                                <AddIcon />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Add new company
                            </Typography>
                        </CardContent>
                    </Link>
                </Card>
            </Box>
        </Box>
    )
}

export default Companies
