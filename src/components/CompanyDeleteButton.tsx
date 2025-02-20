"use client"

import React, { useState } from "react"
import { redirect } from "next/navigation"
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import { useAppStore } from "@/src/store/appStore"
import { toast } from "react-toastify"
import { COMPANIES_ROUTE } from "@/src/utils/consts"

const CompanyDeleteButton = () => {
    const { removeCompany, selectedCompany } = useAppStore()
    const [openCompanyDeleteDialog, setOpenCompanyDeleteDialog] = useState(false)

    const handleOpenCompanyDeleteDialog = () => setOpenCompanyDeleteDialog(true)
    const handleCloseCompanyDeleteDialog = () => setOpenCompanyDeleteDialog(false)

    const handleConfirmCompanyDelete = async () => {
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
        <>
            <Button onClick={handleOpenCompanyDeleteDialog} variant="outlined" startIcon={<DeleteForeverIcon />} color="error">
                Delete
            </Button>

            <Dialog open={openCompanyDeleteDialog} onClose={handleCloseCompanyDeleteDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this company?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCompanyDeleteDialog}>Cancel</Button>
                    <Button onClick={handleConfirmCompanyDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default CompanyDeleteButton
