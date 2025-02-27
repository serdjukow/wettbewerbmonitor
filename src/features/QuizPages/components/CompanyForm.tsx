"use client"

import React, { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { TextField, Button, Grid, Card, CardContent, Box } from "@mui/material"
import CountrySelect from "@/src/components/CountrySelect"
import { type TrackedCountry, Company } from "@/src/utils/types"

interface CompanyFormProps {
    initialData: Company
    onSave: (companyData: Company) => void
}

const CompanyForm: React.FC<CompanyFormProps> = ({ initialData, onSave }) => {
    const {
        handleSubmit,
        control,
        trigger,
        setValue,
        watch,
        formState: { errors },
    } = useForm<Company>({
        defaultValues: initialData,
    })

    const selectedCountry = watch("country")

    useEffect(() => {
        const fetchCountry = async () => {
            try {
                const response = await fetch("https://get.geojs.io/v1/ip/geo.json")
                const data = await response.json()
                if (data && data.country && (!selectedCountry || !selectedCountry.country)) {
                    const autoDetectedCountry: TrackedCountry = {
                        country: data.country_code ? data.country_code.toLowerCase() : "de",
                        country_name: data.country ? data.country : "Germany",
                    }
                    setValue("country", autoDetectedCountry)
                    await trigger("country")
                }
            } catch (error) {
                console.error("Error detecting country:", error)
                const defaultCountry: TrackedCountry = { country: "de", country_name: "Germany" }
                setValue("country", defaultCountry)
                await trigger("country")
            }
        }

        fetchCountry()
    }, [setValue, trigger, selectedCountry])

    const onSubmit = (data: Company) => {
        console.log("Submitted Data:", data)
        onSave(data)
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

                        {/* Country и Website */}
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

                        {/* Address – улица и город в одной строке */}
                        <Grid item xs={12} sm={6}>
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
                        <Grid item xs={12} sm={6}>
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
                        {/* Address – номер дома и почтовый индекс в одной строке */}
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
