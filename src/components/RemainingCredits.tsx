import { useState, useEffect, useRef } from "react"
import { Box, Typography } from "@mui/material"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import Skeleton from "@mui/material/Skeleton"
import { fetchCredits } from "@/src/utils/functions"
import { motion, animate } from "framer-motion"

const RemainingCredits = () => {
    const [credits, setCredits] = useState<string | number>("")

    useEffect(() => {
        async function getCredits() {
            const result = await fetchCredits()
            setCredits(result)
        }
        getCredits()
    }, [])

    const AnimatedNumber = ({ value }: { value: number }) => {
        const [displayValue, setDisplayValue] = useState(0)
        const displayValueRef = useRef(0)

        useEffect(() => {
            const controls = animate(displayValueRef.current, value, {
                duration: 1,
                onUpdate: (latest) => {
                    const rounded = Math.round(latest)
                    setDisplayValue(rounded)
                    displayValueRef.current = rounded
                },
            })
            return () => controls.stop()
        }, [value])

        return <motion.span>{displayValue}</motion.span>
    }

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
                <AnimatedNumber value={+credits} />
            </Typography>
        </Box>
    ) : (
        <Skeleton
            animation="wave"
            height={30}
            sx={{
                flex: "0 0 80px",
                marginRight: 1,
            }}
        />
    )
}

export default RemainingCredits
