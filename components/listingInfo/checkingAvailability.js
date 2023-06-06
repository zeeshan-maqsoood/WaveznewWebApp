import React, { useContext, useEffect, useState, useRef } from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog
} from "@material-ui/core"
import moment from "moment"
import { Modal } from "react-responsive-modal"
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import FormHelperText from "@material-ui/core/FormHelperText"
import LoginPrompt from "../../components/addList/loginPrompt"
import Login from "../../components/login/login"
import API from "../../pages/api/baseApiIinstance"
import Session from "../../sessionService"
import theme from "../../src/theme"
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
//react date time
import "react-datetime/css/react-datetime.css"
import Datetime from "react-datetime"
import CloseIcon from "@material-ui/icons/Close"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  reservationPaper: {
    marginTop: "60px",
    padding: 35,
    textAlign: "center",
    color: theme.palette.text.secondary,
    maxWidth: 400,
    borderRadius: "5%",
    [theme.breakpoints.down("sm")]: {
      marginTop: 0,
      width: "auto"
    }
  },
  datePickerInput: {
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "Roboto",
    marginLeft: "10px",
    marginBottom: "10px"
  },
  text: {
    fontWeight: 500,
    fontSize: 16,
    fontFamily: "Roboto",
    color: theme.palette.text.black,
    width: "100px",
    height: "25px",
    marginBottom: "5px",
    marginTop: "15px",
    textAlign: "left"
  },
  availabilityBtn: {
    width: "auto",
    height: "45px",
    borderRadius: "10px",
    marginTop: "30px",
    color: theme.palette.background.default,
    backgroundColor: theme.palette.buttonPrimary.main,
    [theme.breakpoints.down("xs")]: {
      width: 200
    }
  },
  subTotal: {
   padding: 5
  },
  input: {
    width: "-webkit-fill-available",
    height: "38px",
    borderRadius: "4px",
    itemAign: "left"
  },
  datetime: {
    display: "block",
    padding: 10,
    width: "100%",
    height:  "calc(1.5em + 0.75rem + 2px)",
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: 1.5,
    color: theme.palette.text.black,
    background: "white",
    border: `1px solid${  theme.palette.background.lightGrey}`,
    borderRadius: "0.25rem",
    transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
    '&:focus': {
      border: theme.palette.primary.main,
      outline: 0,
      boxShadow: "0 0 0 0.2rem rgb(0 123 255 / 25%)"
    }
  },
  line: {
    textAlign: "left",
    padding: 5,
    marginRight: "20%",
    fontWeight: 400,
    fontSize: 16,
    fontFamily: "Roboto",
    color: theme.palette.text.black
  },
  flexDisplay: {
    display: "flex"
  }
}))

export default function CheckingAvailability({ vesselId, pricing, maxGuest }) {
  const classes = useStyles()
  const router = useRouter()
  const token = Session.getToken("Wavetoken")
  const { locale } = router
  const t = locale === "en" ? en : fr
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [guest, setGuest] = useState("")
  const [startDateIsValid, setStartDateIsValid] = useState("")
  const [endDateIsValid, setEndDateIsValid] = useState("")
  const [guestIsValid, setGuestIsValid] = useState("")
  const [expandingPricing, setExpandingPricing] = useState(false)
  const [bookedMessage, setBookedMessage] = useState("")
  const [pricingObject, setPricingObject] = useState()
  const [login, setLogin] = useState(false)
  const [loginPrompt, setLoginPrompt] = useState(false)
  const [pricingSection, setPricingSection]= useState()
  const [isExpandingPrice, setIsExpandingPrice] =useState(false)
  const [showVerificationDialog, setShowVerificationDialog] =useState(false)
  const [verificationDialogMessage, setVerificationDialogMessage] =useState("")
  const [verificationDialogTitleMessage, setVerificationDialogTitleMessage] =useState("")
  const [verificationDialogButtonText, setVerificationDialogButtonText] =useState("")

  const onClosePrompt = () => {
    setLoginPrompt(false)
  }
  const onCloseModal = (closeState) => {
    setCloseState(closeState)
  }

  const validate = (values) => {
    let returnValue = true
    if (!values.start) {
      returnValue = false
      setStartDateIsValid("Please provide start sate.")
    }
    if (moment(values.start).diff(moment().add(24, 'hours')) < 0) {
      returnValue = false
      setStartDateIsValid("Please provide start date after 24 hours from now.")
    }
    if (!values.end) {
      returnValue = false
      setEndDateIsValid("Please provide end date")
    }
    if (moment(values.end).diff(moment(values.start)) < 0) {
      returnValue = false
      setEndDateIsValid("Please provide valid end date")
    }
    if (moment(values.end).diff(moment().add(24, 'hours')) < 0) {
      returnValue = false
      setEndDateIsValid("Please provide end date after 24 hours from now.")
    }
    if (!values.numberOfGuests) {
      returnValue = false
      setGuestIsValid("Please provide no of guests")
    }
    // if (values.numberOfGuests <=0 || values.numberOfGuests > 12) {
    //   returnValue = false;
    //   setGuestIsValid("Please provide no of guests.");
    // }
    if (values.numberOfGuests > maxGuest) {
      returnValue = false
      setGuestIsValid(`Maximum guest is ${maxGuest}`)
    }
    return returnValue
  }

  // navigating reserve section
  const checkAvailability = () => {
    //calculateTime();
    const postRequest = {
      vesselId,
      start: startDate,
      end: endDate,
      numberOfGuests: guest
    }

    if (validate(postRequest) === true) {
      API()
        .post(`event/checkAvailability`, postRequest)
        .then((response) => {
          if (response.status === 200) {
            console.log("Post check avalability ", response.data)
            if (response.data.isBooked === false) {             
              setPricingObject(response.data.pricingDetails)
              setExpandingPricing(true)
              setBookedMessage("")
            } else {
              setBookedMessage("The vessel cannot be booked in this selected time period. Please choose different date and time")
            }
          }
        })
        .catch((e) => {
          console.log("Error from get information files is: ", e.response)          
          setBookedMessage(e.response.data.message)
          setExpandingPricing(false)
        })
    }
  }

  const reserve = () => {
    console.log("Reserve button")
    //login Prompt
    if (token === "") {
      setLoginPrompt(true)
      
    } else {
      //check id requirements
      API()
          .get(`trip/checkUserVerificationStatusForReserving/${vesselId}`, {
        headers: {
          authorization: `Bearer ${  token}`
        }
      })
          .then((response) => {
            if (response.status === 200) {
              console.log("reserve user vessel ", response.data)
              setVerificationDialogButtonText('Continue')
              if (response?.data?.isVesselOwner) {
                setVerificationDialogButtonText('Close')
                setVerificationDialogMessage("Vessel Owner cannot book their own vessel.")
                setVerificationDialogTitleMessage("ERROR")
                setShowVerificationDialog(true)
              } else {
                if (response.data?.vesselType === "RENTAL") {
                  if (response?.data?.identityStatus === 'NOT_PROVIDED' || response?.data?.vesselLicenseVerificationStatus === 'NOT_PROVIDED') {
                    setVerificationDialogMessage("To proceed further you have to provide boat license and/or complete id verification process to rent a vessel in wavez.")
                    setVerificationDialogTitleMessage("Boat License and ID Required")
                    setShowVerificationDialog(true)
                  } else if (response?.data?.identityStatus === 'VERIFIED' || response?.data?.vesselLicenseVerificationStatus === 'VERIFIED') {
                    if (response?.data?.requiredUserDetailsProvided) {
                      router.push({pathname: `/booking/${vesselId}`,
                        query: { startDate: startDate.toISOString(), endDate: endDate.toISOString(), numberOfGuests: guest }
                      })
                    } else {
                      setVerificationDialogButtonText('Close')
                      setVerificationDialogMessage("To proceed further you have to provide Gender and Date Of Birth in your user profile.")
                      setVerificationDialogTitleMessage("User Details Not Provided")
                      setShowVerificationDialog(true)
                    }
                  }
                } else {
                  switch (response?.data?.identityStatus) {
                    case 'NOT_PROVIDED':
                      setVerificationDialogMessage("To Proceed further you have to complete the id verification process..")
                      setVerificationDialogTitleMessage("Id Verification Required")
                      setShowVerificationDialog(true)
                      break
                    case 'PROVIDED':
                      setVerificationDialogMessage("Your ID verification is in progress. Please check your notification tab for further updates.")
                      setVerificationDialogTitleMessage("Id Verification in Progress")
                      setVerificationDialogButtonText('Close')
                      setShowVerificationDialog(true)
                      break
                    case 'VERIFIED':
                      if (response?.data?.requiredUserDetailsProvided) {
                        router.push({pathname: `/booking/${vesselId}`,
                          query: { startDate: startDate.toISOString(), endDate: endDate.toISOString(), numberOfGuests: guest }
                        })
                      } else {
                        setVerificationDialogMessage("To proceed further you have to provide Gender and Date Of Birth in your user profile.")
                        setVerificationDialogTitleMessage("User Details Not Provided")
                        setShowVerificationDialog(true)
                      }
                      break
                  }
                }
              }
            }
          })
          .catch((e) => {
            console.log("Error from get reserving status is: ", e.response)
            setBookedMessage(e.response.data.message)
            setExpandingPricing(false)
          })
    }
  }

  const handleStartDateTime = (current) => {
    console.log("new lib: ", current)
    setStartDateIsValid("")
    setStartDate(current)
    setExpandingPricing(false)
  }

  const handleEndDateTime = (current) => {
    console.log("new lib: ", current)
    setEndDateIsValid("")
    setEndDate(current)
    setExpandingPricing(false)
  }

  const disableStartPastDt = current => {
    return current.isAfter(moment())
  }

  const disableEndPastDt = current => {
    return current.isAfter(moment())
  }

  useEffect(() => {

  }, [isExpandingPrice])

  useEffect(() => {
    if (expandingPricing) {
      setIsExpandingPrice(false)
      setPricingSection([
        { unit: "Week", perUnit: pricing?.perWeek?.amount || 0, total: pricingObject?.totalForWeeks.toFixed(2)  || 0, unitValue: pricingObject?.weeksCount || 0 },
        { unit: "Day", perUnit: pricing?.perDay?.amount || 0, total: pricingObject?.totalForDay.toFixed(2) || 0, unitValue: pricingObject?.daysCount || 0 },
        { unit: "Hour", perUnit: pricing?.perHour?.amount || 0, total: pricingObject?.totalForHour.toFixed(2)|| 0, unitValue: pricingObject?.hoursCount || 0 }
      ])
    }
  }, [expandingPricing])

  useEffect(() => {
    setGuest("")
    setStartDate()
    setEndDate()
    setStartDateIsValid("")
    setEndDateIsValid("")
    setGuestIsValid("")
    setBookedMessage("")
    setPricingObject()
    setExpandingPricing(false)
    setPricingSection()
  }, [router])

  const formatPrice = (value) => {
    if (value && typeof value === 'number') {
      return (value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    } else {
      return 0
    }
  }

  const onVerificationDialogClose = () => {
    if (verificationDialogButtonText === 'Continue') {
      router.push('/accountInfo/verification')
    } else {
      setShowVerificationDialog(false)
    }
  }

  return (
    <>
      <Modal
        open={loginPrompt}
        onClose={() => setLoginPrompt(false)}
        classNames={{
          modal: classes.customModal
        }}
        center
      >
        <LoginPrompt
          closeModal={onClosePrompt}
          setLogin={() => setLogin(!login)}
        />
      </Modal>
      <Modal
        open={login}
        onClose={() => setLogin(false)}
        classNames={{
          modal: classes.customModal
        }}
        center
      >
        <Login onCloseModal={onCloseModal} />
      </Modal>
      {showVerificationDialog &&
      <Dialog
          open={showVerificationDialog}
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              setShowVerificationDialog(false)
            }
          }}
          fullWidth
          maxWidth="sm"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          style={{borderRadius: "4px"}}
      >
        <div style={{padding: '2rem'}}>
          <CloseIcon
              onClick={() => setShowVerificationDialog(false)}
              style={{
                fontSize: "2rem",
                cursor: "pointer",
                float: 'right',
                top: "5%",
                position: "relative"
              }}
          />
          <DialogTitle style={{textAlign: 'center'}} id="alert-dialog-title">
            <div style={{display: "inline-grid"}}>
              {verificationDialogTitleMessage}
            </div>
            <hr style={{ width: 60, backgroundColor: theme.palette.buttonPrimary.main, height: 3 }}></hr>
          </DialogTitle>
          <DialogContent >
            <div style={{textAlign: "center", fontWeight: 500, fontSize: '1.15em'}}>
              {verificationDialogMessage}
            </div>
          </DialogContent>
          <DialogActions style={{justifyContent: 'center'}}>
            <Button onClick={() => onVerificationDialogClose()} style={{
              color: "#FFFFFF",
              backgroundColor: '#4D96FB',
              marginTop: '2em'
            }}>{verificationDialogButtonText}</Button>
          </DialogActions>
        </div>
      </Dialog>}
      <Paper className={classes.reservationPaper}>        
        <div className={classes.datePickerInput}>
          <Typography className={classes.text}> {t.listingInfo.startDate}</Typography>
          <Datetime
            value={startDate}
            isValidDate={disableStartPastDt}
            inputProps={{ readOnly: true, className: classes.datetime }}
            onChange={handleStartDateTime}
            timeConstraints={{
              minutes: {
                step: 30
              }
            }}
          />
          {startDateIsValid !== "" && (
            <FormHelperText error>{startDateIsValid}</FormHelperText>
          )}
        </div>

        {/* End picker */}
        <div className={classes.datePickerInput}>
          <Typography className={classes.text}> {t.listingInfo.endDate}</Typography>
          <Datetime
            value={endDate}
            isValidDate={disableEndPastDt}
            inputProps={{ readOnly: true, className: classes.datetime }}
            onChange={handleEndDateTime}
            timeConstraints={{
              minutes: {
                step: 30
              }
            }}
          />
          {endDateIsValid !== "" && (
            <FormHelperText error>{endDateIsValid}</FormHelperText>
          )}
        </div>

        {/* Guest */}
        <div className={classes.datePickerInput}>
          <Typography className={classes.text}> {t.listingInfo.guest}</Typography>
           <TextField
            type="number"
            size="small"
            className={classes.input}
            value={guest}
            InputProps={{ inputProps: { min: 1, max: 12 } }}
            onChange={(event) => { setGuest(event.target.value); setExpandingPricing(false) }}
            variant="outlined"
            onFocus={() => setGuestIsValid("")}
            error={guestIsValid !== ""}
        />
          {guestIsValid !== "" && (
            <FormHelperText error>{guestIsValid}</FormHelperText>
          )}
          {bookedMessage !== "" && (
          <FormHelperText error>{bookedMessage}</FormHelperText>
        )}
        </div>
        <div
          style={{
            borderBottom: "1px solid rgb(221, 221, 221)",
            padding: 10
          }}
        />
        {expandingPricing && (
          <div className={classes.datePickerInput}>
            <Typography className={classes.text}>
              {t.listingInfo.priceDetails}
            </Typography>
            {/* pricing loop */}
            <Grid style={{ display: "flex" }}>
              <Grid
                item
                container
                xs={9}
                style={{
                  textDecorationLine: "underline",
                  textAlign: "left",
                  paddingLeft: "5px",
                  marginRight: "20%"
                }}
              >
                {t.listingInfo.subTotal}{isExpandingPrice ? <ArrowDropDownIcon style={{cursor: "pointer"}} onClick={() => setIsExpandingPrice(false)}/>: <ArrowDropUpIcon style={{cursor: "pointer"}} onClick={() => setIsExpandingPrice(true)}/>}
              </Grid>
              <Grid item xs={3} className={classes.subTotal}>
                ${formatPrice(pricingObject?.total - pricingObject?.serviceFees)}
                {/*${(pricingObject?.total.toFixed(2) - pricingObject?.serviceFees.toFixed(2)).toFixed(2)}*/}
              </Grid>
            </Grid>
            {isExpandingPrice && pricingSection?.map((item) => (item.unitValue !==0 &&
              <Grid key={item.unit} container item style={{ display: "flex" }}>
                <Grid
                  item
                  xs={9}
                  style={{
                    textAlign: "left",
                    paddingLeft: "20px",
                    fontSize: 14
                  }}
                >
                  {item.unitValue} {item.unit} x {item.perUnit}
                </Grid>
                <Grid item xs={3}>
                  ${item.total}
                </Grid>
              </Grid>
            ))}
            <Grid style={{ display: "flex" }}>
              <Grid
                item
                xs={9}
                style={{
                  textDecorationLine: "underline",
                  textAlign: "left",
                  paddingLeft: "5px",
                  marginRight: "20%"
                }}
              >
                {t.listingInfo.serviceFee}
              </Grid>
              <Grid item xs={3} className={classes.subTotal}>
                ${formatPrice(pricingObject?.serviceFees)}
                {/*${pricingObject?.serviceFees.toFixed(2)}*/}
              </Grid>
            </Grid>

            <Grid item className={classes.flexDisplay}>
              <Grid
                item
                xs={9}
                className={classes.line}
              >
                {t.listingInfo.total}
              </Grid>
              <Grid item xs={3} className={classes.subTotal}>
                ${formatPrice(pricingObject?.total)}
                {/*${pricingObject?.total.toFixed(2)}*/}
              </Grid>
            </Grid>
          </div>
        )}
        <Button
          variant='contained'
          className={classes.availabilityBtn}
          onClick={expandingPricing ? reserve : checkAvailability}
        >
          {expandingPricing
            ? t.listingInfo.reserveBtn
            : t.listingInfo.checkAvailabilityBtn}
        </Button>        
        {expandingPricing ?<Typography style={{marginTop: 10}}>Minimum deposit is: ${formatPrice(pricing?.minimumDeposit)}</Typography> : null}
      </Paper>
    </>
  )
}
