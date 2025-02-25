export interface GeneralService {
    title: string
    description?: string
    analysisType: "not_processed" | "manual" | "ai"
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

export interface TrackedCountry {
    country: string
    country_name: string
}

export type Company = {
    uuid: string
    name: string
    country: TrackedCountry
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
    generalServices?: GeneralService[]
    generalDomains?: string[]
    trackedCountries?: TrackedCountry[]
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
