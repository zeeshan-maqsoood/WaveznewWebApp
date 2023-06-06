import React, { useContext, useEffect, useState, useRef } from "react"
import Session from "../../sessionService"
import NavBar from "../../components/navbar/navBar"
import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  CardMedia
} from "@material-ui/core"
import moment from "moment"
import MenuItem from "@material-ui/core/MenuItem"
import Avatar from "@material-ui/core/Avatar"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import Link from "@material-ui/core/Link"
import API from "../../pages/api/baseApiIinstance"
import { Modal } from "react-responsive-modal"
import { makeStyles } from "@material-ui/core/styles"
import BillingAddress from "../../components/accountInfo/billingAddress"
import DisplaySavedCard from "../../components/accountInfo/displaySavedCard"
import CancellationPolicy from "../../components/booking/cancellationPolicy"
import PaymentSection from "../../components/booking/paymentSection"

// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import PaymentInfo from "../../components/accountInfo/paymentInfo"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import BookingBanner from "../../components/booking/bookingBanner"
import theme from "../../src/theme"
const stripePromise = loadStripe(process.env.STRIPE_SECRET_KEY)

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  text: {
    fontFamily: "Roboto",
    fontWeight: 400,
    marginTop: "10px"
  },
  messagePaper: {
    padding: theme.spacing(2),
    marginLeft: "30px",
    marginBottom:'10px',
    background: theme.palette.background.bookingBackground,
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0
    }
  },
  pricingPaper: {
    padding: theme.spacing(2),
    background: theme.palette.background.bookingBackground,
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    }
  },
  cancellationSec: {
    marginLeft: "30px",
    marginTop: "30px",
    width:'100%',
    marginBottom: 0,
    [theme.breakpoints.down("xs")]: {
      width: "95%",
      marginTop:'10px',
      margin:"auto"
    }
  },
  cancellationPaper: {
    padding: theme.spacing(2),
    background: theme.palette.background.lightGrey,
    marginLeft: "30px",
    marginTop: "30px",
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      width: "98%",
      marginTop:'10px',
      margin:"auto"
    }
  },
  datePickerInput: {
    width: "100%",
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "Roboto",
    marginLeft: "10px",
    marginBottom: "10px",
    [theme.breakpoints.down("xs")]: {
      marginLeft: "10px"
    }
  },
  header: {
    marginTop: "24px",
    marginLeft: "70px",
    [theme.breakpoints.down("xs")]: {
      marginLeft: "20px"
    }
  },
  messageBox: {
    width: "95%",
    marginLeft: "15px",
    marginTop: "10px",
    marginBottom: "10px",
    background: theme.palette.background.default
  },
  bookingBtn: {
    width: "263px",
    height: "45px",
    radius: "10px",
    marginBottom: "30px",
    marginTop: "20px",
    color: theme.palette.background.default,
    backgroundColor: theme.palette.buttonPrimary.main,
    marginLeft: "70px",
    [theme.breakpoints.down("xs")]: {
      marginTop: "20px",
      marginLeft: "30px"
    }
  },
   booking_btn_div: {
   marginRight:'inherit',
    [theme.breakpoints.down("xs")]: {

    }
  },
  boatImage: {
    borderRadius: "10px"
  },
  customModal: {
    width: "600px",
    borderRadius: 10,
    position: "center",
    left: "0%",


    [theme.breakpoints.down("xs")]: {
      margin: "auto",
      width: "95%",
      position: "center"
    }
  }
}))

export default function Booking() {
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr
  const token = Session.getToken("WaveToken")
  const [messageField, setMessageField] = useState("")
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [guest, setGuest] = useState()
  const [existingCard, setExistingCard] = useState(false)

  const [selectedStart, setSelectedStart] = useState(
    moment(new Date()).set({ hour: 0, minute: 0 }).toDate()
  )
  const [selectedEnd, setSelectedEnd] = useState(
    moment(new Date()).set({ hour: 0, minute: 0 }).toDate()
  )

  const guestDropDown = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const [open, setOpen] = React.useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (token !== "") {
      console.log("calling Get Saved Card Api")
      API()
        .get("users/savedPaymentMethods", {
          headers: {
            authorization: `Bearer ${  token}`
          }
        })
        .then((response) => {
          if (response.data.paymentMethods.length !== 0) {
            setExistingCard(true)
          }
        })
    }
  }, [])

  return (
    <>
      <NavBar />
      <Grid style={{ margin: 'auto' }} item className={classes.header}>
        <BookingBanner />
      </Grid>
      <div className={classes.root}>
        <Grid
          container
          spacing={0.5}
          style={{ justifyContent: 'space-around', paddingTop: '10px' }}
        >
          {/* Message To Host */}
          <Grid item xs={12} sm={8}>
            <Paper className={classes.messagePaper}>
              <Typography
                className={classes.text}
                style={{ fontSize: '24px', marginLeft: '20px' }}
              >
                {t.listingInfo.messageToHost}
              </Typography>
              <Typography
                className={classes.text}
                style={{
                  fontSize: '14px',
                  color: '#4F4F4F',
                  marginLeft: '20px'
                }}
              >
                {t.listingInfo.subTextInMessage}
              </Typography>

              <List className={classes.root}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/1.jpg"
                    />
                  </ListItemAvatar>
                  <ListItemText style={{ marginTop: '15px' }} primary="Alex" />
                </ListItem>
              </List>

              {/* Text Field */}
              <TextField
                inputProps={{ 'data-testid': 'messageBox' }}
                className={classes.messageBox}
                multiline
                rows={4}
                value={messageField}
                onChange={(event) => setMessageField(event.target.value)}
                variant="outlined"
              />
            </Paper>
            <Paper className={classes.messagePaper}>
              {!existingCard ? (
                <Elements stripe={stripePromise}>
                  <PaymentInfo />
                  <BillingAddress />
                </Elements>
              ) : (
                <DisplaySavedCard />
              )}
              {/*<hr/>*/}
              {/*<PaymentSection/>*/}
            </Paper>
            {/* Cancellation Policy Modal */}
            <div className={classes.cancellationSec}>
              <Link
                legacybehavior
                style={{
                  textDecoration: 'underline',
                  fontSize: '18px',
                  marginLeft: '30px'
                }}
              >
                <a onClick={handleOpen}>Cancellation Policy</a>
              </Link>
              <Modal
                center={true}
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                classNames={{
                  modal: classes.customModal
                }}
              >
                <CancellationPolicy />
              </Modal>
            </div>
            {/* cancellation Gird */}
            <Grid item xs={12} sm={12}>
              <Paper className={classes.cancellationPaper}>
                <p
                  style={{
                    fontFamily: 'Roboto',
                    fontSize: '14px',
                    fontWeight: 500
                  }}
                >
                  {t.listingInfo.cancellationPaperLine1}
                </p>
                <p style={{ fontFamily: 'Roboto', fontSize: '14px' }}>
                  {t.listingInfo.cancellationPaperLine2}
                </p>
              </Paper>
            </Grid>
          </Grid>
          {/* Pricing Details */}
          <Grid item xs={12} sm={3}>
            <Paper className={classes.pricingPaper}>
              <CardMedia
                className={classes.boatImage}
                component="img"
                alt="boatImg"
                height="170"
                image={'https://picsum.photos/200/300'}
                title="boat image"
              />
              <div
                style={{
                  borderBottom: '1px solid rgb(221, 221, 221)',
                  marginTop: '30px',
                  width: '100%'
                }}
              />
              <div className={classes.datePickerInput}>
                <Typography className={classes.text}>Start Date</Typography>
                <form>
                  <TextField
                    type="datetime-local"
                    value={moment(selectedStart).format('YYYY-MM-DDTHH:mm')}
                    format="MM-dd-yyyy"
                    variant="outlined"
                    size="small"
                    defaultValue={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    style={{
                      width: '90%',
                      height: '38px',
                      borderRadius: '4px',
                      backgroundColor: theme.palette.background.default
                    }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </form>
              </div>
              {/* End picker */}
              <div className={classes.datePickerInput}>
                <Typography className={classes.text}>End Date</Typography>
                <TextField
                  type="datetime-local"
                  value={moment(selectedEnd).format('YYYY-MM-DDTHH:mm')}
                  format="yyyy-MM-dd HH:mm:ss"
                  variant="outlined"
                  size="small"
                  defaultValue={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  style={{
                    width: '90%',
                    height: '38px',
                    borderRadius: '4px',
                    backgroundColor: '#FFFFFF'
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </div>
              {/* Guest */}
              <div className={classes.datePickerInput}>
                <Typography className={classes.text}>Guest</Typography>
                <TextField
                  select
                  label=""
                  value={guest}
                  onChange={(event) => setGuest(event.target.value)}
                  variant="outlined"
                  size="small"
                  style={{
                    width: '90%',
                    height: '38px',
                    borderRadius: '4px',
                    backgroundColor: '#FFFFFF'
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                >
                  {guestDropDown.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div
                style={{
                  borderBottom: '1px solid rgb(221, 221, 221)',
                  marginTop: '30px',
                  width: '100%'
                }}
              />
              {/* Payment Section */}
              <div className={classes.datePickerInput}>
                <Typography className={classes.text}>
                  {t.listingInfo.priceDetails}
                </Typography>
                <div style={{ display: 'flex' }}>
                  <p
                    style={{
                      textDecorationLine: 'underline',
                      textAlign: 'left',
                      paddingLeft: '5px',
                      marginRight: '15%'
                    }}
                  >
                    10hour x 80
                  </p>
                  <p style={{ marginLeft: '30%' }}>$800</p>
                </div>
                <div style={{ display: 'flex' }}>
                  <p
                    style={{
                      textDecorationLine: 'underline',
                      textAlign: 'left',
                      paddingLeft: '5px',
                      marginRight: '20%'
                    }}
                  >
                    Service fee
                  </p>
                  <p style={{ marginLeft: '30%' }}>$50</p>
                </div>
                <div style={{ display: 'flex' }}>
                  <p
                    style={{
                      textAlign: 'left',
                      paddingLeft: '5px',
                      marginRight: '30%',
                      fontWeight: 400,
                      fontSize: 16,
                      fontFamily: 'Roboto'
                    }}
                  >
                    Total
                  </p>
                  <p
                    style={{
                      marginLeft: '25%',
                      textAlign: 'center',
                      fontWeight: 400,
                      fontSize: 16,
                      fontFamily: 'Roboto'
                    }}
                  >
                    $950
                  </p>
                </div>
              </div>
              {/*<PaymentSection/>*/}
            </Paper>
          </Grid>
        </Grid>

        {/*Button section*/}
        <div className={classes.booking_btn_div}>
          <Button variant="contained" className={classes.bookingBtn}>
            {t.listingInfo.bookingBtn}
          </Button>
        </div>
      </div>
    </>
  )
}
