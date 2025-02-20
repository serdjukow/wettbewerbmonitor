"use client"

import { ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAppStore } from "@/src/store/appStore"
import { getPagePath } from "@/src/utils/functions"

import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select, { SelectChangeEvent } from "@mui/material/Select"

import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box } from "@mui/material"
import {
    Home as HomeIcon,
    Business as BusinessIcon,
    Key as KeyIcon,
    InsertLink as InsertLinkIcon,
    Edit as EditIcon,
} from "@mui/icons-material"
import { DASHBOARD_ROUTE, COMPETITORS_ROUTE, DOMAINS_ROUTE, KEYWORDS_ROUTE, COMPANIES_ROUTE, EDIT_PROFILE_ROUTE } from "@/src/utils/consts"

interface MenuItem {
    title: string
    icon: ReactNode
    path: string
    submenu?: { title: string; path: string }[]
    badge?: number
}

const menuItems: MenuItem[] = [
    {
        title: "Dashboard",
        icon: <HomeIcon />,
        path: DASHBOARD_ROUTE,
    },
    {
        title: "Search by Domain",
        icon: <InsertLinkIcon />,
        path: DOMAINS_ROUTE,
    },
    {
        title: "Search by Keyword",
        icon: <KeyIcon />,
        path: KEYWORDS_ROUTE,
    },
    {
        title: "Competitors",
        icon: <BusinessIcon />,
        path: COMPETITORS_ROUTE,
    },
    {
        title: "Edit profile",
        icon: <EditIcon />,
        path: EDIT_PROFILE_ROUTE,
    },
]

const Sidebar = () => {
    const router = useRouter()
    const pathname = usePathname()
    const { selectedCompany, companies, setSelectedCompany } = useAppStore()

    const handleCompanyChange = (newId: string | SelectChangeEvent<string>) => {
        const id = typeof newId === "string" ? newId : newId.target.value
        const selected = companies.find((c) => c.uuid === id)

        if (!selected) return

        setSelectedCompany(selected)

        const segments = pathname.split("/")
        const companyIndex = segments.indexOf("companies")

        if (companyIndex !== -1 && segments[companyIndex + 1]) {
            segments[companyIndex + 1] = id
        }

        const dashboardIndex = segments.indexOf(DASHBOARD_ROUTE.replace("/", ""))
        if (dashboardIndex !== -1 && segments.length > dashboardIndex + 2) {
            segments.splice(dashboardIndex + 2)
        }

        const newPath = segments.join("/")
        router.push(newPath)
    }

    return (
        <Box sx={{ overflow: "auto" }}>
            <Box sx={{ p: 2, pt: 4 }}>
                <FormControl sx={{ m: 0, minWidth: "100px", width: "100%" }}>
                    <InputLabel sx={{ m: -1.5 }} id="company-select-label">
                        Company
                    </InputLabel>
                    <Select
                        labelId="company-select-label"
                        id="company-select"
                        value={selectedCompany?.uuid || ""}
                        onChange={handleCompanyChange}
                    >
                        {companies.map((company) => (
                            <MenuItem key={company.uuid} value={company.uuid}>
                                {company.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <List>
                {menuItems.map((item, index) => (
                    <MenuItemComponent key={index} item={item} />
                ))}
            </List>
        </Box>
    )
}

const MenuItemComponent = ({ item }: { item: MenuItem }) => {
    const pathname = usePathname()
    const path = getPagePath(pathname)
    const isActive = path === item.path

    const { selectedCompany } = useAppStore()

    return (
        <ListItem disablePadding style={{ display: "block" }}>
            <Link href={`${COMPANIES_ROUTE}/${selectedCompany?.uuid}${item.path}`} style={{ color: "inherit", textDecoration: "none" }}>
                <ListItemButton
                    sx={{
                        bgcolor: isActive ? "primary.main" : "transparent",
                        color: isActive ? "white" : "inherit",
                        borderRadius: 0.5,
                        "&:hover": {
                            bgcolor: "primary.light",
                        },
                    }}
                >
                    <ListItemIcon
                        sx={{
                            color: isActive ? "white" : "inherit",
                        }}
                    >
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
                </ListItemButton>
            </Link>
        </ListItem>
    )
}

export default Sidebar
