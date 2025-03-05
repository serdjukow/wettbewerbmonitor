import React from "react"
import {
    Box,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Stack,
    Alert,
    IconButton,
    Link,
} from "@mui/material"
import ListAltIcon from "@mui/icons-material/ListAlt"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import { SelectChangeEvent } from "@mui/material/Select"
import { type Competitor } from "../utils/types"
import VisibilityIcon from "@mui/icons-material/Visibility"
import QuizIcon from "@mui/icons-material/Quiz"
import SmartToyIcon from "@mui/icons-material/SmartToy"

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

const analysisTypeStyles = {
    manual: {
        borderColor: "success.main",
        textColor: "success.main",
        icon: <VisibilityIcon sx={{ fontSize: "16px", mr: 1, color: "success.main" }} />,
        title: "Manual determination",
    },
    ai: {
        borderColor: "primary.main",
        textColor: "primary.main",
        icon: <SmartToyIcon sx={{ fontSize: "16px", mr: 1, color: "primary.main" }} />,
        title: "Determined by AI",
    },
    default: {
        borderColor: "grey.400",
        textColor: "grey.600",
        icon: <QuizIcon sx={{ fontSize: "16px", mr: 1, color: "grey.400" }} />,
        title: "Not processed",
    },
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
                            URL:{" "}
                            <Link href={row.url} target="_blank" rel="noopener noreferrer">
                                {row.url}
                            </Link>
                        </Typography>
                        {row.products && row.products.length > 0 ? (
                            <>
                                <Typography variant="body2" color="text.secondary">
                                    Services / Products:
                                </Typography>
                                <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center" }} title="AI">
                                        <SmartToyIcon sx={{ color: "primary.main" }} />
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center" }} title="Manual">
                                        <VisibilityIcon sx={{ color: "success.main" }} />
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center" }} title="Not processed">
                                        <QuizIcon sx={{ color: "grey.400" }} />
                                    </Box>
                                </Stack>
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    {row.products.map((prod, index) => {
                                        const style =
                                            analysisTypeStyles[prod.analysisType as keyof typeof analysisTypeStyles] ||
                                            analysisTypeStyles.default
                                        return (
                                            <Box
                                                key={prod.title || index}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    border: 1,
                                                    borderColor: style.borderColor,
                                                    borderRadius: 1,
                                                    px: 1,
                                                    py: 0.5,
                                                    mb: 0.5,
                                                    backgroundColor: "transparent",
                                                    color: style.textColor,
                                                    fontWeight: "bold",
                                                }}
                                                title={style.title}
                                            >
                                                {style.icon}
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
