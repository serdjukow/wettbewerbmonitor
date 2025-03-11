import { NextResponse, type NextRequest } from "next/server"
import fs from "fs"
import path from "path"
import archiver from "archiver"

type RouteParams = {
    domain: string
    date: string[] // параметр передаётся как массив строк
}

export async function GET(req: NextRequest, { params }: { params: RouteParams }): Promise<NextResponse> {
    // Извлекаем первый элемент массива date
    const domain = params.domain
    const dateValue = params.date[0]

    if (!domain || !dateValue) {
        return NextResponse.json({ error: "❌ Domain or date is missing" }, { status: 400 })
    }

    console.log(`🔍 Fetching ZIP for: ${domain}, Date: ${dateValue}`)

    const versionPath = path.join(process.cwd(), "websites", domain, dateValue)
    if (!fs.existsSync(versionPath)) {
        return NextResponse.json({ error: "❌ Version not found" }, { status: 404 })
    }

    // Создаем папку "zips", если её нет
    const zipFolderPath = path.join(process.cwd(), "public", "zips")
    if (!fs.existsSync(zipFolderPath)) {
        fs.mkdirSync(zipFolderPath, { recursive: true })
        console.log("📂 Folder `zips/` created!")
    }

    const zipPath = path.join(zipFolderPath, `${domain}-${dateValue}.zip`)

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
        downloadUrl: `/zips/${domain}-${dateValue}.zip`,
    })
}
