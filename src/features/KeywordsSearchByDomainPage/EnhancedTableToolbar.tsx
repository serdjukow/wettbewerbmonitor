"use client"
import React from "react"
import { Toolbar, Typography, Button, Tooltip } from "@mui/material"
import { alpha } from "@mui/material/styles"

interface EnhancedTableToolbarProps {
    numSelected: number
    onAddKeywords?: () => void
}

const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = ({ numSelected, onAddKeywords }) => {
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <>
                    <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1">
                        {numSelected} selected
                    </Typography>
                    <Tooltip title="Add keywords">
                        <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={onAddKeywords}
                            sx={{
                                "&:hover": {
                                    color: "white",
                                },
                            }}
                        >
                            Save keywords
                        </Button>
                    </Tooltip>
                </>
            ) : (
                <Typography sx={{ flex: "1 1 100%" }} variant="h6" component="div">
                    Keywords
                </Typography>
            )}
        </Toolbar>
    )
}

export default EnhancedTableToolbar
