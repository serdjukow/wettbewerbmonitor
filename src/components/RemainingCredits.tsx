import * as React from "react"
import { useState, useEffect } from "react"
import {
    Box,
    Typography,
} from "@mui/material"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import Skeleton from "@mui/material/Skeleton"
import { fetchCredits } from "@/src/utils/functions"

const RemainingCredits = () => {
    const [credits, setCredits] = useState<string | number>("")

    useEffect(() => {
        async function getCredits() {
            const result = await fetchCredits()
            setCredits(result)
        }
        getCredits()
    }, [])

    return !!credits ? (
        <Box
            sx={{
                flex: "0 0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pr: { xs: 2, sm: 2 },
            }}
        >
            <AttachMoneyIcon sx={{ color: "#ffca05" }} />
            <Typography variant="h6" sx={{ color: "text.secondary" }}>
                {credits}
            </Typography>
        </Box>
    ) : (
        <Skeleton
            animation="wave"
            height={30}
            sx={{
                flex: "0 0 80px",
                marginRight: 1
            }}
        />
    )
}

export default RemainingCredits
