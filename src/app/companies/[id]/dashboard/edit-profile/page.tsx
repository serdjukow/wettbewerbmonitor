"use client"

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
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            name: "",
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
        if (selectedCompany && selectedCompany.uuid) {
            updateCompany(selectedCompany.uuid, data)
            setIsEdit(!isEdit)
        } else {
            toast.error("Error!")
        }
    }

    return (
        <Container>
            {isEdit ? (
                <Card sx={{ paddingTop: 4 }}>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={2}>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="Full Name" variant="outlined" {...field} required />}
                                />
                                <Controller
                                    name="contact.email"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="Email" variant="outlined" {...field} required />}
                                />
                                <Controller
                                    name="contact.phone"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="Phone" variant="outlined" {...field} />}
                                />
                                <Typography variant="h6">Address</Typography>
                                <Controller
                                    name="address.street"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="Street" variant="outlined" {...field} />}
                                />
                                <Controller
                                    name="address.houseNumber"
                                    control={control}
                                    render={({ field }) => <TextField fullWidth label="House Number" variant="outlined" {...field} />}
                                />
                                <Stack direction="row" spacing={2}>
                                    <Controller
                                        name="address.city"
                                        control={control}
                                        render={({ field }) => <TextField fullWidth label="City" variant="outlined" {...field} />}
                                    />
                                    <Controller
                                        name="address.postalCode"
                                        control={control}
                                        render={({ field }) => <TextField fullWidth label="Postal Code" variant="outlined" {...field} />}
                                    />
                                </Stack>
                                <Typography variant="h6">Website</Typography>
                                <Stack direction="row" spacing={2}>
                                    <Controller
                                        name="website"
                                        control={control}
                                        render={({ field }) => <TextField fullWidth label="Website" variant="outlined" {...field} />}
                                    />
                                </Stack>
                                <Typography variant="h6">Social Networks</Typography>
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
                                    <Button
                                        onClick={() => setIsEdit(!isEdit)}
                                        variant="outlined"
                                        startIcon={<CancelIcon />}
                                        color="warning"
                                    >
                                        Cansel
                                    </Button>
                                    <CompanyDeleteButton />
                                </Box>
                            </Stack>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <Card sx={{ minWidth: 350, margin: "0 auto" }}>
                        <CardContent>
                            <Typography gutterBottom variant="h4" component="div">
                                {selectedCompany?.name}
                            </Typography>
                            {selectedCompany?.address && (
                                <>
                                    <Typography variant="h6">Address</Typography>
                                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                        {selectedCompany?.address.street} {selectedCompany?.address.houseNumber},
                                        <br />
                                        {selectedCompany?.address.city}, {selectedCompany?.address.postalCode}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                </>
                            )}
                            {selectedCompany?.contact && (
                                <>
                                    <Typography variant="h6">Contact</Typography>
                                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                        Phone: {selectedCompany?.contact.phone}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                        Email: {selectedCompany?.contact.email}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                </>
                            )}
                            {selectedCompany?.website && (
                                <>
                                    <Typography variant="h6">Website</Typography>
                                    <Link
                                        href={selectedCompany?.website}
                                        target="_blank"
                                        rel="noopener"
                                        sx={{
                                            textDecoration: "none",
                                        }}
                                    >
                                        {selectedCompany?.website}
                                    </Link>
                                    <Divider sx={{ my: 2 }} />
                                </>
                            )}

                            {selectedCompany?.socialNetworks && (
                                <>
                                    <Typography variant="h6">Social Networks</Typography>
                                    <Stack spacing={1}>
                                        {selectedCompany.socialNetworks.facebook && (
                                            <Link
                                                href={selectedCompany.socialNetworks.facebook}
                                                target="_blank"
                                                sx={{
                                                    textDecoration: "none",
                                                }}
                                            >
                                                Facebook
                                            </Link>
                                        )}
                                        {selectedCompany.socialNetworks.instagram && (
                                            <Link
                                                href={selectedCompany.socialNetworks.instagram}
                                                target="_blank"
                                                sx={{
                                                    textDecoration: "none",
                                                }}
                                            >
                                                Instagram
                                            </Link>
                                        )}
                                        {selectedCompany.socialNetworks.linkedin && (
                                            <Link
                                                href={selectedCompany.socialNetworks.linkedin}
                                                target="_blank"
                                                sx={{
                                                    textDecoration: "none",
                                                }}
                                            >
                                                LinkedIn
                                            </Link>
                                        )}
                                        {selectedCompany.socialNetworks.twitter && (
                                            <Link
                                                href={selectedCompany.socialNetworks.twitter}
                                                target="_blank"
                                                sx={{
                                                    textDecoration: "none",
                                                }}
                                            >
                                                Twitter
                                            </Link>
                                        )}
                                    </Stack>
                                </>
                            )}
                        </CardContent>
                        <CardActions>
                            <Button onClick={() => setIsEdit(!isEdit)} variant="outlined" startIcon={<EditIcon />}>
                                Edit
                            </Button>
                        </CardActions>
                    </Card>
                    <GeneralKeyWordsEditor />
                    <GeneralServicesEditor />
                    <GeneralDomainsEditor />
                </>
            )}
        </Container>
    )
}

export default EditProfilePage
