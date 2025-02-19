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
import Tooltip from "@mui/material/Tooltip"
import Skeleton from "@mui/material/Skeleton"
import { type Competitor } from "@/src/utils/types"
import { useAppStore } from "@/src/store/appStore"
import RemainingCredits from "@/src/components/RemainingCredits"

interface SistrixCompetitorResult {
    uuid?: string
    position: number
    name?: string
    url?: string
    domain?: string
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
    onAddCompetitors?: () => void
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, onAddCompetitors } = props
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
                <>
                    <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1" component="div">
                        {numSelected} selected
                    </Typography>
                    <Tooltip title="Add competitors">
                        <Button
                            onClick={onAddCompetitors}
                            variant="contained"
                            size="small"
                            color="success"
                            sx={{
                                "&:hover": {
                                    color: "white",
                                },
                            }}
                        >
                            Save competitors
                        </Button>
                    </Tooltip>
                </>
            ) : (
                <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
                    Competitors
                </Typography>
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
                    Keyword:
                    <span style={{ color: "#3498db", marginLeft: "5px" }}>{keyword}</span>
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 1, color: "text.secondary" }}>
                    <Typography variant="body1">Website: {keywordStats.intent_website ?? 0}</Typography>
                    <Typography variant="body1">Know: {keywordStats.intent_know ?? 0}</Typography>
                    <Typography variant="body1">Visit: {keywordStats.intent_visit ?? 0}</Typography>
                    <Typography variant="body1">Do: {keywordStats.intent_do ?? 0}</Typography>
                </Box>
            </Box>
            <RemainingCredits />
        </Toolbar>
    )
}

type ExtendedCompetitor = Competitor & { competitorName?: string; keyword?: string }

export default function CompetitorsManager() {
    const [keyword, setKeyword] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [competitors, setCompetitors] = useState<Competitor[]>([])
    const [order, setOrder] = useState<Order>("asc")
    const [orderBy, setOrderBy] = useState<keyof Pick<Competitor, "position" | "domain" | "url">>("position")
    const [selected, setSelected] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(100)
    const [dense, setDense] = useState(true)
    const { updateCompany, selectedCompany } = useAppStore()

    // При загрузке компонента — никаких данных из localStorage, только начальные значения
    useEffect(() => {
        // Если данные уже были получены ранее, можно их сохранить в state,
        // но здесь мы ничего не сохраняем между переходами.
    }, [])

    const { data, isLoading, isError, error } = useSistrixData(
        searchTerm,
        "de",
        { limit: "5", history: "false" },
        { enabled: !!searchTerm }
    )

    useEffect(() => {
        if (data?.answer?.[0]?.result) {
            const competitorResults = data.answer[0].result as SistrixCompetitorResult[]
            const validResults = competitorResults.filter((item) => Boolean(item.domain && item.url))
            const candidateKeyword = data?.answer?.[0]?.kw || ""
            const addedCompetitors = selectedCompany?.seo?.competitorsByKeyword || []

            const filteredResults = validResults.filter((item) => {
                return !addedCompetitors.some((comp) => {
                    const compKeyword = (comp as ExtendedCompetitor).keyword || ""
                    return comp.domain === item.domain && compKeyword === candidateKeyword
                })
            })

            const fetchedCompetitors: Competitor[] = filteredResults.map((item) => ({
                uuid: item.uuid || uuidv4(),
                position: item.position,
                url: item.url || "",
                domain: item.domain || "",
                keyword: "",
                name: item.name || "",
                status: "not_checked",
                products: [],
                address: { street: "", houseNumber: "", postalCode: "", city: "" },
                contact: { phone: "", email: "" },
                socialNetworks: { facebook: "", instagram: "", linkedin: "", twitter: "" },
            }))
            setCompetitors(fetchedCompetitors)
            // Больше не сохраняем данные в localStorage
        }
    }, [data, selectedCompany])

    const handleSearch = () => {
        setSearchTerm(keyword)
        // Убираем сохранение в localStorage
    }

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

    const handleSaveCompetitorsByKeyword = (competitors: Competitor[]) => {
        if (selectedCompany?.uuid) {
            const currentCompetitorsByKeyword = selectedCompany?.seo?.competitorsByKeyword || []
            const formattedCompetitors = competitors.map((comp) => ({
                keyword: data?.answer?.[0]?.kw || "",
                uuid: comp.uuid || "",
                name: comp.name || (comp as ExtendedCompetitor).competitorName || "",
                status: comp.status,
                products: comp.products,
                domain: comp.domain || "",
                url: comp.url || "",
                position: comp.position !== undefined ? comp.position : 0,
                address: {
                    street: comp.address?.street || "",
                    houseNumber: comp.address?.houseNumber || "",
                    postalCode: comp.address?.postalCode || "",
                    city: comp.address?.city || "",
                },
                contact: {
                    phone: comp.contact?.phone || "",
                    email: comp.contact?.email || "",
                },
                socialNetworks: {
                    facebook: comp.socialNetworks?.facebook || "",
                    instagram: comp.socialNetworks?.instagram || "",
                    linkedin: comp.socialNetworks?.linkedin || "",
                    twitter: comp.socialNetworks?.twitter || "",
                },
            }))

            updateCompany(selectedCompany.uuid, {
                seo: {
                    competitorsByKeyword: [...currentCompetitorsByKeyword, ...formattedCompetitors],
                },
            })
            setSelected([])
        }
    }

    const handleAddCompetitors = () => {
        const selectedCompetitors = competitors.filter((comp) => comp.uuid && selected.includes(comp.uuid))
        handleSaveCompetitorsByKeyword(selectedCompetitors)
        setCompetitors([])
    }

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
                            <EnhancedTableToolbar numSelected={selected.length} onAddCompetitors={handleAddCompetitors} />
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
                                rowsPerPageOptions={[5, 10, 25, 50, 100]}
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
