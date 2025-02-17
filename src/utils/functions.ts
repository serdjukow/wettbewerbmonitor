export function getPagePath(pathname: string): string {
    if (pathname.startsWith("/companies/")) {
        const parts = pathname.split("/")
        const remainingPath = "/" + parts.slice(3).join("/")
        return remainingPath
    }

    return "/"
}

export const fetchCredits = async () => {
    try {
        const response = await fetch("/api/sistrix/credits")
        const data = await response.json()
        if (data.error) {
            console.error(data.error.error_message || "Unknown error")
            return "No data"
        } else {
            return data?.answer?.[0]?.credits?.[0]?.value ?? "No data"
        }
    } catch (err) {
        console.error("Couldn't get the data:", err)
        return "No data"
    }
}
