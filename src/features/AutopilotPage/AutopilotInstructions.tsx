"use client"

import React from "react"
import { Card, CardHeader, CardContent, Box, Typography, List, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"

interface AutopilotInstructionsProps {
    confirmedCompetitors: number
    requiredCompetitors: number
    confirmedNonCompetitors: number
    requiredNonCompetitors: number
    keywords: number
    requiredKeywords: number
    unconfirmedCompetitors: number // should be 0 to pass the condition
}

const AutopilotInstructions: React.FC<AutopilotInstructionsProps> = ({
    confirmedCompetitors,
    requiredCompetitors,
    confirmedNonCompetitors,
    requiredNonCompetitors,
    keywords,
    requiredKeywords,
    unconfirmedCompetitors,
}) => {
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
                <Typography variant="body1" align="center" sx={{ mb: 1 }}>
                    To activate the Autopilot, you must meet the following requirements:
                </Typography>
                <List>
                    <ListItem>
                        <ListItemIcon>{confirmedCompetitors >= requiredCompetitors ? <CheckCircleIcon color="success" /> : <ErrorOutlineIcon color="error" />}</ListItemIcon>
                        <ListItemText primary={`Add at least ${requiredCompetitors} confirmed competitors (${confirmedCompetitors} confirmed)`} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>{confirmedNonCompetitors >= requiredNonCompetitors ? <CheckCircleIcon color="success" /> : <ErrorOutlineIcon color="error" />}</ListItemIcon>
                        <ListItemText primary={`Add at least ${requiredNonCompetitors} confirmed non-competitors (${confirmedNonCompetitors} confirmed)`} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>{keywords >= requiredKeywords ? <CheckCircleIcon color="success" /> : <ErrorOutlineIcon color="error" />}</ListItemIcon>
                        <ListItemText primary={`Specify at least ${requiredKeywords} keywords in your project profile (${keywords} specified)`} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>{unconfirmedCompetitors === 0 ? <CheckCircleIcon color="success" /> : <ErrorOutlineIcon color="error" />}</ListItemIcon>
                        <ListItemText primary={`Ensure there are no unconfirmed competitors in your project (${unconfirmedCompetitors} unconfirmed)`} />
                    </ListItem>
                </List>
                <Box sx={{ mt: 1, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                        Note: The autopilot does not find all possible competitors; it simply produces a large influx of new competitors. Please review and process the autopilot
                        results thoroughly before proceeding.
                    </Typography>
                </Box>
                <Box sx={{ mt: 1, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                        Once all conditions are met, the Autopilot feature will be activated and available for use.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}

export default AutopilotInstructions
