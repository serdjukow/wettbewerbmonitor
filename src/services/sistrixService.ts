import axios from "axios"

const BASE_URL = "https://api.sistrix.com"
const API_KEY = process.env.SISTRIX_API_KEY || ""

if (!API_KEY) {
    throw new Error("SISTRIX API Key is missing. Please set it in your environment variables.")
}

interface SistrixCreditsResponse {
    status: string
    answer?: { credits: { value: number; used: number }[] }[]
    error?: { error_code: string; error_message: string }[]
}

const sistrixApi = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
        country: "de",
        format: "json",
    },
})

export const checkSistrixCredits = async (): Promise<SistrixCreditsResponse> => {
    try {
        const response = await sistrixApi.get<SistrixCreditsResponse>("/credits")
        return response.data
    } catch (error) {
        console.error("Ошибка при запросе к SISTRIX API:", error)
        throw error
    }
}

export const getVisibilityIndex = async (domain: string): Promise<unknown> => {
    try {
        const response = await sistrixApi.get("/domain.visibilityindex.overview", {
            params: { domain },
        })
        return response.data
    } catch (error) {
        console.error("Error getting visibility index:", error)
        throw error
    }
}

export const getDomainOverview = async (domain: string): Promise<unknown> => {
    try {
        const response = await sistrixApi.get("/domain.overview", {
            params: { domain },
        })
        return response.data
    } catch (error) {
        console.error("Error getting domain overview:", error)
        throw error
    }
}
