"use client"
import React from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, Divider, List, ListItem, ListItemButton, ListItemText } from "@mui/material"
import NoDataMessage from "@/src/components/NoDataMessage"

interface DomainSelectionModalProps {
    open: boolean
    onClose: () => void
    generalDomains: string[]
    generalSearchQuery: string
    onGeneralSearchQueryChange: (value: string) => void
    onSelectDomain: (domain: string) => void
}

const DomainSelectionModal: React.FC<DomainSelectionModalProps> = ({ open, onClose, generalDomains, generalSearchQuery, onGeneralSearchQueryChange, onSelectDomain }) => {
    const groupedGeneralDomains = React.useMemo(() => {
        const domains = [...generalDomains].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
        const groups: { [letter: string]: string[] } = {}
        domains.forEach((domain) => {
            const letter = domain.charAt(0).toUpperCase()
            if (!groups[letter]) groups[letter] = []
            groups[letter].push(domain)
        })
        return groups
    }, [generalDomains])

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Select a Domain</DialogTitle>

            {generalDomains && generalDomains.length ? (
                <DialogContent dividers>
                    <TextField label="Search domains" fullWidth value={generalSearchQuery} onChange={(e) => onGeneralSearchQueryChange(e.target.value)} sx={{ mb: 2 }} />
                    {Object.keys(groupedGeneralDomains)
                        .sort()
                        .map((letter) => {
                            const filteredDomains = groupedGeneralDomains[letter].filter((domain) => domain.toLowerCase().includes(generalSearchQuery.toLowerCase()))
                            if (filteredDomains.length === 0) return null
                            return (
                                <Box key={letter} sx={{ mb: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                        {letter}
                                    </Typography>
                                    <Divider sx={{ mb: 0 }} />
                                    <List>
                                        {filteredDomains.map((domain, index) => (
                                            <ListItem key={index} disablePadding>
                                                <ListItemButton onClick={() => onSelectDomain(domain)}>
                                                    <ListItemText primary={domain} />
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
                <Button color="secondary" onClick={onClose} variant="contained" style={{ color: "#ffffff" }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DomainSelectionModal
