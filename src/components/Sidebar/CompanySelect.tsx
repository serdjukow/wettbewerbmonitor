import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { useAppStore } from "@/src/store/appStore"
import { usePathname, useRouter } from "next/navigation"

const CompanySelect = () => {
    const { selectedCompany, companies, setSelectedCompany } = useAppStore()
    const pathname = usePathname()
    const router = useRouter()

    const handleChange = (id: string) => {
        const selected = companies.find((c) => c.uuid === id)
        if (!selected) return
        setSelectedCompany(selected)

        if (pathname) {
            const segments = pathname.split("/")
            const companyIndex = segments.indexOf("companies")
            if (companyIndex !== -1 && segments[companyIndex + 1]) {
                segments[companyIndex + 1] = id
            }
            const newPath = segments.join("/")
            router.push(newPath)
        }
    }

    return (
        <FormControl fullWidth sx={{ pl: 2, pr: 2 }}>
            <InputLabel>Company</InputLabel>
            <Select value={selectedCompany?.uuid || ""} label="Company" onChange={(e) => handleChange(e.target.value)}>
                {companies.map((company) => (
                    <MenuItem key={company.uuid} value={company.uuid}>
                        {company.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default CompanySelect
