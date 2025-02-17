"use client"
import { useForm, Controller } from "react-hook-form"
import { useRouter } from "next/navigation"
import { type Competitor } from "@/src/utils/types"
import { useAppStore } from "@/src/store/appStore"
import { v4 as uuidv4 } from "uuid"

import { TextField, Button, Stack, Box, Typography, Card, CardContent } from "@mui/material"

function CompetitorCreatePage() {
    const router = useRouter()
    const { updateCompany, selectedCompany } = useAppStore()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Competitor>({
        defaultValues: {
            uuid: uuidv4(),
            name: "",
            domain: "",
            address: { street: "", houseNumber: "", city: "", postalCode: "" },
            contact: { email: "", phone: "" },
            socialNetworks: {
                facebook: "",
                instagram: "",
                linkedin: "",
                twitter: "",
            },
        },
    })

    const handleSaveCompetitor = (data: Competitor) => {
        if (selectedCompany?.uuid) {
            const currentCompetitors = selectedCompany?.seo?.competitors || []

            updateCompany(selectedCompany?.uuid, {
                seo: { competitors: [...currentCompetitors, data] },
            })

            router.back()
            reset()
        }
    }

    return (
        <Card sx={{ paddingTop: 4 }}>
            <CardContent>
                <form onSubmit={handleSubmit(handleSaveCompetitor)}>
                    <Stack spacing={2}>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: "Company name is required" }}
                            render={({ field }) => (
                                <TextField fullWidth label="Company Name" variant="outlined" {...field} error={!!errors.name} helperText={errors.name?.message} required />
                            )}
                        />

                        <Typography variant="h6">Address</Typography>
                        <Controller name="address.street" control={control} render={({ field }) => <TextField fullWidth label="Street" variant="outlined" {...field} required />} />
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <Controller
                                name="address.houseNumber"
                                control={control}
                                render={({ field }) => <TextField fullWidth label="House Number" variant="outlined" {...field} />}
                            />
                            <Controller
                                name="address.postalCode"
                                control={control}
                                render={({ field }) => <TextField fullWidth label="Postal Code" variant="outlined" {...field} />}
                            />
                        </Stack>
                        <Controller name="address.city" control={control} render={({ field }) => <TextField fullWidth label="City" variant="outlined" {...field} />} />

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <Controller
                                name="contact.phone"
                                control={control}
                                rules={{
                                    required: "Phone number is required",
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: "Phone number must be numeric",
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        variant="outlined"
                                        {...field}
                                        error={!!errors.contact?.phone}
                                        helperText={errors.contact?.phone?.message}
                                        required
                                    />
                                )}
                            />
                            <Controller
                                name="contact.email"
                                control={control}
                                rules={{
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: "Invalid email address",
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        variant="outlined"
                                        {...field}
                                        error={!!errors.contact?.email}
                                        helperText={errors.contact?.email?.message}
                                        required
                                    />
                                )}
                            />
                        </Stack>
                        <Controller name="domain" control={control} render={({ field }) => <TextField fullWidth label="Domaine" variant="outlined" {...field} />} />

                        <Typography variant="h6">Social Networks</Typography>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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

                        <Box sx={{ marginTop: 2 }}>
                            <Button type="submit" variant="contained" color="primary">
                                Submit
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </CardContent>
        </Card>
    )
}

export default CompetitorCreatePage
