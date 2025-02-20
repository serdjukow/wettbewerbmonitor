"use client"

import React, { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import { useAppStore } from "@/src/store/appStore"
import { type Competitor, type GeneralService } from "@/src/utils/types"
import ProductsDialog from "@/src/components/ProductsDialog"

import { TextField, Button, Stack, Box, Typography, Card, CardContent, Container, Alert } from "@mui/material"
import { Save as SaveIcon, Cancel as CancelIcon, DeleteForever as DeleteForeverIcon } from "@mui/icons-material"

function CompetitorEditPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const uuid = searchParams.get("uuid")
    const { selectedCompany, updateCompany } = useAppStore()

    const { control, handleSubmit, reset, watch } = useForm<Competitor>({
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
            socialNetworks: { facebook: "", instagram: "", linkedin: "", twitter: "" },
        },
    })

    const [openProductsDialog, setOpenProductsDialog] = useState(false)
    const [editingCompetitor, setEditingCompetitor] = useState<Competitor | null>(null)

    useEffect(() => {
        if (selectedCompany?.seo?.competitorsByKeyword && uuid) {
            const competitor = selectedCompany.seo.competitorsByKeyword.find((c) => c.uuid === uuid)
            if (competitor) {
                reset(competitor)
                setEditingCompetitor(competitor)
            }
        }
    }, [selectedCompany, uuid, reset])

    const onSubmit = async (data: Competitor) => {
        if (!selectedCompany || !selectedCompany.uuid || !uuid) {
            toast.error("Error: No competitor found!")
            return
        }

        try {
            const updatedCompetitors = selectedCompany.seo?.competitorsByKeyword?.map((c) => (c.uuid === uuid ? { ...c, ...data } : c))

            await updateCompany(selectedCompany.uuid, {
                seo: { competitorsByKeyword: updatedCompetitors },
            })
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
            const updatedCompetitors = selectedCompany.seo?.competitorsByKeyword?.filter((c) => c.uuid !== uuid)
            await updateCompany(selectedCompany.uuid, {
                seo: { competitorsByKeyword: updatedCompetitors },
            })
            router.back()
        } catch (error) {
            toast.error(`Error when deleting a competitor! ${error}`)
        }
    }

    const handleOpenProductsDialog = () => {
        setOpenProductsDialog(true)
    }
    const handleCloseProductsDialog = () => {
        setOpenProductsDialog(false)
    }
    const handleSaveProducts = (products: string[]) => {
        const productsMapped = products.map((prod) => ({ title: prod }))
        reset({ ...watch(), products: productsMapped })
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
                                render={({ field }) => (
                                    <TextField fullWidth label="Competitor Name" variant="outlined" {...field} required />
                                )}
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
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="h6">Products / Services</Typography>
                                <Button variant="outlined" onClick={handleOpenProductsDialog}>
                                    Edit Products
                                </Button>
                            </Box>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                {watch("products")?.length > 0 ? (
                                    watch("products").map((prod, index: number) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                border: "1px solid",
                                                borderColor: "grey.400",
                                                borderRadius: 1,
                                                px: 1,
                                                py: 0.5,
                                                mb: 0.5,
                                            }}
                                        >
                                            <Typography variant="caption">{prod.title}</Typography>
                                        </Box>
                                    ))
                                ) : (
                                    <Alert severity="warning" sx={{ mt: 2 }}>
                                        Services / Products not filled
                                    </Alert>
                                )}
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

            <ProductsDialog
                open={openProductsDialog}
                competitorName={editingCompetitor?.name}
                products={(watch("products") as GeneralService[]).map((prod) => prod.title)}
                onClose={handleCloseProductsDialog}
                onSave={handleSaveProducts}
            />
        </Container>
    )
}

export default CompetitorEditPage
