"use client"

import React, { useState } from "react"
import { redirect } from "next/navigation"
import { Button } from "@mui/material"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import { useAppStore } from "@/src/store/appStore"
import { toast } from "react-toastify"
import { COMPANIES_ROUTE } from "@/src/utils/consts"
import DeleteDialog from "./DeleteDialog"

const CompanyDeleteButton = () => {
    const { removeCompany, selectedCompany } = useAppStore()
    const [openCompanyDeleteDialog, setOpenCompanyDeleteDialog] = useState(false)

    const handleOpenCompanyDeleteDialog = () => setOpenCompanyDeleteDialog(true)
    const handleCloseCompanyDeleteDialog = () => setOpenCompanyDeleteDialog(false)

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
        <>
            <Button onClick={handleOpenCompanyDeleteDialog} variant="contained" startIcon={<DeleteForeverIcon />} color="error">
                Delete company
            </Button>
            <DeleteDialog open={openCompanyDeleteDialog} onClose={handleCloseCompanyDeleteDialog} onConfirm={handleConfirmDelete} />
        </>
    )
}

export default CompanyDeleteButton
