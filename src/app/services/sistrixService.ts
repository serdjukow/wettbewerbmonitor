import axios from "axios"

const API_KEY = "RN7fGTWQ8SJsY5TsbSfNqU5KUrfMeLBH"
const BASE_URL = "https://api.sistrix.com"

const sistrixApi = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
        country: "de",
        format: "json",
    },
})

export const checkSistrixCredits = async () => {
    try {
        const response = await fetch(
            `https://api.sistrix.com/credits?api_key=${API_KEY}`
        )

        if (!response.ok) {
            throw new Error(
                `Ошибка: ${response.status} - ${response.statusText}`
            )
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error("Ошибка при запросе к SISTRIX API:", error)
        throw error
    }
}

export const getVisibilityIndex = async (domain: any) => {
    try {
        const response = await sistrixApi.get(
            "/domain.visibilityindex.overview",
            {
                params: { domain },
            }
        )
        return response.data
    } catch (error) {
        console.error("Ошибка при получении индекса видимости:", error)
        throw error
    }
}

export const getDomainOverview = async (domain: any) => {
    try {
        const response = await sistrixApi.get("/domain.overview", {
            params: { domain },
        })
        return response.data
    } catch (error) {
        console.error("Ошибка при получении обзора домена:", error)
        throw error
    }
}
