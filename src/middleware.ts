import { NextRequest, NextResponse } from "next/server"
import { LOGIN_PAGE_ROUTE } from "./utils/consts"

export function middleware(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value
    const url = new URL(req.url)

    if (!token) {
        return NextResponse.redirect(
            new URL(`${LOGIN_PAGE_ROUTE}?redirect=${url.pathname}`, req.url)
        )
    }

    return NextResponse.next()
}

export const config = {
    matcher: [`/companies/:path*`],
}
