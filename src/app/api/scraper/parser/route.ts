import axios from "axios"
import { JSDOM } from "jsdom"
import sanitizeHtml from "sanitize-html"
import { minify } from "html-minifier-terser"
import fs from "fs"
import path from "path"

const DAYS_LIMIT = 30

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        let url = searchParams.get("url")

        if (!url) {
            return new Response("❌ URL is missing", { status: 400 })
        }

        url = url.trim()

        if (!/^https?:\/\//i.test(url)) {
            return new Response("❌ Invalid URL format. Must start with http:// or https://", { status: 400 })
        }

        const encoder = new TextEncoder()
        const stream = new ReadableStream({
            async start(controller) {
                const sendLog = (message: string) => {
                    controller.enqueue(encoder.encode(`data: ${message}\n\n`))
                }

                sendLog("🌍 Extracting domain...")
                const domain = new URL(url).hostname
                sendLog(`✅ Domain: ${domain}`)

                sendLog("📁 Creating directories...")
                const baseSiteDir = path.join(process.cwd(), "websites", domain)
                fs.mkdirSync(baseSiteDir, { recursive: true })
                sendLog("✅ Directories created")

                const metadataPath = path.join(baseSiteDir, "metadata.json")
                let metadata = { lastParsed: "" }

                if (fs.existsSync(metadataPath)) {
                    metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"))
                }

                if (metadata.lastParsed) {
                    const lastDate = new Date(metadata.lastParsed)
                    const today = new Date()
                    const daysSinceLastParse = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
                    if (daysSinceLastParse < DAYS_LIMIT) {
                        sendLog(`⏳ Parsing blocked: last parsed ${daysSinceLastParse} days ago`)
                        controller.close()
                        return
                    }
                }

                metadata.lastParsed = new Date().toISOString().split("T")[0]
                fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), "utf-8")
                sendLog("✅ Updated metadata")

                const siteDir = path.join(baseSiteDir, `${domain}-${metadata.lastParsed}`)
                fs.mkdirSync(siteDir, { recursive: true })

                sendLog("🔍 Fetching website...")
                const filesJsonPath = path.join(siteDir, "files.json")
                let filesData: { files: { url: string; file: string }[] } = { files: [] }
                if (fs.existsSync(filesJsonPath)) {
                    filesData = JSON.parse(fs.readFileSync(filesJsonPath, "utf-8"))
                }

                const visited = new Set<string>()
                const queue: string[] = [url]

                while (queue.length > 0) {
                    const pageUrl = queue.shift()!
                    if (visited.has(pageUrl)) continue
                    visited.add(pageUrl)

                    sendLog(`🔍 Fetching: ${pageUrl}`)
                    try {
                        const response = await axios.get(pageUrl, {
                            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
                        })

                        sendLog("🧹 Cleaning HTML...")
                        const cleanedHtml = await cleanHtml(response.data)
                        const pagePath = getPageFilePath(siteDir, pageUrl)

                        fs.mkdirSync(path.dirname(pagePath), { recursive: true })
                        fs.writeFileSync(pagePath, cleanedHtml, "utf-8")
                        sendLog(`✅ Saved: ${pagePath}`)

                        if (!filesData.files.some((entry) => entry.url === pageUrl)) {
                            filesData.files.push({ url: pageUrl, file: path.basename(pagePath) })
                        }

                        fs.writeFileSync(filesJsonPath, JSON.stringify(filesData, null, 2), "utf-8")
                        sendLog("🔗 Extracting links...")
                        const newLinks = extractLinks(pageUrl, response.data)
                        queue.push(...newLinks.filter((link) => !visited.has(link)))
                    } catch (error) {
                        sendLog(`❌ Error fetching ${pageUrl}: ${error instanceof Error ? error.message : String(error)}`)
                    }
                }

                sendLog("✅ Processing complete")
                controller.close()
            },
        })

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        })
    } catch (error) {
        return new Response(`❌ Parsing error: ${error}`, { status: 500 })
    }
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

    return await minify(cleanedHtml, {
        collapseWhitespace: true,
        removeComments: true,
        removeEmptyElements: true,
        removeRedundantAttributes: true,
    })
}

function getPageFilePath(siteDir: string, pageUrl: string): string {
    let relativePath = new URL(pageUrl).pathname
    if (relativePath.endsWith("/")) relativePath += "index.html"
    if (!relativePath.endsWith(".html")) relativePath += ".html"
    return path.join(siteDir, relativePath)
}

function extractLinks(baseUrl: string, html: string): string[] {
    const dom = new JSDOM(html)
    const document = dom.window.document
    const links: string[] = []

    document.querySelectorAll("a[href]").forEach((a) => {
        const href = a.getAttribute("href")
        if (!href) return

        try {
            const absoluteUrl = new URL(href, baseUrl).toString()
            if (absoluteUrl.startsWith(baseUrl)) {
                links.push(absoluteUrl)
            }
        } catch (error) {
            console.warn(`❌ Invalid URL found: ${href} - ${error}`)
        }
    })

    return links
}
