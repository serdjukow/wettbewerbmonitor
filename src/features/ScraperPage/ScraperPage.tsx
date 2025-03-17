"use client"

import { useState, useRef, useEffect } from "react"
import { Container, TextField, Button, Typography, List, ListItem, ListItemText, IconButton, Accordion, AccordionSummary, AccordionDetails, Box } from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import DownloadIcon from "@mui/icons-material/Download"
import DeleteIcon from "@mui/icons-material/Delete"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { AnimatePresence, motion } from "framer-motion"

type WebsiteData = {
    domain: string
    versions: string[]
}

const BASE_URL = "/api/scraper/"

const ScraperPage = () => {
    const [url, setUrl] = useState("")
    const [websites, setWebsites] = useState<WebsiteData[]>([])
    const [loading, setLoading] = useState(false)
    const [logs, setLogs] = useState<string[]>([])
    const [isBlocked, setIsBlocked] = useState(false)
    const logsEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchWebsites()
    }, [])

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [logs])

    const fetchWebsites = async () => {
        try {
            const res = await fetch(`${BASE_URL}sites`)
            const data = await res.json()

            if (!data.websites || !Array.isArray(data.websites)) {
                throw new Error("Invalid API response")
            }

            setWebsites(data.websites)
        } catch (error) {
            console.error("Error loading websites:", error)
            toast.error(`❌ ${error}`)
        }
    }

    const scrapeWebsite = () => {
        if (!url) {
            toast.warn("⚠️ Enter a URL!")
            return
        }

        setLoading(true)
        setLogs([])
        setIsBlocked(false)

        const toastId = toast.loading("⏳ Downloading content...")
        const eventSource = new EventSource(`${BASE_URL}parser?url=${encodeURIComponent(url)}`)

        eventSource.onmessage = (event) => {
            const logMessage = event.data

            setLogs((prev) => [...prev, logMessage])

            if (logMessage.includes("⏳ Parsing blocked")) {
                setIsBlocked(true)
                toast.dismiss(toastId)
                toast.warn("❌ Parsing blocked due to time limit!", { autoClose: 5000 })
                eventSource.close()
                setLoading(false)
            }
        }

        eventSource.onerror = () => {
            eventSource.close()
            setLoading(false)
            toast.dismiss(toastId)

            if (!isBlocked) {
                toast.success("✅ Website successfully downloaded!", { autoClose: 3000 })
                fetchWebsites()
            }
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

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault()
            scrapeWebsite()
        }
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <ToastContainer position="top-right" autoClose={3000} />
            <Typography variant="h4" gutterBottom>
                Web Page Parser
            </Typography>
            <TextField label="Enter URL" variant="outlined" onKeyDown={handleKeyDown} fullWidth value={url} onChange={(e) => setUrl(e.target.value)} sx={{ mb: 2 }} />
            <Button variant="contained" color="primary" onClick={scrapeWebsite} disabled={loading} sx={{ mb: 3 }}>
                {loading ? "Downloading..." : "Download Content"}
            </Button>
            <Typography variant="h6">Logs:</Typography>
            <List sx={{ mt: 3, bgcolor: "background.paper" }}>
                <Box sx={{ maxHeight: 300, overflowX: "hidden", overflowY: "auto", fontFamily: "monospace", p: 2 }}>
                    <motion.ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        <AnimatePresence>
                            {logs.map((log, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ marginBottom: "5px" }}
                                >
                                    <Typography sx={{ whiteSpace: "pre-wrap" }}>{log}</Typography>
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </motion.ul>
                    <div ref={logsEndRef} />
                </Box>
            </List>
            <Typography variant="h6" sx={{ mt: 4 }}>
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
                                <Box color="error" onClick={() => deleteWebsite(site.domain)}>
                                    <DeleteIcon color="error" />
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
