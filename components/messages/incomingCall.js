import React, { useEffect, useState } from "react"
import Router from "next/router"
import Button from "@material-ui/core/Button"
import theme from "../../src/theme"
import Session from "../../sessionService"
import API from "../../pages/api/baseApiIinstance"
import PersonIcon from "@material-ui/icons/Person"
import { SocketContext } from "../../src/socket"
// i18n
// eslint-disable-next-line no-duplicate-imports
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import { Avatar, Grid, makeStyles } from "@material-ui/core"

const useStyles = makeStyles(() => ({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center"
    // alignItems: "center",
  },
  addPhotosButton: {
    fontWeight: 400,
    fontSize: 18,
    color: theme.palette.buttonPrimary.main,
    textDecoration: "underline",
    width: "100px",
    cursor: "pointer"
  },
  badgeContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "30px"
  },
  badge: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    backgroundColor: theme.palette.background.lightGrey,
    color: theme.palette.text.grey,
    fontFamily: "Roboto",
    fontSize: "4em"
  },
  midSection: {
    display: "flex",
    height: "60%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }
}))

const IncomingCall = ({ closeModal, acceptCall, callerName, profileImage }) => {
  const token = Session.getToken("Wavetoken")
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr
  const {
    socket,
    otherUser
  } = React.useContext(SocketContext)

  useEffect(() => {
    const ringTimer = setTimeout(callTimeout, 45000)

    return () => {
      clearTimeout(ringTimer)
    }
  }, [])

  const callTimeout = () => {
      rejectCallClicked()
  }

  const acceptCallClicked = () => {
    acceptCall()
    closeModal()
  }

  const rejectCallClicked = () => {
    const data = {
      otherSocketId: otherUser.current
    }
    socket.emit("endCall", (data))
    closeModal()
  }

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12} style={{ fontSize: "18px", lineHeight: "2" }}>
        <p style={{ fontWeight: "500", font: "Roboto", textAlign: "center" }}>
          Incoming Call
        </p>
        <hr
          style={{
            width: 50,
            backgroundColor: theme.palette.buttonPrimary.main,
            height: 3
          }}
        ></hr>
        <div className={classes.midSection}>
          <div className={classes.badgeContainer}>
            <Avatar
              alt="Contact Profile Image"
              src={profileImage ? profileImage.toString() : ""}
              className={classes.badge}
            >
              {!profileImage ? <PersonIcon fontSize="large" /> : null}
            </Avatar>
          </div>
          <p
            style={{
              fontWeight: "400",
              textAlign: "center",
              width: "100%",
              fontWeight: "500"
            }}
          >
            {callerName}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center"
            }}
          ></div>
        </div>
        <div
          style={{
            marginTop: "20px",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            position: "absolute",
            bottom: "50px",
            left: "0px"
          }}
        >
          <Button
            onClick={() => rejectCallClicked()}
            style={{
              fontWeight: "400",
              textTransform: "capitalize",
              backgroundColor: theme.palette.error.main,
              color: "white",
              fontSize: "18px",
              height: "50px",
              width: "40%",
              maxWidth: "250px",
              marginRight: "10px"
            }}
          >
            Decline
          </Button>
          <Button
            onClick={() => acceptCallClicked()}
            style={{
              fontWeight: "400",
              textTransform: "capitalize",
              backgroundColor: theme.palette.background.green,
              color: "white",
              fontSize: "18px",
              height: "50px",
              width: "40%",
              maxWidth: "250px",
              marginLeft: "10px"
            }}
          >
            Accept
          </Button>
        </div>
      </Grid>
    </Grid>
  )
}
export default IncomingCall
