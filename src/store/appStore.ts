import { create } from "zustand"
import { persist } from "zustand/middleware"
import { type Company } from "@/src/utils/types"
import { addCompanyToDB, getCompanies, deleteCompanyFromDB, updateCompanyInDB } from "@/src/services/firebaseService"

type AppState = {
    companies: Company[]
    selectedCompany: Company | null
    isAutopilotActive: boolean
    setAutopilotActive: (active: boolean) => void
    addCompany: (company: Company) => void
    setSelectedCompany: (company: Company | null) => void
    fetchCompanies: () => Promise<void>
    removeCompany: (uuid: string) => Promise<void>
    updateCompany: (uuid: string, updatedData: Partial<Company>) => Promise<void>
}

export const useAppStore = create(
    persist<AppState>(
        (set) => ({
            companies: [],
            selectedCompany: null,
            isAutopilotActive: false,

            setAutopilotActive: (active) => set({ isAutopilotActive: active }),

            addCompany: async (company: Omit<Company, "uuid">) => {
                const newCompany: Company = await addCompanyToDB(company)
                set((state) => ({
                    companies: [...state.companies, newCompany],
                }))
            },

            setSelectedCompany: (company) => set({ selectedCompany: company }),

            fetchCompanies: async () => {
                try {
                    const data = await getCompanies()
                    set({ companies: data })
                } catch (error) {
                    console.error("Error uploading companies: AppStore function", error)
                }
            },

            removeCompany: async (uuid: string) => {
                await deleteCompanyFromDB(uuid)
                set((state) => ({
                    companies: state.companies.filter((company) => company.uuid !== uuid),
                    selectedCompany: state.selectedCompany?.uuid === uuid ? null : state.selectedCompany,
                }))
            },

            updateCompany: async (uuid: string, updatedData: Partial<Company>) => {
                await updateCompanyInDB(uuid, updatedData)
                set((state) => ({
                    companies: state.companies.map((company) => (company.uuid === uuid ? { ...company, ...updatedData } : company)),
                    selectedCompany: state.selectedCompany?.uuid === uuid ? { ...state.selectedCompany, ...updatedData } : state.selectedCompany,
                }))
            },
        }),
        {
            name: "app-store",
        }
    )
)
