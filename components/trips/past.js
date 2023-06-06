import React, { Component, useState, useEffect, useContext } from "react"
import { makeStyles } from "@material-ui/core/styles"
import {Paper, Typography, Grid, Button} from "@material-ui/core"
import Session from "../../sessionService"
import theme from "../../src/theme"
import TablePagination from "@material-ui/core/TablePagination"
import ReviewModal from "./reviewModal"
import moment from "moment"
import API from "../../pages/api/baseApiIinstance"
import VesselImageCard from "./vesselImageCard"
import InfoIcon from "@material-ui/icons/InfoOutlined"
import CancellationPolicy from "./cancellationPolicy"
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import { Modal } from "react-responsive-modal"
import MessageIcon from "@material-ui/icons/Message"

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
  openCalendar: {
    margin: 10
  },
  link: {
    marginBottom: 10,
    color: theme.palette.buttonPrimary.main,
    cursor: "pointer",
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
  error: {
    fontWeight: 500,
    textAlign: "center"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    color: theme.palette.buttonPrimary.main,
    textTransform: "capitalize",
    width: "100%",
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    height: "60px"
  }
})

export default function Past({ isOwner }) {
  const token = Session.getToken("Wavetoken")
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr
  const [open, setOpen] = useState(false)
  const [pastList, setPastList] = useState([])
  const status = "PAST"
  let role = "renter"
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selectedReview, setSelectedReview] = useState({})
  const [openCancelPolicy, setOpenCancelPolicy] = useState(false)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleOpenReview = (item) => {
    setOpen(true)
    setSelectedReview(item)
  }

  const handleCloseReview = () => {
    setOpen(false)
  }

  const splitString = (str) => {
    return str.match(/[A-Z][a-z]+|[0-9]+/g).join(" ")
  }

  const handleOpenSupport = () => {
    router.push("/doc/contactUs")
  }

  function capitalize(str) {
    if (str !== "" && str !== null && str !== undefined) {
      const lower = str.toLowerCase()
      return str.charAt(0).toUpperCase() + lower.slice(1)
    }
  }

  const fullName = (person) => {
    return `${person?.firstName} ${person?.lastName}`
  }

  const fetchPastTrips = () => {
    role = Session.getRole()
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
        setPastList(response.data)
      })
      .catch((e) => {
        setError(e.response.data.message)
        console.log("Error is: ", e)
      })
  }

  const redirectToContactUsPage = () => {
    router.push("/doc/contactUs")
  }

  useEffect(() => {
    setPastList([])
    setError(null)
    fetchPastTrips()
  }, [isOwner])

  useEffect(() => {
    role = Session.getRole()
  }, [])

  return (
    <>
      <div style={{ marginTop: 50 }} />
      <Modal
        open={openCancelPolicy}
        onClose={() => setOpenCancelPolicy(false)}
        classNames={{
          modal: classes.customModal
        }}
        center
      >
        <CancellationPolicy />
      </Modal>
      <Modal
        open={open}
        onClose={handleCloseReview}
        classNames={{
          modal: classes.customModal
        }}
        center
      >
        <ReviewModal reviewItem={selectedReview} close={handleCloseReview} fetchPastTrips={() => fetchPastTrips()} />
      </Modal>
      <Typography component='h6' className={classes.error}>
        {error}
      </Typography>
      {(pastList && pastList?.length !== 0) ?
        pastList
          ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((item) => (
            <div className={classes.root}>
              <Paper className={classes.paper}>
                <Grid
                  container
                  spacing={2}
                  style={{ justifyContent: "center" }}
                >
                  <Grid item>
                    <VesselImageCard
                      isOwner={isOwner}
                      id={item?.vessel?._id}
                      image={item?.vessel?.images?.[0]?.imageURL}
                      vesselName={item?.vessel?.title}
                      price={`$${
                        item?.vessel?.vesselPricing?.perDay?.amount || 0
                      }/day`}
                    />
                  </Grid>
                  <Grid item xs={12} sm container>
                    <Grid item xs container direction='column' spacing={2}>
                      <Grid item xs style={{ minWidth: 320 }}>
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
                          <Grid item xs={4}>
                            {isOwner ? t.tripsPage.guest : t.tripsPage.owner}{" "}
                            {t.tripsPage.detail}
                          </Grid>
                          <Grid item xs={8} style={{ fontWeight: 400 }}>
                            {!isOwner
                              ? fullName(item.vesselOwner)
                              : fullName(item.renter)}
                          </Grid>
                        </Typography>
                        <Typography
                          gutterBottom
                          variant='body2'
                          component='p'
                          className={classes.label}
                        >
                          <Grid item xs={4}>
                            {" "}
                            # {t.tripsPage.ofGuests}
                          </Grid>
                          <Grid item xs={8} style={{ fontWeight: 400 }}>
                            {item.numberOfGuests}
                          </Grid>
                        </Typography>
                        <Typography
                          gutterBottom
                          variant='body2'
                          component='p'
                          className={classes.label}
                        >
                          <Grid item xs={4}>
                            {t.tripsPage.bookingDate}
                          </Grid>
                          <Grid item xs={8} style={{ fontWeight: 400 }}>
                            {moment(item.bookingStartDate).format("DD/MM/YYYY hh:mm a")}{" "}
                            - {moment(item.bookingEndDate).format("DD/MM/YYYY hh:mm a")}
                          </Grid>
                        </Typography>
                        <Typography
                          gutterBottom
                          variant='body2'
                          component='p'
                          className={classes.label}
                        >
                          <Grid item xs={4}>
                            {t.tripsPage.price}
                          </Grid>
                          <Grid item xs={8} style={{ fontWeight: 400 }}>
                            ${item.displayAmount.toFixed(2)}
                          </Grid>
                        </Typography>
                        {role !== "renter" && (
                            <Typography
                                gutterBottom
                                variant='body2'
                                component='p'
                                className={classes.label}
                            >
                              <Grid item xs={4}>{t.tripsPage.bookingNotes}</Grid><Grid item xs={8} style={{ fontWeight: 400 }}>{item?.bookingNotes}</Grid>
                            </Typography>
                        )}
                        <Typography
                          gutterBottom
                          variant='body2'
                          component='p'
                          className={classes.label}
                        >
                          <Grid item xs={4}>
                            {t.tripsPage.status}
                          </Grid>
                          <Grid
                            item
                            xs={8}
                            style={{
                              display:"flex",
                              fontWeight: 400,
                              color:
                                item.tripStatus !== "CANCELLED"
                                  ? theme.palette.background.seaGreen
                                  : theme.palette.background.flamingo
                            }}
                          >
                            {item.tripStatus === "CANCELLED"? <InfoIcon style={{ cursor: "pointer", fontSize: 18, color: theme.palette.text.black, marginRight: 5 }} onClick={() => setOpenCancelPolicy(true)} /> : null}
                            {capitalize(item.tripStatus)}{" "}
                            {item?.refundStatus
                              ? <span style={{color: theme.palette.text.black}}>&nbsp;-&nbsp;{splitString(item.refundStatus)}</span>
                              : null}
                          </Grid>
                        </Typography>
                      </Grid>
                      {/* if status is completed */}
                      {!isOwner && !item.reviewed &&
                      <Grid item>
                        {item.refundStatus !== "RefundFailed" ? (
                          <Typography
                            variant='body2'
                            className={classes.link}
                            onClick={() => handleOpenReview(item)}
                          >
                            {t.tripsPage.writeAReview}
                          </Typography>
                        ) : (
                          <Typography
                            variant='body2'
                            className={classes.link}
                            onClick={handleOpenSupport}
                          >
                            {t.tripsPage.contactWavez}
                          </Typography>
                        )}
                      </Grid>}
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </div>
          )) : <Typography component="h6" className={classes.error}>You have no trips found.</Typography>}
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        className={classes.paper}
        component='div'
        count={pastList?.length || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t.tripsPage.tripsPerPage}
      />
    </>
  )
}
