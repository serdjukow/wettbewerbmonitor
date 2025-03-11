import { NextResponse, type NextRequest } from "next/server"
import fs from "fs"
import path from "path"
import archiver from "archiver"

type RouteParams = {
    domain?: string
    version?: string | string[]
}

/**
 * Создаёт папку, если она отсутствует.
 */
const ensureDirectoryExists = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
        console.log(`📂 Folder created: ${dirPath}`)
    }
}

export async function GET(req: NextRequest, context: { params: RouteParams }): Promise<NextResponse> {
    // Явно получаем params через await
    const params = await context.params

    if (!params.domain || !params.version) {
        return NextResponse.json({ error: "❌ Domain or version is missing" }, { status: 400 })
    }

    // Если `version` - массив, берем первый элемент
    const domain = params.domain
    const version = Array.isArray(params.version) ? params.version[0] : params.version

    console.log(`🔍 Fetching ZIP for: ${domain}, Version: ${version}`)

    const versionPath = path.join(process.cwd(), "websites", domain, version)
    if (!fs.existsSync(versionPath)) {
        return NextResponse.json({ error: "❌ Version not found" }, { status: 404 })
    }

    // Создаём ZIP-файл
    const zipFolderPath = path.join(process.cwd(), "public", "zips")
    ensureDirectoryExists(zipFolderPath)

    const zipPath = path.join(zipFolderPath, `${domain}-${version}.zip`)

    try {
        const output = fs.createWriteStream(zipPath)
        const archive = archiver("zip", { zlib: { level: 9 } })

        await new Promise<void>((resolve, reject) => {
            output.on("close", () => resolve()) // ✅ Теперь `resolve` вызывается без аргументов
            archive.on("error", reject)

            archive.pipe(output)
            archive.directory(versionPath, false)
            archive.finalize()
        })

        console.log(`✅ ZIP archive created: ${zipPath}`)

        return NextResponse.json({
            message: "✅ ZIP archive created",
            downloadUrl: `/zips/${domain}-${version}.zip`,
        })
    } catch (error) {
        return NextResponse.json({ error: "Failed to create ZIP", details: `${error}` }, { status: 500 })
    }
}
