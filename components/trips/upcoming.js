import React, { Component, useState, useEffect, useContext } from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  Paper,
  Typography,
  Grid,
  Button
} from "@material-ui/core"
import Session from "../../sessionService"
import theme from "../../src/theme"
import TablePagination from '@material-ui/core/TablePagination'
import InfoIcon from "@material-ui/icons/InfoOutlined"
import ChatIcon from "@material-ui/icons/Chat"
import LocationOnIcon from "@material-ui/icons/LocationOn"
import Map from "../../components/search/map"
import API from "../../pages/api/baseApiIinstance"
import moment from "moment"
import CryptoJS from "crypto-js"
import Context from "../../store/context"
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import { Modal } from "react-responsive-modal"
import CancelTrip from "./cancelTrip"
import CancellationPolicy from "./cancellationPolicy"
import VesselImageCard from "./vesselImageCard"

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    padding: 10,
    textAlign: "left"
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    width: "fit-content",
    maxWidth: "700px"
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
  label: {
    fontWeight: 500,
    marginTop: 20,
    display: "flex"
  },
  link: {
    margin: 10,
    color: theme.palette.buttonPrimary.main,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    "&:hover": {
      textDecoration: "underline"
    },
    [theme.breakpoints.down("xs")]: {
      textAlign: "center"
    }
  },
  customModal: {
    width: 500,
    borderRadius: 10,
    [theme.breakpoints.down("xs")]: {
      width: 300
    }
  },
  startButton: {
    background: theme.palette.buttonPrimary.main,
    color: "white",
    textTransform: "capitalize",
    paddingLeft: 15,
    paddingRight: 15,
    [theme.breakpoints.down("xs")]: {
      width: 200
    }
  },
  disabledStartButton: {
    background: theme.palette.background.lightGrey,
    color: "white",
    textTransform: "capitalize",
    paddingLeft: 15,
    paddingRight: 15,
    [theme.breakpoints.down("xs")]: {
      width: 200
    }
  },
  alignCenter: {
    textAlign: "center",
    justifyContent: "center"
  },
  map: {
    marginLeft: "5%",
    marginRight: "5%",
    width: "60vw",
    height: "50vh",
    [theme.breakpoints.down("xs")]: {
      display: "none",
      width: 0,
      height: 0
    }
  },
  grayLine: {
    background: theme.palette.search.outline,
    height: "1px",
    border: "none"
  },
  error: {
    fontWeight: 500,
    textAlign: "center"
  }
})

export default function Upcoming({ isOwner }) {
  const token = Session.getToken("Wavetoken")
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr
  const { globalState, globalDispatch } = useContext(Context)

  const [openMap, setOpenMap] = useState(false)
  const [selectedVesselMap, setSelectedVesselMap] = useState()
  const [longitude, setLongitude] = useState()
  const [latitude, setLatitude] = useState()
  const [location, setLocation] = useState()
  const [open, setOpen] = React.useState(false)
  const [cancelTripId, setCancelTripId] = useState("")
  const [openCancelBooking, setOpenCancelBooking] = useState(false)
  const [upcomingList, setUpcomingList] = useState([])
  const [error, setError] = useState(null)
  const status = "UPCOMING"
  const SECRET_KEY = "mypassword"
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleCancelBooking = (tripId) => {
    setCancelTripId(tripId)
    setOpenCancelBooking(true)
  }

  const handleOpenMap = (id, item) => {
    setLongitude()
    setLatitude()
    setSelectedVesselMap(id)
    setLocation(item.vessel.vesselLocation)
    if (openMap === false) {
      setOpenMap(true)
    } else {
      setOpenMap(false)
    }
  }

  const decryptCode = (code) => {
    return CryptoJS.AES.decrypt(code, SECRET_KEY).toString(CryptoJS.enc.Utf8)
  }

  const handleStartTrip = (id, startCode, endCode) => {
    const descryptedStartCode = (startCode ? decryptCode(startCode) : "")
    const descryptedEndCode = (endCode ? decryptCode(endCode) : "")
    const codes = Session.getCode()
    codes.filter(code => code.tripId === id).length > 0 ? null : codes.push({ tripId: id, startCode: descryptedStartCode, endCode: descryptedEndCode })
    Session.setCode(codes)
    router.push(`${  id  }/predepartureChecklist/weather`)
  }

  function capitalize(str) {
    const lower = str.toLowerCase()
    return str.charAt(0).toUpperCase() + lower.slice(1)
  }

  const fetchUpcomingTrips = () => {
    const role = Session.getRole()
    API()
      .get(
        `trip/getTripsByStatus${capitalize(role)}/${status}`,
        {
          headers: {
            authorization: `Bearer ${  token}`
          }
        }
      )
      .then((response) => {
        console.log("trip response.data: ", response.data)
        setUpcomingList(response.data)
      })
      .catch((e) => {
        setError(e.response.data.message)
        console.log("Error is: ", e)
      })
  }

  const fullName = (person) => {
    return `${person?.firstName} ${person?.lastName}`
  }

  
  const onClickMessageGuest = (guestId) => {
    globalDispatch({ type: "SET_CONTACT_SELECTED", payload: guestId })
    router.push("/messages")
  }
  
  const onClickMessageOwner = (ownerId) => {
    globalDispatch({ type: "SET_CONTACT_SELECTED", payload: ownerId })
    router.push("/messages")
  }

  useEffect(() => {
    console.log("Location is: ", location)
    setLongitude(location?.longitude)
    setLatitude(location?.latitude)
  }, [openMap])

  useEffect(() => {
    setUpcomingList([])
    setError()
    fetchUpcomingTrips()
  }, [isOwner])

  return (
    <>
      <div style={{ marginTop: 50 }} />
      <Modal
        open={openCancelBooking}
        onClose={() => { setOpenCancelBooking(false), fetchUpcomingTrips() }}
        classNames={{
          modal: classes.customModal
        }}
        center
      >
        <CancelTrip closeModal={() => { setOpenCancelBooking(false), fetchUpcomingTrips() }} tripId={cancelTripId} />
      </Modal>

      {(upcomingList && upcomingList?.length !== 0) ? upcomingList?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map(item =>
        <div key={upcomingList.indexOf(item)} className={classes.root} style={{ display: "flex" }}>
          <Grid item xs={12} sm={openMap && selectedVesselMap === item._id ? 6 : 12}>
            <Paper className={classes.paper}>
              <Grid container spacing={2} style={{ justifyContent: "center" }}>
                <Grid item >
                  <VesselImageCard isOwner={isOwner} id={item?.vessel?._id} image={item?.vessel?.images?.[0]?.imageURL} vesselName={item?.vessel?.title} price={`$${item?.vessel?.vesselPricing?.perDay?.amount || 0}/day`} />
                </Grid>
                <Grid item xs={12} sm container>
                  <Grid item xs container direction='column' spacing={2}>
                    <Grid item xs style={{ minWidth: 300 }}>
                    <Typography
                        gutterBottom
                        variant='body2'
                        component='p'
                        className={classes.label}
                      >
                        <Grid item xs={4}>{t.tripsPage.tripId}</Grid><Grid item xs={8} style={{ fontWeight: 400 }}>{item._id}</Grid>
                      </Typography>
                      <Typography
                        gutterBottom
                        variant='body2'
                        component='p'
                        className={classes.label}
                      >
                        <Grid item xs={4}>{isOwner ? t.tripsPage.guest : t.tripsPage.owner} {t.tripsPage.detail}</Grid><Grid item xs={8} style={{ fontWeight: 400 }}>{!isOwner ? fullName(item.vesselOwner) : fullName(item.renter)}</Grid>
                      </Typography>
                      <Typography
                        gutterBottom
                        variant='body2'
                        component='p'
                        className={classes.label}
                      >
                        <Grid item xs={4}> # {t.tripsPage.ofGuests}</Grid><Grid item xs={8} style={{ fontWeight: 400 }}>{item.numberOfGuests}</Grid>
                      </Typography>
                      <Typography
                        gutterBottom
                        variant='body2'
                        component='p'
                        className={classes.label}
                      >
                        <Grid item xs={4}>{t.tripsPage.bookingDate}</Grid><Grid item xs={8} style={{ fontWeight: 400 }}>{moment(item.bookingStartDate).format("DD/MM/YYYY hh:mm a")} - {moment(item.bookingEndDate).format("DD/MM/YYYY hh:mm a")}</Grid>
                      </Typography>
                      <Typography
                        gutterBottom
                        variant='body2'
                        component='p'
                        className={classes.label}
                      >
                        <Grid item xs={4}>{t.tripsPage.price}</Grid><Grid item xs={8} style={{ fontWeight: 400 }}>${item.displayAmount.toFixed(2)}</Grid>
                      </Typography>
                      {isOwner && (
                          <Typography
                              gutterBottom
                              variant='body2'
                              component='p'
                              className={classes.label}
                          >
                            <Grid item xs={4}>{t.tripsPage.bookingNotes}</Grid><Grid item xs={8} style={{ fontWeight: 400 }}>{item?.bookingNotes && item?.bookingNotes !== "" ? item?.bookingNotes : "-"}</Grid>
                          </Typography>
                      )}
                    </Grid>
                    {!isOwner && <> <Grid item>
                      <Typography
                        variant='body2'
                        className={classes.link}
                        onClick={(new Date(item.bookingStartDate) - new Date()) / 3600000 > 24 ? () => { } : () => onClickMessageOwner(item.vesselOwner._id)}
                        disabled={(new Date(item.bookingStartDate) - new Date()) / 3600000 > 24} // disable if trip start time is more than 24 hours in the future
                        style={
                          (new Date(item.bookingStartDate) - new Date()) / 3600000 > 24 ?
                            {
                              color: theme.palette.text.grey,
                              cursor: "default"
                            }
                            :
                            {
                              color: theme.palette.buttonPrimary.main
                            }
                        }
                      >
                        <ChatIcon style={{ fontSize: 20, marginRight: 10 }} />
                        {t.tripsPage.messageVesselOwner}
                      </Typography>
                    </Grid>
                      <Grid item>
                        <Typography variant='body2' className={classes.link} onClick={() => handleOpenMap(item._id, item)}>
                          <LocationOnIcon style={{ fontSize: 20, marginRight: 10 }} />
                          {openMap && selectedVesselMap === item._id ? t.tripsPage.closeMap : t.tripsPage.vesselLocation}
                        </Typography>
                      </Grid></>}

                    {isOwner && <Grid item>
                      <hr className={classes.grayLine} />
                      <Typography variant='body2' style={{ textAlign: "center", fontWeight: 500 }}>
                        {t.tripsPage.verificationCode}<br /> <span style={{ fontSize: 24 }}>{item.startVerificationCode ? decryptCode(item.startVerificationCode) : null}</span>
                      </Typography>
                      <hr className={classes.grayLine} />
                    </Grid>}

                    {/* info icon */}
                    <Modal
                      open={open}
                      onClose={() => handleClose()}
                      classNames={{
                        modal: classes.customModal
                      }}
                      center
                    >
                      <CancellationPolicy />
                    </Modal>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} className={classes.alignCenter}>
                        {isOwner ? <Button
                          size='small'
                          onClick={() => onClickMessageGuest(item.renter._id)}
                          style={{
                            color: (new Date(item.bookingStartDate) - new Date()) / 3600000 > 24 ? theme.palette.text.grey : theme.palette.buttonPrimary.main,
                            textTransform: "capitalize"
                          }}
                          disabled={(new Date(item.bookingStartDate) - new Date()) / 3600000 > 24} // disable if trip start time is more than 24 hours in the future
                        >
                          {t.tripsPage.message} {t.tripsPage.guest}
                        </Button> : <Button
                          size='small'
                          className={(new Date(item.bookingStartDate) - new Date()) / 3600000 > 2 ? classes.disabledStartButton : classes.startButton}
                          onClick={() => handleStartTrip(item._id, item.startVerificationCode, item.endVerificationCode)}
                          disabled={(new Date(item.bookingStartDate) - new Date()) / 3600000 > 2} // disable if trip start time is more than 2 hours in the future
                        >
                          {t.tripsPage.startTrip}
                        </Button>}
                      </Grid>
                      <Grid item xs={12} sm={6} style={{ display: "flex" }} className={classes.alignCenter}>
                        <InfoIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => handleOpen()}
                        />
                        <Button
                          size='small'
                          onClick={() => handleCancelBooking(item._id)}
                          style={{
                            color: theme.palette.background.flamingo,
                            textTransform: "capitalize"
                          }}
                        >
                          {t.tripsPage.cancel}
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          {selectedVesselMap && selectedVesselMap === item._id && <Grid item sm={6} className={classes.map} style={{ display: openMap ? "inline" : "none" }}>
             <Map
                locationData={[
                  [
                    latitude || 0,
                    longitude || 0
                  ]
                ]}
                center={{
                  lat: latitude || 0,
                  lng: longitude || 0
                }}
              />
          </Grid>}

        </div>) : <Typography component="h6" className={classes.error}>You have no trips found.</Typography>}
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          className={classes.paper}
          component="div"
          count={upcomingList?.length || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t.tripsPage.tripsPerPage}
    />
    </>
  )
}
