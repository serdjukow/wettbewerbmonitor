import { NextResponse } from "next/server"
import axios from "axios"
import { AxiosError } from "axios"
import { JSDOM } from "jsdom"
import sanitizeHtml from "sanitize-html"
import { minify } from "html-minifier-terser"
import fs from "fs"
import path from "path"
import crypto from "crypto"

type FileEntry = { url: string; file: string; date: string }

function generateHash(url: string): string {
    return crypto.createHash("md5").update(url).digest("hex")
}

function getCurrentDate(): string {
    return new Date().toISOString().split("T")[0]
}

function cleanEmptyTags(html: string): string {
    return html.replace(/<(\w+)>\s*<\/\1>/g, "")
}

async function cleanHtml(html: string): Promise<string> {
    const dom = new JSDOM(html)
    const document = dom.window.document

    document.querySelectorAll("script, style, iframe, video, audio, img, noscript").forEach((el) => el.remove())

    const cleanedHtml = sanitizeHtml(document.documentElement.outerHTML, {
        allowedTags: [
            "html",
            "head",
            "body",
            "meta",
            "title",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "p",
            "a",
            "ul",
            "ol",
            "li",
            "table",
            "tr",
            "td",
            "th",
            "thead",
            "tbody",
            "tfoot",
            "strong",
            "em",
        ],
        allowedAttributes: { a: ["href"], meta: ["name", "content"] },
    })

    let finalHtml = cleanEmptyTags(cleanedHtml)
    finalHtml = await minify(finalHtml, {
        collapseWhitespace: true,
        removeComments: true,
        removeEmptyElements: true,
        removeRedundantAttributes: true,
    })

    return finalHtml
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        let url = searchParams.get("url")

        if (!url) {
            return NextResponse.json({ error: "❌ URL is missing" }, { status: 400 })
        }

        url = url.trim()

        if (!/^https?:\/\//i.test(url)) {
            return NextResponse.json({ error: "❌ Invalid URL format. Must start with http:// or https://" }, { status: 400 })
        }

        const domain = new URL(url).hostname
        const date = getCurrentDate()
        const dirPath = path.join(process.cwd(), "websites", domain, date)
        const filePath = path.join(dirPath, "files.json")

        fs.mkdirSync(dirPath, { recursive: true })

        let response
        try {
            response = await axios.get(url, {
                headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
            })
        } catch (error) {
            const axiosError = error as AxiosError

            if (axiosError.response) {
                return NextResponse.json({ error: `❌ Failed to fetch page: ${axiosError.response.statusText}` }, { status: axiosError.response.status })
            } else {
                return NextResponse.json({ error: "❌ Network error while fetching the page" }, { status: 500 })
            }
        }

        const cleanedHtml = await cleanHtml(response.data)

        const fileHash = generateHash(url)
        const contentFile = path.join(dirPath, `${fileHash}.html`)

        fs.writeFileSync(contentFile, cleanedHtml, "utf-8")

        let filesData: { updated_at: string; files: FileEntry[] } = { updated_at: date, files: [] }
        if (fs.existsSync(filePath)) {
            filesData = JSON.parse(fs.readFileSync(filePath, "utf-8"))
        }

        if (!filesData.files.some((entry) => entry.url === url)) {
            filesData.files.push({ url, file: `${fileHash}.html`, date })
        }

        fs.writeFileSync(filePath, JSON.stringify(filesData, null, 2), "utf-8")

        return NextResponse.json({
            message: "✅ Page downloaded and saved",
            url,
            savedFile: contentFile,
            jsonFile: filePath,
        })
    } catch (error: unknown) {
        console.error("❌ Parsing error:", error)

        let errorMessage = "Unknown error"
        if (error instanceof Error) {
            errorMessage = error.message
        }

        return NextResponse.json({ error: "Parsing error", details: errorMessage }, { status: 500 })
    }
}
