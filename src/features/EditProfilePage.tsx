"use client"

import React, { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { toast } from "react-toastify"
import { useAppStore } from "@/src/store/appStore"
import { type Company } from "@/src/utils/types"

import { TextField, Button, Stack, Box, Typography, Card, CardContent, Container } from "@mui/material"
import { Save as SaveIcon } from "@mui/icons-material"

import GeneralKeyWordsEditor from "@/src/components/GeneralKeyWordsEditor"
import GeneralServicesEditor from "@/src/components/GeneralServicesEditor"
import GeneralDomainsEditor from "@/src/components/GeneralDomainsEditor"
import CompanyDeleteButton from "@/src/components/CompanyDeleteButton"
import CountrySelect from "@/src/components/CountrySelect"
import TrackedCountriesEditor from "@/src/components/TrackedCountriesEditor"

const EditProfilePage = () => {
    const { selectedCompany, updateCompany } = useAppStore()

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        trigger,
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

    useEffect(() => {
        if (selectedCompany) {
            reset(selectedCompany)
        }
    }, [selectedCompany, reset])

    const onSubmit = (data: Company) => {
        if (!data.country || !data.country.country || !data.country.country_name) {
            toast.error("Please select a valid country before saving.")
            return
        }

        if (selectedCompany && selectedCompany.uuid) {
            updateCompany(selectedCompany.uuid, data)
            toast.success("The company has been successfully updated!")
        } else {
            toast.error("Error updating company!")
        }
    }

    return (
        <Container>
            <Card sx={{ paddingTop: 4 }}>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={2}>
                            {/* Company Name */}
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: "Full Name is required" }}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        variant="outlined"
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                        required
                                    />
                                )}
                            />

                            {/* Email */}
                            <Controller
                                name="contact.email"
                                control={control}
                                rules={{ required: "Email is required" }}
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

                            {/* Country Selection */}
                            <Controller
                                name="country"
                                control={control}
                                rules={{ required: "Country is required" }}
                                render={({ field }) => (
                                    <CountrySelect
                                        value={field.value}
                                        onChange={(selectedCountry) => {
                                            setValue("country", {
                                                country: selectedCountry.country,
                                                country_name: selectedCountry.country_name,
                                            })
                                            trigger("country")
                                        }}
                                    />
                                )}
                            />

                            {/* Phone */}
                            <Controller
                                name="contact.phone"
                                control={control}
                                render={({ field }) => <TextField fullWidth label="Phone" variant="outlined" value={field.value ?? ""} onChange={field.onChange} />}
                            />

                            {/* Address Section */}
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
                                name="website"
                                control={control}
                                render={({ field }) => <TextField fullWidth label="Website" variant="outlined" value={field.value ?? ""} onChange={field.onChange} />}
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

                            <Stack direction="row" spacing={2}>
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

                            {/* Save Button */}
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
                                <CompanyDeleteButton />
                            </Box>
                        </Stack>
                    </form>
                </CardContent>
            </Card>

            {/* Country Tracker and Editors */}
            <TrackedCountriesEditor />
            <GeneralKeyWordsEditor />
            <GeneralServicesEditor />
            <GeneralDomainsEditor />
        </Container>
    )
}

export default EditProfilePage
