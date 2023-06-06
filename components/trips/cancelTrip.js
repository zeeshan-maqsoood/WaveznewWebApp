import React, { Component, useState, useEffect, useContext } from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  Paper,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  FormHelperText
} from "@material-ui/core"
import Session from "../../sessionService"
import theme from "../../src/theme"
import API from "../../pages/api/baseApiIinstance"

// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    overflow: "auto",
    flexDirection: "column"
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: 600
  },
  saveDiv: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px"
  },
  textArea: {
    width: "95%"
  },
  reviewTxt: {
    fontSize: 16,
    fontWeight: 500,
    textAlign: "center",
    marginBottom: 0
  },
  btm: {
    borderBottom: `solid${  theme.palette.buttonPrimary.main}`,
    width: "60px",
    marginBottom: 10,
    margin: "auto"
  }
})

export default function CancelTrip({ closeModal, tripId }) {
  const token = Session.getToken("Wavetoken")
  const router = useRouter()
  const classes = useStyles()
  const { locale } = router
  const t = locale === "en" ? en : fr
  const [reasonText, setReasonText] = useState("")
  const [reasonError, setReasonError] = useState(false)

  // max character
  const CHARACTER_LIMIT = 500

  const onClickCancel = () => {
    reasonText.length > 0 ? updateTrip() : setReasonError(true)
  }

  const updateTrip = () => {
    const body = {
      tripId,
      cancelReason: reasonText
    }
    API()
      .put("trip/cancel", body, {
        headers: {
          authorization: `Bearer ${  token}`
        }
      })
      .then((response) => {
        if (response.status = 200) {
          closeModal()
        }
      })
      .catch((e) => {
        // router.push("/somethingWentWrong");
        console.log("error: ", e)
      })
  }

  return (
    <>
      <div className={classes.paper}>
        <div className={classes.reviewTxt}>
          {t.tripsPage.cancelTrip.header}
        </div>
        <Grid><div className={classes.btm} /></Grid>
        <div style={{ fontWeight: 500, fontSize: 24 }}>{t.tripsPage.cancelTrip.subHeader}</div>
        {/* Text Box */}
        <p style={{ fontSize: "16px", fontWeight: 500 }}>
          {t.tripsPage.cancelTrip.inputLabel}
        </p>
        <TextField
          inputProps={{ "data-testid": "TextBox", maxLength: CHARACTER_LIMIT }}
          className={classes.textArea}
          multiline
          rows={4}
          value={reasonText}
          onChange={(event) => { setReasonText(event.target.value), setReasonError(false) }}
          variant="outlined"
          helperText={`${reasonText.length}/${CHARACTER_LIMIT}`}
        />
        <FormHelperText error> {reasonError ? "Please enter the reason for your cancellation." : null} </FormHelperText>
        <p>
          {t.tripsPage.cancelInfo}
        </p>
        {/* Bottom Div Buttons */}
        <Grid item xs={12} className={classes.saveDiv}>
          <Button
            variant="contained"
            onClick={() => onClickCancel()}
            style={{
              fontWeight: "400",
              textTransform: "capitalize",
              backgroundColor: theme.palette.background.flamingo,
              color: theme.palette.background.whisper,
              fontSize: "16px",

              maxWidth: "250px"
            }}
          >
            {t.tripsPage.cancelTrip.button}
          </Button>
        </Grid>
      </div>
    </>
  )
}
