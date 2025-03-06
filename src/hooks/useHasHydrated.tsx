import { useState, useEffect } from "react"

export function useHasHydrated() {
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => {
        setHydrated(true)
    }, [])

    return hydrated
}
