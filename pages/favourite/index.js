import React, { useState, useEffect, useContext } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import NavBar from "../../components/navbar/navBar"
import { Button, Snackbar, IconButton} from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"
import ListingCard from "../../components/search/listingCard"
import Session from "../../sessionService"
import API from "../api/baseApiIinstance"
import Typography from "@material-ui/core/Typography"
import Context from "../../store/context"
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
    color: theme.palette.buttonPrimary.main,
    textTransform: "none"
  },
  noVesselText: {
    marginLeft: 24
  }
}))

export default function Favourite() {
  const classes = useStyles()
  const mobileBreakpoint = 600
  const token = Session.getToken("Wavetoken")
  const [isMobile, setIsMobile] = useState(false)
  const [windowSize, setWindowSize] = useState("")
  const { globalState, globalDispatch } = useContext(Context)
  const [favourites, setFavourites] = useState([])
  const [shortList, setShortList] = useState([])
  const [shortListFullMessage, setShortListFullMessage] = useState(false)
  //locale
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  const renderFavouriteData = (data) => {
    const listFav = []
    const shortListVessel = []
    data?.favoriteRentals?.map((item) => {
      listFav.push(item)
    })
    data?.favoriteStays?.map((item) => {
      listFav.push(item)
    })
    data?.favoriteCharters?.map((item) => {
      listFav.push(item)
    })
    setFavourites(listFav)

    data?.shortListRentals?.map((item) => {
      shortListVessel.push(item)
    })
    data?.shortListStays?.map((item) => {
      shortListVessel.push(item)
    })
    data?.shortListCharters?.map((item) => {
      shortListVessel.push(item)
    })
    setShortList(shortListVessel)
  }

  const loadFavourite = () => {
    if (token !== "") {
      API()
        .get("favourite", {
          headers: {
            authorization: `Bearer ${  token}`
          }
        })
        .then((response) => {
          renderFavouriteData(response.data[0])
          globalDispatch({type: "SET_FAVOURITE_DATA", payload: response.data[0]})
        })
        .catch((e) => {
          console.log("Error from getting all favourite: ", e)
          // router.push("/somethingWentWrong");
        })
    }
  }

  const handleAddToShortList = (id, type) => {
    //build request body
    const favourite =  JSON.parse(Session.getFavourite())
    const shortlistLength = favourite.shortListStays.length + favourite.shortListCharters.length + favourite.shortListRentals.length
    if (shortlistLength === 3) {
      setShortListFullMessage(true)
      return
    }
    console.log("In favourite, favourite is: ", favourite)
    const requestBody = {
      favoriteRentals: 
      type === "RENTAL"
      ? favourite.favoriteRentals.filter((item) => item !== id)
      : favourite.favoriteRentals,
    favoriteCharters: 
      type === "CHARTER"
      ? favourite.favoriteCharters.filter((item) => item !== id)
      : favourite.favoriteCharters,
    favoriteStays: 
      type === "STAY"
      ? favourite.favoriteStays.filter((item) => item !== id)
      : favourite.favoriteStays,
    shortListRentals:
      type === "RENTAL"
        ? [...favourite.shortListRentals, id]
        : favourite.shortListRentals,
    shortListCharters:
      type === "CHARTER"
        ? [...favourite.shortListCharters, id]
        : favourite.shortListCharters,
    shortListStays:
      type === "STAY"
        ? [...favourite.shortListStays, id]
        : favourite.shortListStays
    }
    if (favourite !== "") {
      API()
        .put(`favourite/${favourite._id}`, requestBody, {
          headers: {
            authorization: `Bearer ${  token}`
          }
        })
        .then((response) => {        
          console.log("success in updating FAVOURITE: ", response.data)            

          globalDispatch({type: "SET_FAVOURITE_DATA", payload: response.data})
          const favObject = {
            favoriteRentals: response.data.favoriteRentals.map(item => item._id),
            favoriteCharters: response.data.favoriteCharters.map(item => item._id),
            favoriteStays: response.data.favoriteStays.map(item => item._id),
            shortListRentals: response.data.shortListRentals.map(item => item._id),
            shortListCharters: response.data.shortListCharters.map(item => item._id),
            shortListStays: response.data.shortListStays.map(item => item._id),
            _id: response.data._id
          }
          Session.setFavourite(JSON.stringify(favObject))
          globalDispatch({type: "SET_FAVOURITE", payload: favObject})
        })
        .catch((e) => {
          console.log(e)
          // router.push("/somethingWentWrong");
        })
    }
  }

  useEffect(() => {
    loadFavourite()
    setShortListFullMessage(false)
  }, [])

  useEffect(() => {
    if (globalState.favouriteData !== "") {
      renderFavouriteData(globalState.favouriteData)
    }   
  }, [
globalState.favourite.shortListRentals, 
    globalState.favourite.shortListRentals,
    globalState.favourite.shortListStays,
    globalState.favourite.favoriteRentals,
    globalState.favourite.favoriteCharters,
    globalState.favourite.favoriteStays
])

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
      <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}
            open={shortListFullMessage}
            autoHideDuration={5000}
            onClose={() => setShortListFullMessage(false)}
            message='Short list is full (3/3)'
            action={
              <React.Fragment>
                <IconButton
                  size='small'
                  aria-label='close'
                  color='inherit'
                  onClick={() => setShortListFullMessage(false)}
                >
                  <CloseIcon fontSize='small' />
                </IconButton>
              </React.Fragment>
            }
          />
      <div className={classes.container}>
        {/* Main Grid */}
        <Grid container item direction='row' xs={12} spacing={2}>
          <Grid item xs={12} lg={11} className={classes.header}>
            <Typography color='textPrimary' variant='h6'>
              {t.favourite.favourites}
            </Typography>
          </Grid>
          {/* Spacing */}
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
                  {t.favourite.shortList}
                </Typography>
              </Grid>
              {shortList.length === 0 ? <Typography className={classes.noVesselText}>{t.favourite.noShortlistVessel}</Typography> :  shortList.map((vessel) => (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={3}
                  key={vessel._id}
                  style={{ height: "auto" }}
                >
                  <ListingCard
                    id={vessel._id}
                    type={vessel.vesselType}
                    image={
                      vessel.images[0]?.imageURL ??
                      "/assets/images/maskGroup.png"
                    }
                    title={vessel.title}
                    price={
                      vessel.vesselType === "RENTAL"
                        ? `${vessel.vesselPricing?.perHour.amount ?? 0}/hr`
                        : `${vessel.vesselPricing?.perDay.amount ?? 0}/day`
                    }
                    passengers={vessel.numberOfPassengers}
                  />
                </Grid>
              ))}
              <Grid item xs={12} lg={11} className={classes.header}>
                <Typography color='textPrimary' variant='h6'>
                  {t.favourite.favourite}
                </Typography>
              </Grid>
              {favourites.length === 0 ? <Typography className={classes.noVesselText}>{t.favourite.noFavVessel}</Typography> : favourites.map((vessel) => (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={3}
                  key={vessel._id}
                  style={{ height: "auto", marginBottom: 30 }}
                >
                  <ListingCard
                    id={vessel._id}
                    type={vessel.vesselType}
                    image={
                      vessel.images[0]?.imageURL ??
                      "/assets/images/maskGroup.png"
                    }
                    title={vessel.title}
                    price={
                      vessel.vesselType === "RENTAL"
                        ? `${vessel.vesselPricing?.perHour.amount ?? 0}/hr`
                        : `${vessel.vesselPricing?.perDay.amount ?? 0}/day`
                    }
                    passengers={vessel.numberOfPassengers}
                  />
                   <Button
                      className={classes.addShortListButton}
                      onClick={() =>
                        handleAddToShortList(vessel?._id, vessel?.vesselType)
                      }
                >
                  {t.favourite.addToShortList}
                </Button>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  )
}
