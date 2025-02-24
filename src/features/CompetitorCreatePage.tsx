"use client"

import { useForm, Controller } from "react-hook-form"
import { useRouter } from "next/navigation"
import { type Competitor } from "@/src/utils/types"
import { useAppStore } from "@/src/store/appStore"
import { v4 as uuidv4 } from "uuid"

import { TextField, Button, Stack, Box, Typography, Card, CardContent, Container } from "@mui/material"

const CompetitorCreatePage = () => {
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
            status: "not_checked",
        },
    })

    const handleSaveCompetitor = (data: Competitor) => {
        if (selectedCompany?.uuid) {
            const currentCompetitors = selectedCompany.seo?.competitors || []

            const formattedCompetitor: Competitor = {
                uuid: data.uuid || uuidv4(),
                name: data.name || "",
                status: data.status || "not_checked",
                products: data.products || [],
                domain: data.domain || "",
                keyword: data.keyword || "",
                url: data.url || "",
                address: {
                    street: data.address?.street ?? "",
                    houseNumber: data.address?.houseNumber ?? "",
                    postalCode: data.address?.postalCode ?? "",
                    city: data.address?.city ?? "",
                },
                contact: {
                    email: data.contact?.email ?? "",
                    phone: data.contact?.phone ?? "",
                },
                socialNetworks: {
                    facebook: data.socialNetworks?.facebook ?? "",
                    instagram: data.socialNetworks?.instagram ?? "",
                    linkedin: data.socialNetworks?.linkedin ?? "",
                    twitter: data.socialNetworks?.twitter ?? "",
                },
            }

            updateCompany(selectedCompany.uuid, {
                seo: { competitors: [...currentCompetitors, formattedCompetitor] },
            })

            router.back()
            reset()
        }
    }

    return (
        <Container>
            <Card sx={{ paddingTop: 4 }}>
                <CardContent>
                    <form onSubmit={handleSubmit(handleSaveCompetitor)}>
                        <Stack spacing={2}>
                            {/* Competitor Name */}
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: "Competitor name is required" }}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label="Competitor Name"
                                        variant="outlined"
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                        required
                                    />
                                )}
                            />

                            {/* Address */}
                            <Typography variant="h6">Address</Typography>
                            <Controller
                                name="address.street"
                                control={control}
                                render={({ field }) => <TextField fullWidth label="Street" variant="outlined" value={field.value ?? ""} onChange={field.onChange} required />}
                            />
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <Controller
                                    name="address.houseNumber"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="House Number" variant="outlined" value={field.value ?? ""} onChange={field.onChange} />}
                                />
                                <Controller
                                    name="address.postalCode"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="Postal Code" variant="outlined" value={field.value ?? ""} onChange={field.onChange} />}
                                />
                            </Stack>
                            <Controller
                                name="address.city"
                                control={control}
                                render={({ field }) => <TextField fullWidth label="City" variant="outlined" value={field.value ?? ""} onChange={field.onChange} />}
                            />

                            {/* Contact */}
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
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
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
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            error={!!errors.contact?.email}
                                            helperText={errors.contact?.email?.message}
                                            required
                                        />
                                    )}
                                />
                            </Stack>

                            {/* Domain & URL */}
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <Controller
                                    name="domain"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="Website" variant="outlined" value={field.value ?? ""} onChange={field.onChange} />}
                                />
                                <Controller
                                    name="url"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="URL" variant="outlined" value={field.value ?? ""} onChange={field.onChange} />}
                                />
                            </Stack>

                            {/* Keyword */}
                            <Typography variant="h6">Keyword</Typography>
                            <Controller
                                name="keyword"
                                control={control}
                                render={({ field }) => <TextField fullWidth label="Keyword" variant="outlined" value={field.value ?? ""} onChange={field.onChange} />}
                            />

                            {/* Social Networks */}
                            <Typography variant="h6">Social Networks</Typography>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <Controller
                                    name="socialNetworks.linkedin"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="LinkedIn" variant="outlined" value={field.value ?? ""} onChange={field.onChange} />}
                                />
                                <Controller
                                    name="socialNetworks.twitter"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="Twitter" variant="outlined" value={field.value ?? ""} onChange={field.onChange} />}
                                />
                            </Stack>

                            {/* Submit Button */}
                            <Box sx={{ marginTop: 2 }}>
                                <Button type="submit" variant="contained" color="primary">
                                    Submit
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </Container>
    )
}

export default CompetitorCreatePage
