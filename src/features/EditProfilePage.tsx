"use client"

import React, { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { toast } from "react-toastify"
import { useAppStore } from "@/src/store/appStore"
import { type Company } from "@/src/utils/types"

import { TextField, Button, Stack, Box, Card, CardContent, Container } from "@mui/material"
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
                            <Stack direction="row" spacing={2}>
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
                                {/* Website */}
                                <Controller
                                    name="website"
                                    control={control}
                                    rules={{ required: "Website is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            label="Website"
                                            variant="outlined"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            error={!!errors.website}
                                            helperText={errors.website?.message}
                                            required
                                        />
                                    )}
                                />
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                {/* Address: Street & City */}
                                <Controller
                                    name="address.street"
                                    control={control}
                                    rules={{ required: "Street is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            label="Street"
                                            variant="outlined"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            error={!!errors.address?.street}
                                            helperText={errors.address?.street?.message}
                                            required
                                        />
                                    )}
                                />
                                <Controller
                                    name="address.city"
                                    control={control}
                                    rules={{ required: "City is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            label="City"
                                            variant="outlined"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            error={!!errors.address?.city}
                                            helperText={errors.address?.city?.message}
                                            required
                                        />
                                    )}
                                />
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                {/* Address: House Number & Postal Code */}
                                <Controller
                                    name="address.houseNumber"
                                    control={control}
                                    rules={{ required: "House Number is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            label="House Number"
                                            variant="outlined"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            error={!!errors.address?.houseNumber}
                                            helperText={errors.address?.houseNumber?.message}
                                            required
                                        />
                                    )}
                                />
                                <Controller
                                    name="address.postalCode"
                                    control={control}
                                    rules={{ required: "Postal Code is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            label="Postal Code"
                                            variant="outlined"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            error={!!errors.address?.postalCode}
                                            helperText={errors.address?.postalCode?.message}
                                            required
                                        />
                                    )}
                                />
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                {/* Phone */}
                                <Controller
                                    name="contact.phone"
                                    control={control}
                                    rules={{ required: "Phone number is required" }}
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
                            </Stack>
                            {/* Social Networks */}
                            <Stack direction="row" spacing={2}>
                                <Controller
                                    name="socialNetworks.facebook"
                                    control={control}
                                    rules={{ required: "Facebook profile is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            label="Facebook"
                                            variant="outlined"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            error={!!errors.socialNetworks?.facebook}
                                            helperText={errors.socialNetworks?.facebook?.message}
                                            required
                                        />
                                    )}
                                />
                                <Controller
                                    name="socialNetworks.instagram"
                                    control={control}
                                    rules={{ required: "Instagram profile is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            label="Instagram"
                                            variant="outlined"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            error={!!errors.socialNetworks?.instagram}
                                            helperText={errors.socialNetworks?.instagram?.message}
                                            required
                                        />
                                    )}
                                />
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                <Controller
                                    name="socialNetworks.linkedin"
                                    control={control}
                                    rules={{ required: "LinkedIn profile is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            label="LinkedIn"
                                            variant="outlined"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            error={!!errors.socialNetworks?.linkedin}
                                            helperText={errors.socialNetworks?.linkedin?.message}
                                            required
                                        />
                                    )}
                                />
                                <Controller
                                    name="socialNetworks.twitter"
                                    control={control}
                                    rules={{ required: "Twitter profile is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            label="Twitter"
                                            variant="outlined"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            error={!!errors.socialNetworks?.twitter}
                                            helperText={errors.socialNetworks?.twitter?.message}
                                            required
                                        />
                                    )}
                                />
                            </Stack>
                            {/* Save & Delete Buttons */}
                            <Box sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                                <Button type="submit" variant="contained" startIcon={<SaveIcon />} color="success" sx={{ color: "#fff" }}>
                                    Save Changes
                                </Button>
                                <CompanyDeleteButton />
                            </Box>
                        </Stack>
                    </form>
                </CardContent>
            </Card>

            <TrackedCountriesEditor />
            <GeneralKeyWordsEditor />
            <GeneralServicesEditor />
            <GeneralDomainsEditor />
        </Container>
    )
}

export default EditProfilePage
