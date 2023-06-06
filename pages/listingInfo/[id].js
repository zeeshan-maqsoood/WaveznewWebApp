import React, { useContext, useEffect, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Session from "../../sessionService"
import { Paper, Grid, Button } from "@material-ui/core"
import Description from "../../components/listingInfo/description"
import ArrowForwardIcon from "@material-ui/icons/ArrowForward"
import HostDetails from "../../components/listingInfo/hostDetails"
import Features from "../../components/listingInfo/features"
import CheckingAvailability from "../../components/listingInfo/checkingAvailability"
import ShareIcon from "@material-ui/icons/Share"
import Map from "../../components/search/map"
import UserReview from "../../components/userReview"
import API from "../api/baseApiIinstance"
import Footer from "../../components/footer"
import ListingCard from "../../components/search/listingCard"
import StarRateRoundedIcon from "@material-ui/icons/StarRateRounded"
import { Modal } from "react-responsive-modal"
// eslint-disable-next-line no-duplicate-imports
import { withStyles } from "@material-ui/core/styles"
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import NavBar from "../../components/navbar/navBar.js"
import { ReactPhotoCollage } from "react-photo-collage"
import HeartIcon from "../../components/favourite/heartIcon"
import theme from "../../src/theme"
import ClipBoard from "../../components/listingInfo/clipBoard"
import Rating from "@material-ui/lab/Rating"

const useStyles = makeStyles((theme) => ({
  error: {
    color: theme.palette.error.main,
    marginTop: 20,
    marginBottom: 10
  },
  boat_name: {
    fontWeight: 500,
    font: "Roboto",
    color: theme.palette.title.matterhorn,
    margin: 1,
    padding: 10
  },
  favAndShare: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: "24px",
    color: theme.palette.title.matterhorn,
    marginLeft: "10px",
    marginTop: "30px",
    cursor: "pointer"
  },
  contentTitle: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: "24px",
    color: theme.palette.title.matterhorn,
    marginLeft: "5%",
    marginTop: "30px",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "5px"
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "5px"
    }
  },
  imagePaper: {
    padding: 20,
    margin: 20,
    display: "block",
    backgroundColor: theme.palette.addPayment.borderBottom
  },
  map: {
    marginTop: "20px",
    marginBottom: "90px",
    marginLeft: "5%",
    width: "60vw",
    height: "50vh",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: "60vh",
      marginLeft: 0
    }
  },
  allVessel: {
    float: "right",
    marginRight: "12.5%",
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      marginRight: "17%"
    }
  },
  topTitle: {
    fontSize: 30,
    [theme.breakpoints.down("xs")]: {
      fontSize: 20
    }
  },
  favNShareGrid: {
    textAlign: "right"
  },
  container: {
    padding: 20,
    margin: 20,
    display: "block"
  },
  hintModal: {
    width: "40vw",
    padding: 30,
    borderRadius: 10
  }
}))

const StyledRating = withStyles({
  iconFilled: {
    color: theme.palette.userReview.iconFilled
  },
  iconHover: {
    color: theme.palette.userReview.iconHover
  }
})(Rating)


export default function VesselDetails() {
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr
  const token = Session.getToken("Wavetoken")
  const favourite =
    token !== "" && Session.getFavourite()
      ? JSON.parse(Session.getFavourite())
      : ""
  let vesselId = router.query.id
  const [vesselDetail, setVesselDetail] = useState()
  const [vesselsByUser, setVesselsByUser] = useState()
  const [setting, setSetting] = useState()
  const [inFavourite, setInFavourite] = useState()
  const [openClipBoard, setOpenClipBoard] = useState(false)
  const [userReviews, setUserReviews] = useState([])
  const [isViewAllReviews, setIsViewAllReviews] = useState(false)
  const [ratingsLoaded, setRatingsLoaded] = useState(false)

  const getListingInfo = () => {
    if (router.asPath !== router.route) {
      vesselId = router.query.id

      API()
        .get(`vessel/guest/${vesselId}`)
        .then((response) => {
          if (response.status === 200) {
            setVesselDetail(response.data)
          }
        })
        .catch((e) => {
          console.log("Error from get information files is: ", e)
          // router.push("/somethingWentWrong");
        })
    }
  }

  const viewAllReviews = () => {
    router.push(`reviews/${vesselId}`)
  }

  const showAllVessels = (id) => {
    router.push(`/allVesselsByUser/${id}`)
  }

  // get data for other listings
  const getOtherListings = () => {
    if (vesselDetail !== undefined) {
      const userId = vesselDetail?.userId?._id

      API()
        .get(`users/getListings/guest/${userId}`)
        .then((response) => {
          if (response.status === 200) {
            setVesselsByUser(response.data?.listings && response.data?.listings?.length !== 0 ? response.data?.listings?.filter(l => l._id !== vesselId) : [])
          }
        })
        .catch((e) => {
          console.log("Error from get information files is: ", e)
        })
    }
  }

  const getUserReviews = () => {
    if (router.asPath !== router.route) {
      vesselId = router.query.id
      API()
      .get(`reviews/vesselReviews/${vesselId}`)
      .then((response) => {
        console.log("User review: ", response?.data)   
        if (response?.data?.reviews?.length > 3) {
          setIsViewAllReviews(true)
        }   
        setUserReviews(response?.data?.reviews?.slice(0, 3))
        setRatingsLoaded(true)
      })
      .catch((e) => {
        console.log("Error from get information files is: ", e)
      })
    }
  }

  const checkFavouriteVessel = () => {
    setInFavourite(true)
  }

  useEffect(() => {
    getListingInfo()
    getUserReviews()
    setInFavourite()
    setSetting()
  }, [router])

  useEffect(() => {
    getOtherListings()
  }, [vesselDetail?.userId?._id])

  useEffect(() => {
    if (vesselDetail !== undefined) {
      const imageArr = []
      vesselDetail?.images?.map((item) =>
        imageArr.push({ source: item.imageURL })
      )
      setSetting({
        borderRadius: "10px",
        width: "100%",
        height: ["300px", "250px"],
        layout: [3],
        photos: imageArr,
        showNumOfRemainingPhotos: true
      })
    }
  }, [vesselDetail?.images])

  useEffect(() => {
    checkFavouriteVessel()
  }, [token, vesselDetail?._id, vesselDetail?.vesselType])

  return (
    <>
      <NavBar />
      <Modal
        open={openClipBoard}
        onClose={() => setOpenClipBoard(false)}
        center
        classNames={{
          modal: classes.hintModal
        }}
      >
        <ClipBoard />
      </Modal>
      <Paper className={classes.boat_name}>
        <Grid container className={classes.topTitle}>
          <Grid container item xs={6}>
            {vesselDetail?.title}
          </Grid>
          <Grid item xs={6} className={classes.favNShareGrid}>
            {token && inFavourite && vesselDetail?._id && (
              <HeartIcon
                vessel={vesselDetail}
                id={vesselDetail?._id}
                type={vesselDetail?.vesselType}
                inVesselInfo={true}
              />
            )}
            <a
              onClick={() => setOpenClipBoard(true)}
              className={classes.favAndShare}
            >
              <ShareIcon />
            </a>
          </Grid>
        </Grid>
      </Paper>
      {vesselDetail?.images?.length !== 0 && (
        <Paper className={classes.imagePaper}>
          {setting !== undefined && <ReactPhotoCollage {...setting} />}
        </Paper>
      )}
      <Paper className={classes.container}>
      {ratingsLoaded && (
          <StyledRating
              name='customized-color'
              defaultValue={vesselDetail?.averageRating}
              getLabelText={(value) =>
                  `${value} Heart${value !== 1 ? "s" : ""}`
              }
              precision={0.5}
              icon={<StarRateRoundedIcon fontSize='medium' />}
              disabled
          />
      )}
        <Grid container spacing={5}>
          <Grid item sm={12} md={8}>
            {/* Description */}
            <Description
              limitCharacters={500}descriptionTxt={vesselDetail?.description ?? "No Description"}
            />
            {/* Host Details */}
            <HostDetails
              numberOfGuest={vesselDetail?.numberOfPassengers}
              hostInfo={vesselDetail?.userId}
              categories={vesselDetail?.vesselCategory}
            />
            {/* Features */}
            <Features features={vesselDetail?.vesselFeatures} rope={vesselDetail?.hasRope ? "Rope":""} faKit={vesselDetail?.hasFirstAidKid ?"First Aid Kit" : ""} light={vesselDetail?.hasFlashlight ? "Flash Light": ""} jacket={vesselDetail?.hasLifeJackets ? "Life Jacket":""} />
            {/* location */}
            <Grid item className={classes.contentTitle}>
              {t.listingInfo.location}
              <div
                style={{
                  borderBottom: "1px solid rgb(221, 221, 221)",
                  marginTop: "5px",
                  marginBottom: "20px"
                }}
              />
            </Grid>

            <div className={classes.map}>
              <Map
                locationData={[
                  [
                    vesselDetail?.vesselLocation?.latitude || 0,
                    vesselDetail?.vesselLocation?.longitude || 0
                  ]
                ]}
                center={{
                  lat: vesselDetail?.vesselLocation?.latitude || 0,
                  lng: vesselDetail?.vesselLocation?.longitude || 0
                }}
              />
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <CheckingAvailability
              vesselId={vesselDetail?._id}
              pricing={vesselDetail?.vesselPricing}
              maxGuest={vesselDetail?.numberOfPassengers}
            />
          </Grid>
        </Grid>
      </Paper>
      <Grid className={classes.contentTitle}>
        {t.listingInfo.otherListings}
        {vesselsByUser?.length > 4 && (
          <a
            onClick={() => showAllVessels(vesselDetail?.userId?._id)}
            className={classes.allVessel}
          >
            {t.listingInfo.all} <ArrowForwardIcon />
          </a>
        )}
      </Grid>
      <Grid container style={{justifyContent: "center"}}>
        {vesselsByUser !== undefined &&
          vesselsByUser?.map(
            (item) =>
              vesselsByUser.indexOf(item) < 4 && (
                <Grid
                  item
                  xs={4}
                  md={2}
                  key={item._id}
                  style={{
                    marginRight: "5%",
                    marginTop: "20px"
                  }}
                >
                  <ListingCard
                    vessel={item}
                    id={item?._id}
                    type={item?.vesselType}
                    image={
                      item?.images[0]?.imageURL ??
                      "/assets/images/maskGroup.png"
                    }
                    title={item?.title}
                    price={
                      item?.vesselType !== "RENTAL"
                        ? `$${item?.vesselPricing?.perDay?.amount ?? 0}/day`
                        : `$${item?.vesselPricing?.perHour?.amount ?? 0}/hr`
                    }
                    passengers={item?.numberOfPassengers}
                  />
                </Grid>
              )
          )}
      </Grid>

      <div
        style={{
          margin: "5%"
        }}
      >
        <div >{isViewAllReviews && <Button onClick={() => viewAllReviews(vesselDetail?._id)}>All Reviews</Button>}</div>
        <div style={{ justifyContent: "space-evenly" }}>
          {userReviews.map((data) => (
            <UserReview key={data._id} data={data} />
            ))}
        </div>
      </div>
      <Footer />
    </>
  )
}
