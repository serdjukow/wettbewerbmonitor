"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { addSistrixApiKey, getSistrixApiKey } from "@/src/services/firebaseService"
import { useAuth } from "@/src/context/AuthContext"

import { Box, TextField, IconButton, Stack } from "@mui/material"
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material"
import PageLoader from "@/src/components/PageLoader"

const SettingsPage = () => {
    const { user, loading } = useAuth()
    const [isEdit, setIsEdit] = useState(false)
    const [apiKey, setApiKey] = useState("")

    useEffect(() => {
        const fetchApiKey = async () => {
            if (user) {
                const key = await getSistrixApiKey()
                if (key) {
                    setApiKey(key)
                } else {
                    setApiKey("")
                }
            }
        }

        fetchApiKey()
    }, [user])

    const handleSave = async () => {
        await addSistrixApiKey(apiKey)
        setIsEdit(false)
    }

    if (loading) return <PageLoader />

    return (
        <Box component="form" sx={{ "& > :not(style)": { m: 1, width: "70ch" } }} noValidate autoComplete="off">
            <Stack direction="row" spacing={1}>
                <TextField
                    id="outlined-basic"
                    label="Sistrix API Key"
                    variant="outlined"
                    sx={{ width: "100%" }}
                    placeholder="Enter Sistrix API Key"
                    disabled={!isEdit}
                    value={apiKey}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setApiKey(event.target.value)
                    }}
                />

                {isEdit ? (
                    <>
                        <IconButton onClick={handleSave} color="success" aria-label="add to shopping cart">
                            <SaveIcon />
                        </IconButton>
                        <IconButton onClick={() => setIsEdit(!isEdit)} color="warning" aria-label="add to shopping cart">
                            <CancelIcon />
                        </IconButton>
                    </>
                ) : (
                    <IconButton onClick={() => setIsEdit(!isEdit)} color="primary" aria-label="add to shopping cart">
                        <EditIcon />
                    </IconButton>
                )}
            </Stack>
        </Box>
    )
}

export default SettingsPage
