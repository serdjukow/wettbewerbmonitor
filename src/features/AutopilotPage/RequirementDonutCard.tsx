"use client"

import React from "react"
import { Card, CardHeader, CardContent, Box, Typography, Button } from "@mui/material"
import dynamic from "next/dynamic"
import Link from "next/link"
import { ApexOptions } from "apexcharts"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface RequirementDonutCardProps {
    label: string
    current: number
    required: number
    companyUUID?: string
}

const RequirementDonutCard: React.FC<RequirementDonutCardProps> = ({ label, current, required, companyUUID }) => {
    // Calculate progress values
    const computedCompleted = Math.min(current, required)
    const computedRequired = required
    const remaining = computedRequired - computedCompleted
    const series = [computedCompleted, computedRequired - computedCompleted]

    // Determine header style based on whether the requirement is met
    const isComplete = current >= required
    const headerIcon = isComplete ? <CheckCircleIcon /> : <WarningAmberIcon />
    const headerBgColor = isComplete ? "success.main" : "warning.main"
    const headerColor = isComplete ? "success.contrastText" : "warning.contrastText"

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
            <CardHeader title={<Typography variant="subtitle1">{label}</Typography>} avatar={headerIcon} sx={{ backgroundColor: headerBgColor, color: headerColor }} />
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
                        <Typography variant="h6">{`${computedCompleted} from ${computedRequired}`}</Typography>
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
                            {computedCompleted}
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
                            {remaining}
                        </Typography>
                    </Box>
                </Box>
                {!isComplete && (
                    <Box sx={{ textAlign: "center", mt: 2 }}>
                        {current > 0 && companyUUID && (
                            <Link href={`/companies/${companyUUID}/dashboard/competitors`} passHref>
                                <Button variant="contained" color="warning" sx={{ mt: 2 }}>
                                    Review
                                </Button>
                            </Link>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    )
}

export default RequirementDonutCard
