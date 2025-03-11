import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
    try {
        const websitesPath = path.join(process.cwd(), "websites")
        if (!fs.existsSync(websitesPath)) {
            return NextResponse.json({ websites: [] })
        }

        const domains = fs.readdirSync(websitesPath).filter((folder) => fs.statSync(path.join(websitesPath, folder)).isDirectory())

        const result = domains.map((domain) => {
            const domainPath = path.join(websitesPath, domain)
            const versions = fs.readdirSync(domainPath).filter((folder) => fs.statSync(path.join(domainPath, folder)).isDirectory())

            return { domain, versions }
        })

        return NextResponse.json({ websites: result })
    } catch (error) {
        return NextResponse.json({ error: `Error getting list of sites: ${error}` }, { status: 500 })
    }
}
