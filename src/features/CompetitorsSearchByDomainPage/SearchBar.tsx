"use client"
import React from "react"
import { Box, TextField, Button, IconButton } from "@mui/material"
import ListAltIcon from "@mui/icons-material/ListAlt"

interface SearchBarProps {
    domainInput: string
    onDomainInputChange: (value: string) => void
    onSearch: () => void
    onOpenGeneralModal: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({ domainInput, onDomainInputChange, onSearch, onOpenGeneralModal }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearch()
        }
    }

    return (
        <Box
            sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
                pt: 2,
                pr: 2,
                pl: 2,
            }}
        >
            <TextField
                label="Enter domain"
                variant="outlined"
                value={domainInput}
                onChange={(e) => onDomainInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                sx={{ flex: 1 }}
            />
            <IconButton color="primary" onClick={onOpenGeneralModal}>
                <ListAltIcon />
            </IconButton>
            <Button variant="contained" onClick={onSearch}>
                Search
            </Button>
        </Box>
    )
}

export default SearchBar
