import React, { useState } from "react"
import Router from "next/router"
import Button from "@material-ui/core/Button"
// i18n
// eslint-disable-next-line no-duplicate-imports
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import theme from "../../src/theme"

const CallingOfflineUser = ({ closeModal }) => {
    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : fr

    return (
        <>
            <div style={{ fontSize: "18px", lineHeight: "2" }}>
                <p
                    style={{ fontWeight: "500", font: "Roboto", textAlign: "center" }}
                >
                    {t.messagePage.modal.header}
                </p>
                <hr style={{ width: 50, backgroundColor: theme.palette.buttonPrimary.main, height: 3 }}></hr>
                <p style={{ fontWeight: "400" }}>
                    {t.messagePage.modal.description}
                </p>
                <div
                    style={{ marginTop: "2.6em", width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}
                >
                        <Button
                        onClick={() => { closeModal() }}
                        style={{
                            fontWeight: "400",
                            textTransform: "capitalize",
                            backgroundColor: theme.palette.buttonPrimary.main,
                            color: theme.palette.background.default,
                            fontSize: "18px",
                            maxWidth: "150px"
                        }}>{t.okay}</Button>
                </div>
            </div>
        </>
    )
}
export default CallingOfflineUser
