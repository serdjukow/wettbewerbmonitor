"use client"

import React, { useEffect, useState, MouseEvent } from "react"
import { useForm, Controller } from "react-hook-form"
import { toast } from "react-toastify"
import { useAppStore } from "@/src/store/appStore"
import { type Company } from "@/src/utils/types"

import { TextField, Button, Stack, Box, Card, CardContent } from "@mui/material"
import { Save as SaveIcon, Edit as EditIcon, Cancel as CancelIcon } from "@mui/icons-material"
import CountrySelect from "@/src/components/CountrySelect"

import { redirect } from "next/navigation"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import { COMPANIES_ROUTE } from "@/src/utils/consts"
import DeleteDialog from "./DeleteDialog"

const EditCompanyForm = () => {
    const { selectedCompany, updateCompany, removeCompany } = useAppStore()
    const [isEdit, setIsEdit] = useState(false)

    const [openCompanyDeleteDialog, setOpenCompanyDeleteDialog] = useState(false)

    const handleOpenCompanyDeleteDialog = () => setOpenCompanyDeleteDialog(true)
    const handleCloseCompanyDeleteDialog = () => setOpenCompanyDeleteDialog(false)

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
        setIsEdit(!isEdit)
    }

    const handleButtonEdit = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIsEdit(!isEdit)
    }

    const handleConfirmDelete = async () => {
        if (selectedCompany?.uuid) {
            try {
                await removeCompany(selectedCompany.uuid)
                toast.success("Company deleted")
            } catch (error) {
                toast.error(`Error deleting company ${error}`)
            }
        }
        setOpenCompanyDeleteDialog(false)
        redirect(COMPANIES_ROUTE)
    }
    
    return (
        <Card sx={{ paddingTop: 4 }}>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2}>
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
                                    disabled={!isEdit}
                                />
                            )}
                        />

                        <Stack direction="row" spacing={2} sx={{ pointerEvents: !isEdit ? "none" : "auto" }}>
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
                                        disabled={!isEdit}
                                    />
                                )}
                            />
                        </Stack>

                        <Stack direction="row" spacing={2}>
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
                        </Stack>

                        <Stack direction="row" spacing={2}>
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
                                        disabled={!isEdit}
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
                                        disabled={!isEdit}
                                    />
                                )}
                            />
                        </Stack>

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

                        {/* Save & Delete Buttons */}
                        <Box sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                            {isEdit ? (
                                <>
                                    <Button type="submit" variant="contained" startIcon={<SaveIcon />} color="success" sx={{ color: "#fff" }}>
                                        Save Changes
                                    </Button>
                                    <Button onClick={() => setIsEdit(!isEdit)} type="button" variant="contained" startIcon={<CancelIcon />} color="warning" sx={{ color: "#fff" }}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleOpenCompanyDeleteDialog} variant="contained" startIcon={<DeleteForeverIcon />} color="error">
                                        Delete company
                                    </Button>
                                    <DeleteDialog open={openCompanyDeleteDialog} onClose={handleCloseCompanyDeleteDialog} onConfirm={handleConfirmDelete} />
                                </>
                            ) : (
                                <Button onClick={handleButtonEdit} type="button" variant="contained" startIcon={<EditIcon />} color="primary" sx={{ color: "#fff" }}>
                                    Edit
                                </Button>
                            )}
                        </Box>
                    </Stack>
                </form>
            </CardContent>
        </Card>
    )
}

export default EditCompanyForm
