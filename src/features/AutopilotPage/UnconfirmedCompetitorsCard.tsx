"use client"

import React from "react"
import { Card, CardHeader, CardContent, Box, Typography, Button } from "@mui/material"
import dynamic from "next/dynamic"
import Link from "next/link"
import { ApexOptions } from "apexcharts"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface UnconfirmedCompetitorsCardProps {
    unconfirmedCount: number
    companyUUID: string
}

const UnconfirmedCompetitorsCard: React.FC<UnconfirmedCompetitorsCardProps> = ({ unconfirmedCount, companyUUID }) => {
    // Если нет неподтверждённых конкурентов, прогресс = 100, иначе = 0.
    const progress = unconfirmedCount === 0 ? 100 : 0
    const series = [progress, 100 - progress]

    const isComplete = unconfirmedCount === 0
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
        <Card sx={{ width: 300, borderRadius: 2, boxShadow: 3 }}>
            <CardHeader title={<Typography variant="h6">Unconfirmed Competitors</Typography>} avatar={headerIcon} sx={{ backgroundColor: headerBgColor, color: headerColor }} />
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
                            transform: "translate(6%, -10%)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            pointerEvents: "none",
                        }}
                    >
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            {isComplete ? "Done" : `${unconfirmedCount}`}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ textAlign: "center", mt: 2 }}>
                    <Typography variant="body2">{unconfirmedCount > 0 ? `You need to confirm ${unconfirmedCount} competitors.` : "All competitors are confirmed!"}</Typography>
                    {unconfirmedCount > 0 && (
                        <Link href={`/companies/${companyUUID}/dashboard/competitors`} passHref>
                            <Button variant="contained" color="warning" sx={{ mt: 2 }}>
                                Review Competitors
                            </Button>
                        </Link>
                    )}
                </Box>
            </CardContent>
        </Card>
    )
}

export default UnconfirmedCompetitorsCard
