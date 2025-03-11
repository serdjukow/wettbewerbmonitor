import { NextResponse, NextRequest } from "next/server"
import fs from "fs"
import path from "path"
import archiver from "archiver"

export async function GET(req: NextRequest, context: { params: unknown }) {
    try {
        // Приводим context.params к типу объекта с динамическими параметрами
        const { params } = context as { params: Record<string, string | string[]> }

        // Если параметр приходит как массив, берем первый элемент
        const domain = Array.isArray(params.domain) ? params.domain[0] : params.domain
        const date = Array.isArray(params.date) ? params.date[0] : params.date

        if (!domain || !date) {
            return NextResponse.json({ error: "❌ Domain or date is missing" }, { status: 400 })
        }

        console.log(`🔍 Fetching ZIP for: ${domain}, Date: ${date}`)

        const versionPath = path.join(process.cwd(), "websites", domain, date)
        if (!fs.existsSync(versionPath)) {
            return NextResponse.json({ error: "❌ Version not found" }, { status: 404 })
        }

        const zipFolderPath = path.join(process.cwd(), "public", "zips")
        if (!fs.existsSync(zipFolderPath)) {
            fs.mkdirSync(zipFolderPath, { recursive: true })
            console.log("📂 Folder `zips/` created!")
        }

        const zipPath = path.join(zipFolderPath, `${domain}-${date}.zip`)

        const output = fs.createWriteStream(zipPath)
        const archive = archiver("zip", { zlib: { level: 9 } })

        output.on("close", () => {
            console.log(`✅ ZIP archive created: ${zipPath}`)
        })

        archive.pipe(output)
        archive.directory(versionPath, false)
        await archive.finalize()

        return NextResponse.json({
            message: "✅ ZIP archive created",
            downloadUrl: `/zips/${domain}-${date}.zip`,
        })
    } catch (error: unknown) {
        console.error("❌ Error creating ZIP:", error)

        let errorMessage = "Unknown error"
        if (error instanceof Error) {
            errorMessage = error.message
        }

        return NextResponse.json({ error: "Error creating ZIP", details: errorMessage }, { status: 500 })
    }
}
