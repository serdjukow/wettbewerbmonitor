"use client"

import { useState, useEffect } from "react"
import { Container, TextField, Button, Typography, List, ListItem, ListItemText, IconButton, Divider } from "@mui/material"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import DownloadIcon from "@mui/icons-material/Download"
import DeleteIcon from "@mui/icons-material/Delete"

type WebsiteData = {
    domain: string
    versions: string[]
}

const BASE_URL = "/api/scraper/"

const ScraperPage = () => {
    const [url, setUrl] = useState("")
    const [message, setMessage] = useState("")
    const [websites, setWebsites] = useState<WebsiteData[]>([])

    useEffect(() => {
        fetchWebsites()
    }, [])
    
    const fetchWebsites = async () => {
        try {
            const res = await fetch(`${BASE_URL}sites`)
            const data = await res.json()
            setWebsites(data.websites || [])
        } catch (error) {
            console.error("Error loading websites:", error)
            toast.error(`${error}`)
        }
    }

    const scrapeWebsite = async () => {
        if (!url) {
            toast.warn("⚠️ Enter a URL!")
            return
        }

        try {
            const response = await fetch(`${BASE_URL}parser?url=${encodeURIComponent(url)}`)
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "API error")
            }

            setMessage(data.message)
            toast.success("✅ Website successfully downloaded!")

            fetchWebsites()
        } catch (error) {
            console.error("Request error:", error)
            toast.error(`${error}`)
        }
    }

    const downloadZip = async (domain: string, date: string) => {
        toast.info(`⏳ Preparing ZIP for ${domain} (${date})...`)

        try {
            const response = await fetch(`${BASE_URL}sites/${domain}/${date}/download`)
            const data = await response.json()

            if (data.downloadUrl) {
                toast.success("✅ ZIP is ready!")
                window.open(data.downloadUrl, "_blank")
            } else {
                throw new Error("Error downloading ZIP")
            }
        } catch (error) {
            console.error("ZIP download error:", error)
            toast.error(`${error}`)
        }
    }

    const deleteWebsite = async (domain: string) => {
        if (!confirm(`Are you sure you want to delete ${domain}?`)) return

        toast.info(`⏳ Deleting ${domain}...`)

        try {
            const response = await fetch(`${BASE_URL}sites/${domain}`, { method: "DELETE" })

            if (!response.ok) {
                throw new Error("Failed to delete website")
            }

            const data = response.headers.get("content-type")?.includes("application/json") ? await response.json() : { message: `✅ Website ${domain} deleted successfully!` }

            toast.success(data.message)
            fetchWebsites() 
        } catch (error) {
            console.error("Delete error:", error)
            toast.error(`${error}`)
        }
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <ToastContainer position="top-right" autoClose={3000} />

            <Typography variant="h4" gutterBottom>
                Web Page Parser
            </Typography>

            <TextField label="Enter URL" variant="outlined" fullWidth value={url} onChange={(e) => setUrl(e.target.value)} sx={{ mb: 2 }} />
            <Button variant="contained" color="primary" onClick={scrapeWebsite} sx={{ mb: 3 }}>
                Download Content
            </Button>

            {message && (
                <Typography variant="body1" sx={{ mt: 2 }}>
                    ✅ {message}
                </Typography>
            )}

            <Typography variant="h5" sx={{ mt: 4 }}>
                Saved Websites
            </Typography>
            <List sx={{ width: "100%", bgcolor: "background.paper", mt: 2 }}>
                {websites.length > 0 ? (
                    websites.map((site) => (
                        <div key={site.domain}>
                            <ListItem>
                                <ListItemText primary={site.domain} secondary={`Versions: ${site.versions.length}`} />
                                {site.versions.length > 0 && (
                                    <IconButton sx={{ mr: 1 }} edge="end" color="primary" onClick={() => downloadZip(site.domain, site.versions[0])}>
                                        <DownloadIcon />
                                    </IconButton>
                                )}
                                <IconButton edge="end" color="error" onClick={() => deleteWebsite(site.domain)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                            <Divider />
                        </div>
                    ))
                ) : (
                    <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
                        No saved websites yet.
                    </Typography>
                )}
            </List>
        </Container>
    )
}

export default ScraperPage
