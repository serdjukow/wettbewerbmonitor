"use client"
import React from "react"
import { Toolbar, Typography, Button, Tooltip } from "@mui/material"
import { alpha } from "@mui/material/styles"

interface EnhancedTableToolbarProps {
    numSelected: number
    onAddCompetitors?: () => void
}

const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = ({ numSelected, onAddCompetitors }) => {
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
                    <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1" component="div">
                        {numSelected} selected
                    </Typography>
                    <Tooltip title="Add competitors">
                        <Button
                            onClick={onAddCompetitors}
                            variant="contained"
                            size="small"
                            color="success"
                            sx={{ color: "#fff" }}                    
                        >
                            Save competitors
                        </Button>
                    </Tooltip>
                </>
            ) : (
                <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
                    Competitors
                </Typography>
            )}
        </Toolbar>
    )
}

export default EnhancedTableToolbar
