import { List } from "@mui/material"
import { menuItems } from "./menuItems"
import MenuItemComponent from "./MenuItemComponent"

const MenuList = () => (
    <List>
        {menuItems.map((item, index) => (
            <MenuItemComponent key={index} item={item} />
        ))}
    </List>
)

export default MenuList
