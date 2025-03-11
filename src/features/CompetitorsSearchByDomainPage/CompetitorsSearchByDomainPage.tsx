"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Box, Paper } from "@mui/material"
import { usePathname } from "next/navigation"
import SearchBar from "./SearchBar"
import DomainSelectionModal from "./DomainSelectionModal"
import CompetitorsDataGrid from "./CompetitorsDataGrid"
import EnhancedTableToolbar from "./EnhancedTableToolbar"
import DomainStatsTableToolbar from "./DomainStatsTableToolbar"
import CompetitorStats from "@/src/components/CompetitorStats"
import { useSistrixDomainsData } from "@/src/hooks/useSistrixDomainsQuery"
import { useAppStore } from "@/src/store/appStore"
import { useSearchStore } from "@/src/store/searchStore"
import { v4 as uuidv4 } from "uuid"
import { type Competitor } from "@/src/utils/types"

interface SistrixDomainResult {
    uuid?: string
    domain: string
    match: number
}

type Order = "asc" | "desc"
type ExtendedCompetitor = Competitor & { competitorName?: string; domain?: string }

const CompetitorsSearchByDomainPage: React.FC = () => {
    const pathname = usePathname()
    const pageId = useMemo(() => {
        if (pathname) {
            const parts = pathname.split("/").filter(Boolean)
            return parts.pop() || "defaultPage"
        }
        return "defaultPage"
    }, [pathname])

    const { updateCompany, selectedCompany } = useAppStore()
    const { companies, setSearchResult, removeCompetitors, clearSearchResult } = useSearchStore()
    const companyId = selectedCompany?.uuid || "defaultCompany"

    const [domainInput, setDomainInput] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [competitors, setCompetitors] = useState<Competitor[]>([])
    const [order, setOrder] = useState<Order>("asc")
    const [orderBy, setOrderBy] = useState<"match" | "domain">("match")
    const [selected, setSelected] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(100)

    const [openGeneralDomainsModal, setOpenGeneralDomainsModal] = useState(false)
    const handleOpenGeneralModal = () => setOpenGeneralDomainsModal(true)
    const handleCloseGeneralDomainsModal = () => {
        setOpenGeneralDomainsModal(false)
        setGeneralSearchQuery("")
    }
    const handleSelectGeneralDomain = (domain: string) => {
        setDomainInput(domain.trim())
        setOpenGeneralDomainsModal(false)
        setGeneralSearchQuery("")
    }

    const [generalSearchQuery, setGeneralSearchQuery] = useState("")
    const generalDomains = selectedCompany?.generalDomains || []

    useEffect(() => {
        useSearchStore.getState().setCurrentCompanyId(companyId)
        clearSearchResult(companyId)
        setDomainInput("")
        setSearchTerm("")
        setCompetitors([])

        const cache = companies[companyId]

        if (cache && cache.query) {
            setSearchTerm(cache.query)
            setDomainInput(cache.query)
            setCompetitors(cache.result)
        }
    }, [companyId, clearSearchResult, companies])

    const { data, isLoading, isError, error } = useSistrixDomainsData(searchTerm)

    useEffect(() => {
        if (data) {
            if ("status" in data && data.status === "fail") {
                setCompetitors([])
            } else if ("answer" in data && data.answer?.[0]?.result) {
                const competitorResults = data.answer[0].result as SistrixDomainResult[]
                const validResults = competitorResults.filter((item) => Boolean(item.domain))

                const addedCompetitors = selectedCompany?.seo?.competitors || []
                const uniqueDomains = new Set<string>()
                const uniqueResults: SistrixDomainResult[] = []

                for (const item of validResults) {
                    if (!item.domain) continue
                    if (uniqueDomains.has(item.domain)) {
                        continue
                    }
                    uniqueDomains.add(item.domain)
                    uniqueResults.push(item)
                }

                const filteredResults = uniqueResults.filter((item) => {
                    const isAlreadyAdded = addedCompetitors.some((comp) => {
                        const compDomain = (comp as ExtendedCompetitor).domain || ""
                        return compDomain === item.domain
                    })

                    return !isAlreadyAdded
                })

                const fetchedCompetitors: Competitor[] = filteredResults.map((item) => ({
                    uuid: item.uuid || uuidv4(),
                    match: item.match,
                    domain: item.domain,
                    url: "",
                    keyword: "",
                    name: "",
                    status: "not_checked",
                    products: [],
                    address: { street: "", houseNumber: "", postalCode: "", city: "" },
                    contact: { phone: "", email: "" },
                    socialNetworks: { facebook: "", instagram: "", linkedin: "", twitter: "" },
                }))

                setCompetitors(fetchedCompetitors)

                setSearchResult(companyId, { companyId, query: searchTerm, result: fetchedCompetitors })
            }
        }
    }, [data, selectedCompany, searchTerm, pageId, setSearchResult, companyId])

    const metrics = useMemo(() => {
        if (data && "answer" in data && data.answer?.[0]?.result) {
            const competitorResults = data.answer[0].result as SistrixDomainResult[]
            const validResults = competitorResults.filter((item) => Boolean(item.domain))
            const totalResultsCount = validResults.length

            const addedCompetitors = selectedCompany?.seo?.competitors || []
            const uniqueDomains = new Set<string>()
            const uniqueResults: SistrixDomainResult[] = []
            let duplicateCount = 0
            for (const item of validResults) {
                if (!item.domain) continue
                if (uniqueDomains.has(item.domain)) {
                    duplicateCount++
                } else {
                    uniqueDomains.add(item.domain)
                    uniqueResults.push(item)
                }
            }

            let hiddenCount = 0
            const filteredResults = uniqueResults.filter((item) => {
                const isAlreadyAdded = addedCompetitors.some((comp) => {
                    const compDomain = (comp as ExtendedCompetitor).domain || ""
                    return compDomain === item.domain
                })
                if (isAlreadyAdded) hiddenCount++
                return !isAlreadyAdded
            })
            return {
                totalResultsCount,
                filteredResultsCount: filteredResults.length,
                hiddenResultsCount: hiddenCount,
                duplicateCount,
            }
        } else {
            return {
                totalResultsCount: competitors.length,
                filteredResultsCount: competitors.length,
                hiddenResultsCount: 0,
                duplicateCount: 0,
            }
        }
    }, [data, selectedCompany, competitors])

    const handleSearch = () => {
        const trimmed = domainInput.trim()
        setSearchTerm(trimmed)
        setDomainInput(trimmed)
    }

    const handleSaveCompetitors = (competitorsToSave: Competitor[]) => {
        if (selectedCompany?.uuid) {
            const currentCompetitors = selectedCompany?.seo?.competitors || []
            const formattedCompetitors = competitorsToSave.map((comp) => ({
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
                    competitors: [...currentCompetitors, ...formattedCompetitors],
                },
            })
            setSelected([])
        }
    }

    const handleAddCompetitors = () => {
        const selectedCompetitors = competitors.filter((comp) => comp.uuid && selected.includes(comp.uuid))
        handleSaveCompetitors(selectedCompetitors)

        const removedIds = selectedCompetitors.map((comp) => comp.uuid)
        removeCompetitors(companyId, removedIds)
        const updated = useSearchStore.getState().companies[companyId]
        if (updated) {
            setCompetitors(updated.result)
        }
        setSelected([])
    }

    return (
        <Box sx={{ p: 2 }}>
            <Paper sx={{ width: "100%" }}>
                <SearchBar domainInput={domainInput} onDomainInputChange={setDomainInput} onSearch={handleSearch} onOpenGeneralModal={handleOpenGeneralModal} />
                <DomainStatsTableToolbar domain={domainInput} />
                <CompetitorStats
                    totalResultsCount={metrics.totalResultsCount}
                    filteredResultsCount={metrics.filteredResultsCount}
                    hiddenResultsCount={metrics.hiddenResultsCount}
                    duplicateCount={metrics.duplicateCount}
                />
                <EnhancedTableToolbar numSelected={selected.length} onAddCompetitors={handleAddCompetitors} />
                <CompetitorsDataGrid
                    competitors={competitors}
                    selected={selected}
                    onRowSelectionModelChange={setSelected}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPaginationModelChange={({ page, pageSize }) => {
                        setPage(page)
                        setRowsPerPage(pageSize)
                    }}
                    orderBy={orderBy}
                    order={order}
                    onSortModelChange={(model) => {
                        if (model.length) {
                            const field = model[0].field
                            if (field === "match" || field === "domain") {
                                setOrderBy(field as "match" | "domain")
                                setOrder(model[0].sort as Order)
                            }
                        }
                    }}
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                />
            </Paper>
            <DomainSelectionModal
                open={openGeneralDomainsModal}
                onClose={handleCloseGeneralDomainsModal}
                generalDomains={generalDomains}
                generalSearchQuery={generalSearchQuery}
                onGeneralSearchQueryChange={setGeneralSearchQuery}
                onSelectDomain={handleSelectGeneralDomain}
            />
        </Box>
    )
}

export default CompetitorsSearchByDomainPage
