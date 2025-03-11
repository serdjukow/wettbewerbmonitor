import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import archiver from "archiver"

export async function GET(
    req: Request,
    { params }: { params: Record<string, string> } // ✅ Исправленный тип
) {
    try {
        const domain = params.domain
        const date = params.date

        // ✅ Проверяем, что параметры существуют
        if (!domain || !date) {
            return NextResponse.json({ error: "❌ Domain or date is missing" }, { status: 400 })
        }

        console.log(`🔍 Fetching ZIP: ${domain}, Date: ${date}`)

        const versionPath = path.join(process.cwd(), "websites", domain, date)
        if (!fs.existsSync(versionPath)) {
            return NextResponse.json({ error: "❌ Version not found" }, { status: 404 })
        }

        // 📂 Создаем папку `zips/`, если её нет
        const zipFolderPath = path.join(process.cwd(), "public", "zips")
        if (!fs.existsSync(zipFolderPath)) {
            fs.mkdirSync(zipFolderPath, { recursive: true })
            console.log("📂 Folder `zips/` created!")
        }

        const zipPath = path.join(zipFolderPath, `${domain}-${date}.zip`)

        // 🔥 Создаем ZIP-архив
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
