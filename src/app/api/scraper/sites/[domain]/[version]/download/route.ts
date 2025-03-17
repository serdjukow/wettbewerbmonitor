import { NextResponse, type NextRequest } from "next/server"
import fs from "fs"
import path from "path"
import archiver from "archiver"

type RouteParams = {
    domain: string
    version: string
}

export async function GET(req: NextRequest, { params }: { params: Promise<RouteParams> }): Promise<NextResponse> {

    const { domain, version } = await params

    if (!domain || !version) {
        return NextResponse.json({ error: "❌ Domain or version is missing" }, { status: 400 })
    }

    console.log(`🔍 Fetching ZIP for: ${domain}, Version: ${version}`)

    const versionPath = path.join(process.cwd(), "websites", domain, version)
    if (!fs.existsSync(versionPath)) {
        return NextResponse.json({ error: "❌ Version not found" }, { status: 404 })
    }

    const zipFolderPath = path.join(process.cwd(), "public", "zips")
    if (!fs.existsSync(zipFolderPath)) {
        fs.mkdirSync(zipFolderPath, { recursive: true })
        console.log("📂 Folder `zips/` created!")
    }

    const zipPath = path.join(zipFolderPath, `${domain}-${version}.zip`)

    try {
        const output = fs.createWriteStream(zipPath)
        const archive = archiver("zip", { zlib: { level: 9 } })

        await new Promise<void>((resolve, reject) => {
            output.on("close", resolve)
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
