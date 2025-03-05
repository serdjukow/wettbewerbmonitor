"use client"

import React from "react"
import { Card, CardHeader, CardContent, Box, Typography } from "@mui/material"
import dynamic from "next/dynamic"
import { ApexOptions } from "apexcharts"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface RequirementDonutCardProps {
    label: string
    current: number
    required: number
}

const RequirementDonutCard: React.FC<RequirementDonutCardProps> = ({ label, current, required }) => {
    let computedCompleted: number
    let computedRequired: number
    let remaining: number

    if (required === 0 && label === "Unconfirmed competitors") {
        if (current === 0) {
            computedCompleted = 1
            computedRequired = 1
            remaining = 0
        } else {
            computedCompleted = 0
            computedRequired = current
            remaining = current
        }
    } else {
        computedCompleted = Math.min(current, required)
        computedRequired = required
        remaining = computedRequired - computedCompleted
    }

    const series = [computedCompleted, computedRequired - computedCompleted]

    const chartOptions: ApexOptions = {
        chart: {
            type: "donut",
            sparkline: { enabled: false },
        },
        labels: ["Done", "Remaining"],
        colors: ["#00a76f", "#888"],
        legend: { show: false },
        plotOptions: {
            pie: {
                donut: {
                    size: "80%",
                    labels: {
                        name: { show: false },
                        value: { show: false },
                    },
                },
            },
        },
        dataLabels: { enabled: false },
        stroke: { show: false },
    }

    return (
        <Card sx={{ width: 300, borderRadius: 2 }}>
            <CardHeader
                title={<Typography variant="h6">{label}</Typography>}
                //avatar={<WarningAmberIcon color="warning" />}
                sx={{ backgroundColor: "warning.main", color: "warning.contrastText" }}
            />
            <CardContent>
                <Box sx={{ position: "relative", display: "flex", justifyContent: "center", mb: 2 }}>
                    <ReactApexChart options={chartOptions} series={series} type="donut" width={240} />
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: 240,
                            height: 240,
                            transform: "translate(5%, -8%)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            pointerEvents: "none",
                        }}
                    >
                        <Typography variant="h6">
                            {label === "Unconfirmed competitors"
                                ? current === 0
                                    ? "0 from 0"
                                    : `0 from ${current}`
                                : `${computedCompleted} from ${computedRequired}`}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                            sx={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                backgroundColor: "#00a76f",
                            }}
                        />
                        <Typography variant="body2" sx={{ flex: 1 }}>
                            Done
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                            {label === "Unconfirmed competitors" ? 0 : computedCompleted}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                            sx={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                backgroundColor: "#EFF2F5",
                                border: "1px solid #E0E0E0",
                            }}
                        />
                        <Typography variant="body2" sx={{ flex: 1 }}>
                            Remaining
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                            {label === "Unconfirmed competitors" ? current : remaining}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}

export default RequirementDonutCard
