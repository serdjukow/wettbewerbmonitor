import * as React from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import type { ThemeOptions } from "@mui/material/styles"
import { colorSchemes, typography, shadows, shape } from "./themePrimitives"

interface AppThemeProps {
    children: React.ReactNode
    /**
     * This is for the docs site. You can ignore it or remove it.
     */
    disableCustomTheme?: boolean
    themeComponents?: ThemeOptions["components"]
}

export default function AppTheme(props: AppThemeProps) {
    const { children, disableCustomTheme, themeComponents } = props
    const theme = React.useMemo(() => {
        return disableCustomTheme
            ? {}
            : createTheme({
                  cssVariables: {
                      colorSchemeSelector: "data-mui-color-scheme",
                      cssVarPrefix: "template",
                  },
                  colorSchemes,
                  typography,
                  shadows,
                  shape,
              })
    }, [disableCustomTheme])
    if (disableCustomTheme) {
        return <React.Fragment>{children}</React.Fragment>
    }
    return (
        <ThemeProvider theme={theme} disableTransitionOnChange>
            {children}
        </ThemeProvider>
    )
}
