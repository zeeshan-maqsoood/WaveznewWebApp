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
import API from "../../pages/api/baseApiIinstance"
import { Modal } from "react-responsive-modal"
import RejectOffer from "./rejectOffer"
import CancelTrip from "./cancelTrip"
import CancelOffer from "./cancelOffer"
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import VesselImageCard from "./vesselImageCard"
import moment from "moment"

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
    color: "#4D96FB",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline"
    },
    [theme.breakpoints.down("xs")]: {
      textAlign: "center"
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
  alignCenter: {
    textAlign: "center",
    justifyContent: "center"
  },
  error: {
    fontWeight: 500,
    textAlign: "center"
  },
  customModal: {
    paddingLeft: '20px',
    paddingRight: '20px',
    width: "85%",
    maxWidth: '616px',
    borderRadius: 10
  }
})

export default function Offers({isOwner}) {
  const token = Session.getToken("Wavetoken")
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr
  const [offerList, setOfferList] = useState([])
  const [error, setError] = useState(null)
  const status = "OFFER"
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [rejectSelected, setRejectSelected] = useState(false)
  const [rejectTripId, setRejectTripId] = useState("")
  const [isMounted, setIsMounted] = useState(true)
  const [cancelTripId, setCancelTripId] = useState("")

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  function capitalize(str) {
    const lower = str.toLowerCase()
    return str.charAt(0).toUpperCase() + lower.slice(1)
  }

  const fetchOfferTrips = () => {
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
        const sortedTrips = response.data.sort((a, b) =>
          new Date(b.bookingDate) - new Date(a.bookingDate)
        )
        setOfferList(sortedTrips)
      })
      .catch((e) => {
        setError(e.response.data.message)
        if (e.response.status === 404) {
          setOfferList([])
        }
      })
  }

  const onClickAcceptOffer = (tripId) => {
    console.log("accepting offer for trip: ", tripId)
    const body = {
      tripId
    }
    API()
      .put("trip/acceptOffer", body, {
        headers: {
          authorization: `Bearer ${  token}`
        }
      })
      .then((response) => {
        console.log("response is ", response)
        if (response.status = 200) {
          fetchOfferTrips()
        }
      })
      .catch((e) => {
        // router.push("/somethingWentWrong");
      })
  }

  const onClickReject = (tripId) => {
    setRejectTripId(tripId)
    setRejectSelected(true)
  }

  const onClickCancel = (tripId) => {
    setCancelTripId(tripId)
  }

  useEffect(() => {
    setOfferList([])
    setError(null)
    if (isMounted) {
      fetchOfferTrips()
    }
  }, [isOwner, isMounted])

  useEffect(() => {
    console.log("offerList: ", offerList)
  }, [offerList])

  return (
    <>
      <Modal
        open={rejectSelected}
        onClose={() => setRejectSelected(false)}
        classNames={{
          modal: classes.customModal
        }}
        center
      >
        <RejectOffer closeModal={() => setRejectSelected(false)} fetchOfferTrips={() => fetchOfferTrips()} tripId={rejectTripId} />
      </Modal>
      <Modal
        open={cancelTripId}
        onClose={() => setCancelTripId("")}
        classNames={{
          modal: classes.customModal
        }}
        center
      >
        <CancelOffer closeModal={() => setCancelTripId("")} tripId={cancelTripId} fetchOfferTrips={() => fetchOfferTrips()} />
      </Modal>
      <div style={{ marginTop: 50 }} />
      <Typography component="h6" className={classes.error}>{error}</Typography>
      {(offerList && offerList?.length !== 0) ? offerList?.map(item =>
        (!item.rejectedByVesselOwner || !isOwner ?
        (<div key={offerList.indexOf(item)} className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container spacing={2} style={{ justifyContent: "center" }}>
            <Grid item>
              <VesselImageCard isOwner={isOwner} id={item?.vessel?._id} image={item?.vessel?.images[0].imageURL} vesselName={item?.vessel?.title} price={`$${item?.vessel?.vesselPricing?.perDay?.amount || 0}/day`} />
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container spacing={2}>
                <Grid item xs style={{ minWidth: 300 }}>
                  <Typography
                    gutterBottom
                    variant='body2'
                    component='div'
                    className={classes.label}
                  >
                    <Grid item xs={4}>{isOwner && t.tripsPage.guest}{!isOwner && t.tripsPage.owner} {t.tripsPage.detail} </Grid><Grid item xs={8} style={{ fontWeight: 400 }}>{isOwner && `${item.renter.firstName  } ${  item.renter.lastName}`}{!isOwner && `${item.vesselOwner.firstName  } ${  item.vesselOwner.lastName}`}</Grid>
                  </Typography>
                  <Typography
                    gutterBottom
                    variant='body2'
                    component='p'
                    className={classes.label}
                  >
                    <Grid item xs={4}> # {t.tripsPage.ofGuests} </Grid><Grid item xs={8} style={{ fontWeight: 400 }}>{item.numberOfGuests}</Grid>
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
                  {!isOwner &&
                  <Typography
                    gutterBottom
                    variant='body2'
                    component='p'
                    className={classes.label}
                  >
                    <Grid item xs={4}>{t.tripsPage.status}</Grid><Grid item xs={8} style={item.rejectedByVesselOwner ? { fontWeight: 400, color: theme.palette.error.main } : { fontWeight: 400, color: theme.palette.background.orange }}>{item.rejectedByVesselOwner === true ? t.tripsPage.declined : t.tripsPage.pending}</Grid>
                  </Typography>}
                </Grid>

                {isOwner ?
                (<Grid container item spacing={2}>
                  <Grid item xs={12} sm={6} className={classes.alignCenter}>
                    <Button size='small' className={classes.startButton} onClick={() => onClickAcceptOffer(item._id)}>
                      {t.tripsPage.accept}
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    className={classes.alignCenter}
                  >
                    <Button
                      size='small'
                      style={{
                        color: theme.palette.background.flamingo,
                        textTransform: "capitalize"
                      }}
                      onClick={() => onClickReject(item._id)}
                    >
                      {t.tripsPage.reject}
                    </Button>
                  </Grid>
                </Grid>)
                : 
                (<Grid container item spacing={2}>
                  <Grid
                    item
                    xs={12}
                    className={classes.alignCenter}
                  >
                    <Button
                      size='small'
                      style={item.rejectedByVesselOwner ? {display: "hidden", visibility: "hidden", width: "144px"}
                      : {
                        color: theme.palette.background.flamingo,
                        textTransform: "capitalize", 
                        width: "144px"
                      }}
                      onClick={item.rejectedByVesselOwner ? () => {} : () => onClickCancel(item._id)}
                    >
                      {t.tripsPage.cancel}
                    </Button>
                  </Grid>
                </Grid>)
                }
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>)
      : (<></>))
      ) : <Typography component="h6" className={classes.error}>You have no trips found.</Typography>}
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        className={classes.paper}
        component="div"
        count={offerList?.length || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t.tripsPage.tripsPerPage}
      />
    </>
  )
}
