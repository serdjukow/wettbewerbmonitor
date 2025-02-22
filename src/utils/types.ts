export interface GeneralService {
    title?: string
    name?: string
    description?: string
    aiAnalysis?: string
    manualAnalysis?: string
    competitorMapping?: { [competitorId: string]: boolean }
    isCompetitor?: boolean
    analysisType?: "" | "manual" | "ai"
}

export interface Competitor {
    uuid: string
    name: string
    status: "not_checked" | "competitor" | "not_competitor"
    products: GeneralService[]
    domain: string
    url: string
    position?: number
    match?: number
    keyword?: string
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

type Keyword = {
    uuid: string
    keyword: string
}

export type Company = {
    id?: string
    uuid?: string
    name: string
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
    website?: string
    socialNetworks?: {
        facebook?: string
        instagram?: string
        linkedin?: string
        twitter?: string
    }
    seo?: {
        keywords?: Keyword[]
        competitors?: Competitor[]
    }
    generalKeywords?: string[]
    generalServices?: {
        title: string
        description?: string
    }[]
    generalDomains?: string[]
}

interface QueryParams {
    limit: string
    country: string
}

export type AppState = {
    companies: Company[]
    selectedCompany: Company | null
    addCompany: (company: Company) => void
    setSelectedCompany: (company: Company | null) => void
    fetchCompanies: () => Promise<void>
    removeCompany: (uuid: string) => Promise<void>
    updateCompany: (uuid: string, updatedData: Partial<Company>) => Promise<void>
    queryParams: QueryParams
    updateQueryParams: (params: Partial<QueryParams>) => void
}
