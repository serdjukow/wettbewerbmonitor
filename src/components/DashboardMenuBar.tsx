"use client"

import React, { useState, MouseEvent } from "react"
import { useAuth } from "@/src/context/AuthContext"
import { redirect } from "next/navigation"
import { deleteCookie } from "cookies-next"
import Link from "next/link"
import { toast } from "react-toastify"

import { Box, AppBar, Toolbar, Button, IconButton, Menu, MenuItem, Container, Tooltip, Avatar, Typography } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import ColorModeIconDropdown from "@/src/theme/ColorModeIconDropdown"
import Sitemark from "./SitemarkIcon"
import PersonIcon from "@mui/icons-material/Person"
import Image from "next/image"

import { HOME_ROUTE, COMPANIES_ROUTE } from "@/src/utils/consts"

export interface User {
    id: string
    email: string
    name?: string
    avatarUrl?: string
    photoURL?: string
    displayName?: string
}

const DashboardMenuBar = () => {
    const { logOut, user } = useAuth()
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)

    console.log(user)

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

    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget)
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null)
    }

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", px: 0 }}>
                    <Sitemark />
                </Box>
                <Container maxWidth="xl" sx={{ margin: "0 auto 0 0", width: "100%" }}>
                    <Toolbar disableGutters>
                        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                            <IconButton
                                size="large"
                                aria-label="open navigation menu"
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
                                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                                keepMounted
                                transformOrigin={{ vertical: "top", horizontal: "left" }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: "block", md: "none" } }}
                            >
                                <Link href={COMPANIES_ROUTE} style={{ color: "inherit", textDecoration: "none" }}>
                                    <MenuItem onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">My Companies</Typography>
                                    </MenuItem>
                                </Link>
                                <Link href="/settings" style={{ color: "inherit", textDecoration: "none" }}>
                                    <MenuItem onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">Settings</Typography>
                                    </MenuItem>
                                </Link>
                            </Menu>
                        </Box>

                        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                            <Link href={COMPANIES_ROUTE} style={{ color: "inherit", textDecoration: "none" }}>
                                <Button sx={{ my: 2, color: "white", display: "block" }}>My Companies</Button>
                            </Link>
                            <Link href="/settings" style={{ color: "inherit", textDecoration: "none" }}>
                                <Button sx={{ my: 2, color: "white", display: "block" }}>Settings</Button>
                            </Link>
                        </Box>
                    </Toolbar>
                </Container>

                <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 2 }}>
                    <ColorModeIconDropdown />
                    <Box sx={{ ml: 2 }}>
                        <Tooltip title={user?.displayName}>
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar sx={{ width: 40, height: 40 }}>
                                    {user?.photoURL ? (
                                        <Image src={user?.photoURL} alt={user?.displayName || "User Avatar"} width={40} height={40} />
                                    ) : (
                                        <PersonIcon />
                                    )}
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
                            keepMounted
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <Box sx={{ p: 2 }}>
                                <Typography sx={{ textAlign: "center" }}>{user?.email || "No email"}</Typography>
                            </Box>
                            <MenuItem onClick={handleCloseUserMenu}>
                                <span color="inherit" onClick={logOutFunktion}>
                                    Sign Out
                                </span>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default DashboardMenuBar
