import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline"
import HighlightOffIcon from "@material-ui/icons/HighlightOff"

// i18n
import { useRouter } from "next/router"
import en from "../../locales/en"
import fr from "../../locales/fr"
import theme from "../../src/theme"

const useStyles = makeStyles((theme) => ({
  thanksMessage: {
    width: "80%",
    margin: "2% 20%",
    display: "flex",
    borderRadius: "10px",
    [theme.breakpoints.down("sm")]: {
      marginRight: "auto",
      marginLeft: "auto"
    }
  }
}))
function ThanksOrRejection({ status, reason }) {
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  const renderMessage = () => {
    if (status === "REJECTION") {
      return reason
    } else if (status === "APPROVED") {
      return t.editListing.verification.approvedMessage
    }
    return t.editListing.verification.thankYouMessage
  }
  return (
    <>
      <Paper variant='outlined' className={classes.thanksMessage}>
        <div
          style={{
            backgroundColor: status !== "REJECTION" ? theme.palette.background.eucalyptus : theme.palette.background.flamingo,
            borderRadius: "10px 0px 0px 10px"
          }}
        >
          {status !== "REJECTION" ? (
            <CheckCircleOutlineIcon
              style={{
                color: theme.palette.background.default,
                fontSize: "50px",
                margin: "10px"
              }}
            />
          ) : (
            <HighlightOffIcon
              style={{
                color: theme.palette.background.default,
                fontSize: "50px",
                margin: "10px"
              }}
            />
          )}
        </div>
        <p style={{ padding: 5 }}>{renderMessage()}</p>
      </Paper>
    </>
  )
}

export default ThanksOrRejection
