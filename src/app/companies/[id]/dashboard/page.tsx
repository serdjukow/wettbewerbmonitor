"use client"

import React, { useState, useEffect } from "react"
import { useAppStore } from "@/src/store/appStore"

import Box from "@mui/material/Box"
import NoCompetitorsFoundCard from "@/src/components/NoCompetitorsFoundCard"





const DashboardPage = () => {
    const { selectedCompany } = useAppStore()    

    return (
        <>
            {!selectedCompany?.seo?.competitors?.length ? (
                <Box sx={{ width: "100%" }}>
                  Dashboard
                </Box>
            ) : (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "75vh" }}>
                    <NoCompetitorsFoundCard />
                </Box>
            )}
        </>
    )
}

export default DashboardPage
