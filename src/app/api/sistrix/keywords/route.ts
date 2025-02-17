import { NextResponse } from "next/server"
import axios from "axios"

const BASE_URL = "https://api.sistrix.com"
const API_KEY = process.env.SISTRIX_API_KEY || ""

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const kw = searchParams.get("kw")

    if (!kw) {
        return NextResponse.json({ error: "Parameter 'kw' is required" }, { status: 400 })
    }

    const paramsSeo = {
        api_key: API_KEY,
        kw,
        country: searchParams.get("country") || "de",
        limit: searchParams.get("limit") || "10",
        format: "json",
    }

    const paramsSearchIntent = new URLSearchParams()
    paramsSearchIntent.append("api_key", API_KEY)
    paramsSearchIntent.append("kw", kw)
    paramsSearchIntent.append("country", searchParams.get("country") || "de")
    paramsSearchIntent.append("format", "json")

    try {
        const [seoRes, searchIntentRes] = await Promise.all([
            axios.get(`${BASE_URL}/keyword.seo`, { params: paramsSeo }),
            axios.post(`${BASE_URL}/keyword.seo.searchintent`, paramsSearchIntent),
        ])

        const keywordStats = searchIntentRes.data?.answer?.[0]?.result?.[0] || {}
        const mergedData = {
            ...seoRes.data,
            keywordStats,
        }

        return NextResponse.json(mergedData)
    } catch (error) {
        const errorMessage = (axios.isAxiosError(error) && error.response?.data) || (error as Error).message || "Ошибка запроса"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}
