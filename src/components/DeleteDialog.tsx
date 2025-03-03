import React from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from "@mui/material"

export interface DeleteDialogProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ open, onClose, onConfirm }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
                <Typography>Are you sure you want to delete?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onConfirm} color="error" variant="contained">
                    Delete
                </Button>
                <Button onClick={onClose} variant="contained">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteDialog
