"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Box, TextField, Button } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

interface ProductsDialogProps {
    open: boolean
    competitorName?: string
    products: string[]
    onClose: () => void
    onSave: (products: string[]) => void
}

export default function ProductsDialog({ open, competitorName, products, onClose, onSave }: ProductsDialogProps) {
    const [newProduct, setNewProduct] = useState("")
    const [localProducts, setLocalProducts] = useState<string[]>([])

    useEffect(() => {
        setLocalProducts(products)
    }, [products])

    const handleAddNewProduct = () => {
        if (newProduct.trim()) {
            setLocalProducts((prev) => [...prev, newProduct.trim()])
            setNewProduct("")
        }
    }

    const handleRemoveProduct = (product: string) => {
        setLocalProducts((prev) => prev.filter((p) => p !== product))
    }

    const handleSaveProducts = () => {
        onSave(localProducts)
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Editing products for {competitorName || ""}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    Already added products:
                </Typography>
                {localProducts.length > 0 ? (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {localProducts.map((product) => (
                            <Box
                                key={product}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    border: "1px solid",
                                    borderColor: "grey.400",
                                    borderRadius: 1,
                                    px: 1,
                                    py: 0.5,
                                }}
                            >
                                <Typography variant="body2">{product}</Typography>
                                <IconButton size="small" onClick={() => handleRemoveProduct(product)} sx={{ ml: 0.5 }}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        No products added.
                    </Typography>
                )}
                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <TextField label="New product" variant="outlined" size="small" fullWidth value={newProduct} onChange={(e) => setNewProduct(e.target.value)} />
                    <Button variant="contained" onClick={handleAddNewProduct}>
                        Add
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSaveProducts} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}
