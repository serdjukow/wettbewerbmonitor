"use client"

import React from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Typography, Divider, List, ListItem, ListItemButton, ListItemText, Button } from "@mui/material"
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
            <DialogTitle>Select a General Keyword</DialogTitle>
            {Object.keys(groupedGeneralKeywords).length ? (
                <DialogContent dividers>
                    <TextField label="Search keywords" fullWidth value={searchQuery} onChange={(e) => onSearchQueryChange(e.target.value)} sx={{ mb: 2 }} />
                    {Object.keys(groupedGeneralKeywords)
                        .sort()
                        .map((letter) => {
                            const filteredWords = groupedGeneralKeywords[letter].filter((word) => word.toLowerCase().includes(searchQuery.toLowerCase()))
                            if (filteredWords.length === 0) return null
                            return (
                                <Box key={letter} sx={{ mb: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                        {letter}
                                    </Typography>
                                    <Divider sx={{ mb: 0 }} />
                                    <List>
                                        {filteredWords.map((word, index) => (
                                            <ListItem key={index} disablePadding>
                                                <ListItemButton onClick={() => onSelectKeyword(word)}>
                                                    <ListItemText primary={word} />
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
                <Button variant="outlined" color="secondary" onClick={onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default GeneralKeywordsDialog
