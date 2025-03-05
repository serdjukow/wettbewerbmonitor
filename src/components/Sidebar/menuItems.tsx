import { ReactNode } from "react"
import {
    Home as HomeIcon,
    TrendingUp as TrendingUpIcon,
    Key as KeyIcon,
    InsertLink as InsertLinkIcon,
    Edit as EditIcon,
    Abc as AbcIcon,
    AutoMode as AutoModeIcon,
} from "@mui/icons-material"
import {
    DASHBOARD_ROUTE,
    COMPETITORS_ROUTE,
    DOMAINS_ROUTE,
    KEYWORDS_ROUTE,
    EDIT_PROFILE_ROUTE,
    DOMAIN_KEYWORDS_ROUTE,
    AUTOPILOT_ROUTE,
} from "@/src/utils/consts"

export interface MenuItem {
    title: string
    icon: ReactNode
    path: string
}

export const menuItems: MenuItem[] = [
    { title: "Dashboard", icon: <HomeIcon />, path: DASHBOARD_ROUTE },
    { title: "Search by Domain", icon: <InsertLinkIcon />, path: DOMAINS_ROUTE },
    { title: "Search by Keyword", icon: <KeyIcon />, path: KEYWORDS_ROUTE },
    { title: "Keywords by Domain", icon: <AbcIcon />, path: DOMAIN_KEYWORDS_ROUTE },
    { title: "Autopilot", icon: <AutoModeIcon />, path: AUTOPILOT_ROUTE },
    { title: "Competitors", icon: <TrendingUpIcon />, path: COMPETITORS_ROUTE },
    { title: "Edit profile", icon: <EditIcon />, path: EDIT_PROFILE_ROUTE },
]
