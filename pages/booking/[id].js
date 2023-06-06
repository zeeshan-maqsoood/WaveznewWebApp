import React, { useContext, useEffect, useState, useRef } from "react"
import Session from "../../sessionService"
import NavBar from "../../components/navbar/navBar"
import {
    Paper,
    Typography,
    Grid,
    TextField,
    Button,
    CardMedia,
    Checkbox,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Backdrop
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
import SavedCard from "../../components/shared/savedCard"
import BookAddPaymentSave from "../../components/shared/savePaymentMethod"
import "react-datetime/css/react-datetime.css"
import Datetime from "react-datetime"
import FormHelperText from "@material-ui/core/FormHelperText"
import CloseIcon from "@material-ui/icons/Close"
import {InfoOutlined} from "@material-ui/icons"
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
        borderRadius: "10px",
        marginBottom: "1em",
        marginTop: "1em",
        color: theme.palette.background.default,
        backgroundColor: theme.palette.buttonPrimary.main,
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
    },
    datetime: {
        display: "block",
        padding: 10,
        width: "90%",
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
    priceHeaders: {
        textDecorationLine: "underline",
        textAlign: "left",
        fontWeight: 400,
        paddingTop: "1.5em"
    },
    priceDetails: {
        position: "absolute",
        paddingLeft: "15%",
        fontWeight: 400
    },
    subTotal: {
        marginRight: "2em",
        paddingTop: "1.5em",
        textAlign: "right",
        fontWeight: 400
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: theme.palette.background.default
    }
}))

export default function Booking() {
    const classes = useStyles()
    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : fr
    const token = Session.getToken("WaveToken")
    const [messageField, setMessageField] = useState("")
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [guest, setGuest] = useState(1)
    const [existingCard, setExistingCard] = useState(false)
    const [taxPercentage, setTaxPercentage] = useState(0)
    const [taxAmount, setTaxAmount] = useState(0)
    const [taxRates, setTaxRates] = useState([])
    const [priceDetails, setPriceDetails] = useState({
        daysCount: 0,
        hoursCount: 0,
        weeksCount: 0,
        totalForHour: 0,
        totalForDay: 0,
        totalForWeeks: 0,
        perHourPrice: 0,
        perDayPrice: 0,
        perWeekPrice: 0,
        maxGuests: 12,
        taxRates: []
    })
    const [serviceFees, setServiceFees] = useState(0)
    const [securityDeposit, setSecurityDeposit] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [paymentMethods, setPaymentMethods] = useState([])
    const { id, numberOfGuests } = router.query
    const queryStartDate = String(router.query.startDate)
    const queryEndDate = String(router.query.endDate)
    const [startDateError, setStartDateError] = useState("")
    const [endDateError, setEndDateError] = useState("")
    const [guestError, setGuestError] = useState("")
    const [savePaymentMethod, setSavePaymentMethod] = useState(true)
    const [paymentMethodsLoaded, setPaymentMethodsLoaded] = useState(false)
    const [showBookingSuccessfulDialog, setShowBookingSuccessfulDialog] = useState(false)
    const [bookingId, setBookingId] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const savePaymentMethodRef = useRef()
    const [vesselDetails, setVesselDetails] = useState({})

    /**Password Dialog Hooks**/
    const [showBookingPasswordDialog, setShowBookingPasswordDialog] = useState(false)
    const [password, setPassword] = useState("")
    const [passwordError, setPasswordError] = useState("")

    const [open, setOpen] = React.useState(false)

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    useEffect(() => {
        if (id) {
            console.log(Session.getUserLoggedInData().isVesselOwner)
            console.log('booking id', id)
            queryStartDate ? setStartDate(new Date(queryStartDate)) : ''
            queryEndDate ? setEndDate(new Date(queryEndDate)) : ''
            numberOfGuests ? setGuest(numberOfGuests) : ''
            console.log('query start date', queryStartDate)
            console.log('query end date', queryEndDate)
            console.log('no of guests', numberOfGuests)
            getBookingDetails(new Date(queryStartDate), new Date(queryEndDate), numberOfGuests)
            getListingInfo(id)
        }
    }, [id])

    // useEffect(() => {
    //     if (startDate && startDate !== "" && startDate !== new Date() && endDate && endDate !== "" && guest && token && endDate !== new Date()) {
    //         getBookingDetails();
    //     }
    // }, [startDate, endDate, guest]);

    useEffect(() => {
        if (token && token !== "") {
            console.log("calling Get Saved Card Api")
            API()
                .get("users/savedPaymentMethods", {
                    headers: {
                        authorization: `Bearer ${  token}`
                    }
                })
                .then((response) => {
                    if (response.data.paymentMethods.length !== 0) {
                        setPaymentMethods(response.data.paymentMethods)
                        setExistingCard(true)
                        setPaymentMethodsLoaded(true)
                    }
                }).catch((err) => {
                    setPaymentMethodsLoaded(true)
                    console.log(`Error loading the saved payment methods ${err}`)
            })
        }
    }, [])

    const getBookingDetails = async (startDt, endDt, numberOfPassengers) => {
        const { id } = router.query
        if (id && startDate && startDate !== "" && endDate && endDate !== "") {
            API()
                .post("event/calculateBookingInfo",
            {
                vesselId: id,
                start: startDt ? startDt.toISOString() : startDate.toISOString(),
                end: endDt ? endDt.toISOString() : endDate.toISOString(),
                numberOfGuests: numberOfPassengers ? numberOfPassengers : numberOfGuests
            }
                    , {
                    headers: {
                        authorization: `Bearer ${  token}`
                    }
                })
                .then((response) => {
                    if (response.data) {
                        console.log(response.data)
                        setPriceDetails(response.data?.pricingDetails)
                        setServiceFees(response.data?.pricingDetails?.serviceFees)
                        setSecurityDeposit(response.data?.pricingDetails?.minimumDeposit)
                        // setTaxPercentage(response.data?.pricingDetails?.taxPercentage);
                        // setTaxAmount(response.data?.pricingDetails?.taxAmount);
                        setTaxRates(response.data?.pricingDetails?.taxRates ? response.data?.pricingDetails?.taxRates : [])
                        setTotalAmount(Math.round((response.data?.pricingDetails?.total + response.data?.pricingDetails?.minimumDeposit) * 100) / 100)
                    }
                    setIsLoading(false)
                })
                .catch((err) => {
                    console.log(err)
                    setIsLoading(false)
                })
        }
    }

    const onPaymentMethodDelete = (paymentMethodId) => {
        if (paymentMethodId) {
            API()
                .delete(`users/paymentMethod/${paymentMethodId}`, {
                    headers: {
                        authorization: `Bearer ${  token}`
                    }
                })
                .then((response) => {
                    if (response.status === 200) {
                        setExistingCard(false)
                        setPaymentMethods([])
                    }
                }).catch((err) => {
                   console.log(err)
                   window.alert(`There was an error deleting payment method`)
            })
        }
    }

    const handleStartDateTime = (current) => {
        console.log("new lib: ", current)
        setStartDateError("")
        setStartDate(current)
        getBookingDetails(current, endDate, numberOfGuests)
        // setExpandingPricing(false);
    }

    const handleEndDateTime = (current) => {
        console.log("new lib: ", current)
        setEndDateError("")
        setEndDate(current)
        getBookingDetails(startDate, current, numberOfGuests)
        // setExpandingPricing(false);
    }

    const disableStartPastDt = current => {
        return current.isAfter(moment())
    }

    const disableEndPastDt = current => {
        return current.isAfter(moment())
    }

    const validateForm = (values) => {
        let returnValue = true
        if (!values.start) {
            returnValue = false
            setStartDateError("Please provide start sate.")
        }
        if (moment(values.start).diff(moment().add(24, 'hours')) < 0) {
            returnValue = false
            setStartDateError("Please provide start date after 24 hours from now.")
        }
        if (!values.end) {
            returnValue = false
            setEndDateError("Please provide end date")
        }
        if (moment(values.end).diff(moment(values.start)) < 0) {
            returnValue = false
            setEndDateError("Please provide valid end date")
        }
        if (moment(values.end).diff(moment().add(24, 'hours')) < 0) {
            returnValue = false
            setEndDateError("Please provide end date after 24 hours from now.")
        }
        if (!values.numberOfGuests) {
            returnValue = false
            setGuestError("Please provide no of guests")
        }
        if (values.numberOfGuests <=0 || values.numberOfGuests > 12) {
            returnValue = false
            setGuestError("# guests should be 1-12.")
        }
        if (values.numberOfGuests > (priceDetails.maxGuests ? priceDetails.maxGuests : 12)) {
            returnValue = false
            setGuestError(`Maximum guests cannot exceed ${(priceDetails.maxGuests ? priceDetails.maxGuests : 12)}`)
        }
        return returnValue
    }

    const getPaymentMethodForBooking = async () => {
        if (validateForm({
            start: startDate,
            end: endDate,
            numberOfGuests: guest
        })) {
            setIsLoading(true)
            if (paymentMethods?.length !== 0) {
                bookVessel(paymentMethods[0].id, true)
            } else {
                await savePaymentMethodRef.current.handlePaymentMethodSubmit(savePaymentMethod).then(result => {
                    console.log(result)
                    // if (savePaymentMethod) {
                    console.log(result?.setupIntent?.payment_method)
                    if (result?.setupIntent) {
                        console.log(result)
                        bookVessel(result?.setupIntent?.payment_method)
                    } else {
                        setIsLoading(false)
                    }
                    // } else {
                    //     if (result?.token) {
                    //         console.log(result?.token?.id);
                    //         bookVessel(result?.token?.id);
                    //     } else {
                    //         setIsLoading(false);
                    //     }
                    // }
                }).catch((er) => {
                    console.log(er)
                    window.alert(er?.message)
                })
            }
        }
    }

    const bookVessel = async (paymentId, alreadySavedPaymentMethod) => {
        console.log(savePaymentMethodRef)
        const bookingPayload = {
            vesselId: id,
            numberOfGuests,
            start: queryStartDate,
            end: queryEndDate,
            bookingNotes: messageField,
            paymentMethodId: paymentId
        }

        // if (savePaymentMethod || alreadySavedPaymentMethod) {
        //     bookingPayload = {...bookingPayload, ...{paymentMethodId: paymentId}};
        // } else {
        //     bookingPayload = {...bookingPayload, ...{tokenId: paymentId}};
        // }

        if (paymentId) {
            API()
                .post(`trip/book`, bookingPayload, {
                    headers: {
                        authorization: `Bearer ${  token}`
                    }
                })
                .then((response) => {
                    if (response.status === 200) {
                        console.log(response.data)
                        setBookingId(response.data.tripId)
                        // window.alert('booking succesfult');
                        setShowBookingSuccessfulDialog(true)
                    }
                    setIsLoading(false)
                }).catch((err) => {
                console.log(err)
                window.alert(`There was an error while booking vessel ${err?.response?.data?.message}`)
                setShowBookingSuccessfulDialog(false)
                setIsLoading(false)
                // window.alert(`There was an error booking the vessel`);
            })
        }
    }

    const formatPrice = (value) => {
        if (value && typeof value === 'number') {
            return (value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
        } else {
            return 0
        }
    }

    const redirectAfterBooking = () => {
        setShowBookingSuccessfulDialog(false)
        router.push('/')
    }

    const confirmPassword = () => {
        API()
            .post(`signin`, {
                email: Session.getUserLoggedInData().email,
                password
            }, {
                headers: {
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data)
                    setPasswordError("")
                    getPaymentMethodForBooking()
                }
                setIsLoading(false)
            }).catch((err) => {
            window.alert(`There was an error while checking password ${err?.response?.data?.message}`)
            setPasswordError("Invalid Password!")
            setIsLoading(false)
            // window.alert(`There was an error booking the vessel`);
        })
    }

    const checkFieldsValidation = () => {
        if (validateForm({
            start: startDate,
            end: endDate,
            numberOfGuests: guest
        })) {
            setShowBookingPasswordDialog(true)
        }
    }

    const getListingInfo = (id) => {
        if (id) {
            API()
                .get(`vessel/guest/${id}`)
                .then((response) => {
                    if (response.status === 200) {
                        setVesselDetails(response.data)
                    }
                })
                .catch((e) => {
                    console.log("Error from get vessel details is: ", e)
                })
        }
    }

    return (
        <>
            <NavBar />
            <Grid style={{margin:"auto"}} item className={classes.header}>
                <BookingBanner/>
            </Grid>
            <div className={classes.root}>
                <Grid
                    container
                    spacing={1}
                    style={{ justifyContent: "space-around", paddingTop: "10px" }}
                >
                    <Backdrop className={classes.backdrop} open={isLoading}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    {/* Message To Host */}
                    <Grid item xs={12} sm={8}>
                        <Paper className={classes.messagePaper}>
                            <Typography
                                className={classes.text}
                                style={{ fontSize: "24px", marginLeft: "20px" }}
                            >
                                {t.listingInfo.messageToHost}
                            </Typography>
                            <Typography
                                className={classes.text}
                                style={{
                                    fontSize: "14px",
                                    color: "#4F4F4F",
                                    marginLeft: "20px"
                                }}
                            >
                                {t.listingInfo.subTextInMessage}
                            </Typography>

                            <List className={classes.root}>
                                <ListItem alignItems='flex-start'>
                                    <ListItemAvatar>
                                        {vesselDetails?.userId?.profileImageUrl ? (
                                            <Avatar src={vesselDetails?.userId?.profileImageUrl} />
                                        ) : (
                                            <Avatar>
                                                {vesselDetails?.userId?.firstName.charAt(0)}
                                                {vesselDetails?.userId?.lastName.charAt(0)}
                                            </Avatar>
                                        )}
                                    </ListItemAvatar>
                                    <ListItemText style={{ marginTop: "15px" }} primary={`${vesselDetails?.userId?.firstName} ${vesselDetails?.userId?.lastName}`} />
                                </ListItem>
                            </List>

                            {/* Text Field */}
                            <TextField
                                inputProps={{ "data-testid": "messageBox" }}
                                className={classes.messageBox}
                                multiline
                                rows={4}
                                value={messageField}
                                onChange={(event) => setMessageField(event.target.value)}
                                variant='outlined'
                            />
                        </Paper>
                        <Paper className={classes.messagePaper}>
                            <Typography
                                style={{ marginLeft: "20px" }}
                            variant={"h5"}>
                                {t.listingInfo.pricingInfo}
                            </Typography>
                            {paymentMethods?.length === 0 ? (
                                    <>
                                <Elements stripe={stripePromise}>
                                    <PaymentInfo />
                                    {/*<FormControlLabel*/}
                                    {/*style={{marginLeft: "2.5em"}}*/}
                                    {/*control={*/}
                                    {/*    <Checkbox*/}
                                    {/*    checked={savePaymentMethod}*/}
                                    {/*    onChange={(event) => {setSavePaymentMethod(event?.target?.checked)}}*/}
                                    {/*    color="primary"*/}
                                    {/*    />*/}
                                    {/*}*/}
                                    {/*label="Save Credit Card Information"*/}
                                    {/*/>*/}
                                    <div style={{marginLeft: '2.5em'}}>
                                        <InfoOutlined style={{fontSize: "1.5em"}}/>
                                        Your Credit Card Information will be saved in your account and will be charged once your reservation is approved.
                                    </div>
                                    <BillingAddress />
                                    <BookAddPaymentSave ref={savePaymentMethodRef} />
                                </Elements>
                                    </>
                                ) : (
                                <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                                    {paymentMethods?.map((method, ind) => (
                                        <SavedCard key={ind} cardId={method.id}
                                                   cardType={method.card.brand}
                                                   cardFourDigit={method.card.last4}
                                                   onDeleteConfirm={onPaymentMethodDelete} />
                                        ))}
                                </div>
                            )}
                            {/*<hr/>*/}
                            {/*<PaymentSection/>*/}
                        </Paper>
                        {/* Cancellation Policy Modal */}
                        <div className={classes.cancellationSec}>

                                <a style={{
                                    textDecoration: "underline",
                                    fontSize: "18px",
                                    marginLeft: "30px"
                                }} onClick={handleOpen}>Cancellation Policy</a>
                            <Modal
                                center={true}
                                open={open}
                                onClose={handleClose}
                                aria-labelledby='simple-modal-title'
                                aria-describedby='simple-modal-description'
                                classNames={{
                                    modal: classes.customModal
                                }}
                            >
                                <CancellationPolicy/>
                            </Modal>
                        </div>
                        {/* cancellation Gird */}
                        <Grid item xs={12} sm={12}>
                            <Paper className={classes.cancellationPaper}>
                                <p
                                    style={{
                                        fontFamily: "Roboto",
                                        fontSize: "14px",
                                        fontWeight: 500
                                    }}
                                >
                                    {t.listingInfo.cancellationPaperLine1}
                                </p>
                                <p style={{ fontFamily: "Roboto", fontSize: "14px" }}>
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
                                component='img'
                                alt='boatImg'
                                height='170'
                                image={"https://picsum.photos/200/300"}
                                title='boat image'
                            />
                            <div
                                style={{
                                    borderBottom: "1px solid rgb(221, 221, 221)",
                                    marginTop: "30px",
                                    width: "100%"
                                }}
                            />
                            <div className={classes.datePickerInput}>
                                <Typography className={classes.text}>Start Date</Typography>
                                    <Datetime
                                        value={startDate}
                                        isValidDate={disableStartPastDt}
                                        inputProps={{ readOnly: true, className: classes.datetime, disabled: true }}
                                        onChange={handleStartDateTime}
                                        timeConstraints={{
                                            minutes: {
                                                step: 30
                                            }
                                        }}
                                    />
                                {startDateError !== "" && (
                                    <FormHelperText error>{startDateError}</FormHelperText>
                                )}
                            </div>
                            {/* End picker */}
                            <div className={classes.datePickerInput}>
                                <Typography className={classes.text}>End Date</Typography>
                                <Datetime
                                    value={endDate}
                                    isValidDate={disableEndPastDt}
                                    inputProps={{ readOnly: true, className: classes.datetime, disabled: true }}
                                    onChange={handleEndDateTime}
                                    timeConstraints={{
                                        minutes: {
                                            step: 30
                                        }
                                    }}
                                />
                                {endDateError !== "" && (
                                    <FormHelperText error>{endDateError}</FormHelperText>
                                )}
                            </div>
                            {/* Guest */}
                            <div className={classes.datePickerInput}>
                                <Typography className={classes.text}>Guest</Typography>
                                <TextField
                                    type="number"
                                    size="small"
                                    value={guest}
                                    InputProps={{ inputProps: { min: 1, max: 12 } }}
                                    onChange={(event) => {
                                        setGuest(event?.target?.value)
                                        getBookingDetails(startDate, endDate, event?.target?.value)
                                    }}
                                    variant="outlined"
                                    style={{
                                        width: "90%",
                                        height: "38px",
                                        borderRadius: "4px",
                                        backgroundColor: "#FFFFFF"
                                    }}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    disabled={true}
                                />
                                {guestError !== "" && (
                                    <FormHelperText error>{guestError}</FormHelperText>
                                )}
                            </div>
                            <div
                                style={{
                                    borderBottom: "1px solid rgb(221, 221, 221)",
                                    marginTop: "30px",
                                    width: "100%"
                                }}
                            />
                            {/* Payment Section */}
                            <div className={classes.datePickerInput}>
                                <Typography className={classes.priceHeaders} style={{paddingTop: "2em", fontWeight: 500, textDecoration: "none"}}>
                                    {t.listingInfo.priceDetails}
                                </Typography>
                                <Grid style={{ display: "flex" }}>
                                    <Grid
                                        item
                                        xs={8}
                                        className={classes.priceHeaders}>
                                        {priceDetails.hoursCount !== 0 && (
                                            <>
                                            ${formatPrice(priceDetails.perHourPrice)}/hour x {priceDetails.hoursCount}
                                                <br/>
                                            </>
                                            )}
                                        {priceDetails.daysCount !== 0 && (
                                            <>
                                                ${formatPrice(priceDetails.perDayPrice)}/day x {priceDetails.daysCount}
                                                <br/>
                                            </>
                                        )}
                                        {priceDetails.weeksCount !== 0 && (
                                            <>
                                                ${formatPrice(priceDetails.perWeekPrice)}/week x {priceDetails.weeksCount}
                                            </>
                                        )}
                                    </Grid>
                                    <Grid item xs={4} className={classes.subTotal}>
                                        ${formatPrice(priceDetails.totalForDay + priceDetails.totalForHour + priceDetails.totalForWeeks)}
                                    </Grid>
                                </Grid>
                                <Grid style={{ display: "flex" }}>
                                    <Grid
                                        item
                                        xs={8}
                                        className={classes.priceHeaders}>
                                        {t.listingInfo.serviceFee}
                                    </Grid>
                                    <Grid item xs={4} className={classes.subTotal}>
                                        ${formatPrice(serviceFees)}
                                    </Grid>
                                </Grid>
                                {(taxRates && taxRates?.length !== 0) && taxRates?.map(tax => (
                                    <Grid style={{ display: "flex" }}>
                                        <Grid
                                            item
                                            xs={8}
                                            className={classes.priceHeaders}>
                                            {tax?.taxType} ({tax?.percentage}%)
                                        </Grid>
                                        <Grid item xs={4} className={classes.subTotal}>
                                            ${formatPrice(tax?.amount)}
                                        </Grid>
                                    </Grid>
                                ))}
                                <Grid style={{ display: "flex" }}>
                                    <Grid
                                        item
                                        xs={8}
                                        className={classes.priceHeaders}>
                                        {t.listingInfo.securityDeposit}
                                    </Grid>
                                    <Grid item xs={4} className={classes.subTotal}>
                                        ${formatPrice(securityDeposit)}
                                    </Grid>
                                </Grid>
                                <Grid style={{ display: "flex" }}>
                                    <Grid
                                        item
                                        xs={8}
                                        className={classes.priceHeaders}
                                        style={{fontWeight: 500, textDecoration: "none"}}>
                                        {t.listingInfo.total}
                                    </Grid>
                                    <Grid item xs={4} className={classes.subTotal} style={{fontWeight: 500}}>
                                        ${formatPrice(totalAmount)}
                                    </Grid>
                                </Grid>
                            </div>
                            <div style={{textAlign: "center"}}>
                                <Button variant='contained' className={classes.bookingBtn} onClick={() => checkFieldsValidation()}>
                                    {t.listingInfo.bookingBtn}
                                </Button>
                            </div>
                            {/*<PaymentSection/>*/}
                        </Paper>
                    </Grid>
                </Grid>

                {/*Button section*/}
                {/*<div className={classes.booking_btn_div}>*/}
                {/*    <Button variant='contained' className={classes.bookingBtn} onClick={() => getPaymentMethodForBooking()}>*/}
                {/*        {t.listingInfo.bookingBtn}*/}
                {/*    </Button>*/}
                {/*</div>*/}
                {showBookingSuccessfulDialog &&
                <Dialog
                    open={showBookingSuccessfulDialog}
                    onClose={(event, reason) => {
                        if (reason !== 'backdropClick') {
                            setShowBookingSuccessfulDialog(false)
                        }
                    }}
                    fullWidth
                    maxWidth="sm"
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <div style={{padding: '2rem'}}>
                        <DialogTitle style={{textAlign: 'center'}} id="alert-dialog-title">
                            <div style={{display: "inline-grid", fontSize: "1.3em"}}>
                                Booking Successful
                            </div>
                        </DialogTitle>
                        <DialogContent>
                            <div style={{textAlign: "center", marginBottom: "2em"}}>
                                Booking Id: {bookingId}
                            </div>
                        </DialogContent>
                        <DialogActions style={{justifyContent: 'center'}}>
                            <Button
                                style={{marginRight: "1rem", color: theme.palette.background.default, backgroundColor: theme.palette.background.deepSkyBlue}}
                                variant="contained"
                                onClick={() => {
                                    redirectAfterBooking()
                                }}
                            >
                                OK
                            </Button>
                        </DialogActions>
                    </div>
                </Dialog>}

                {showBookingPasswordDialog &&
                <Dialog
                    open={showBookingPasswordDialog}
                    onClose={(event, reason) => {
                        if (reason !== 'backdropClick') {
                            setShowBookingPasswordDialog(false)
                        }
                    }}
                    fullWidth
                    maxWidth="sm"
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <div style={{padding: '2rem'}}>
                        <DialogTitle style={{textAlign: 'center'}} id="alert-dialog-title">
                            <div style={{display: "inline-grid", fontSize: "1.3em"}}>
                                Confirm Your Password To Continue
                            </div>
                        </DialogTitle>
                        <DialogContent style={{textAlign: "center"}}>
                            <TextField
                                inputProps={{ "data-testid": "password" }}
                                label={t.password}
                                type='password'
                                variant='outlined'
                                name='password'
                                style={{ marginBottom: "20px", width: "80%" }}
                                error={passwordError !== ""}
                                onFocus={() => setPasswordError("")}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {passwordError !== "" && <FormHelperText error>{passwordError}</FormHelperText>}
                        </DialogContent>
                        <DialogActions style={{justifyContent: 'center'}}>
                            <Button
                                style={{marginRight: "1rem", color: theme.palette.background.default, backgroundColor: theme.palette.buttonPrimary.main}}
                                variant="contained"
                                onClick={() => {
                                    confirmPassword()
                                }}
                            >
                                OK
                            </Button>
                            <Button
                                style={{marginLeft: "1rem", color: theme.palette.background.default, backgroundColor: theme.palette.background.flamingo}}
                                variant="contained"
                                onClick={() => {
                                    setShowBookingPasswordDialog(false)
                                }}
                            >
                                Cancel
                            </Button>
                        </DialogActions>
                    </div>
                </Dialog>}

            </div>
        </>
    )
}
