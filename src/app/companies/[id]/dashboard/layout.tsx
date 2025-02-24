"use client"

import { usePathname } from "next/navigation"
import { Suspense } from "react"

import Sidebar from "@/src/components/Sidebar"
import { Box, Drawer, Toolbar, Typography } from "@mui/material"

interface CompaniesLayoutProps {
    children: React.ReactNode
}

const drawerWidth = 240

function getPageTitle(pathname: string): string {
    const pageTitles: Record<string, string> = {
        dashboard: "Dashboard",
        domains: "Search by Domain",
        keywords: "Search by Keyword",
        competitors: "Competitors",
        "competitor-edit": "Edit competitor",
        "competitor-create": "Create competitor",
        "edit-profile": "Edit profile",
        "competitor-view": "View competitor",
    }

    return pageTitles[pathname]
}

function PageHeader({ title }: { title: string }) {
    return (
        <Box
            sx={{
                width: "100%",
                py: 2,
                px: 3,
                borderBottom: "2px solid rgb(20 24 32)",
            }}
        >
            <Typography variant="h5" component="h1">
                {title}
            </Typography>
        </Box>
    )
}

const DashboardLayout = ({ children }: CompaniesLayoutProps) => {
    const pathname = usePathname()
    const lastSegment = pathname?.split("/").pop()
    const title = getPageTitle(lastSegment || "")

    return (
        <Box sx={{ marginLeft: "240px", p: 2 }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                    display: "block",
                    position: "relative !importand",
                }}
            >
                <Toolbar />
                <Sidebar />
            </Drawer>
            <PageHeader title={title} />
            <Box component="main" sx={{ pt: 2 }}>
                <Suspense fallback={<div>Загрузка данных DashboardLayou ...</div>}>{children}</Suspense>
            </Box>
        </Box>
    )
}

export default DashboardLayout
