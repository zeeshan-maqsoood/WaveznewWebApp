/* eslint-disable no-var */
import React, { useContext, useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import NavBar from "../../components/navbar/navBar"
import GridList from "@material-ui/core/GridList"
import theme from "../../src/theme"
import { TextField, Button, Typography, Checkbox } from "@material-ui/core"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormControl from "@material-ui/core/FormControl"
import FormLabel from "@material-ui/core/FormLabel"
import API from "../../pages/api/baseApiIinstance"
import Session from "../../sessionService"
import { Calendar, momentLocalizer } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { DateCellWrapper } from "../../components/calendar/dateCellWrapper"
import moment from "moment"
import { Modal } from "react-responsive-modal"
import { UpdateButtonNotice } from "../../components/calendar/updateButtonNotice"
import EventInfoDisplay from "../../components/calendar/eventDisplay"
import "react-datetime/css/react-datetime.css"
import Datetime from "react-datetime"
import Context from "../../store/context"
import CancellationPolicy from "../../components/trips/cancellationPolicy"
import InfoIcon from "@material-ui/icons/InfoOutlined"
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import MobileHint from "../../components/addList/mobileHint"

const useStyles = makeStyles((theme) => ({
  container: {},
  boatSelect: {
    display: "flex",
    minHeight: "calc(500px + 180px)",
    height: "85vh",
    borderLeft: `1px ${  theme.palette.background.lightGrey  } solid`,
    borderRight: `1px ${  theme.palette.background.lightGrey  } solid`,
    borderBottom: `1px ${  theme.palette.background.lightGrey  } solid`,
    paddingTop: 1
  },
  calendar: {
    display: "flex",
    justifyContent: "center",
    minHeight: "500px",
    height: "calc(85vh - 180px)",
    padding: 20,
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "Roboto"
  },
  bottomSection: {
    display: "flex",
    height: "180px",
    paddingLeft: 10,
    marginTop: 20
    // marginBottom: 10,
  },
  bottomDiv: {
    marginLeft: 10,

    width: "96%",
    border: `1px ${  theme.palette.background.lightGrey  } solid`,
    borderRadius: 5,
    padding: 20
  },
  datePickerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "fit-content",
    width: "100%"
  },
  datePickerInput: {
    width: "fit-content",
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "Roboto"
  },
  calendarLabel: {
    alignItems: "center",
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 10,
    height: 72,
    width: "100%",
    border: `1px ${  theme.palette.background.lightGrey  } solid`
  },
  text: {
    fontWeight: 500,
    fontSize: 16,
    fontFamily: "Roboto"
  },
  gridList: {
    display: "flex",
    justifContent: "flex-start"
  },
  boatItem: {
    display: "flex",
    alignItems: "center"
  },
  eventModal: {
    maxWidth: "500px",
    maxHeight: "600px",
    borderRadius: 10
  },
  radioGroup: {
    display: "contents",
    [theme.breakpoints.down("sm")]: {
      // display: "none",
    }
  },
  buttonRow: {
    padding: 20,
    width: "100%",
    justifyContent: "center",
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "spaceEvenly"
    }
  },
  datetime: {
    display: "block",
    paddingLeft: 10,
    width: "100%",
    height: "calc(1.5em + 0.75rem + 2px)",
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: 1.5,
    color: "#495057",
    background: "#e9ecef",
    border: "1px solid #ced4da",
    borderRadius: "0.25rem",
    transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
    "&:focus": {
      border: "#80bdff",
      outline: 0,
      boxShadow: "0 0 0 0.2rem rgb(0 123 255 / 25%)"
    }
  },
  cancelPolicyModal: {
    width: 500,
    borderRadius: 10,
    [theme.breakpoints.down("xs")]: {
      width: 300
    }
  },
  hintModal: {
    width: "90vw",
    borderRadius: 10
  }
}))

const localizer = momentLocalizer(moment) // required by RBC

export default function CalendarView() {
  const randomColor = require("randomcolor")
  const currentTheme = "light" // can be changed when dark and color themes are implemented, see randomcolor npm docs
  const token = Session.getToken("Wavetoken")
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr
  const { globalState, globalDispatch } = useContext(Context)

  const [radioValue, setRadioValue] = useState("BLOCK")
  let isTimeGutter = true // used to prevent slotPropGetter styles from applying in first column
  const [selectedStart, setSelectedStart] = useState(
    moment(new Date())
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .toDate()
  )
  const [selectedEnd, setSelectedEnd] = useState(
    moment(new Date())
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .toDate()
  )
  const [listings, setListings] = useState([])
  const [eventList, setEventList] = useState([])
  const [selectedEvent, setSelectedEvent] = useState("")
  const [displayedDate, setDisplayedDate] = useState(new Date())
  const [viewType, setViewType] = useState("month")
  const [isValid, setIsValid] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [cancelPolicyOpen, setCancelPolicyOpen] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)

  useEffect(() => {
    // fetch listings when page loads
    fetchListings()
  }, [])

  const fetchListings = () => {
    // populate listings
    API()
      .get("users/getListings", {
        headers: {
          authorization: `Bearer ${  token}`
        }
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("response.data: ", response.data)
          const fetchedListings = []
          response.data?.listings?.map((listing) => {
            fetchedListings.push({
              isChecked: false,
              _id: listing._id,
              title: listing.title,
              color: randomizeColor(fetchedListings),
              vesselType: listing.vesselType
            })
          })
          if (fetchedListings.length > 0) {
            fetchedListings[0].isChecked = true
          } // set first listing to true by default

          if (
            fetchedListings.length > 0 &&
            globalState.calendarListingSelected
          ) {
            const selectedListing = fetchedListings.find(
              (listing) => listing._id === globalState.calendarListingSelected
            )
            selectedListing
              ? ((fetchedListings[0].isChecked = false),
                (selectedListing.isChecked = true),
                globalDispatch({ type: "SET_CALENDAR_LISTING", payload: "" }))
              : null
          }
          setListings(fetchedListings)
        }
      })
      .catch((e) => {
        // router.push("/somethingWentWrong");
      })
  }

  useEffect(() => {
    // fetch events when listings are updated
    fetchEvents()
  }, [listings])

  const fetchEvents = (date = displayedDate) => {
    // fetch events for visible month. if no date provided, use displayedDate from last onNavigate call (used when blocking dates outside current month)
    date = moment(date)
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .toDate() // set to midnight of current day
    const vesselIds = []
    const start = new Date(date.getTime())
    const end = new Date(date.getTime())

    listings.map((listing) => {
      if (listing.isChecked) {
        vesselIds.push(listing._id)
      }
    })
    const body = {
      vesselIds,
      start:
        viewType === "agenda"
          ? start.toISOString() // agenda events start on current day of selected month
          : moment(start.setDate(-6)).toISOString(), // set start of search to a few days before current month, accounting for visible days from previous month (and set to UTC)
      end:
        viewType === "agenda"
          ? moment(end).add(1, "month").toDate().toISOString() // one month from agenda start date
          : moment(end.setDate(37)).toISOString() // set end date to a few days after current month, accounting for visible days from next month (and set to UTC)
    }
    API()
      .post("event/search", body, {
        headers: {
          authorization: `Bearer ${  token}`
        }
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("response data for event fetch: ", response.data)
          const updatedEvents = [...response.data]
          updatedEvents.map((event) => {
            {
              (event.start = moment(new Date(event.start))
                .add(1, "millisecond")
                .toDate()),
                (event.end = new Date(event.end))
            } // RBC requires raw JS dates, add 1ms to keep out of allday header in day view
            {
              event.end.getHours() === 0 && event.end.getMinutes() === 0
                ? (event.end = moment(event.end)
                    .subtract(1, "millisecond")
                    .toDate())
                : null
            } // subtract 1ms if ends at midnight to prevent extra day in week view
            {
              event.userDetails
                ? (event.title =
                    `${event.userDetails.firstName 
                    } ${ 
                    event.userDetails.lastName}`)
                : (event.title = "BLOCKED")
            } // set title using user name
          })
          setEventList(updatedEvents)
        }
      })
      .catch((e) => {
        // router.push("/somethingWentWrong");
      })
    isTimeGutter = true // used to prevent slotPropGetter styles from applying on first column - specifically when switching to week or day view with many days selected
  }

  const randomizeColor = (fetchedListings) => {
    // randomize color using theme (default light). convert hexcode to decimal and try again if similar to existing code
    let newColor = randomColor({ luminosity: currentTheme })
    let maxTries = 30
    if (fetchedListings.length >= 20) {
      maxTries = 5
    } else if (fetchedListings.length >= 10) {
      maxTries = 10
    }
    if (fetchedListings?.length < 30) {
      // stop checking after 30 items in list
      let colorIsTooSimilar = true
      let consecutiveLoops = 0
      while (colorIsTooSimilar && consecutiveLoops < maxTries) {
        // quit after 10 attempts to avoid infinite looping with too many listings
        colorIsTooSimilar = false
        consecutiveLoops++
        var r1 = parseInt(newColor.substring(1, 3), 16) // get red/green/blue int values of hex1
        // eslint-disable-next-line no-var
        var g1 = parseInt(newColor.substring(3, 5), 16)
        var b1 = parseInt(newColor.substring(5, 7), 16)

        const similarListings = fetchedListings.filter(
          (listing) =>
            listing?.color && // confirm listing has a color to avoid error
            (Math.abs(r1 - parseInt(listing.color.substring(1, 3), 16)) / 255 + // difference between red values
              Math.abs(g1 - parseInt(listing.color.substring(3, 5), 16)) / 255 + // difference between green values
              Math.abs(b1 - parseInt(listing.color.substring(5, 7), 16)) /
                255) / // difference between blue values
              3 <
              0.2
        )

        if (similarListings.length !== 0) {
          colorIsTooSimilar = true
          newColor = randomColor({ luminosity: currentTheme })
        }
      }
    }
    return newColor
  }

  const onCheckUncheck = (listingId) => {
    // check or uncheck vessel and update event list
    const updatedListings = [...listings]
    const listing = updatedListings.find((listing) => listing._id === listingId)
    listing.isChecked = !listing?.isChecked
    setListings(updatedListings)
  }

  const handleSelect = ({ start, end, action }) => {
    // set selected date on calendar click and drag
    isTimeGutter = true // used to prevent slotPropGetter styles from applying on first column
    viewType === "month" ? (end = moment(end).add(1, "days").toDate()) : null // set end date to midnight of next day if selecting in month view
    setSelectedStart(start)
    setSelectedEnd(end)
  }

  const eventStyleGetter = (event, start, end, isSelected) => {
    // set event styles
    const backgroundColor = listings.find(
      (listing) => listing._id === event.vessel._id
    )?.color

    const style = {
      background:
        viewType === "agenda"
          ? // ? event.userDetails ? backgroundColor : 'repeating-linear-gradient(45deg, ' + backgroundColor + ', ' + backgroundColor + ' 10px, lightgrey 10px, lightgrey 20px)'
            event.userDetails
            ? backgroundColor
            : `repeating-linear-gradient(45deg, lightgrey, lightgrey 40px, ${ 
              backgroundColor 
              } 10px, ${ 
              backgroundColor 
              } 50px)`
          : event.userDetails
          ? backgroundColor
          : `repeating-linear-gradient(45deg, lightgrey, lightgrey 40px, ${ 
            backgroundColor 
            } 10px, ${ 
            backgroundColor 
            } 50px)`,
      borderRadius: "5px",
      textAlign: "center",
      opacity: 0.8,
      color: theme.palette.text.black,
      border: "0px",
      display: "block"
    }
    return {
      style
    }
  }

  const slotPropGetter = (date) => {
    // return style for each time slot
    if (selectedStart >= selectedEnd) {
      return
    } // no style if start and end dates are invalid
    let style
    const time = date.getTime()
    const startTime = selectedStart.getTime()
    const endTime = selectedEnd.getTime()

    if (!isTimeGutter) {
      // skip first column, otherwise sunday styles are applied
      if (
        time <= startTime &&
        moment(time).add(30, "minutes").toDate() > startTime
      ) {
        // addition checks if selected start falls within time slot
        moment(time).add(30, "minutes").toDate() >= endTime && time < endTime
          ? (style = {
              border: `3px solid ${  theme.palette.buttonPrimary.main}`
            }) // start time is also end time
          : (style = {
              borderTop: `3px solid ${  theme.palette.buttonPrimary.main}`,
              borderLeft: `3px solid ${  theme.palette.buttonPrimary.main}`,
              borderRight: `3px solid ${  theme.palette.buttonPrimary.main}`
            }) // style start time
      } else if (
        moment(time).add(30, "minutes").toDate() >= endTime &&
        time < endTime
      ) {
        // addition done in reverse because RBC naturally extends one extra time slot
        style = {
          borderBottom: `3px solid ${  theme.palette.buttonPrimary.main}`,
          borderLeft: `3px solid ${  theme.palette.buttonPrimary.main}`,
          borderRight: `3px solid ${  theme.palette.buttonPrimary.main}`
        } // style end time
      } else if (
        time >= startTime &&
        moment(time).add(30, "minutes").toDate() <= endTime
      ) {
        // addition to check if date falls before corrected end slot
        style = {
          borderLeft: `3px solid ${  theme.palette.buttonPrimary.main}`,
          borderRight: `3px solid ${  theme.palette.buttonPrimary.main}`, // style middle time
          borderTop:
            date.getHours() === 0 && date.getMinutes() === 0
              ? `3px solid ${  theme.palette.buttonPrimary.main}`
              : null, // add border top if 12:00 AM
          borderBottom:
            date.getHours() === 23 && date.getMinutes() >= 30
              ? `3px solid ${  theme.palette.buttonPrimary.main}`
              : null // add border bottom if 11:30 PM or later
        }
      }
    }

    if (isTimeGutter && date.getHours() === 23 && date.getMinutes() === 30) {
      isTimeGutter = false // stop ignoring slotPropGetter styles
    }

    return {
      style
    }
  }

  const dayPropGetter = (date) => {
    // return style for each day in month view
    if (viewType !== "month" || selectedStart >= selectedEnd) {
      return
    } // no style if start and end dates are invalid
    let style
    const momentDate = moment(date)

    if (
      momentDate.dayOfYear() === moment(selectedStart).dayOfYear() &&
      momentDate.year() === moment(selectedStart).year()
    ) {
      // is start date
      date.getDay() === 6 || // is Saturday (last day of the week)
      (momentDate.dayOfYear() ===
        moment(selectedEnd).subtract(1, "millisecond").dayOfYear() &&
        momentDate.year() ===
          moment(selectedEnd).subtract(1, "millisecond").year()) // is also end date
        ? (style = { border: `3px solid ${  theme.palette.buttonPrimary.main}` }) // style when only one day is selected (up to midnight of following day) or start day is saturday
        : (style = {
            borderTop: `3px solid ${  theme.palette.buttonPrimary.main}`,
            borderBottom: `3px solid ${  theme.palette.buttonPrimary.main}`,
            borderLeft: `3px solid ${  theme.palette.buttonPrimary.main}`
          }) // style normal start day
    } else if (
      momentDate.dayOfYear() ===
        moment(selectedEnd).subtract(1, "millisecond").dayOfYear() &&
      momentDate.year() ===
        moment(selectedEnd).subtract(1, "millisecond").year()
    ) {
      date.getDate() ===
      moment(selectedEnd).subtract(1, "minute").toDate().getDate() // ends after midnight (otherwise no style needed)
        ? date.getDay() === 0 // is first day of the week
          ? (style = {
              border: `3px solid ${  theme.palette.buttonPrimary.main}`
            }) // end day is saturday
          : (style = {
              borderTop: `3px solid ${  theme.palette.buttonPrimary.main}`,
              borderBottom: `3px solid ${  theme.palette.buttonPrimary.main}`,
              borderRight: `3px solid ${  theme.palette.buttonPrimary.main}`
            }) // style normal end day
        : (style = {}) // if ends at midnight, end border was applied on previous day
    } else if (
      moment(date).isAfter(selectedStart) &&
      moment(date).isBefore(selectedEnd)
    ) {
      style = {
        borderTop: `3px solid ${  theme.palette.buttonPrimary.main}`,
        borderBottom: `3px solid ${  theme.palette.buttonPrimary.main}`, // style middle days
        borderLeft:
          date.getDay() === 0
            ? `3px solid ${  theme.palette.buttonPrimary.main}`
            : null, // add left border if first day of week
        borderRight:
          date.getDay() === 6
            ? `3px solid ${  theme.palette.buttonPrimary.main}`
            : null // add right border if last day of week
      }
    }

    return {
      style
    }
  }

  const handleChangeRadio = (event) => {
    // select book or available
    setRadioValue(event.target.value)
  }

  const setStart = (newDate) => {
    // set start date via datepicker
    isTimeGutter = true // used to prevent slotPropGetter styles from applying on first column
    const newStart = moment(newDate).toDate()
    setSelectedStart(newDate)
  }

  const setEnd = (newDate) => {
    // set end date via datepicker
    isTimeGutter = true // used to prevent slotPropGetter styles from applying on first column
    const newEnd = moment(newDate).toDate()
    setSelectedEnd(newEnd)
  }

  useEffect(() => {
    // fetch events when view type changes. Agenda view displays one month starting at current day of the month
    fetchEvents()
    isTimeGutter = true // used to prevent slotPropGetter styles from applying on first column
  }, [viewType])

  const onView = (view) => {
    isTimeGutter = true // used to prevent slotPropGetter styles from applying on first column
    setViewType(view)
  }

  const onNavigate = (date, view, navDirection) => {
    // fetch events for visible month
    isTimeGutter = true // used to prevent slotPropGetter styles from applying on first column
    setDisplayedDate(date)
    fetchEvents(date)
  }

  const onSelectEvent = (event, jsDetails) => {
    setSelectedEvent(event)
  }

  const updateCalendar = () => {
    const checkedListings = listings.filter((list) => list.isChecked === true)
    if (!checkUpdateValid(checkedListings)) {
      return
    }
    radioValue === "BLOCK"
      ? setDateBlocked(checkedListings[0])
      : unblockTimeslot(checkedListings[0])
  }

  const checkUpdateValid = (checkedListings) => {
    if (!selectedStart || !selectedEnd || selectedStart >= selectedEnd) {
      // dates selected are invalid
      setErrorMessage(t.calendar.updateButton.selectDates)
      return false
    } else if (selectedStart < moment(new Date()).add(7, "days").toDate()) {
      // start date is not one week in the future
      setErrorMessage(t.calendar.updateButton.noticeRequired)
      return false
    } else if (checkedListings.length === 0) {
      // no listing selected
      setErrorMessage(t.calendar.updateButton.bodyNoneSelected)
      return false
    } else if (checkedListings.length > 1) {
      // too many listings selected
      setErrorMessage(t.calendar.updateButton.bodyTooMany)
      return false
    }

    return true
  }

  useEffect(() => {
    errorMessage === "" ? setIsValid(true) : setIsValid(false)
  }, [errorMessage])

  const closeErrorMessage = () => {
    setErrorMessage("")
  }

  const unblockTimeslot = (listing) => {
    const body = {
      start: selectedStart.toISOString(),
      end: selectedEnd.toISOString()
    }

    API()
      .put(`event/unBlockTimeslot/${  listing._id}`, body, {
        headers: {
          authorization: `Bearer ${  token}`
        }
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Successfully made period availbale")
          fetchEvents()
        }
      })
      .catch((e) => {
        // router.push("/somethingWentWrong");
      })
  }

  const setDateBlocked = (listing) => {
    const body = {
      start: selectedStart.toISOString(),
      end: selectedEnd.toISOString()
    }

    API()
      .post(`event/blockTimeslot/${  listing._id}`, body, {
        headers: {
          authorization: `Bearer ${  token}`
        }
      })
      .then((response) => {
        if (response.status === 200) {
          fetchEvents()
        }
      })
      .catch((e) => {
        if (e?.response?.status === 409) {
          setErrorMessage(t.calendar.updateButton.timeOverlap)
        } else {
          // router.push("/somethingWentWrong");
        }
      })
  }

  const handleOpenTip = () => {}

  return (
    <>
      <Modal
        open={selectedEvent}
        onClose={() => setSelectedEvent("")}
        classNames={{ modal: classes.eventModal }}
        center
      >
        <EventInfoDisplay
          event={selectedEvent}
          start={
            selectedEvent.start
              ? moment(selectedEvent.start).format("DD MMMM")
              : ""
          }
          end={
            selectedEvent.end ? moment(selectedEvent.end).format("DD MMMM") : ""
          }
          startTime={
            selectedEvent.start ? moment(selectedEvent.start).format("LT") : ""
          }
          endTime={
            selectedEvent.end ? moment(selectedEvent.end).format("LT") : ""
          }
          onClose={() => setSelectedEvent("")}
          blocked={selectedEvent.title === "BLOCKED"}
          token={token}
          refresh={() => fetchEvents()}
        />{" "}
        {/* Displayed when an event is clicked */}
      </Modal>
      <Modal
        open={!isValid}
        onClose={() => closeErrorMessage()}
        classNames={{ modal: classes.eventModal }}
        center
      >
        <UpdateButtonNotice
          onClose={() => closeErrorMessage()}
          header={t.calendar.updateButton.header}
          body={errorMessage}
        />{" "}
        {/* Displayed when update fails */}
      </Modal>
      <Modal
        open={cancelPolicyOpen}
        onClose={() => setCancelPolicyOpen(false)}
        classNames={{
          modal: classes.cancelPolicyModal
        }}
        center
      >
        <CancellationPolicy />
      </Modal>
      <Modal
        open={hintOpen}
        onClose={() => setHintOpen(false)}
        classNames={{
          modal: classes.hintModal
        }}
        center
      >
        <MobileHint
          content={[
            { hint: t.calendar.blockHint, title: t.calendar.block },
            {
              hint: t.calendar.availableHint,
              title: t.calendar.eventInfo.confirmButton
            }
          ]}
          closeHint={() => setHintOpen(false)}
        />
      </Modal>
      <NavBar />
      <Grid container className={classes.container}>
        {" "}
        {/* Container Grid */}
        <Grid item xs={false} lg={1} xl={2} />
        <Grid container item xs={12} lg={10} xl={8}>
          {/* Main Grid */}
          <Grid item xs={12} className={classes.calendarLabel}>
            {" "}
            {/* Calendar Tab */}
            <span style={{ display: "flex", flexDirection: "row" }}>
              <Typography className={classes.text}>
                {t.calendar.calendar}
              </Typography>
              <InfoIcon
                style={{ cursor: "pointer", marginLeft: 10 }}
                onClick={() => setHintOpen(true)}
              />
            </span>
            <span
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "row"
              }}
              onClick={() => setCancelPolicyOpen(true)}
            >
              <Typography className={classes.text}>
                {t.editListing.pricing.cancellationAndRefund}
              </Typography>
              <InfoIcon style={{ cursor: "pointer", marginLeft: 10 }} />
            </span>
          </Grid>
          <Grid container item xs={12}>
            {" "}
            {/* Grid for boat select, calendar, and bottom section */}
            <Grid
              container
              item
              xs={3}
              direction="column"
              className={classes.boatSelect}
            >
              {" "}
              {/* Boat select */}
              <GridList
                className={classes.gridList}
                spacing={3}
                cellHeight={80}
              >
                {listings.map((listing) => (
                  <Grid
                    item
                    xs={12}
                    key={listing._id}
                    className={classes.boatItem}
                    style={
                      listing.isChecked
                        ? {
                            backgroundColor:
                              theme.palette.wavezHome.backgroundColorSearch,
                            borderLeft:
                              `1px ${ 
                              theme.palette.background.lightGrey 
                              } solid`,
                            borderRight:
                              `1px ${ 
                              theme.palette.background.lightGrey 
                              } solid`
                          }
                        : {}
                    }
                  >
                    <Typography className={classes.text}>
                      <Checkbox
                        checked={listing.isChecked ? true : false}
                        onChange={() => onCheckUncheck(listing._id)}
                        style={{ color: listing.color, marginLeft: 20 }}
                        inputProps={{
                          "data-testid": `checkbox_${  listing._id}`
                        }}
                      />
                      {listing.title}
                    </Typography>
                  </Grid>
                ))}
              </GridList>
            </Grid>
            <Grid container item xs={9}>
              {" "}
              {/* Calendar and bottom section */}
              <Grid item xs={12} className={classes.bottomSection}>
                {" "}
                {/* Bottom section */}
                <Grid item xs={12} className={classes.bottomDiv}>
                  <div className={classes.datePickerRow}>
                    <div className={classes.datePickerInput}>
                      {" "}
                      {/* Start picker */}
                      <Typography className={classes.text}>
                        {t.calendar.startPicker}
                      </Typography>
                      <form>
                        <Datetime
                          inputProps={{
                            readOnly: true,
                            className: classes.datetime
                          }}
                          value={selectedStart}
                          onChange={setStart}
                          timeConstraints={{ minutes: { step: 30 } }}
                        />
                      </form>
                    </div>
                    <div className={classes.datePickerInput}>
                      {" "}
                      {/* End picker */}
                      <Typography className={classes.text}>
                        {t.calendar.endPicker}
                      </Typography>
                      <Datetime
                        inputProps={{
                          readOnly: true,
                          className: classes.datetime
                        }}
                        value={selectedEnd}
                        onChange={setEnd}
                        timeConstraints={{ minutes: { step: 30 } }}
                      />
                    </div>
                    <RadioGroup
                      aria-label=""
                      name="blockOrAvailable"
                      value={radioValue}
                      onChange={handleChangeRadio}
                      className={classes.radioGroup}
                    >
                      <div className={classes.datePickerInput}>
                        <FormControlLabel
                          value="BLOCK"
                          control={<Radio />}
                          label={t.calendar.block}
                        />
                      </div>
                      <div className={classes.datePickerInput}>
                        <FormControlLabel
                          value="AVAILABLE"
                          control={<Radio />}
                          label={t.calendar.available}
                        />
                      </div>
                    </RadioGroup>
                  </div>
                  <div className={classes.buttonRow}>
                    <Button
                      variant="contained"
                      onClick={() => updateCalendar()}
                      style={{
                        fontWeight: "400",
                        textTransform: "capitalize",
                        backgroundColor: theme.palette.buttonPrimary.main,
                        color: theme.palette.background.default,
                        fontSize: "18px",
                        maxHeight: "50px",
                        maxWidth: "250px",
                        marginLeft: 20
                      }}
                      data-testid="updateBtn"
                    >
                      {t.calendar.updateButton.label}
                    </Button>
                  </div>
                </Grid>
              </Grid>
              <Grid item xs={12} className={classes.calendar}>
                {" "}
                {/* Calendar */}
                <Calendar
                  culture={locale === "en" ? locale : "fr-ca"}
                  localizer={localizer}
                  events={eventList}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "100%", width: "90%" }}
                  selectable
                  onSelectSlot={handleSelect}
                  eventPropGetter={eventStyleGetter}
                  slotPropGetter={(date) => slotPropGetter(date)}
                  dayPropGetter={(date) => dayPropGetter(date)}
                  onSelectEvent={(event, jsDetails) =>
                    onSelectEvent(event, jsDetails)
                  }
                  onView={(view) => onView(view)}
                  onNavigate={(date, view, navDirection) =>
                    onNavigate(date, view, navDirection)
                  }
                  messages={{
                    available: t.calendar.agenda,
                    month: t.calendar.month,
                    week: t.calendar.week,
                    day: t.calendar.day,
                    agenda: t.calendar.agenda,
                    today: t.calendar.today,
                    previous: t.calendar.back,
                    next: t.calendar.next
                  }}
                  showMultiDayTimes={true} // shows multi-day events with start and end times instead of moving to header
                  // allDayAccessor={(event) => { return false; }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={false} lg={1} xl={2} />
      </Grid>
      <div style={{ marginBottom: 5 }} />
    </>
  )
}
