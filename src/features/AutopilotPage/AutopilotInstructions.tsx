"use client"

import React from "react"
import { Card, CardHeader, CardContent, Box, Typography, List, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"

const AutopilotInstructions: React.FC = () => {
    return (
        <Card
            sx={{
                maxWidth: 600,
                margin: "auto",
                mt: 1,
                boxShadow: 3,
                borderRadius: 2,
            }}
        >
            <CardHeader
                title={
                    <Typography variant="h5" align="center">
                        How to Access the Autopilot
                    </Typography>
                }
                sx={{
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    py: 2,
                }}
            />
            <CardContent>
                <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                    To activate the Autopilot, you must meet the following requirements:
                </Typography>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary="Add at least 100 confirmed competitors" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary="Add at least 100 confirmed non-competitors" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary="Specify at least 10 keywords in your project profile" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ErrorOutlineIcon color="error" />
                        </ListItemIcon>
                        <ListItemText primary="Ensure that there are no unconfirmed competitors in your project" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ErrorOutlineIcon color="error" />
                        </ListItemIcon>
                        <ListItemText primary="Note: The autopilot does not find all possible competitors; it simply produces a large influx of new competitors. Please review and process the autopilot results thoroughly before proceeding." />
                    </ListItem>
                </List>
                <Box sx={{ mt: 3, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                        Once all conditions are met, the Autopilot feature will be activated and available for use.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}

export default AutopilotInstructions
