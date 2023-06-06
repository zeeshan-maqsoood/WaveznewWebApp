/* eslint-disable no-duplicate-imports */
import React, { useEffect, useState } from "react"
import Router from "next/router"
import Button from "@material-ui/core/Button"
import theme from '../../src/theme'
import Session from "../../sessionService"
import API from "../../pages/api/baseApiIinstance"
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import { Chip, FormHelperText, Grid, makeStyles, TextField } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({

}))

const RejectOffer = ({ closeModal, fetchOfferTrips, tripId }) => {
    const token = Session.getToken("Wavetoken")
    const classes = useStyles()
    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : fr
    const [apiError, setApiError] = useState(false)

    const onClickReject = () => {
        rejectOffer()
    }

    const rejectOffer = () => {
        const body = {
            tripId
        }
        API()
            .put("trip/rejectOffer", body, {
                headers: {
                    authorization: `Bearer ${  token}`
                }
            })
            .then((response) => {
                console.log("response is ", response)
                if (response.status === 200) {
                    fetchOfferTrips()
                    closeModal()
                }
            })
            .catch((e) => {
                setApiError(true)
                console.log("error: ", e)
            })
    }

    return (
        <Grid container className={classes.container}>
            <Grid item xs={12} style={{ fontSize: "18px", lineHeight: "2" }}>
                <p
                    style={{ fontWeight: "500", font: "Roboto", textAlign: "center" }}
                >
                    {t.tripsPage.rejectHeader}
                </p>
                <hr style={{ width: 50, backgroundColor: theme.palette.buttonPrimary.main, height: 3 }}></hr>
                <p style={{ fontWeight: "500", textAlign: "center", width: "100%", color: theme.palette.title.matterhorn }}>
                    {t.tripsPage.rejectSubheader}
                </p>
                <FormHelperText error> {apiError ? t.tripsPage.otpError : null} </FormHelperText>
                <div style={{ marginTop: "20px", width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
                    <Button
                        onClick={() => closeModal()}
                        style={{
                            fontWeight: "400",
                            textTransform: "capitalize",
                            backgroundColor: "white",
                            color: theme.palette.buttonPrimary.main,
                            fontSize: "18px",
                            maxWidth: "150px"
                        }}>{t.cancel}</Button>
                    <Button
                        onClick={() => { onClickReject() }}
                        style={{
                            fontWeight: "400",
                            textTransform: "capitalize",
                            backgroundColor: theme.palette.background.flamingo,
                            color: "white",
                            fontSize: "18px",
                            maxWidth: "150px"
                        }}>{t.tripsPage.reject}</Button>
                </div>
            </Grid>
        </Grid>
    )
}
export default RejectOffer
