import { NextResponse } from "next/server"

const BASE_URL = "https://api.sistrix.com"

const apiKey = process.env.SISTRIX_API_KEY
const apiKeyDemo = "[API_KEY]"

export async function GET() {
    try {
        const response = await fetch(
            `${BASE_URL}/credits?api_key=${apiKey}&format=json`
        )

        if (!response.ok) {
            throw new Error(
                `Ошибка: ${response.status} - ${response.statusText}`
            )
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error("Ошибка при запросе к SISTRIX API:", error)
        return NextResponse.json(
            { error: "Ошибка при запросе" },
            { status: 500 }
        )
    }
}
