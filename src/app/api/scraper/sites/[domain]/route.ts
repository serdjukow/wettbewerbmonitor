import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(req: NextRequest, context: { params: Promise<{ domain: string }> }) {
    try {
        const { domain } = await context.params

        if (!domain) {
            return NextResponse.json({ error: "❌ Домен не указан" }, { status: 400 })
        }

        console.log("🔍 Получен запрос на сайт:", domain)

        const domainPath = path.join(process.cwd(), "websites", domain)
        if (!fs.existsSync(domainPath)) {
            return NextResponse.json({ error: "❌ Домен не найден" }, { status: 404 })
        }

        const versions = fs.readdirSync(domainPath).filter((folder) => fs.statSync(path.join(domainPath, folder)).isDirectory())

        return NextResponse.json({ domain, versions })
    } catch (error: unknown) {
        console.error("❌ Ошибка при получении версий сайта:", error)

        let errorMessage = "Неизвестная ошибка"
        if (error instanceof Error) {
            errorMessage = error.message
        }

        return NextResponse.json({ error: "Ошибка при получении версий", details: errorMessage }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ domain: string }> }) {
    try {
        const { domain } = await context.params

        if (!domain) {
            return NextResponse.json({ error: "❌ Domain not specified" }, { status: 400 })
        }

        console.log(`🗑️ Deleting website: ${domain}`)

        const domainPath = path.join(process.cwd(), "websites", domain)

        if (!fs.existsSync(domainPath)) {
            return NextResponse.json({ error: "❌ Website not found" }, { status: 404 })
        }

        fs.rmSync(domainPath, { recursive: true, force: true })

        return NextResponse.json({ message: `✅ Website ${domain} deleted successfully!` })
    } catch (error: unknown) {
        console.error("❌ Error deleting website:", error)

        let errorMessage = "Unknown error"
        if (error instanceof Error) {
            errorMessage = error.message
        }

        return NextResponse.json({ error: "Error deleting website", details: errorMessage }, { status: 500 })
    }
}
