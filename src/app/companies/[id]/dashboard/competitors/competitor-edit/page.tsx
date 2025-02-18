"use client"

import React, { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import { useAppStore } from "@/src/store/appStore"
import { type Competitor } from "@/src/utils/types"

import { TextField, Button, Stack, Box, Typography, Card, CardContent, Container } from "@mui/material"
import { Save as SaveIcon, Cancel as CancelIcon, DeleteForever as DeleteForeverIcon } from "@mui/icons-material"

function CompetitorEditPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const uuid = searchParams.get("uuid")
    const { selectedCompany, updateCompany } = useAppStore()

    // Начальные значения формы (без поля position)
    const { control, handleSubmit, reset } = useForm<Competitor>({
        defaultValues: {
            uuid: "",
            url: "",
            domain: "",
            keyword: "",
            name: "",
            address: { street: "", houseNumber: "", postalCode: "", city: "" },
            contact: { phone: "", email: "" },
            socialNetworks: { facebook: "", instagram: "", linkedin: "", twitter: "" },
        },
    })

    // При монтировании ищем конкурента в списке competitorsByKeyword
    useEffect(() => {
        if (selectedCompany?.seo?.competitorsByKeyword && uuid) {
            const competitor = selectedCompany.seo.competitorsByKeyword.find((c) => c.uuid === uuid)
            if (competitor) {
                reset(competitor)
            }
        }
    }, [selectedCompany, uuid, reset])

    // Функция сохранения изменений
    const onSubmit = async (data: Competitor) => {
        if (!selectedCompany || !selectedCompany.uuid || !uuid) {
            toast.error("Error: No competitor found!")
            return
        }

        try {
            // Обновляем список, заменяя изменённого конкурента (оставляем position без изменений)
            const updatedCompetitors = selectedCompany.seo?.competitorsByKeyword?.map((c) => (c.uuid === uuid ? { ...c, ...data } : c))

            await updateCompany(selectedCompany.uuid, {
                seo: { competitorsByKeyword: updatedCompetitors },
            })
            router.back()
        } catch (error) {
            toast.error(`Error updating competitor! ${error}`)
        }
    }

    // Функция удаления конкурента
    const handleDeleteCompetitor = async () => {
        if (!selectedCompany || !selectedCompany.uuid || !uuid) {
            toast.error("Error: No competitor found!")
            return
        }

        try {
            const updatedCompetitors = selectedCompany.seo?.competitorsByKeyword?.filter((c) => c.uuid !== uuid)
            await updateCompany(selectedCompany.uuid, {
                seo: { competitorsByKeyword: updatedCompetitors },
            })
            router.back()
        } catch (error) {
            toast.error(`Error when deleting a competitor! ${error}`)
        }
    }

    return (
        <Container>
            <Card sx={{ paddingTop: 4 }}>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={2}>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => <TextField fullWidth label="Competitor Name" variant="outlined" {...field} required />}
                            />
                            <Controller
                                name="contact.email"
                                control={control}
                                render={({ field }) => <TextField fullWidth label="Email" variant="outlined" {...field} required />}
                            />
                            <Controller
                                name="contact.phone"
                                control={control}
                                render={({ field }) => <TextField fullWidth label="Phone" variant="outlined" {...field} />}
                            />
                            <Typography variant="h6">Address</Typography>
                            <Controller
                                name="address.street"
                                control={control}
                                render={({ field }) => <TextField fullWidth label="Street" variant="outlined" {...field} />}
                            />
                            <Controller
                                name="address.houseNumber"
                                control={control}
                                render={({ field }) => <TextField fullWidth label="House Number" variant="outlined" {...field} />}
                            />
                            <Stack direction="row" spacing={2}>
                                <Controller
                                    name="address.city"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="City" variant="outlined" {...field} />}
                                />
                                <Controller
                                    name="address.postalCode"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="Postal Code" variant="outlined" {...field} />}
                                />
                            </Stack>
                            <Typography variant="h6">Website</Typography>
                            <Controller
                                name="domain"
                                control={control}
                                render={({ field }) => <TextField fullWidth label="Website" variant="outlined" {...field} />}
                            />
                            <Typography variant="h6">Keyword</Typography>
                            <Controller
                                name="keyword"
                                control={control}
                                render={({ field }) => <TextField fullWidth label="Keyword" variant="outlined" {...field} />}
                            />
                            <Typography variant="h6">Social Networks</Typography>
                            <Stack direction="row" spacing={2}>
                                <Controller
                                    name="socialNetworks.facebook"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="Facebook" variant="outlined" {...field} />}
                                />
                                <Controller
                                    name="socialNetworks.instagram"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="Instagram" variant="outlined" {...field} />}
                                />
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                <Controller
                                    name="socialNetworks.linkedin"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="LinkedIn" variant="outlined" {...field} />}
                                />
                                <Controller
                                    name="socialNetworks.twitter"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="Twitter" variant="outlined" {...field} />}
                                />
                            </Stack>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "10px",
                                    paddingTop: 4,
                                }}
                            >
                                <Button type="submit" variant="outlined" startIcon={<SaveIcon />} color="success">
                                    Save Changes
                                </Button>
                                <Button onClick={() => router.back()} variant="outlined" startIcon={<CancelIcon />} color="warning">
                                    Cancel
                                </Button>
                                <Button onClick={handleDeleteCompetitor} variant="outlined" startIcon={<DeleteForeverIcon />} color="error">
                                    Delete
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </Container>
    )
}

export default CompetitorEditPage
