export interface Competitor {
    uuid: string
    name: string
    status: "not_checked" | "competitor" | "not_competitor"
    products: string[]
    domain: string
    url: string
    position?: number
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
        competitorsByKeyword?: Competitor[]
        competitorsByDomain?: Competitor[]
    }
    generalKeywords?: string[]
    generalServices?: {
        title: string
        description?: string
    }[]
}

export type AppState = {
    companies: Company[]
    selectedCompany: Company | null
    addCompany: (company: Company) => void
    setSelectedCompany: (company: Company | null) => void
    fetchCompanies: () => Promise<void>
    removeCompany: (uuid: string) => Promise<void>
    updateCompany: (uuid: string, updatedData: Partial<Company>) => Promise<void>
}
