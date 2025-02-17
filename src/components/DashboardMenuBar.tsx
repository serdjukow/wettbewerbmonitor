import { useState, MouseEvent } from "react"
import { useAuth } from "@/src/context/AuthContext"
import { redirect } from "next/navigation"
import { deleteCookie } from "cookies-next"
import Link from "next/link"
import { toast } from "react-toastify"

import { Box, AppBar, Toolbar, Button, IconButton, Menu, Container } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import ColorModeIconDropdown from "@/src/theme/ColorModeIconDropdown"
import Sitemark from "./SitemarkIcon"

import { HOME_ROUTE, COMPANIES_ROUTE } from "@/src/utils/consts"

const DashboardMenuBar = () => {     
    const { logOut } = useAuth()

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)

    const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget)
    }

    const handleCloseNavMenu = () => {
        setAnchorElNav(null)
    }

    const logOutFunktion = () => {
        logOut()
        deleteCookie("auth_token")
        toast.success("You have successfully logged out.")
        redirect(HOME_ROUTE)
    }

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <Box
                    sx={{
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        px: 0,
                    }}
                >
                    <Sitemark />
                </Box>
                <Container
                    maxWidth="xl"
                    sx={{
                        margin: "0 auto 0 0",
                        width: "100%",
                    }}
                >
                    <Toolbar disableGutters>
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "flex", md: "none" },
                            }}
                        >
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: "block", md: "none" } }}
                            >
                                <Link
                                    href={COMPANIES_ROUTE}
                                    onClick={handleCloseNavMenu}
                                    style={{
                                        color: "inherit",
                                        textDecoration: "none",
                                    }}
                                >
                                    <Button
                                        sx={{
                                            my: 2,
                                            color: "white",
                                            display: "block",
                                        }}
                                    >
                                        My Companies
                                    </Button>
                                </Link>
                                <Link
                                    href={"/settings"}
                                    onClick={handleCloseNavMenu}
                                    style={{
                                        color: "inherit",
                                        textDecoration: "none",
                                    }}
                                >
                                    <Button
                                        sx={{
                                            my: 2,
                                            color: "white",
                                            display: "block",
                                        }}
                                    >
                                        Settings
                                    </Button>
                                </Link>
                            </Menu>
                        </Box>

                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "none", md: "flex" },
                            }}
                        >
                            <Link
                                href={COMPANIES_ROUTE}
                                style={{
                                    color: "inherit",
                                    textDecoration: "none",
                                }}
                            >
                                <Button
                                    sx={{
                                        my: 2,
                                        color: "white",
                                        display: "block",
                                    }}
                                >
                                    My Companies
                                </Button>
                            </Link>
                            <Link
                                href={"/settings"}
                                style={{
                                    color: "inherit",
                                    textDecoration: "none",
                                }}
                            >
                                <Button
                                    sx={{
                                        my: 2,
                                        color: "white",
                                        display: "block",
                                    }}
                                >
                                    Settings
                                </Button>
                            </Link>
                        </Box>
                    </Toolbar>
                </Container>
                <Box sx={{ flexShrink: 0 }}>
                    <Button color="inherit" onClick={logOutFunktion}>
                        Sign Out
                    </Button>
                    <ColorModeIconDropdown />
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default DashboardMenuBar
