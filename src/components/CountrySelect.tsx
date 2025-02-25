import React from "react"
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material"
import { type TrackedCountry } from "@/src/utils/types"

interface CountrySelectProps {
    value: TrackedCountry | null
    onChange: (country: TrackedCountry) => void
}

const countryOptions: TrackedCountry[] = [
    { country: "de", country_name: "Germany" },
    { country: "at", country_name: "Austria" },
    { country: "ch", country_name: "Switzerland" },
    { country: "nl", country_name: "Netherlands" },
    { country: "fr", country_name: "France" },
    { country: "it", country_name: "Italy" },
    { country: "es", country_name: "Spain" },
    { country: "pl", country_name: "Poland" },
    { country: "uk", country_name: "United Kingdom" },
    { country: "us", country_name: "USA" },
    { country: "se", country_name: "Sweden" },
    { country: "br", country_name: "Brazil" },
    { country: "tr", country_name: "Turkey" },
    { country: "be", country_name: "Belgium" },
    { country: "ie", country_name: "Ireland" },
    { country: "pt", country_name: "Portugal" },
    { country: "dk", country_name: "Denmark" },
    { country: "no", country_name: "Norway" },
    { country: "fi", country_name: "Finland" },
    { country: "gr", country_name: "Greece" },
    { country: "hu", country_name: "Hungary" },
    { country: "sk", country_name: "Slovakia" },
    { country: "cz", country_name: "Czech Republic" },
    { country: "ca", country_name: "Canada" },
    { country: "au", country_name: "Australia" },
    { country: "mx", country_name: "Mexico" },
    { country: "ru", country_name: "Russia" },
    { country: "jp", country_name: "Japan" },
    { country: "in", country_name: "India" },
    { country: "za", country_name: "South Africa" },
    { country: "ro", country_name: "Romania" },
    { country: "si", country_name: "Slovenia" },
    { country: "hr", country_name: "Croatia" },
    { country: "bg", country_name: "Bulgaria" },
    { country: "th", country_name: "Thailand" },
    { country: "vn", country_name: "Vietnam" },
    { country: "id", country_name: "Indonesia" },
    { country: "pe", country_name: "Peru" },
    { country: "ar", country_name: "Argentina" },
    { country: "co", country_name: "Colombia" },
    { country: "cy", country_name: "Cyprus" },
    { country: "mt", country_name: "Malta" },
    { country: "my", country_name: "Malaysia" },
    { country: "ph", country_name: "Philippines" },
    { country: "nz", country_name: "New Zealand" },
    { country: "ae", country_name: "United Arab Emirates" },
    { country: "eg", country_name: "Egypt" },
    { country: "cl", country_name: "Chile" },
    { country: "pk", country_name: "Pakistan" },
    { country: "sg", country_name: "Singapore" },
    { country: "ng", country_name: "Nigeria" },
    { country: "ve", country_name: "Venezuela" },
    { country: "ua", country_name: "Ukraine" },
]

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
    const handleCountryChange = (event: SelectChangeEvent<string>) => {
        const selectedCountry = countryOptions.find((country) => country.country === event.target.value)
        if (selectedCountry) {
            onChange(selectedCountry)
        }
    }

    return (
        <FormControl fullWidth>
            <InputLabel id="country-select-label">Country</InputLabel>
            <Select labelId="country-select-label" value={value?.country || ""} label="Country" onChange={handleCountryChange}>
                {countryOptions.map((country) => (
                    <MenuItem key={country.country} value={country.country}>
                        {country.country_name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default CountrySelect
