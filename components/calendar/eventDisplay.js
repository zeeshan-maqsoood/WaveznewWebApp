import React, { useEffect, useState } from "react"
import Router from "next/router"
import Button from "@material-ui/core/Button"
import { Grid, makeStyles, Typography } from "@material-ui/core"
import API from "../../pages/api/baseApiIinstance"
import Avatar from "@material-ui/core/Avatar"
import theme from "../../src/theme"
import Session from "../../sessionService"
// i18n
// eslint-disable-next-line no-duplicate-imports
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center"
  },
  image: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "90%"
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.title.matterhorn
  },
  button: {
    display: "flex",
    justifyContent: "center"
  },
  infoBubble: {
    padding: 30,
    width: "100%",
    borderRadius: 10,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20
  },
  text: {
    fontSize: "14px",
    marginBottom: 10,
    color: theme.palette.text.grey,
    fontWeight: 500
  },
  subtitle: {
    fontSize: "16px",
    marginTop: 20,
    marginBottom: 20,
    fontWeight: 500,
    color: theme.palette.title.matterhorn
  },
  badge: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    backgroundColor: theme.palette.wavezHome.backgroundColorSearch,
    color: theme.palette.navBar.background,
    fontFamily: "Roboto",
    fontSize: "4em"
  }
}))

const EventInfoDisplay = ({
  event,
  onClose,
  start,
  end,
  startTime,
  endTime,
  blocked,
  token,
  refresh
}) => {
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  const deleteBlocking = () => {
    API()
      .delete(`event/blockTimeslot/${  event._id}`, {
        headers: {
          authorization: `Bearer ${  token}`
        }
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Successfully deleted blocked period")
          refresh()
        }
      })
      .catch((e) => {
        // router.push("/somethingWentWrong");
        console.log(e)
      })
  }

  return (
    <Grid container className={classes.container}>
      <Grid item container xs={12}>
        {blocked ? (
          <Grid item xs={12} className={classes.title}>
            {event.title}
          </Grid>
        ) : (
          <>
            {event?.userDetails?.profileImageUrl ? (
              <Grid item xs={3} className={classes.image}>
                <Avatar
                  alt="User Profile Image"
                  src={event.userDetails?.profileImageUrl?.toString()}
                  className={classes.badge}
                />
              </Grid>
            ) : (
              <Grid item xs={3} />
            )}
            <Grid item xs={6} className={classes.title}>
              {event.title}
            </Grid>
            <Grid item xs={3} />
          </>
        )}
      </Grid>
      <Grid item xs={12} className={classes.infoBubble}>
        <div className={classes.subtitle} style={{ fontWeight: 500 }}>
          {t.calendar.eventInfo.bookingInfo}
        </div>
        <div className={classes.text}>
          {start} {startTime} - {end} {endTime}
        </div>
        {!blocked && (
          <div className={classes.text}>
            {event.bookingDetails?.numberOfPassengers}{" "}
            {t.calendar.eventInfo.passengers}
          </div>
        )}
        <div className={classes.subtitle} style={{ fontWeight: 500 }}>
          {t.calendar.eventInfo.boatInfo}
        </div>
        <div className={classes.text}>{event?.vessel?.title}</div>
        <div className={classes.text}>{event?.vessel?.vesselBrand}</div>
      </Grid>

      {blocked ? (
        <Grid
          item
          xs={12}
          className={classes.button}
          style={{ justifyContent: "space-evenly" }}
        >
          <Button
            onClick={() => {
              onClose()
            }}
            style={{
              fontWeight: "400",
              textTransform: "capitalize",
              fontSize: "18px",
              maxWidth: "150px"
            }}
          >
            {t.calendar.eventInfo.cancelButton}
          </Button>
          <Button
            onClick={() => {
              deleteBlocking(), onClose()
            }}
            style={{
              fontWeight: "400",
              textTransform: "capitalize",
              backgroundColor: theme.palette.background.flamingo,
              color: theme.palette.background.default,
              fontSize: "18px",
              maxWidth: "150px"
            }}
          >
            {t.calendar.eventInfo.confirmButton}
          </Button>
        </Grid>
      ) : (
        <Grid item xs={12} className={classes.button}>
          <Button
            onClick={() => {
              Session.setRole("owner"), router.push("trips/tripTabs")
            }}
            style={{
              fontWeight: "400",
              textTransform: "capitalize",
              backgroundColor: theme.palette.buttonPrimary.main,
              color: theme.palette.background.default,
              fontSize: "18px",
              maxWidth: "150px"
            }}
          >
            {t.calendar.eventInfo.viewButton}
          </Button>
        </Grid>
      )}
    </Grid>
  )
}

export default EventInfoDisplay
