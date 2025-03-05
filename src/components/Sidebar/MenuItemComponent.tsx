import Link from "next/link"
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { usePathname } from "next/navigation"
import { getPagePath } from "@/src/utils/functions"
import { useAppStore } from "@/src/store/appStore"
import { COMPANIES_ROUTE } from "@/src/utils/consts"
import { MenuItem } from "./menuItems"

interface Props {
    item: MenuItem
}

const MenuItemComponent = ({ item }: Props) => {
    const pathname = usePathname()
    const path = getPagePath(pathname ?? "")
    const isActive = path === item.path
    const { selectedCompany } = useAppStore()

    return (
        <ListItem disablePadding>
            <Link
                href={`${COMPANIES_ROUTE}/${selectedCompany?.uuid}${item.path}`}
                style={{ color: "inherit", textDecoration: "none", width: "100%" }}
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

export default MenuItemComponent
