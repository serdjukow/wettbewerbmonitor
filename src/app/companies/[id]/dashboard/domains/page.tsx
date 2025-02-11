"use client"

import { useState } from "react"

const DomainPage = () => {
    const [creditsData, setCreditsData] = useState<any | null>(null)
    const [error, setError] = useState<string | null>(null)

    const fetchCredits = async () => {
        try {
            const response = await fetch("/api/sistrix")
            const data = await response.json()

            if (data.error) {
                setError(data.error)
            } else {
                setCreditsData(data)
            }
        } catch (err) {
            setError("Не удалось получить данные")
            console.error("Ошибка запроса:", err)
        }
    }

    const availableCredits =
        creditsData?.answer?.[0]?.credits?.[0]?.value ?? "Нет данных"
    const usedCredits = creditsData?.credits?.[0].used ?? "Нет данных"
    
    return (
        <div>
            <button onClick={fetchCredits}>Check loans</button>

            {creditsData && (
                <div style={{ marginTop: "20px" }}>
                    <p>
                        Remaining credits: <strong>{availableCredits}</strong>
                    </p>
                    <p>
                        Used: <strong>{usedCredits}</strong>
                    </p>
                </div>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    )
}

export default DomainPage
