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
    seo?: []
}

export type AppState = {
    companies: Company[]
    selectedCompany: Company | null
    addCompany: (company: Company) => void
    setSelectedCompany: (company: Company | null) => void
    fetchCompanies: () => Promise<void>;
    loading: boolean,
    removeCompany: (uuid: string) => Promise<void>;
    updateCompany: (uuid: string, updatedData: Partial<Company>) => Promise<void>;
}