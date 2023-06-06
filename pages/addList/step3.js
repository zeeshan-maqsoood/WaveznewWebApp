import React, { useState, useContext, useEffect } from "react"
import NavBar from "../../components/navbar/navBar"
import { makeStyles } from "@material-ui/core/styles"
import { FormHelperText, Grid, TextField } from "@material-ui/core"
import { flexbox } from "@material-ui/system"
import Autocomplete from '@material-ui/lab/Autocomplete'
import API from "../api/baseApiIinstance"
import Button from "@material-ui/core/Button"
import Session from "../../sessionService"
import postCharter from '../../components/addList/api/postCharter'
import postRental from '../../components/addList/api/postRental'
import postStay from '../../components/addList/api/postStay'
import Context from '../../store/context'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import { Modal } from "react-responsive-modal"
import MobileHint from "../../components/addList/mobileHint"
import YearDropdown from "../../components/addList/yearDropdown"
// i18n
import { useRouter } from 'next/router'
import en from '../../locales/en.js'
import fr from '../../locales/fr.js'
import ErrorMessageModal from "../editListing/photos/errorMessageModal"
import theme from "../../src/theme"


const Step3 = (props) => {
  const YEARS_OLD_ALLOWED = 25 // TO-DO: set this number dynamically when backend provides route
  const { globalState, globalDispatch } = useContext(Context)
  const [startDate, setStartDate] = useState(new Date())
  const [options, setOptions] = useState([])
  const token = Session.getToken("Wavetoken")
  const router = useRouter()
  const { locale } = router
  const t = locale === 'en' ? en : fr

  const [submitted, setSubmitted] = useState(false)
  const [makeIsValid, setMakeIsValid] = useState(true)
  const [yearIsValid, setYearIsValid] = useState(true)

  const [hintIsOpen, setHintIsOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // populate years array from current year going back YEARS_OLD_ALLOWED
    const currYear = new Date().getFullYear()
    const years = [YEARS_OLD_ALLOWED]
    for (let index = 0; index <= YEARS_OLD_ALLOWED; index++) {
      years[index] = { year: String(currYear - index) }
    }
    setOptions(years)
  }, []) // Empty array ensures that effect is only run on mount

  useEffect(() => {
    if (submitted) {
      router.push("/yourListings")
    }
  }, [submitted])

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      justifyContent: "center",
      width: "100%"
    },
    container: {
      width: "100%",
      paddingLeft: "10px"
    },
    text: {
      font: "Roboto",
      color: theme.palette.title.matterhorn,
      fontWeight: "500"
    },
    header: {
      font: "Roboto",
      color: theme.palette.title.matterhorn,
      fontWeight: "600",
      fontSize: 30
    },
    form: {
      font: "Roboto",
      fontSize: 24
    },
    makeInput: {
      width: "90%",
      height: "30px",
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme.palette.background.silver
    },
    yearInput: {
      width: "300px",
      [theme.breakpoints.down("sm")]: {
        width: "90%"
      }
    },
    option: {
      fontSize: 15,
      '& > span': {
        marginRight: 10,
        fontSize: 18
      }
    },
    bottomNav: {
      position: "fixed",
      bottom: 0,
      left: 0,
      backgroundColor: theme.palette.background.default,
      height: 80,
      width: "100%"
    },
    navbtn: {
      backgroundColor: theme.palette.background.default,
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
      alignItems: "center",
      borderTop: `1px solid ${theme.palette.background.lightGrey}`
    },
    paddingBottom: {
      marginTop: "100px"
    },
    hintModal: {
      width: "90vw",
      borderRadius: 10,
      position: "fixed",
      left: 0
    },
    errorModal: {
      borderRadius: 10
    }
  }))

  const classes = useStyles()

  const handleInputChange = (event) => {
    const target = event.target
    globalDispatch({ type: target.name, payload: target.value })
    target.name === "SET_MAKE" && setMakeIsValid(true)
  }

  // pass this to api requests to allow state update without disallowed hook use
  const responseSuccessful = () => {
    setSubmitted(true)
  }

  // pass this to api requests to allow global state update without disallowed hook use
  const clearFormData = (actionType, actionPayload, actionDisplayPayload = undefined) => {
    globalDispatch({ type: actionType, payload: actionPayload, displayPayload: actionDisplayPayload })
  }

  const handleNext = () => {
    validateForm() && postListing()
  }

  const validateForm = () => {
    let formIsValid = true
    setMakeIsValid(true)
    setYearIsValid(true)

    { !globalState.addListVesselMake ? (formIsValid = false, setMakeIsValid(false)) : null }
    { !globalState.addListVesselYear ? (formIsValid = false, setYearIsValid(false)) : null }

    return formIsValid
  }

  const postListing = () => {
    // send api post
    if (globalState.addListService === "Rental") {
      postRental(token, globalState, responseSuccessful, clearFormData, setError)
    } else if (globalState.addListService === "Charter") {
      setError(postCharter(token, globalState, responseSuccessful, clearFormData, setError))
    } else if (globalState.addListService === "Stay") {
      setError(postStay(token, globalState, responseSuccessful, clearFormData, setError))
    }
  }

  useEffect(() => {
    console.log("error: ", error)
    error ? setErrorOpen(true) : null
  }, [error])

  return (
    <div className={classes.container}>
      <Modal classNames={{ modal: classes.errorModal }} open={errorOpen} onClose={() => setErrorOpen(false)} center>
        <ErrorMessageModal
          message={error?.response?.data?.message}
          questionMessage={""}
          closeModal={() => setErrorOpen(false)}
        />
      </Modal>
      <Modal
        open={hintIsOpen}
        onClose={() => setHintIsOpen(false)}
        classNames={{
          modal: classes.hintModal
        }}
        center
        blockScroll={false}
      >
        <MobileHint content={[{ hint: props.hint1Text }]} closeHint={() => setHintIsOpen(false)} />
      </Modal>
      <p className={classes.header}>{t.listBoat}{props.isMobile && <HelpOutlineIcon onClick={() => setHintIsOpen(true)} style={{ marginLeft: 5 }} />}</p>
      <form className={classes.form} noValidate autoComplete="off">

        {/* Make/Brand */}
        <p className={classes.text}>{t.addListStep3.makeLabel}</p>
        <TextField value={globalState.addListVesselMake} name={"SET_MAKE"} onChange={handleInputChange} error={!makeIsValid} className={classes.makeInput} id="outlined-basic" label={t.addListStep3.makePlaceholder} variant="outlined" inputProps={{ maxLength: 40 }} />
        <div style={{ marginBottom: 25 }} />
        <FormHelperText error> {!makeIsValid ? t.addListStep3.errorMake : null} </FormHelperText>
        {/* Year */}
        <YearDropdown setUnsavedChanges={() => { }} vesselYear={globalState.addListVesselYear} setVesselYear={(val) => globalDispatch({ type: "SET_YEAR", payload: val })} yearIsValid={yearIsValid} setYearIsValid={(val) => setYearIsValid(val)} labelStyles={{
          font: "Roboto",
          color: theme.palette.title.matterhorn,
          fontWeight: "500"
        }} />
        <div className={classes.paddingBottom} />
        {/* Nav buttons */}
        <Grid item container xs={12} className={classes.bottomNav}>
          <Grid item xs={1} sm={1} lg={2} />
          <Grid item xs={10} sm={4} lg={4} className={classes.navbtn} >
            <Button
              onClick={props.handleBack}
              style={{
                textTransform: "capitalize",
                backgroundColor: theme.palette.background.default,
                fontWeight: "400",
                fontSize: "18px",
                color: theme.palette.buttonPrimary.main,
                height: "60%"
              }}
            >
              &lt; {t.back}
            </Button>
            <Button
              disabled={token ? false : true}
              variant="contained"
              onClick={handleNext}
              style={{
                fontWeight: "400",
                textTransform: "capitalize",
                backgroundColor: token ? theme.palette.buttonPrimary.main : "#c3c3c3",
                color: theme.palette.background.default,
                fontSize: "15px",
                maxHeight: "70%",
                maxWidth: "150px"
              }}
              data-testid="submitBtn"
            >
              {t.saveContinue}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div >
  )
}
export default Step3