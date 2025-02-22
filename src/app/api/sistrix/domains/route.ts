import { NextResponse } from "next/server"
import axios from "axios"

const BASE_URL = "https://api.sistrix.com"
const API_KEY = process.env.SISTRIX_API_KEY || ""

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const domain = searchParams.get("domain")

    if (!domain) {
        return NextResponse.json({ error: "Parameter 'domain' is required" }, { status: 400 })
    }

    const params = {
        api_key: API_KEY,
        domain,
        country: searchParams.get("country") || "de",
        limit: searchParams.get("limit") || "10",
        format: "json",
    }

    try {
        const response = await axios.get(`${BASE_URL}/domain.competitors.seo`, { params })
        return NextResponse.json(response.data)
    } catch (error) {
        const errorMessage = (axios.isAxiosError(error) && error.response?.data) || (error as Error).message || "Ошибка запроса"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}
