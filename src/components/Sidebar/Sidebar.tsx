import { Box } from "@mui/material"
import CompanySelect from "./CompanySelect"
import MenuList from "./MenuList"

const Sidebar = () => {
    return (
        <Box sx={{ overflow: "auto", pt: 4 }}>
            <CompanySelect />
            <MenuList />
        </Box>
    )
}

export default Sidebar
