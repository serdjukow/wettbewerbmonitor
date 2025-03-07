"use client"
import React from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, Divider, List, ListItem, ListItemButton, ListItemText } from "@mui/material"
import NoDataMessage from "@/src/components/NoDataMessage"

interface GeneralKeywordsDialogProps {
    open: boolean
    onClose: () => void
    searchQuery: string
    onSearchQueryChange: (value: string) => void
    groupedGeneralKeywords: { [letter: string]: string[] }
    onSelectKeyword: (keyword: string) => void
}

const GeneralKeywordsDialog: React.FC<GeneralKeywordsDialogProps> = ({ open, onClose, searchQuery, onSearchQueryChange, groupedGeneralKeywords, onSelectKeyword }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Select a Keyword</DialogTitle>
            {Object.keys(groupedGeneralKeywords).length ? (
                <DialogContent dividers>
                    <TextField label="Search keywords" fullWidth value={searchQuery} onChange={(e) => onSearchQueryChange(e.target.value)} sx={{ mb: 2 }} />
                    {Object.keys(groupedGeneralKeywords)
                        .sort()
                        .map((letter) => {
                            const filtered = groupedGeneralKeywords[letter].filter((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase()))
                            if (!filtered.length) return null
                            return (
                                <Box key={letter} sx={{ mb: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                        {letter}
                                    </Typography>
                                    <Divider sx={{ mb: 0 }} />
                                    <List>
                                        {filtered.map((kw, index) => (
                                            <ListItem key={index} disablePadding>
                                                <ListItemButton onClick={() => onSelectKeyword(kw)}>
                                                    <ListItemText primary={kw} />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )
                        })}
                </DialogContent>
            ) : (
                <NoDataMessage />
            )}
            <DialogActions>
                <Button onClick={onClose} variant="contained" color="secondary" sx={{ color: "#fff" }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default GeneralKeywordsDialog
