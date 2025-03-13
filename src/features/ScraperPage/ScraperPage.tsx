"use client"

import { useState, useEffect } from "react"
import {
    Container,
    TextField,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import DownloadIcon from "@mui/icons-material/Download"
import DeleteIcon from "@mui/icons-material/Delete"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

type WebsiteData = {
    domain: string
    versions: string[]
}

const BASE_URL = "/api/scraper/"

const ScraperPage = () => {
    const [url, setUrl] = useState("")
    const [message, setMessage] = useState("")
    const [websites, setWebsites] = useState<WebsiteData[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchWebsites()
    }, [])

    const fetchWebsites = async () => {
        try {
            const res = await fetch(`${BASE_URL}sites`)
            const data = await res.json()

            console.log("Fetched websites data:", data)

            if (!data.websites || !Array.isArray(data.websites)) {
                throw new Error("Invalid API response")
            }

            setWebsites(data.websites)
        } catch (error) {
            console.error("Error loading websites:", error)
            toast.error(`❌ ${error}`)
        }
    }

    const scrapeWebsite = async () => {
        if (!url) {
            toast.warn("⚠️ Enter a URL!")
            return
        }

        setLoading(true)

        const toastId = toast.loading("⏳ Downloading content...")

        try {
            const response = await fetch(`${BASE_URL}parser?url=${encodeURIComponent(url)}`)
            const data = await response.json()

            if (!response.ok) {
                if (response.status === 429) {
                    toast.dismiss(toastId)
                    toast.warning(`❌ ${data.error}`, { autoClose: 5000 })
                } else {
                    throw new Error(data.error || "API error")
                }
                return
            }

            setMessage(data.message)

            await new Promise((resolve) => setTimeout(resolve, 2000))

            toast.dismiss(toastId)
            toast.success("✅ Website successfully downloaded!", { autoClose: 3000 })

            fetchWebsites()
        } catch (error) {
            console.error("Request error:", error)
            toast.dismiss(toastId)
            toast.error(`❌ Error: ${error}`, { autoClose: 5000 })
        } finally {
            setLoading(false)
        }
    }

    const downloadZip = async (domain: string, version: string) => {
        toast.info(`⏳ Preparing ZIP for ${domain} (${version})...`)

        try {
            const response = await fetch(`${BASE_URL}sites/${domain}/${version}/download`)
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
        const confirmDelete = window.confirm(`Are you sure you want to delete ${domain}?`)
        if (!confirmDelete) return

        toast.info(`⏳ Deleting ${domain}...`)

        try {
            const response = await fetch(`${BASE_URL}sites/${domain}`, { method: "DELETE" })

            if (!response.ok) {
                throw new Error("Failed to delete website")
            }

            toast.success(`✅ Website ${domain} deleted successfully!`)
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
            <Button variant="contained" color="primary" onClick={scrapeWebsite} disabled={loading} sx={{ mb: 3 }}>
                {loading ? "Downloading..." : "Download Content"}
            </Button>
            {message && (
                <Typography variant="body1" sx={{ mt: 2 }}>
                    ✅ {message}
                </Typography>
            )}
            <Typography variant="h5" sx={{ mt: 4 }}>
                Saved Websites
            </Typography>
            <List sx={{ width: "100%", bgcolor: "background.paper", mt: 2, p: 2 }}>
                {websites.length > 0 ? (
                    websites.map((site) => (
                        <Accordion key={site.domain}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ flexGrow: 1 }}>
                                    {String(site.domain)} ({site.versions.length} versions)
                                </Typography>
                                <Box>
                                    {" "}
                                    {/* ✅ Обернули в Box, теперь нет <button> внутри <button> */}
                                    <IconButton sx={{ mr: 1 }} edge="end" color="error" onClick={() => deleteWebsite(site.domain)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List sx={{ width: "100%" }}>
                                    {site.versions.length > 0 ? (
                                        site.versions.map((version) => (
                                            <ListItem key={version}>
                                                <ListItemText primary={String(version)} />
                                                <IconButton edge="end" color="primary" onClick={() => downloadZip(site.domain, version)}>
                                                    <DownloadIcon />
                                                </IconButton>
                                            </ListItem>
                                        ))
                                    ) : (
                                        <Typography variant="body2">No versions available</Typography>
                                    )}
                                </List>
                            </AccordionDetails>
                        </Accordion>
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
