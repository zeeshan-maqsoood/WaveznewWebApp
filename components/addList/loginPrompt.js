import React, { useState } from "react"
import Router from "next/router"
import Button from "@material-ui/core/Button"
// i18n
// eslint-disable-next-line no-duplicate-imports
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import { Grid } from "@material-ui/core"
import theme from "../../src/theme"

const LoginPrompt = ({ closeModal = () => { }, setLogin }) => {
    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : fr

    return (
        <Grid container>
            <Grid item xs={12} style={{ fontSize: "18px", lineHeight: "2" }}>
                <p
                    style={{ fontWeight: "500", font: "Roboto", textAlign: "center" }}
                >
                    {t.loginPrompt.header}
                </p>
                <hr style={{ width: 50, backgroundColor: theme.palette.buttonPrimary.main, height: 3 }}></hr>
                <p style={{ fontWeight: "400" }}>
                    {t.loginPrompt.instructions}
                </p>
                <div
                    style={{ marginTop: "2.6em", width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}
                >
                    <Button
                        onClick={() => closeModal()}
                        style={{
                            fontWeight: "600",
                            textTransform: "capitalize",
                            backgroundColor: theme.palette.background.default,
                            color: theme.palette.buttonPrimary.main,
                            fontSize: "18px",
                            maxWidth: "150px"
                        }}>{t.loginPrompt.cancel}</Button>
                    <Button
                        onClick={() => { closeModal(), setLogin() }}
                        style={{
                            fontWeight: "400",
                            textTransform: "capitalize",
                            backgroundColor: theme.palette.buttonPrimary.main,
                            color: theme.palette.background.default,
                            fontSize: "18px",
                            maxWidth: "150px"
                        }}>{t.signupLogin}</Button>
                </div>
            </Grid>
        </Grid>
    )
}
export default LoginPrompt
