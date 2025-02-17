"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { alpha } from "@mui/material/styles"
import {
    Box,
    Button,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Toolbar,
    Paper,
    Checkbox,
    FormControlLabel,
    Switch,
} from "@mui/material"
import { visuallyHidden } from "@mui/utils"
import { useSistrixData } from "@/src/hooks/useSistrixQuery"
import { v4 as uuidv4 } from "uuid"
import IconButton from "@mui/material/IconButton"
import FilterListIcon from "@mui/icons-material/FilterList"
import Tooltip from "@mui/material/Tooltip"
import Skeleton from "@mui/material/Skeleton"
import { fetchCredits } from "@/src/utils/functions"

interface SistrixCompetitorResult {
    uuid?: string
    position: number
    name?: string
    url?: string
    domain?: string
}

export type Competitor = {
    uuid?: string
    name?: string
    domain?: string
    url?: string
    position?: number
    address?: {
        street: string
        houseNumber: string
        postalCode: string
        city: string
    }
    contact?: {
        phone: string
        email: string
    }
    socialNetworks?: {
        facebook?: string
        instagram?: string
        linkedin?: string
        twitter?: string
    }
}

interface HeadCell {
    disablePadding: boolean
    id: keyof Pick<Competitor, "position" | "domain" | "url">
    label: string
    numeric: boolean
}

const headCells: readonly HeadCell[] = [
    { id: "position", numeric: false, disablePadding: false, label: "Position" },
    { id: "domain", numeric: false, disablePadding: false, label: "Domain" },
    { id: "url", numeric: false, disablePadding: false, label: "Url" },
]

type Order = "asc" | "desc"

function descendingComparator(a: number | string, b: number | string) {
    if (b < a) return -1
    if (b > a) return 1
    return 0
}

function getComparator<Key extends "position" | "domain" | "url">(order: Order, orderBy: Key): (a: Competitor, b: Competitor) => number {
    return order === "desc"
        ? (a, b) => descendingComparator(a[orderBy] ?? (orderBy === "position" ? 0 : ""), b[orderBy] ?? (orderBy === "position" ? 0 : ""))
        : (a, b) => -descendingComparator(a[orderBy] ?? (orderBy === "position" ? 0 : ""), b[orderBy] ?? (orderBy === "position" ? 0 : ""))
}

interface EnhancedTableHeadProps {
    numSelected: number
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
    order: Order
    orderBy: keyof Pick<Competitor, "position" | "domain" | "url">
    rowCount: number
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Pick<Competitor, "position" | "domain" | "url">) => void
}

function EnhancedTableHead(props: EnhancedTableHeadProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props
    const createSortHandler = (property: keyof Pick<Competitor, "position" | "domain" | "url">) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property)
    }

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ "aria-label": "select all competitors" }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

interface EnhancedTableToolbarProps {
    numSelected: number
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected } = props
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
                    Competitors
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Add competitors">
                    <Button variant="contained" size="small" color="success">
                        Add competitors
                    </Button>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    )
}

interface KeywordStats {
    intent_website?: number
    intent_know?: number
    intent_visit?: number
    intent_do?: number
}

interface KeywordStatsTableToolbarProps {
    keyword: string
    keywordStats: KeywordStats
}

function KeywordStatsTableToolbar(props: KeywordStatsTableToolbarProps) {
    const { keyword, keywordStats } = props
    const [credits, setCredits] = useState<string | number>("Loading...")
    
    useEffect(() => {
        async function getCredits() {
            const result = await fetchCredits()
            setCredits(result)
        }
        getCredits()
    }, [])

    return (
        <Toolbar
            sx={{
                pt: { sm: 2 },
                pb: { sm: 2 },
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
            }}
        >
            <Box sx={{ flex: "1 1 100%" }}>
                <Typography variant="h6" id="tableTitle" component="div">
                    Keyword: {keyword}
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                    <Typography variant="body1">Website: {keywordStats.intent_website ?? 0}</Typography>
                    <Typography variant="body1">Know: {keywordStats.intent_know ?? 0}</Typography>
                    <Typography variant="body1">Visit: {keywordStats.intent_visit ?? 0}</Typography>
                    <Typography variant="body1">Do: {keywordStats.intent_do ?? 0}</Typography>
                </Box>
            </Box>
            <Box sx={{ flex: "0 0 auto", pr: { xs: 2, sm: 2 } }}>
                <Typography variant="h6">Remaining Credits: {credits}</Typography>
            </Box>
        </Toolbar>
    )
}

const CACHE_TIME = 1000 * 60 * 60 * 24

export default function CompetitorsManager() {
    const [keyword, setKeyword] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [competitors, setCompetitors] = useState<Competitor[]>([])
    const [order, setOrder] = useState<Order>("asc")
    const [orderBy, setOrderBy] = useState<keyof Pick<Competitor, "position" | "domain" | "url">>("position")
    const [selected, setSelected] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [dense, setDense] = useState(true)

    useEffect(() => {
        const storedTerm = localStorage.getItem("lastSearchTerm")
        const storedTimestamp = localStorage.getItem("lastSearchTimestamp")
        if (storedTerm && storedTimestamp) {
            const elapsed = Date.now() - parseInt(storedTimestamp, 10)
            if (elapsed < CACHE_TIME) {
                setKeyword(storedTerm)
                setSearchTerm(storedTerm)
            } else {
                localStorage.removeItem("lastSearchTerm")
                localStorage.removeItem("lastCompetitors")
                localStorage.removeItem("lastSearchTimestamp")
                setKeyword("")
                setSearchTerm("")
                setCompetitors([])
            }
        }
        const storedCompetitors = localStorage.getItem("lastCompetitors")
        if (storedCompetitors) {
            setCompetitors(JSON.parse(storedCompetitors))
        }
    }, [])

    const { data, isLoading, isError, error } = useSistrixData(
        searchTerm,
        "de",
        { limit: "5", history: "false" },
        { enabled: !!searchTerm }
    )

    useEffect(() => {
        if (data?.answer?.[0]?.result) {
            const competitorResults = data.answer[0].result as unknown as SistrixCompetitorResult[]
            const validResults = competitorResults.filter((item) => Boolean(item.domain && item.url))
            const fetchedCompetitors: Competitor[] = validResults.map((item) => ({
                uuid: item.uuid || uuidv4(),
                position: item.position,
                name: item.name || "",
                url: item.url || "",
                domain: item.domain || "",
                address: { street: "", houseNumber: "", postalCode: "", city: "" },
                contact: { phone: "", email: "" },
                socialNetworks: { facebook: "", instagram: "", linkedin: "", twitter: "" },
            }))
            setCompetitors(fetchedCompetitors)
            localStorage.setItem("lastCompetitors", JSON.stringify(fetchedCompetitors))
            localStorage.setItem("lastSearchTimestamp", Date.now().toString())
        }
    }, [data])

    const handleSearch = () => {
        setSearchTerm(keyword)
        localStorage.setItem("lastSearchTerm", keyword)
        localStorage.setItem("lastSearchTimestamp", Date.now().toString())
    }

    // const handleAddCompetitor = () => {
    //     if (data?.answer?.[0]?.result) {
    //         const validResults = data.answer[0].result.filter((item: any) => item.domain && item.url)
    //         const fetchedCompetitors: Competitor[] = validResults.map((item: any) => ({
    //             uuid: item.uuid || uuidv4(),
    //             position: item.position,
    //             name: item.name || "",
    //             url: item.url || "",
    //             domain: item.domain || "",
    //             address: { street: "", houseNumber: "", postalCode: "", city: "" },
    //             contact: { phone: "", email: "" },
    //             socialNetworks: { facebook: "", instagram: "", linkedin: "", twitter: "" },
    //         }))
    //         setCompetitors(fetchedCompetitors)
    //         localStorage.setItem("lastCompetitors", JSON.stringify(fetchedCompetitors))
    //         localStorage.setItem("lastSearchTimestamp", Date.now().toString())
    //     }
    // }

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Pick<Competitor, "position" | "domain" | "url">) => {
        const isAsc = orderBy === property && order === "asc"
        setOrder(isAsc ? "desc" : "asc")
        setOrderBy(property)
    }

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = competitors.map((comp) => comp.uuid || "")
            setSelected(newSelected)
            return
        }
        setSelected([])
    }

    const handleClick = (event: React.MouseEvent<unknown>, uuid: string) => {
        const selectedIndex = selected.indexOf(uuid)
        let newSelected: string[] = []
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, uuid)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
        }
        setSelected(newSelected)
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked)
    }

    const sortedCompetitors = React.useMemo(() => [...competitors].sort(getComparator(order, orderBy)), [competitors, order, orderBy])

    const paginatedCompetitors = React.useMemo(
        () => sortedCompetitors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [sortedCompetitors, page, rowsPerPage]
    )

    const isSelected = (uuid: string) => selected.indexOf(uuid) !== -1

    if (isError) return <Typography color="error">Error: {error?.message}</Typography>
    
    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                <TextField
                    label="Enter keyword"
                    variant="outlined"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch()
                        }
                    }}
                    sx={{ flex: 1 }}
                />
                <Button variant="contained" onClick={handleSearch}>
                    Search
                </Button>
            </Box>

            {!isLoading ? (
                !!paginatedCompetitors.length && (
                    <Box>
                        <Paper sx={{ width: "100%", mb: 2 }}>
                            <KeywordStatsTableToolbar keyword={keyword} keywordStats={data?.keywordStats ?? {}} />
                            <EnhancedTableToolbar numSelected={selected.length} />
                            <TableContainer>
                                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? "small" : "medium"}>
                                    <EnhancedTableHead
                                        numSelected={selected.length}
                                        order={order}
                                        orderBy={orderBy}
                                        rowCount={competitors.length}
                                        onSelectAllClick={handleSelectAllClick}
                                        onRequestSort={handleRequestSort}
                                    />
                                    <TableBody>
                                        {paginatedCompetitors.map((row, index) => {
                                            const isItemSelected = isSelected(row.uuid || "")
                                            const labelId = `enhanced-table-checkbox-${index}`
                                            return (
                                                <TableRow
                                                    hover
                                                    onClick={(event) => handleClick(event, row.uuid || "")}
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={row.uuid || index}
                                                    selected={isItemSelected}
                                                    sx={{ cursor: "pointer" }}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            color="primary"
                                                            checked={isItemSelected}
                                                            inputProps={{ "aria-labelledby": labelId }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="left">{row.position}</TableCell>
                                                    <TableCell>{row.domain}</TableCell>
                                                    <TableCell>{row.url}</TableCell>
                                                </TableRow>
                                            )
                                        })}
                                        {paginatedCompetitors.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} align="center">
                                                    No data
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={competitors.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                        <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />
                    </Box>
                )
            ) : (
                <>
                    <Skeleton animation="wave" variant="rectangular" height={50} />
                    <Skeleton animation="wave" height={50} />
                    <Skeleton animation="wave" height={50} />
                    <Skeleton animation="wave" height={50} />
                    <Skeleton animation="wave" height={50} />
                    <Skeleton animation="wave" height={50} />
                    <Skeleton animation="wave" height={50} />
                </>
            )}
        </Box>
    )
}
