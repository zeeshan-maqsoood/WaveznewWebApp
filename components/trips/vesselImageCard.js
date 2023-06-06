import React, { Component, useState, useEffect, useContext } from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  Paper,
  Typography,
  Grid,
  Button,
  CardActionArea,
  CardMedia,
  CardActions,
  Card,
  ButtonBase,
  CardContent
} from "@material-ui/core"
import Session from "../../sessionService"
import theme from "../../src/theme"
import OpenInNewIcon from "@material-ui/icons/OpenInNew"
import Context from "../../store/context"

// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    padding: 10,
    textAlign: "left"
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    width: "fit-content"
  },
  image: {
    width: "fit-content"
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%"
  },
  link: {
    margin: 10,
    color: theme.palette.buttonPrimary.main,
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline"
    },
    [theme.breakpoints.down("xs")]: {
      textAlign: "center"
    }
  }
})

export default function Upcoming({ isOwner, vesselName, price, id, image }) {
  const token = Session.getToken("Wavetoken")
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr
  const { globalState, globalDispatch } = useContext(Context)

  const handleOpenCalendar = (listingId) => {
    globalDispatch({ type: "SET_CALENDAR_LISTING", payload: listingId })
    router.push("/calendar")
  }

  const handleOpenVesselDescription = () => {
    if (id !== undefined) {
      router.push(`/listingInfo/${id}`)
    }
  }
  return (
    <>
      <ButtonBase className={classes.image} onClick={handleOpenVesselDescription}>
        <Card className={classes.root}>
          <CardActionArea style={{ width: 247, height: 243, borderRadius: 12 }}>
            <CardMedia
              component='img'
              alt='boatImg'
              height='170'
              image={image || "https://picsum.photos/200/300"}
              title='Boat Image'
            />
            <CardContent>
              <Typography variant='body2' color='textSecondary' component='p'>
                {vesselName}
              </Typography>
              <Typography variant='body2' color='textSecondary' component='p'>
                {price}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </ButtonBase>
      {isOwner && <Typography
        variant='body2'
        className={classes.link}
        onClick={() => handleOpenCalendar(id)}
      >
        {t.tripsPage.openCalendar}
        <OpenInNewIcon style={{ fontSize: 15, marginLeft: 10 }} />
      </Typography>}

    </>
  )
}
