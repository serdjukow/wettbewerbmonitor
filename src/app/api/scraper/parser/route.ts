import { NextResponse } from "next/server";
import axios from "axios";
import { JSDOM } from "jsdom";
import sanitizeHtml from "sanitize-html";
import { minify } from "html-minifier-terser";
import fs from "fs";
import path from "path";

const DAYS_LIMIT = 30;

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        let url = searchParams.get("url");

        if (!url) {
            return NextResponse.json({ error: "❌ URL is missing" }, { status: 400 });
        }

        url = url.trim();

        if (!/^https?:\/\//i.test(url)) {
            return NextResponse.json({ error: "❌ Invalid URL format. Must start with http:// or https://" }, { status: 400 });
        }

        const domain = new URL(url).hostname;
        const baseSiteDir = path.join(process.cwd(), "websites", domain);
        fs.mkdirSync(baseSiteDir, { recursive: true });
        
        const metadataPath = path.join(baseSiteDir, "metadata.json");
        let metadata: { lastParsed: string } = { lastParsed: "" };

        if (fs.existsSync(metadataPath)) {
            metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
        }

        if (metadata.lastParsed) {
            const lastDate = new Date(metadata.lastParsed);
            const today = new Date();
            const daysSinceLastParse = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            if (daysSinceLastParse < DAYS_LIMIT) {
                return NextResponse.json({
                    error: `❌ Parsing blocked: Last parsing was ${daysSinceLastParse} days ago. Try again in ${DAYS_LIMIT - daysSinceLastParse} days.`,
                }, { status: 429 });
            }
        }

        const date = new Date().toISOString().split("T")[0];
        metadata.lastParsed = date;
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), "utf-8");
        
        const siteDir = path.join(baseSiteDir, `${domain}-${date}`);
        fs.mkdirSync(siteDir, { recursive: true });

        const filesJsonPath = path.join(siteDir, "files.json");
        let filesData: { files: { url: string; file: string }[] } = { files: [] };
        if (fs.existsSync(filesJsonPath)) {
            filesData = JSON.parse(fs.readFileSync(filesJsonPath, "utf-8"));
        }

        const visited = new Set<string>();
        const queue: string[] = [url];

        while (queue.length > 0) {
            const pageUrl = queue.shift()!;
            if (visited.has(pageUrl)) continue;

            console.log(`🔍 Fetching: ${pageUrl}`);
            visited.add(pageUrl);

            try {
                const response = await axios.get(pageUrl, {
                    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
                });

                const cleanedHtml = await cleanHtml(response.data);
                const pagePath = getPageFilePath(siteDir, pageUrl);

                fs.mkdirSync(path.dirname(pagePath), { recursive: true });
                fs.writeFileSync(pagePath, cleanedHtml, "utf-8");
                console.log(`✅ Saved: ${pagePath}`);

                if (!filesData.files.some((entry) => entry.url === pageUrl)) {
                    filesData.files.push({ url: pageUrl, file: path.basename(pagePath) });
                }

                fs.writeFileSync(filesJsonPath, JSON.stringify(filesData, null, 2), "utf-8");

                const newLinks = extractLinks(pageUrl, response.data);
                queue.push(...newLinks.filter((link) => !visited.has(link)));
            } catch (error) {
                console.error(`❌ Error fetching ${pageUrl}:`, error);
            }
        }

        return NextResponse.json({
            message: `✅ Site ${domain} saved successfully!`,
            directory: siteDir,
        });
    } catch (error: unknown) {
        console.error("❌ Parsing error:", error);
        return NextResponse.json({ error: "Parsing error", details: `${error}` }, { status: 500 });
    }
}

async function cleanHtml(html: string): Promise<string> {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    document.querySelectorAll("script, style, iframe, video, audio, img, noscript").forEach((el) => el.remove());

    const cleanedHtml = sanitizeHtml(document.documentElement.outerHTML, {
        allowedTags: [
            "html", "head", "body", "meta", "title", "h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "ul", "ol", "li", "table", "tr", "td", "th", "thead", "tbody", "tfoot", "strong", "em"
        ],
        allowedAttributes: { a: ["href"], meta: ["name", "content"] },
    });

    return await minify(cleanedHtml, {
        collapseWhitespace: true,
        removeComments: true,
        removeEmptyElements: true,
        removeRedundantAttributes: true,
    });
}

function getPageFilePath(siteDir: string, pageUrl: string): string {
    let relativePath = new URL(pageUrl).pathname;
    if (relativePath.endsWith("/")) relativePath += "index.html";
    if (!relativePath.endsWith(".html")) relativePath += ".html";
    return path.join(siteDir, relativePath);
}

function extractLinks(baseUrl: string, html: string): string[] {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const links: string[] = [];

    document.querySelectorAll("a[href]").forEach((a) => {
        const href = a.getAttribute("href");
        if (!href) return;

        try {
            const absoluteUrl = new URL(href, baseUrl).toString();
            if (absoluteUrl.startsWith(baseUrl)) {
                links.push(absoluteUrl);
            }
        } catch (error) {
            console.warn(`❌ Invalid URL found: ${href} - ${error}`)
        }
    });

    return links;
}