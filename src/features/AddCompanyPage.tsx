"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { useRouter } from "next/navigation"
import { type Company, type TrackedCountry } from "@/src/utils/types"
import { addCompanyToDB } from "@/src/services/firebaseService"

import { TextField, Button, Stack, Box, Typography, Container, Card, CardContent } from "@mui/material"
import { COMPANIES_ROUTE } from "@/src/utils/consts"
import CountrySelect from "@/src/components/CountrySelect"

const AddCompanyPage = () => {
    const router = useRouter()

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        trigger,
        watch,
        formState: { errors },
    } = useForm<Company>({
        defaultValues: {
            name: "",
            country: { country: "", country_name: "" },
            contact: { email: "", phone: "" },
            address: { street: "", houseNumber: "", city: "", postalCode: "" },
            website: "",
            socialNetworks: {
                facebook: "",
                instagram: "",
                linkedin: "",
                twitter: "",
            },
        },
    })

    const selectedCountry = watch("country")

    useEffect(() => {
        const fetchCountry = async () => {
            try {
                const response = await fetch("https://get.geojs.io/v1/ip/geo.json")
                const data = await response.json()
                if (data && data.country && !selectedCountry.country) {
                    const autoDetectedCountry: TrackedCountry = {
                        country: data.country_code.toLowerCase(),
                        country_name: data.country.toLowerCase(),
                    }

                    setValue("country", autoDetectedCountry)
                    await trigger("country")
                }
            } catch (error) {
                console.error("Error detecting country:", error)
            }
        }

        fetchCountry()
    }, [setValue, trigger, selectedCountry])

    const onSubmit = async (data: Company) => {
        if (!data.country || !data.country.country_name || !data.country.country) {
            console.error("Country code is missing", data.country)
            return
        }

        const countrySelectInput = data.country.country_name || selectedCountry.country_name

        if (!countrySelectInput) {
            console.error("Country name is missing")
            return
        }

        await addCompanyToDB({
            ...data,
            country: {
                country: data.country.country,
                country_name: countrySelectInput,
            },
        })

        console.log("Submitted data:", {
            ...data,
            country: {
                country: data.country.country,
                country_name: countrySelectInput,
            },
        })

        reset()
        router.push(COMPANIES_ROUTE)
    }

    return (
        <Container
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pt: 2,
                minHeight: "calc(100vh - 68px)",
            }}
        >
            <Card sx={{ padding: 1 }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Add New Company
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={2}>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: "Company name is required" }}
                                render={({ field }) => (
                                    <TextField fullWidth label="Company Name" variant="outlined" {...field} error={!!errors.name} helperText={errors.name?.message} required />
                                )}
                            />

                            <Typography variant="h6">Country</Typography>
                            <Controller
                                name="country"
                                control={control}
                                rules={{ required: "Country is required" }}
                                render={({ field }) => (
                                    <CountrySelect
                                        value={field.value}
                                        onChange={(selected) => {
                                            setValue("country", selected)
                                            trigger("country")
                                        }}
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
                            <Controller name="address.city" control={control} render={({ field }) => <TextField fullWidth label="City" variant="outlined" {...field} />} />

                            <Typography variant="h6">Contact</Typography>
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

                            <Typography variant="h6">Website</Typography>
                            <Controller name="website" control={control} render={({ field }) => <TextField fullWidth label="Website" variant="outlined" {...field} />} />

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

export default AddCompanyPage
