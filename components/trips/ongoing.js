import React, { Component, useState, useEffect, useContext } from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  Paper,
  Box,
  Typography,
  Grid
} from "@material-ui/core"
import Session from "../../sessionService"
import theme from "../../src/theme"
import ChatIcon from "@material-ui/icons/Chat"
import TablePagination from '@material-ui/core/TablePagination'
import API from "../../pages/api/baseApiIinstance"
import VesselImageCard from "./vesselImageCard"
import moment from "moment"
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
    marginBottom: 10,
    color: theme.palette.buttonPrimary.main,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    "&:hover": {
      textDecoration: "underline"
    },
    [theme.breakpoints.down("xs")]: {
      textAlign: "center",
      justifyContent: "center"
    }
  },
  error: {
    fontWeight: 500,
    textAlign: "center"
  }
})

export default function Ongoing({ isOwner }) {
  const token = Session.getToken("Wavetoken")
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr
  const [ongoingList, setOnGoingList] = useState([])
  const status = "ONGOING"
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const { globalState, globalDispatch } = useContext(Context)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const onClickMessageGuest = (guestId) => {
    globalDispatch({ type: "SET_CONTACT_SELECTED", payload: guestId })
    router.push("/messages")
  }
  
  const onClickMessageOwner = (ownerId) => {
    globalDispatch({ type: "SET_CONTACT_SELECTED", payload: ownerId })
    router.push("/messages")
  }

  const handleEndTrip = (tripId, renterId, vesselOwnerId) => {
    API()
      .get("users/getUserDetails", {
        headers: {
          authorization: `Bearer ${  token}`
        }
      })
      .then((response) => {
        if (response.status === 200) {
          response.data._id === renterId
            ? router.push(`/trips/${  tripId  }/postdepartureChecklist`)
            : (response.data._id === vesselOwnerId) && router.push(`/trips/${  tripId  }/ownerPostdepartureChecklist`)
        }
      })
      .catch((e) => {
        // router.push("/somethingWentWrong")
      })
  }

  function capitalize(str) {
    const lower = str.toLowerCase()
    return str.charAt(0).toUpperCase() + lower.slice(1)
  }

  const fullName = (person) => {
    return `${person?.firstName} ${person?.lastName}`
  }

  const fetchOngoingTrips = () => {
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
        setOnGoingList(response.data)
      })
      .catch((e) => {
        setError(e.response.data.message)
        console.log("Error is: ", e)
      })
  }

  useEffect(() => {
    setOnGoingList([])
    setError(null)
    fetchOngoingTrips()
  }, [isOwner])

  return (
    <>
      <div style={{ marginTop: 50 }} />
      <Typography component="h6" className={classes.error}>{error}</Typography>
      {(ongoingList && ongoingList?.length !== 0) ? ongoingList?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map(item => <div className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container spacing={2} style={{ justifyContent: "center" }}>
            <Grid item>
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
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={9}>
                    <Typography variant='body2' className={classes.link} onClick={!isOwner ? () => onClickMessageOwner(item.vesselOwner._id) : () => onClickMessageGuest(item.renter._id)}>
                      <ChatIcon style={{ fontSize: 20, marginRight: 10 }} />
                      {isOwner ? `${t.tripsPage.message} ${t.tripsPage.guest}` : t.tripsPage.messageVesselOwner}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3} className={classes.link} style={{ color: theme.palette.background.flamingo }} onClick={() => handleEndTrip(item._id, item.renter, item.vesselOwner)}>{t.tripsPage.endtrip}</Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>) : <Typography component="h6" className={classes.error}>You have no trips found.</Typography>}
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        className={classes.paper}
        component="div"
        count={ongoingList?.length || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t.tripsPage.tripsPerPage}
    />              
    </>
  )
}
