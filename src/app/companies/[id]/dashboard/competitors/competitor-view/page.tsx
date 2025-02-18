"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { styled } from "@mui/material/styles"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { Container, Typography, ButtonGroup, Button } from "@mui/material"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useAppStore } from "@/src/store/appStore"
import { type Competitor } from "@/src/utils/types"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}))

const CompetitorViewPage: React.FC = () => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    const { selectedCompany } = useAppStore()
    const uuid = searchParams.get("uuid")
    const [competitor, setCompetitor] = useState<Competitor | null>(null)

    useEffect(() => {
        if (selectedCompany && uuid) {
            const comp =
                selectedCompany?.seo?.competitorsByKeyword?.find((c: Competitor) => c.uuid === uuid) ||
                selectedCompany?.seo?.competitors?.find((c: Competitor) => c.uuid === uuid) ||
                null
            setCompetitor(comp)
        }
    }, [selectedCompany, uuid])

    const rows = competitor
        ? [
              { property: "Name", value: competitor.name },
              { property: "Domain", value: competitor.domain },
              { property: "URL", value: competitor.url },
              { property: "Keyword", value: (competitor as any).keyword },
              { property: "Contact Email", value: competitor.contact?.email },
              { property: "Contact Phone", value: competitor.contact?.phone },
              { property: "Street", value: competitor.address?.street },
              { property: "House Number", value: competitor.address?.houseNumber },
              { property: "Postal Code", value: competitor.address?.postalCode },
              { property: "City", value: competitor.address?.city },
              { property: "Facebook", value: competitor.socialNetworks?.facebook },
              { property: "Instagram", value: competitor.socialNetworks?.instagram },
              { property: "LinkedIn", value: competitor.socialNetworks?.linkedin },
              { property: "Twitter", value: competitor.socialNetworks?.twitter },
          ]
        : []

    const renderValue = (value: any) => (value && value.toString().trim() !== "" ? value : "-")

    if (!competitor) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography variant="h6">Competitor not found.</Typography>
                <Button variant="contained" onClick={() => router.back()} sx={{ mt: 2 }}>
                    Go Back
                </Button>
            </Container>
        )
    }

    const handleEditCompetitor = (uuid: string) => {
        router.push(`/companies/${selectedCompany?.uuid}/dashboard/competitors/competitor-edit?uuid=${uuid}`)
    }

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                {competitor.name || "-"}
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="competitor details">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Property</StyledTableCell>
                            <StyledTableCell>Value</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <StyledTableRow key={index}>
                                <StyledTableCell component="th" scope="row">
                                    {row.property}
                                </StyledTableCell>
                                <StyledTableCell>{renderValue(row.value)}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ButtonGroup variant="contained" sx={{ mt: 4}}>
                <Button onClick={() => router.back()}>Back</Button>
                <Button
                    data-uuid={competitor.uuid}
                    color="success"
                    onClick={(e) => {
                        const uuid = e.currentTarget.dataset.uuid
                        if (uuid) handleEditCompetitor(uuid)
                    }}
                >
                    Edit
                </Button>
            </ButtonGroup>
        </Container>
    )
}

export default CompetitorViewPage
