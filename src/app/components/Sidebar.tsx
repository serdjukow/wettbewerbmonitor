"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAppStore } from "@/store/appStore"

import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select, { SelectChangeEvent } from "@mui/material/Select"

import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
} from "@mui/material"
import {
    Home as HomeIcon,
    Settings as SettingsIcon,
    Key as KeyIcon,
    InsertLink as InsertLinkIcon,
    Edit as EditIcon,
} from "@mui/icons-material"

import {
    DASHBOARD_ROUTE,
    SETTINGS_ROUTE,
    DOMAINS_ROUTE,
    KEYWORDS_ROUTE,
    COMPANIES_ROUTE,
    EDIT_PROFILE_ROUTE,
} from "@/utils/consts"

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
        title: "Domains",
        icon: <InsertLinkIcon />,
        path: DOMAINS_ROUTE,
    },
    {
        title: "Keywords",
        icon: <KeyIcon />,
        path: KEYWORDS_ROUTE,
    },
    {
        title: "Settings",
        icon: <SettingsIcon />,
        path: SETTINGS_ROUTE,
    },
    {
        title: "Edit profile",
        icon: <EditIcon />,
        path: EDIT_PROFILE_ROUTE,
    },
]

const Sidebar = () => {
    const { selectedCompany, companies, setSelectedCompany } = useAppStore()

    const handleChange = (event: SelectChangeEvent<string>) => {
        const selected = companies.find((c) => c.uuid === event.target.value)
        if (selected) {
            setSelectedCompany(selected)
            window.history.pushState(
                null,
                "",
                `${COMPANIES_ROUTE}/${selected.uuid}${DASHBOARD_ROUTE}/edit-profile`
            )
        }
    }

    return (
        <Box sx={{ overflow: "auto" }}>
            <Box sx={{ p: 2, pt: 4 }}>
                <FormControl sx={{ m: 0, minWidth: "100px", width: "100%" }}>
                    <InputLabel
                        sx={{ m: -1.5 }}
                        id="company-select-label"
                    >
                        Company
                    </InputLabel>
                    <Select
                        labelId="company-select-label"
                        id="company-select"
                        value={selectedCompany?.uuid || ""}
                        onChange={handleChange}
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
    const isActive = pathname === item.path
    const { selectedCompany } = useAppStore()

    return (
        <ListItem disablePadding style={{ display: "block" }}>
            <Link
                href={`${COMPANIES_ROUTE}/${selectedCompany?.uuid}${item.path}`}
                style={{ color: "inherit", textDecoration: "none" }}
            >
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
