import React from "react"
import { Box, Card, CardHeader, CardContent, CardActions, FormControl, InputLabel, Select, MenuItem, Typography, Stack, Alert, IconButton } from "@mui/material"
import ListAltIcon from "@mui/icons-material/ListAlt"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import { SelectChangeEvent } from "@mui/material/Select"
import { type Competitor } from "../utils/types"

export type StatusType = "not_checked" | "competitor" | "not_competitor"

export interface Product {
    title?: string
    analysisType: "manual" | "ai" | "not_processed"
}

export interface CompetitorCardProps {
    row: Competitor
    handleStatusChange: (uuid: string, newStatus: StatusType) => void
    handleOpenServicesDialog: (row: Competitor) => void
    handleViewCompetitor: (uuid: string) => void
    handleEditCompetitor: (uuid: string) => void
    handleOpenDeleteDialog: (row: Competitor) => void
}

const CompetitorCard: React.FC<CompetitorCardProps> = ({
    row,
    handleStatusChange,
    handleOpenServicesDialog,
    handleViewCompetitor,
    handleEditCompetitor,
    handleOpenDeleteDialog,
}) => {
    return (
        <Box key={row.uuid} sx={{ mb: 2 }}>
            <Card variant="outlined">
                <CardHeader
                    sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}
                    title={row.domain}
                    subheader={row.name}
                    action={
                        <FormControl variant="standard" size="small" sx={{ minWidth: 120 }}>
                            <InputLabel id={`status-label-${row.uuid}`} sx={{ color: "primary.contrastText" }}>
                                Status
                            </InputLabel>
                            <Select
                                labelId={`status-label-${row.uuid}`}
                                value={row.status}
                                onChange={(e: SelectChangeEvent) => handleStatusChange(row.uuid, e.target.value as StatusType)}
                                label="Status"
                                sx={{ color: "primary.contrastText" }}
                            >
                                <MenuItem value="not_checked">Not checked</MenuItem>
                                <MenuItem value="competitor">Competitor</MenuItem>
                                <MenuItem value="not_competitor">Not competitor</MenuItem>
                            </Select>
                        </FormControl>
                    }
                />
                <CardContent>
                    <Stack spacing={1}>
                        <Typography variant="body2" color="text.secondary">
                            URL: {row.url}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Keyword: {row.keyword}
                        </Typography>
                        {row.products && row.products.length > 0 ? (
                            <>
                                <Typography variant="body2" color="text.secondary">
                                    Services / Products:
                                </Typography>
                                <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Box
                                            sx={{
                                                width: 12,
                                                height: 12,
                                                border: 1,
                                                borderColor: "grey.400",
                                                borderRadius: "50%",
                                                mr: 0.5,
                                            }}
                                        />
                                        <Typography variant="caption">Not Processed</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Box
                                            sx={{
                                                width: 12,
                                                height: 12,
                                                border: 1,
                                                borderColor: "success.main",
                                                borderRadius: "50%",
                                                mr: 0.5,
                                            }}
                                        />
                                        <Typography variant="caption">Manual</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Box
                                            sx={{
                                                width: 12,
                                                height: 12,
                                                border: 1,
                                                borderColor: "primary.main",
                                                borderRadius: "50%",
                                                mr: 0.5,
                                            }}
                                        />
                                        <Typography variant="caption">AI</Typography>
                                    </Box>
                                </Stack>
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    {row.products.map((prod, index) => {
                                        let borderColor = "grey.400"
                                        let textColor = "grey.600"
                                        if (prod.analysisType === "manual") {
                                            borderColor = "success.main"
                                            textColor = "success.main"
                                        } else if (prod.analysisType === "ai") {
                                            borderColor = "primary.main"
                                            textColor = "primary.main"
                                        }
                                        return (
                                            <Box
                                                key={prod.title || index}
                                                sx={{
                                                    border: 1,
                                                    borderColor: borderColor,
                                                    borderRadius: 1,
                                                    px: 1,
                                                    py: 0.5,
                                                    mb: 0.5,
                                                    backgroundColor: "transparent",
                                                    color: textColor,
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                <Typography variant="caption">{prod.title}</Typography>
                                            </Box>
                                        )
                                    })}
                                </Stack>
                            </>
                        ) : (
                            <>
                                <Typography variant="body2" color="text.secondary">
                                    Services / Products:
                                </Typography>
                                <Alert severity="warning" sx={{ mt: 2 }}>
                                    Services / Products not filled
                                </Alert>
                            </>
                        )}
                    </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                    <IconButton onClick={() => handleOpenServicesDialog(row)} color="info">
                        <ListAltIcon />
                    </IconButton>
                    <IconButton onClick={() => handleViewCompetitor(row.uuid)} color="success">
                        <RemoveRedEyeIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditCompetitor(row.uuid)} color="primary">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDeleteDialog(row)} color="error">
                        <DeleteIcon />
                    </IconButton>
                </CardActions>
            </Card>
        </Box>
    )
}

export default CompetitorCard
