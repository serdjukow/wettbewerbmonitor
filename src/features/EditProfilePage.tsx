"use client"

export const dynamic = "force-dynamic"

import React, { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { toast } from "react-toastify"
import { useAppStore } from "@/src/store/appStore"
import { type Company } from "@/src/utils/types"

import { TextField, Button, Stack, Box, Typography, Link, Divider, Card, CardActions, CardContent, Container } from "@mui/material"
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material"

import GeneralKeyWordsEditor from "@/src/components/GeneralKeyWordsEditor"
import GeneralServicesEditor from "@/src/components/GeneralServicesEditor"
import GeneralDomainsEditor from "@/src/components/GeneralDomainsEditor"
import CompanyDeleteButton from "@/src/components/CompanyDeleteButton"

const EditProfilePage = () => {
    const { selectedCompany, updateCompany } = useAppStore()
    const [isEdit, setIsEdit] = useState(false)

    const { control, handleSubmit, reset } = useForm<Company>({
        defaultValues: {
            name: "",
            contact: {},
            address: {},
        },
    })

    useEffect(() => {
        if (selectedCompany) {
            reset(selectedCompany)
        }
    }, [selectedCompany, reset])

    const onSubmit = (data: Company) => {
        if (selectedCompany && selectedCompany.uuid) {
            updateCompany(selectedCompany.uuid, data)
            setIsEdit(false)
        } else {
            toast.error("Error updating company!")
        }
    }

    return (
        <Container>
            {isEdit ? (
                <Card sx={{ paddingTop: 4 }}>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={2}>
                                {/* Company Name */}
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField fullWidth label="Full Name" variant="outlined" value={field.value ?? ""} onChange={field.onChange} required />
                                    )}
                                />

                                {/* Contact */}
                                <Controller
                                    name="contact.email"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="Email" variant="outlined" value={field.value ?? ""} onChange={field.onChange} required />}
                                />
                                <Controller
                                    name="contact.phone"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="Phone" variant="outlined" value={field.value ?? ""} onChange={field.onChange} />}
                                />

                                {/* Address */}
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

                                {/* Buttons */}
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
                                    <Button onClick={() => setIsEdit(false)} variant="outlined" startIcon={<CancelIcon />} color="warning">
                                        Cancel
                                    </Button>
                                    <CompanyDeleteButton />
                                </Box>
                            </Stack>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* View Mode */}
                    <Card sx={{ minWidth: 350, margin: "0 auto" }}>
                        <CardContent>
                            <Typography gutterBottom variant="h4" component="div">
                                {selectedCompany?.name}
                            </Typography>
                            {selectedCompany?.address && (
                                <>
                                    <Typography variant="h6">Address</Typography>
                                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                        {selectedCompany?.address.street} {selectedCompany?.address.houseNumber},<br />
                                        {selectedCompany?.address.city}, {selectedCompany?.address.postalCode}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                </>
                            )}

                            {selectedCompany?.contact && (
                                <>
                                    <Typography variant="h6">Contact</Typography>
                                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                        Phone: {selectedCompany?.contact.phone ?? "N/A"}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                        Email: {selectedCompany?.contact.email ?? "N/A"}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                </>
                            )}

                            {selectedCompany?.website && (
                                <>
                                    <Typography variant="h6">Website</Typography>
                                    <Link href={selectedCompany?.website} target="_blank" rel="noopener" sx={{ textDecoration: "none" }}>
                                        {selectedCompany?.website}
                                    </Link>
                                    <Divider sx={{ my: 2 }} />
                                </>
                            )}

                            {selectedCompany?.socialNetworks && (
                                <>
                                    <Typography variant="h6">Social Networks</Typography>
                                    <Stack spacing={1}>
                                        {Object.entries(selectedCompany.socialNetworks).map(
                                            ([network, url]) =>
                                                url && (
                                                    <Link key={network} href={url} target="_blank" sx={{ textDecoration: "none" }}>
                                                        {network.charAt(0).toUpperCase() + network.slice(1)}
                                                    </Link>
                                                )
                                        )}
                                    </Stack>
                                </>
                            )}
                        </CardContent>
                        <CardActions>
                            <Button onClick={() => setIsEdit(true)} variant="outlined" startIcon={<EditIcon />}>
                                Edit
                            </Button>
                        </CardActions>
                    </Card>

                    {/* Editors */}
                    <GeneralKeyWordsEditor />
                    <GeneralServicesEditor />
                    <GeneralDomainsEditor />
                </>
            )}
        </Container>
    )
}

export default EditProfilePage
