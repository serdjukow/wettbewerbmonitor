"use client"

import React from "react"
import { Container, Typography } from "@mui/material"
import Link from "next/link"
import { usePathname } from "next/navigation"

export interface NoDataMessageProps {
    title?: string
    description?: string
    actionText?: string
}

const NoDataMessage: React.FC<NoDataMessageProps> = ({
    title = "No data available.",
    description = "Please update your profile to add the required data.",
    actionText = "Edit Profile",
}) => {
    const pathname = usePathname()

    let editProfileUrl = "/edit-profile"
    if (pathname?.includes("/dashboard")) {
        if (pathname.includes("/dashboard/edit-profile")) {
            editProfileUrl = pathname
        } else {
            const dashboardIndex = pathname.indexOf("/dashboard")
            const base = pathname.substring(0, dashboardIndex + "/dashboard".length)
            editProfileUrl = `${base}/edit-profile`
        }
    }

    return (
        <Container sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body1" gutterBottom>
                {description}
            </Typography>
            <Link style={{ color: "#6363f0" }} href={editProfileUrl} passHref>
                {actionText}
            </Link>
        </Container>
    )
}

export default NoDataMessage
