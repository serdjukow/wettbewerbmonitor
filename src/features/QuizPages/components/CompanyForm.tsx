import React from "react"
import { useForm, Controller } from "react-hook-form"
import { TextField, Button, Grid, Card, CardContent, Box } from "@mui/material"
import CountrySelect from "@/src/components/CountrySelect"
import { type TrackedCountry } from "@/src/utils/types"

interface CompanyFormValues {
    name: string
    country: TrackedCountry
    address: {
        street: string
        houseNumber: string
        postalCode: string
        city: string
    }
    contact: {
        phone: string
        email: string
    }
    website: string
    socialNetworks: {
        facebook: string
        instagram: string
        linkedin: string
        twitter: string
    }
}

const CompanyForm: React.FC = () => {
    const {
        handleSubmit,
        control,
        trigger,
        formState: { errors },
    } = useForm<CompanyFormValues>({
        defaultValues: {
            name: "",
            country: { country: "", country_name: "" },
            address: {
                street: "",
                houseNumber: "",
                postalCode: "",
                city: "",
            },
            contact: {
                phone: "",
                email: "",
            },
            website: "",
            socialNetworks: {
                facebook: "",
                instagram: "",
                linkedin: "",
                twitter: "",
            },
        },
    })

    const onSubmit = (data: CompanyFormValues) => {
        console.log("Submitted Data:", data)
        // Здесь реализуйте логику сохранения данных (например, отправку на сервер)
    }

    return (
        <Card sx={{ p: 1 }}>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        {/* Company Name */}
                        <Grid item xs={12}>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: "Company name is required" }}
                                render={({ field }) => (
                                    <TextField fullWidth label="Company Name" variant="outlined" {...field} error={!!errors.name} helperText={errors.name?.message} required />
                                )}
                            />
                        </Grid>

                        {/* Country и Website в одну строку */}
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="country"
                                control={control}
                                rules={{ required: "Country is required" }}
                                render={({ field }) => (
                                    <CountrySelect
                                        value={field.value}
                                        onChange={(selected: TrackedCountry) => {
                                            field.onChange(selected)
                                            trigger("country")
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="website"
                                control={control}
                                rules={{ required: "Website is required" }}
                                render={({ field }) => (
                                    <TextField fullWidth label="Website" variant="outlined" {...field} error={!!errors.website} helperText={errors.website?.message} required />
                                )}
                            />
                        </Grid>

                        {/* Address */}
                        <Grid item xs={12}>
                            <Controller
                                name="address.street"
                                control={control}
                                rules={{ required: "Street is required" }}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label="Street"
                                        variant="outlined"
                                        {...field}
                                        error={!!errors.address?.street}
                                        helperText={errors.address?.street?.message}
                                        required
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="address.houseNumber"
                                control={control}
                                rules={{ required: "House number is required" }}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label="House Number"
                                        variant="outlined"
                                        {...field}
                                        error={!!errors.address?.houseNumber}
                                        helperText={errors.address?.houseNumber?.message}
                                        required
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="address.postalCode"
                                control={control}
                                rules={{ required: "Postal Code is required" }}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label="Postal Code"
                                        variant="outlined"
                                        {...field}
                                        error={!!errors.address?.postalCode}
                                        helperText={errors.address?.postalCode?.message}
                                        required
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="address.city"
                                control={control}
                                rules={{ required: "City is required" }}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label="City"
                                        variant="outlined"
                                        {...field}
                                        error={!!errors.address?.city}
                                        helperText={errors.address?.city?.message}
                                        required
                                    />
                                )}
                            />
                        </Grid>

                        {/* Contact */}
                        <Grid item xs={6}>
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
                        </Grid>
                        <Grid item xs={6}>
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
                        </Grid>

                        {/* Social Networks */}
                        <Grid item xs={6}>
                            <Controller
                                name="socialNetworks.facebook"
                                control={control}
                                rules={{ required: "Facebook profile is required" }}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label="Facebook"
                                        variant="outlined"
                                        {...field}
                                        error={!!errors.socialNetworks?.facebook}
                                        helperText={errors.socialNetworks?.facebook?.message}
                                        required
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="socialNetworks.instagram"
                                control={control}
                                rules={{ required: "Instagram profile is required" }}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label="Instagram"
                                        variant="outlined"
                                        {...field}
                                        error={!!errors.socialNetworks?.instagram}
                                        helperText={errors.socialNetworks?.instagram?.message}
                                        required
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="socialNetworks.linkedin"
                                control={control}
                                rules={{ required: "LinkedIn profile is required" }}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label="LinkedIn"
                                        variant="outlined"
                                        {...field}
                                        error={!!errors.socialNetworks?.linkedin}
                                        helperText={errors.socialNetworks?.linkedin?.message}
                                        required
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="socialNetworks.twitter"
                                control={control}
                                rules={{ required: "Twitter profile is required" }}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label="Twitter"
                                        variant="outlined"
                                        {...field}
                                        error={!!errors.socialNetworks?.twitter}
                                        helperText={errors.socialNetworks?.twitter?.message}
                                        required
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Submit
                        </Button>
                    </Box>
                </form>
            </CardContent>
        </Card>
    )
}

export default CompanyForm
