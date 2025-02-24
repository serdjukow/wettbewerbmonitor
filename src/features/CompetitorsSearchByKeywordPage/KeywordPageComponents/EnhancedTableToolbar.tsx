import React from "react"
import { alpha } from "@mui/material/styles"
import { Button, Typography, Tooltip, Toolbar } from "@mui/material"

import { EnhancedTableToolbarProps } from "./../KeywordPageTypes"

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, onAddCompetitors } = props
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
                            sx={{
                                "&:hover": {
                                    color: "white",
                                },
                            }}
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
