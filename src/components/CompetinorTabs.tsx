import React from "react"
import { Paper, Tabs, Tab, Badge } from "@mui/material"
import { shortNumber } from "@/src/utils/functions"

export interface CompetitorTabsProps {
    value: string
    onChange: (event: React.SyntheticEvent, newValue: string) => void
    counts: {
        not_checked: number
        competitor: number
        not_competitor: number
        products_not_selected: number
    }
}

const CompetitorTabs: React.FC<CompetitorTabsProps> = ({ value, onChange, counts }) => {
    return (
        <Paper sx={{ width: "100%", mb: 2, p: 1 }}>
            <Tabs value={value} onChange={onChange} indicatorColor="primary" textColor="primary" variant="scrollable">
                <Tab
                    sx={{ pr: 4 }}
                    value="not_checked"
                    label={
                        <Badge
                            badgeContent={shortNumber(counts.not_checked)}
                            color="default"
                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
                            sx={{
                                "& .MuiBadge-badge": {
                                    transform: "translate(100%, -60%)",
                                    minWidth: "22px",
                                    height: "22px",
                                    borderRadius: "50%",
                                    padding: "0 4px",
                                    backgroundColor: "grey",
                                    color: "white",
                                },
                            }}
                        >
                            NOT CHECKED
                        </Badge>
                    }
                />
                <Tab
                    sx={{ pr: 4 }}
                    value="competitor"
                    label={
                        <Badge
                            badgeContent={shortNumber(counts.competitor)}
                            color="success"
                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
                            sx={{
                                "& .MuiBadge-badge": {
                                    transform: "translate(100%, -60%)",
                                    minWidth: "22px",
                                    height: "22px",
                                    borderRadius: "50%",
                                    padding: "0 4px",
                                    color: "white",
                                },
                            }}
                        >
                            COMPETITOR
                        </Badge>
                    }
                />
                <Tab
                    sx={{ pr: 4 }}
                    value="not_competitor"
                    label={
                        <Badge
                            badgeContent={shortNumber(counts.not_competitor)}
                            color="warning"
                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
                            sx={{
                                "& .MuiBadge-badge": {
                                    transform: "translate(100%, -60%)",
                                    minWidth: "22px",
                                    height: "22px",
                                    borderRadius: "50%",
                                    padding: "0 4px",
                                    color: "white",
                                },
                            }}
                        >
                            NOT COMPETITOR
                        </Badge>
                    }
                />
                <Tab
                    sx={{ pr: 4 }}
                    value="products_not_selected"
                    label={
                        <Badge
                            badgeContent={shortNumber(counts.products_not_selected)}
                            color="info"
                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
                            sx={{
                                "& .MuiBadge-badge": {
                                    transform: "translate(100%, -60%)",
                                    minWidth: "22px",
                                    height: "22px",
                                    borderRadius: "50%",
                                    padding: "0 4px",
                                    color: "white",
                                },
                            }}
                        >
                            PRODUCTS NOT SELECTED
                        </Badge>
                    }
                />
            </Tabs>
        </Paper>
    )
}

export default CompetitorTabs
