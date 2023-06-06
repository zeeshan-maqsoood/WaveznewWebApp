import React, { useState, useEffect, useContext } from "react"

import API from "../../pages/api/baseApiIinstance"
import { makeStyles } from "@material-ui/core/styles"
import { Grid, Button } from "@material-ui/core"
import ListingCard from "../search/listingCard"

import Session from "../../sessionService"
import Context from "../../store/context"

// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import theme from "../../src/theme"

const ShortListFull = ({ onCloseModal }) => {
  const mobileBreakpoint = 600
  const token = Session.getToken("Wavetoken")
  const [isMobile, setIsMobile] = useState(false)
  const [windowSize, setWindowSize] = useState("")
  const [shortList, setShortList] = useState([])
  let favourite = token !== "" ? JSON.parse(Session.getFavourite()) : ""
  const [isDelete, setIsDelete] = useState(false)
  const [isUpdated, setIsUpdated] = useState(false)
  const { globalState, globalDispatch } = useContext(Context)

  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  const handleClickUpdate = () => {
    const candidate = Session.getCandidate()
    //case adding candidate to shortlist full
    if (candidate !== "") {
      //put API add candidate to shortlist
      favourite = JSON.parse(Session.getFavourite())
      const requestBody = {
        favoriteRentals:
          candidate.vesselType === "RENTAL"
            ? favourite.favoriteRentals.filter((item) => item !== candidate._id)
            : favourite.favoriteRentals,
        favoriteCharters:
          candidate.vesselType === "CHARTER"
            ? favourite.favoriteCharters.filter((item) => item !== candidate._id)
            : favourite.favoriteCharters,
        favoriteStays:
         candidate.vesselType === "STAY"
            ? favourite.favoriteStays.filter((item) => item !== candidate._id)
            : favourite.favoriteStays,     
        shortListRentals:
          candidate.vesselType === "RENTAL"
            ? [...favourite?.shortListRentals, candidate._id]
            : favourite.shortListRentals,
        shortListCharters:
          candidate.vesselType  === "CHARTER"
            ? [...favourite?.shortListCharters, candidate._id]
            : favourite.shortListCharters,
        shortListStays:
          candidate.vesselType  === "STAY"
            ? [...favourite?.shortListStays, candidate._id]
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
          })
        }
    }
    onCloseModal()
  }

  const handleRemoveVessel = (id, type) => {
    const candidate = Session.getCandidate()
    //if remove candidate: 
    if (id === candidate._id) {
      Session.setCandidate("")
      setIsDelete(true)
      setIsUpdated(true)
    } else { // remove a vessel in shortlist
      //build request body
    const requestBody = {
      shortListRentals:
        type === "RENTAL"
          ? favourite.shortListRentals.filter((item) => item !== id)
          : favourite.shortListRentals,
      shortListCharters:
        type === "CHARTER"
          ? favourite.shortListCharters.filter((item) => item !== id)
          : favourite.shortListCharters,
      shortListStays:
        type === "STAY"
          ? favourite.shortListStays.filter((item) => item !== id)
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
          setIsDelete(true)
          setIsUpdated(true)
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
        })
    }
    }    
  }

  const getFavourite = () => {
    const listFav = []
    if (token !== "") {
      API()
        .get("favourite", {
          headers: {
            authorization: `Bearer ${  token}`
          }
        })
        .then((response) => {
          response.data[0].shortListRentals?.map((item) => listFav.push(item))
          response.data[0].shortListStays?.map((item) => listFav.push(item))
          response.data[0].shortListCharters?.map((item) => listFav.push(item))
          const candidate = Session.getCandidate()
          if (candidate !== "") {
            listFav.push(candidate)
          }
          setShortList(listFav)
        })
        .catch((e) => {
          console.log("Error from getting shortlist : ", e)
        })
    }
  }

  useEffect(() => {
    getFavourite()
    setIsDelete(false)
  }, [isDelete])

  useEffect(() => {
    getFavourite()
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
      <div>
        <h2>Shortlist Full</h2>
        <p>
          You can add maximum 3 listings to your shortlist. Please remove one
          from the list.
        </p>
        <Grid container item xs={12} spacing={2}>
          {shortList.map((vessel) => (
            <Grid
              style={{ marginBottom: 30 }}
              item
              xs={12}
              sm={isMobile ? 12 : 4}
              key={vessel?._id}
            >
              <ListingCard
                id={vessel?._id}
                type={vessel?.vesselType}
                image={
                  vessel?.images[0]?.imageURL ?? "/assets/images/maskGroup.png"
                }
                title={vessel?.title}
                price={vessel?.vesselType !== "STAY" ? `${vessel?.vesselPricing?.perHour?.amount ?? 0}/hr` : `${vessel?.vesselPricing?.perDay?.amount ?? 0}/day` }
                passengers={vessel?.numberOfPassengers}    
              />
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <Button
                  style={{ color: theme.palette.buttonPrimary.main, textTransform: "none" }}
                  onClick={() =>
                    handleRemoveVessel(vessel?._id, vessel?.vesselType)
                  }
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Grid item xs={12} style={{ textAlign: "center", marginTop: 30 }}>
          <Button disabled={!isUpdated} style={{ backgroundColor: !isUpdated ? theme.palette.background.default : theme.palette.buttonPrimary.main, paddingLeft: 20, paddingRight: 20, color: theme.palette.background.default, fontWeight: 400, textTransform: "none" }} onClick={handleClickUpdate}>Update</Button>
        </Grid>
      </div>
    </>
  )
}
export default ShortListFull
