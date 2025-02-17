"use client"
import { useForm, Controller } from "react-hook-form"
import { useRouter } from "next/navigation"
import { type Company } from "@/src/utils/types"
import { addCompanyToDB } from "@/src/services/firebaseService"

import { TextField, Button, Stack, Box, Typography } from "@mui/material"
import { COMPANIES_ROUTE } from "@/src/utils/consts"

const AddCompanyPage = () => {
    const router = useRouter()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Company>({
        defaultValues: {
            name: "",
            contact: { email: "", phone: "" },
            address: { street: "", houseNumber: "", city: "", postalCode: "" },
            socialNetworks: {
                facebook: "",
                instagram: "",
                linkedin: "",
                twitter: "",
            },
        },
    })

    const onSubmit = async (data: Company) => {
        await addCompanyToDB(data)
        reset()
        router.push(COMPANIES_ROUTE)
    }

    return (
        <Box sx={{ padding: 1 }}>
            <Typography variant="h4" gutterBottom>
                Add New Company
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                    {/* Company Name */}
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: "Company name is required" }}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                label="Company Name"
                                variant="outlined"
                                {...field}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                required
                            />
                        )}
                    />

                    <Typography variant="h6">Address</Typography>
                    <Controller
                        name="address.street"
                        control={control}
                        render={({ field }) => <TextField fullWidth label="Street" variant="outlined" {...field} required />}
                    />
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
                    <Controller
                        name="address.city"
                        control={control}
                        render={({ field }) => <TextField fullWidth label="City" variant="outlined" {...field} />}
                    />

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

                    {/* Website Field */}
                    <Controller
                        name="website"
                        control={control}
                        render={({ field }) => <TextField fullWidth label="Website" variant="outlined" {...field} />}
                    />

                    {/* Social Networks Fields */}
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
        </Box>
    )
}

export default AddCompanyPage
