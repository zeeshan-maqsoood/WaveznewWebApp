import React, { Component, useState, useEffect, useContext } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Session from "../../sessionService"
import { Typography } from "@material-ui/core"
// eslint-disable-next-line no-duplicate-imports
import { Grid } from "@material-ui/core"
import API from "../../pages/api/baseApiIinstance"
import Button from "@material-ui/core/Button"
import NavBar from "../../components/navbar/navBar.js"
import Image from "next/image"
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345
  },
  introduction: {
    padding: 50,
    paddingBottom: 10
  },
  buttonStyle: {
    textAlign: "center",
    color: theme.palette.buttonPrimary.main,
    textTransform: "none",
    fontSize: 20
  }
}))

export default function Trips() {
  const token = Session.getToken("Wavetoken")
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const [isVesselOwner, setIsVesselOwner] = useState(false)
  const t = locale === "en" ? en : fr
  const data = [
    {
      button: "Renter",
      title: `${t.tripsPage.for} ${t.tripsPage.renter}`,
      intro: t.tripsPage.introRenter
    },
    {
      button: "Owner",
      title: `${t.tripsPage.for} ${t.tripsPage.owner}`,
      intro: t.tripsPage.introOwner
    }
  ]

  const handleOpenTrip = (role) => {
      role === "Owner" ? Session.setRole("owner"): Session.setRole("renter")
      router.push(`trips/tripTabs`)
  }

  useEffect(() => {
    API()
    .get(`users/getUserDetails`,
      {
        headers: {
          authorization: `Bearer ${  token}`
        }
      }
    )
    .then((response) => {
      Session.setUserDetail(response.data)
      if (response.data.isVesselOwner === true) {
        setIsVesselOwner(true)
      }      
    })
    .catch((e) => {
      console.log("Error is: ", e)
      // router.push("/somethingWentWrong")
    })
  }, [])

  return (
    <>
      <NavBar />
        {data?.map((item) => (
          <Grid container item key={data.indexOf(item)}>
              <Grid item xs={1}/>
            <Grid item xs={12} sm={6} className={classes.introduction}>
            <Typography variant="h6" gutterBottom>{item.title}</Typography>
              <Typography>{item.intro}</Typography>
            </Grid>
            <Grid item xs={8} sm={4}>
              <Image
                src='/assets/images/document-verified-successful.png'
                width='300'
                height='250'
              />
            </Grid>
            <Grid item xs={4} style={{margin: "auto"}} >
              {item.button === "Owner" && <Button onClick={() => handleOpenTrip(item.button)} className={classes.buttonStyle} disabled={!isVesselOwner}>
               {t.tripsPage.exploreAs} {item.button} &gt;
              </Button>}
              {item.button === "Renter" && <Button onClick={() => handleOpenTrip(item.button)} className={classes.buttonStyle}>
              {t.tripsPage.exploreAs} {item.button} &gt;
              </Button>}
            </Grid>
          </Grid>
        ))}
    </>
  )
}
