import { NextResponse, type NextRequest } from "next/server"
import fs from "fs"
import path from "path"

export async function DELETE(req: NextRequest, context: { params: { domain?: string } }): Promise<NextResponse> {
    try {
        const params = await context.params // ✅ Теперь `params` извлекаются асинхронно

        if (!params?.domain) {
            return NextResponse.json({ error: "❌ Domain not specified" }, { status: 400 })
        }

        const domain = params.domain
        console.log(`🗑️ Deleting website: ${domain}`)

        const domainPath = path.join(process.cwd(), "websites", domain)

        if (!fs.existsSync(domainPath)) {
            return NextResponse.json({ error: "❌ Website not found" }, { status: 404 })
        }

        fs.rmSync(domainPath, { recursive: true, force: true })

        return NextResponse.json({ message: `✅ Website ${domain} deleted successfully!` })
    } catch (error) {
        console.error("❌ Error deleting website:", error)

        return NextResponse.json({ error: "Error deleting website", details: `${error}` }, { status: 500 })
    }
}
