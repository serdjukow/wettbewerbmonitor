import React from "react"
import { Box, Typography } from "@mui/material"
import CustomNoRowsOverlay from "@/src/components/CustomNoRowsOverlay"

interface SistrixDomainResult {
    uuid?: string
    domain: string
    match?: number
}

interface SistrixResponseError {
    status: "fail"
    error_message: string
}

interface SistrixResponseSuccess {
    answer: {
        result: SistrixDomainResult[]
        kw?: string
    }[]
}

interface CustomOverlayProps {
    data: SistrixResponse | null
}

type SistrixResponse = SistrixResponseError | SistrixResponseSuccess

const CustomOverlay: React.FC<CustomOverlayProps> = ({ data }) => {
    if (data && "status" in data && data.status === "fail") {
        return (
            <Box sx={{ p: 2 }}>
                <Typography color="error">{data.error_message || "No results found."}</Typography>
            </Box>
        )
    }
    return <CustomNoRowsOverlay />
}

export default CustomOverlay
