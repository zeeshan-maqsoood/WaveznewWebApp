import React, { useState } from "react"
import Router from "next/router"
import Button from "@material-ui/core/Button"
import { Grid } from "@material-ui/core"
// i18n
// eslint-disable-next-line no-duplicate-imports
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import theme from "../../src/theme"

export const UpdateButtonNotice = ({ onClose, header, body }) => {
    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : fr

    return (
        <Grid container>
            <Grid item xs={12} style={{ fontSize: "18px", lineHeight: "2" }}>
                <p
                    style={{ fontWeight: "500", font: "Roboto", textAlign: "center" }}
                >
                    {header}
                </p>
                <hr style={{ width: 50, backgroundColor: theme.palette.buttonPrimary.main, height: 3 }}></hr>
                <p style={{ fontWeight: "400" }}>
                    {body}
                </p>
                <div
                    style={{ marginTop: "2.6em", width: "100%", display: "flex", flexDirection: "row", justifyContent: "center" }}
                >
                    <Button
                        onClick={() => { onClose() }}
                        style={{
                            fontWeight: "400",
                            textTransform: "capitalize",
                            backgroundColor: theme.palette.buttonPrimary.main,
                            color: theme.palette.background.default,
                            fontSize: "18px",
                            maxWidth: "150px"
                        }}>{t.okay}</Button>
                </div>
            </Grid>
        </Grid>
    )
}