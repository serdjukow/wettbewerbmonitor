"use client"

import React from "react"
import { useAppStore } from "@/src/store/appStore"
import { useRouter } from "next/navigation"

import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import CardMedia from "@mui/material/CardMedia"
import EmptyBoxImg from "@/src/assets/images/empty-box.svg"
import { KEYWORDS_ROUTE, DOMAINS_ROUTE, COMPANIES_ROUTE } from "@/src/utils/consts"

function NoCompetitorsFound() {
    const router = useRouter()
    const { selectedCompany } = useAppStore()

    const handleButtonAddKeyword = () => {
        router.push(`${COMPANIES_ROUTE}/${selectedCompany?.uuid}${KEYWORDS_ROUTE}`)
    }

    const handleButtonAddDomain = () => {
        router.push(`${COMPANIES_ROUTE}/${selectedCompany?.uuid}${DOMAINS_ROUTE}`)
    }

    return (
        <Card variant="outlined">
            <CardContent
                sx={{
                    text: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CardMedia
                    sx={{
                        height: 200,
                        width: 200,
                        text: "center",
                        display: "flex",
                        justifyContent: "center",
                        mb: "20px",
                    }}
                    image={EmptyBoxImg.src}
                    title="Empty Box"
                />
                <Typography variant="h5" component="div">
                    No competitors found.
                </Typography>
                <Typography sx={{ color: "text.secondary", mb: 1.5 }}>There are no competitors monitored yet. Please add some.</Typography>
            </CardContent>
            <CardActions
                sx={{
                    justifyContent: "center",
                }}
            >
                <Button onClick={handleButtonAddKeyword} color="success" variant="outlined">
                    With keyword
                </Button>
                <Button onClick={handleButtonAddDomain} color="success" variant="outlined">
                    With domain
                </Button>
            </CardActions>
        </Card>
    )
}

export default NoCompetitorsFound
