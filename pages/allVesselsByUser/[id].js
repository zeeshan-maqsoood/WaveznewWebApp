import React, { useState, useEffect, useContext } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import NavBar from "../../components/navbar/navBar"
import ListingCard from "../../components/search/listingCard"
import Session from "../../sessionService"
import API from "../api/baseApiIinstance"
import Typography from "@material-ui/core/Typography"
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"

const useStyles = makeStyles((theme) => ({
  container: {
    flexGrow: 1,
    [theme.breakpoints.up("sm")]: {
      paddingLeft: 24
    }
  },
  header: {
    marginTop: 24,
    marginLeft: 24,
    [theme.breakpoints.up("sm")]: {
      marginLeft: 0
    }
  },
  addShortListButton: {
    color: "#4D96FB",
    textTransform: "none"
  }
}))

export default function VesselByUser() {
  const classes = useStyles()
  const mobileBreakpoint = 600
  const token = Session.getToken("Wavetoken")
  const [isMobile, setIsMobile] = useState(false)
  const [windowSize, setWindowSize] = useState("")
  const [vesselsByUser, setVesselsByUser] = useState()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  const getOtherListings = () => {
    console.log("GET LISTINGS ")
    if (router.asPath !== router.route) {
      const userId = router.query.id

      API()
        .get(`users/getListings/guest/${userId}`)
        .then((response) => {
          if (response.status === 200) {
            console.log("Vessels by user response is ",  response.data)
            setVesselsByUser(response.data.listings)
          }
        })
        .catch((e) => {
          console.log("Error from get information files is: ", e)
        })
    }
  }

  useEffect(() => {
    getOtherListings()
  }, [])

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== "undefined") {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize(window.innerWidth)
        window.innerWidth <= mobileBreakpoint
          ? setIsMobile(true)
          : setIsMobile(false)
      }

      // Add event listener
      window.addEventListener("resize", handleResize)

      // Call handler right away so state gets updated with initial window size
      handleResize()

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <>
      <NavBar />
      <div className={classes.container}>
        {/* Main Grid */}
        <Grid container item direction='row' xs={12} spacing={2}>
          <Grid xs={false} item />
          {/* Card Grid */}
          <Grid container item xs={12}>
            <Grid xs={1} item lg={1} />
            <Grid
              container
              direction='row'
              item
              xs={11}
              sm={12}
              lg={10}
              spacing={3}
            >
              <Grid item xs={12} lg={11} className={classes.header}>
                <Typography color='textPrimary' variant='h6'>
                 All Vessels of <b>{vesselsByUser?.[0]?.userId?.firstName} {vesselsByUser?.[0]?.userId?.lastName}</b> 
                </Typography>
              </Grid>
              {vesselsByUser && vesselsByUser?.map((vessel) => (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={3}
                  key={vessel._id}
                  style={{ height: "auto" }}
                >
                  <ListingCard
                    vessel={vessel}
                    id={vessel._id}
                    type={vessel.vesselType}
                    image={
                      vessel.images[0]?.imageURL ??
                      "/assets/images/maskGroup.png"
                    }
                    title={vessel.title}
                    price={
                      vessel.vesselType !== "STAY"
                        ? `${vessel.vesselPricing?.perHour?.amount ?? 0}/hr`
                        : `${vessel.vesselPricing?.perDay?.amount ?? 0}/day`
                    }
                    passengers={vessel.numberOfPassengers}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  )
}
