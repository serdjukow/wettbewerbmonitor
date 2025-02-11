"use client"

import { useEffect, useState } from "react"
import { addSistrixApiKey, getSistrixApiKey } from "@/services/firebaseService"
import { useAuth } from "@/context/AuthContext"

import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
} from "@mui/icons-material"
import PageLoader from "@/components/PageLoader"

const Settings = () => {
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
        <Box
            component="form"
            sx={{ "& > :not(style)": { m: 1, width: "70ch" } }}
            noValidate
            autoComplete="off"
        >
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
                        <IconButton
                            onClick={handleSave}
                            color="success"
                            aria-label="add to shopping cart"
                        >
                            <SaveIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => setIsEdit(!isEdit)}
                            color="warning"
                            aria-label="add to shopping cart"
                        >
                            <CancelIcon />
                        </IconButton>
                    </>
                ) : (
                    <IconButton
                        onClick={() => setIsEdit(!isEdit)}
                        color="primary"
                        aria-label="add to shopping cart"
                    >
                        <EditIcon />
                    </IconButton>
                )}
            </Stack>
        </Box>
    )
}

export default Settings
