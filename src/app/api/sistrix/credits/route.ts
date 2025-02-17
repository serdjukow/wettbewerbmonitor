import { NextResponse } from "next/server"
// import handler from "./../sistrix-key/sistrix-key"

const BASE_URL = "https://api.sistrix.com"
const API_KEY = process.env.SISTRIX_API_KEY

export async function GET() {
    try {
        const response = await fetch(`${BASE_URL}/credits?api_key=${API_KEY}&format=json`)

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} - ${response.statusText}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error("Error while requesting SISTRIX API:", error)
        return NextResponse.json({ error: "Error while requesting" }, { status: 500 })
    }
}