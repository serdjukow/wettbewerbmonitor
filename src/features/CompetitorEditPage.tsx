"use client"

export const dynamic = "force-dynamic"

import React, { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import { useAppStore } from "@/src/store/appStore"
import { type Competitor } from "@/src/utils/types"

import { TextField, Button, Stack, Box, Typography, Card, CardContent, Container } from "@mui/material"
import { Save as SaveIcon, Cancel as CancelIcon, DeleteForever as DeleteForeverIcon } from "@mui/icons-material"
import DeleteDialog from "../components/DeleteDialog"

const CompetitorEditPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const uuid = searchParams?.get("uuid")
    const { selectedCompany, updateCompany } = useAppStore()

    const { control, handleSubmit, reset } = useForm<Competitor>({
        defaultValues: {
            uuid: "",
            name: "",
            status: "not_checked",
            products: [],
            url: "",
            domain: "",
            keyword: "",
            address: { street: "", houseNumber: "", postalCode: "", city: "" },
            contact: { phone: "", email: "" },
            socialNetworks: {
                facebook: "",
                instagram: "",
                linkedin: "",
                twitter: "",
            },
        },
    })

    const [openConfirmDelete, setOpenConfirmDelete] = useState(false)

    useEffect(() => {
        if (selectedCompany?.seo?.competitors && uuid) {
            const competitor = selectedCompany.seo.competitors.find((c) => c.uuid === uuid)
            if (competitor) {
                reset(competitor)
            }
        }
    }, [selectedCompany, uuid, reset])

    const onSubmit = async (data: Competitor) => {
        if (!selectedCompany || !selectedCompany.uuid || !uuid) {
            toast.error("Error: No competitor found!")
            return
        }

        try {
            const updatedCompetitors = selectedCompany.seo?.competitors?.map((c) => (c.uuid === uuid ? { ...c, ...data } : c))

            await updateCompany(selectedCompany.uuid, {
                seo: { competitors: updatedCompetitors },
            })
            toast.success(`Competitor was successfully updated.`)
            router.back()
        } catch (error) {
            toast.error(`Error updating competitor! ${error}`)
        }
    }

    const handleDeleteCompetitor = async () => {
        if (!selectedCompany || !selectedCompany.uuid || !uuid) {
            toast.error("Error: No competitor found!")
            return
        }

        try {
            const updatedCompetitors = selectedCompany.seo?.competitors?.filter((c) => c.uuid !== uuid)
            await updateCompany(selectedCompany.uuid, {
                seo: { competitors: updatedCompetitors },
            })
            toast.success(`Competitor was successfully deleted.`)
            router.back()
        } catch (error) {
            toast.error(`Error deleting competitor! ${error}`)
        }
    }

    const handleOpenConfirmDelete = () => setOpenConfirmDelete(true)
    const handleCloseConfirmDelete = () => setOpenConfirmDelete(false)
    const handleConfirmDelete = async () => {
        await handleDeleteCompetitor()
        setOpenConfirmDelete(false)
    }

    return (
        <Container>
            <Card sx={{ paddingTop: 4 }}>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={2}>
                            {/* Competitor Name */}
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <TextField fullWidth label="Competitor Name" variant="outlined" value={field.value ?? ""} onChange={field.onChange} required />
                                )}
                            />

                            {/* Contact Information */}
                            <Controller
                                name="contact.email"
                                control={control}
                                render={({ field }) => <TextField fullWidth label="Email" variant="outlined" value={field.value ?? ""} onChange={field.onChange} required />}
                            />
                            <Controller
                                name="contact.phone"
                                control={control}
                                render={({ field }) => <TextField fullWidth label="Phone" variant="outlined" value={field.value ?? ""} onChange={field.onChange} />}
                            />

                            {/* Address */}
                            <Typography variant="h6">Address</Typography>
                            <Controller
                                name="address.street"
                                control={control}
                                render={({ field }) => <TextField fullWidth label="Street" variant="outlined" value={field.value ?? ""} onChange={field.onChange} />}
                            />
                            <Controller
                                name="address.houseNumber"
                                control={control}
                                render={({ field }) => <TextField fullWidth label="House Number" variant="outlined" value={field.value ?? ""} onChange={field.onChange} />}
                            />
                            <Stack direction="row" spacing={2}>
                                <Controller
                                    name="address.city"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="City" variant="outlined" value={field.value ?? ""} onChange={field.onChange} />}
                                />
                                <Controller
                                    name="address.postalCode"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="Postal Code" variant="outlined" value={field.value ?? ""} onChange={field.onChange} />}
                                />
                            </Stack>

                            {/* Website */}
                            <Typography variant="h6">Website</Typography>
                            <Controller
                                name="domain"
                                control={control}
                                render={({ field }) => <TextField fullWidth label="Website" variant="outlined" value={field.value ?? ""} onChange={field.onChange} />}
                            />

                            {/* Keyword */}
                            <Typography variant="h6">Keyword</Typography>
                            <Controller
                                name="keyword"
                                control={control}
                                render={({ field }) => <TextField fullWidth label="Keyword" variant="outlined" value={field.value ?? ""} onChange={field.onChange} />}
                            />

                            {/* Social Networks */}
                            <Typography variant="h6">Social Networks</Typography>
                            <Stack direction="row" spacing={2}>
                                <Controller
                                    name="socialNetworks.facebook"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="Facebook" variant="outlined" value={field.value ?? ""} onChange={field.onChange} />}
                                />
                                <Controller
                                    name="socialNetworks.instagram"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="Instagram" variant="outlined" value={field.value ?? ""} onChange={field.onChange} />}
                                />
                            </Stack>

                            {/* Actions */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "10px",
                                    paddingTop: 4,
                                }}
                            >
                                <Button type="submit" variant="contained" startIcon={<SaveIcon />} color="success">
                                    Save Changes
                                </Button>
                                <Button onClick={() => router.back()} variant="contained" startIcon={<CancelIcon />} color="warning">
                                    Cancel
                                </Button>
                                {/* Instead of directly calling handleDeleteCompetitor, open the confirmation dialog */}
                                <Button onClick={handleOpenConfirmDelete} variant="contained" startIcon={<DeleteForeverIcon />} color="error">
                                    Delete
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
            <DeleteDialog open={openConfirmDelete} onClose={handleCloseConfirmDelete} onConfirm={handleConfirmDelete} />
        </Container>
    )
}

export default CompetitorEditPage
