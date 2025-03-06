"use client"

import React, { useRef, useState, useEffect } from "react"
import { Box, Typography } from "@mui/material"
import Confetti from "react-confetti"

const AutopilotRun = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    useEffect(() => {
        if (containerRef.current) {
            setDimensions({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight,
            })
        }
    }, [])

    return (
        <Box ref={containerRef} sx={{ p: 4, textAlign: "center", position: "relative", height: "calc(100vh - 70px)" }}>
            <Confetti
                drawShape={(ctx) => {
                    ctx.beginPath()
                    for (let i = 0; i < 22; i++) {
                        const angle = 0.35 * i
                        const x = (0.2 + 1.5 * angle) * Math.cos(angle)
                        const y = (0.2 + 1.5 * angle) * Math.sin(angle)
                        ctx.lineTo(x, y)
                    }
                    ctx.stroke()
                    ctx.closePath()
                }}
                width={dimensions.width}
                height={dimensions.height}
            />
            <Typography variant="h4" gutterBottom>
                🚀 Autopilot is running!
            </Typography>
            <Typography>The autopilot is now processing your project. You can monitor the progress here.</Typography>
        </Box>
    )
}

export default AutopilotRun
