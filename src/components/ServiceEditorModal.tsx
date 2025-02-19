"use client"

import React, { useEffect, useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material"

interface ServiceEditorModalProps {
    open: boolean
    initialValue?: string
    onClose: () => void
    onSave: (value: string) => void
}

const ServiceEditorModal: React.FC<ServiceEditorModalProps> = ({ open, initialValue = "", onClose, onSave }) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{initialValue ? "Edit Service" : "Add Service"}</DialogTitle>
            <DialogContent>
                <TextField autoFocus margin="dense" label="Service" fullWidth variant="outlined" value={value} onChange={(e) => setValue(e.target.value)} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={() => {
                        onSave(value)
                        setValue("")
                    }}
                    color="primary"
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ServiceEditorModal
