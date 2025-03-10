"use client"
import React from "react"
import { Box, TextField, Button, IconButton } from "@mui/material"
import ListAltIcon from "@mui/icons-material/ListAlt"

interface SearchBarProps {
    searchBarInput: string
    onSearchBarInputChange: (value: string) => void
    onSearch: () => void
    onOpenGeneralModal: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({ searchBarInput, onSearchBarInputChange, onSearch, onOpenGeneralModal }) => {
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
                value={searchBarInput}
                onChange={(e) => onSearchBarInputChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") onSearch()
                }}
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
