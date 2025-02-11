"use client"

import { ReactNode } from "react"
import Sidebar from "@/components/Sidebar"
import { Box, Drawer, Toolbar } from "@mui/material"

const drawerWidth = 240

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <Box sx={{ display: "flex" }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
            >
                <Toolbar />
                <Sidebar />
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
                {children}
            </Box>
        </Box>
    )
}
