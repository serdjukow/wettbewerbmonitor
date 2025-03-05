"use client"

import React from "react"
import { Card, CardHeader, CardContent, Box, Typography, Button } from "@mui/material"
import dynamic from "next/dynamic"
import { ApexOptions } from "apexcharts"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface UnconfirmedCompetitorsCardProps {
    unconfirmedCount: number
}

const UnconfirmedCompetitorsCard: React.FC<UnconfirmedCompetitorsCardProps> = ({ unconfirmedCount }) => {
    const series = [unconfirmedCount]

    const chartOptions: ApexOptions = {
        chart: {
            type: "radialBar",
            sparkline: { enabled: true },
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    size: "70%",
                },
                dataLabels: {
                    name: {
                        show: true,
                        offsetY: -10,
                    },
                    value: {
                        show: true,
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        formatter: (): string => `${unconfirmedCount}`,
                    },
                    total: {
                        show: false,
                    },
                },
            },
        },
        colors: ["#FF9800"],
        labels: ["Unconfirmed"],
        legend: {
            show: false,
        },
    }

    return (
        <Card sx={{ width: 300, borderRadius: 2, boxShadow: 3 }}>
            <CardHeader
                title={<Typography variant="h6">Unconfirmed Competitors</Typography>}
                avatar={<WarningAmberIcon color="warning" />}
                sx={{ backgroundColor: "warning.main", color: "warning.contrastText" }}
            />
            <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <ReactApexChart options={chartOptions} series={series} type="radialBar" width={240} />
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        {unconfirmedCount > 0 ? `You need to confirm ${unconfirmedCount} competitors.` : "All competitors are confirmed!"}
                    </Typography>
                    {unconfirmedCount > 0 && (
                        <Button variant="contained" color="warning" sx={{ mt: 2 }}>
                            Confirm Now
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
    )
}

export default UnconfirmedCompetitorsCard
