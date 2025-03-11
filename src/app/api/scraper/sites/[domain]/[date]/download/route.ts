import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import archiver from "archiver"

export async function GET(
    req: Request,
    context: { params: { domain?: string; date?: string } }
) {
    try {
        // ✅ Ожидаем `params` перед их использованием
        const { domain, date } = await context.params // 🟢 `await` решает проблему

        // ✅ Проверяем, что `params` существуют перед доступом к ним
        if (!domain || !date) {
            return NextResponse.json({ error: "❌ Домен или дата не указаны" }, { status: 400 })
        }

        console.log(`🔍 Запрос на скачивание ZIP: ${domain}, Дата: ${date}`)

        const versionPath = path.join(process.cwd(), "websites", domain, date)
        if (!fs.existsSync(versionPath)) {
            return NextResponse.json({ error: "❌ Версия не найдена" }, { status: 404 })
        }

        // 📂 Проверяем и создаем папку zips/, если её нет
        const zipFolderPath = path.join(process.cwd(), "public", "zips")
        if (!fs.existsSync(zipFolderPath)) {
            fs.mkdirSync(zipFolderPath, { recursive: true })
            console.log("📂 Папка zips создана!")
        }

        const zipPath = path.join(zipFolderPath, `${domain}-${date}.zip`)

        // 🔥 Создаем ZIP-архив
        const output = fs.createWriteStream(zipPath)
        const archive = archiver("zip", { zlib: { level: 9 } })

        output.on("close", () => {
            console.log(`✅ ZIP-архив создан: ${zipPath}`)
        })

        archive.pipe(output)
        archive.directory(versionPath, false)
        await archive.finalize()

        return NextResponse.json({
            message: "✅ ZIP-архив создан",
            downloadUrl: `/zips/${domain}-${date}.zip`,
        })
    } catch (error: unknown) {
        console.error("❌ Ошибка при создании ZIP:", error)

        let errorMessage = "Неизвестная ошибка"
        if (error instanceof Error) {
            errorMessage = error.message
        }

        return NextResponse.json({ error: "Ошибка при создании ZIP", details: errorMessage }, { status: 500 })
    }
}
