"use client"

import React from "react"
import { Card, CardHeader, CardContent, Box, Typography, Button} from "@mui/material"
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

    const headerIcon = unconfirmedCount > 0 ? <WarningAmberIcon /> : <CheckCircleIcon />
    const headerBgColor = unconfirmedCount > 0 ? "warning.main" : "success.main"
    const headerColor = unconfirmedCount > 0 ? "warning.contrastText" : "success.contrastText"

    return (
        <Card sx={{ width: 300, borderRadius: 2, boxShadow: 3 }}>
            <CardHeader title={<Typography variant="h6">Unconfirmed Competitors</Typography>} avatar={headerIcon} sx={{ backgroundColor: headerBgColor, color: headerColor }} />
            <CardContent>
                <Box sx={{ position: "relative", display: "flex", justifyContent: "center", mb: 2 }}>
                    <ReactApexChart options={chartOptions} series={series} type="radialBar" width={240} />
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
                        <Typography variant="h6">{unconfirmedCount > 0 ? `0 from ${unconfirmedCount}` : "0 from 0"}</Typography>
                    </Box>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        {unconfirmedCount > 0 ? `You need to confirm ${unconfirmedCount} competitors.` : "All competitors are confirmed!"}
                    </Typography>
                    {unconfirmedCount > 0 && (
                        <Link href={`/companies/${companyUUID}/dashboard/competitors`} passHref>
                            <Button variant="contained" color="warning" sx={{ mt: 2 }}>
                                Confirm Now
                            </Button>
                        </Link>
                    )}
                </Box>
            </CardContent>
        </Card>
    )
}

export default UnconfirmedCompetitorsCard
