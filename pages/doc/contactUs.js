import React, { useContext, useEffect, useState, useRef } from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  Paper,
  FormControl,
  InputLabel,
  Typography,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogTitle
} from "@material-ui/core"
import PlaceIcon from "@material-ui/icons/Place"
import MailIcon from "@material-ui/icons/Mail"
import PublicIcon from "@material-ui/icons/Public"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import NavBar from "../../components/navbar/navBar"

// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import FormHelperText from "@material-ui/core/FormHelperText"

import API from "../api/baseApiIinstance"
import theme from "../../src/theme"

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
      transform: "translate(14px, -12px) scale(0.75) !important"
    }
  },
  formStyle: {
    marginTop: "1%"
  },
  textField: {
    width: "90%",
    [theme.breakpoints.down("xs")]: {
      width: "95%"
    },
    "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
      transform: "translate(14px, -12px) scale(0.75) !important"
    }
  },
  nameTextField: {
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      width: "95%"
    }
  },
  nameTextField2: {
    width: "100%",
    marginLeft: "17%",
    [theme.breakpoints.down("xs")]: {
      width: "95%",
      marginLeft: 0
    }
  },
  messageBox: {
    width: "90%",
    marginTop: "10px",
    marginBottom: "10px",
    background: "#FFFFFF"
  },
  bookingBtn: {
    width: "150px",
    height: "45px",
    radius: "10px",
    marginTop: "5%",
    color: "white",
    backgroundColor: "#4D96FB",
    [theme.breakpoints.down("xs")]: {
      marginLeft: "25%"
    }
  },
  formText: {
    fontFamily: "Roboto"
  },
  contactInfoText: {
    marginLeft: "5px",
    fontFamily: "Roboto"
  }
}))

const ContactUs = (props) => {
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  const [service, setService] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [userType, setUserType] = useState("")
  const [messageField, setMessageField] = useState("")

  /**
   * Validator hooks
   * */
  const [validateService, setValidateService] = useState("")
  const [validateFirstName, setValidateFirstName] = useState("")
  const [validateLastName, setValidateLastName] = useState("")
  const [validatePhoneNumber, setValidatePhoneNumber] = useState("")
  const [validateEmail, setValidateEmail] = useState("")
  const [validateUserType, setValidateUserType] = useState("")
  const [validateMessageField, setValidateMessageField] = useState("")

  const [openDialog, setOpenDialog] = useState(false)
  const [dialogMessage, setDialogMessage] = useState("")

  const serviceDropDown = [
    "General Inquires",
    "Rental",
    "Charter",
    "Docked Stay"
  ]

  const handleChange = (event) => {
    setService(event.target.value)
    event?.target?.value && event?.target?.value !== ""
      ? setValidateService("")
      : setValidateService("Please select the service for inquiry")
  }

  const validateForm = (event) => {
    let isValid = true
    const emailRegex = new RegExp("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")
    firstName && firstName !== ""
      ? setValidateFirstName("")
      : (setValidateFirstName("First Name is required"), (isValid = false))
    lastName && lastName !== ""
      ? setValidateLastName("")
      : (setValidateLastName("Last Name is required"), (isValid = false))
    phoneNumber && phoneNumber !== ""
      ? setValidatePhoneNumber("")
      : (setValidatePhoneNumber("Phone Number is required"), (isValid = false))
    email && email !== ""
      ? setValidateEmail("")
      : (setValidateEmail("Email is required"), (isValid = false))
    email && emailRegex.test(email)
      ? setValidateEmail("")
      : (setValidateEmail("Please provide a valid email"), (isValid = false))
    userType && userType !== ""
      ? setValidateUserType("")
      : (setValidateUserType("Please select your user type"),
        (isValid = false))
    service && service !== ""
      ? setValidateService("")
      : (setValidateService("Please select the service for inquiry"),
        (isValid = false))
    messageField && messageField !== ""
      ? setValidateMessageField("")
      : (setValidateMessageField("Inquiry description is required."),
        (isValid = false))
    return isValid
  }

  const onSubmit = () => {
    if (validateForm()) {
      API()
        .post("configuration/sendContactUsEmail", {
          firstName,
          lastName,
          email,
          service,
          phoneNumber,
          userType,
          topic: messageField
        })
        .then((result) => {
          if (result.status === 200) {
            setDialogMessage("Inquiry Submitted Successfully.")
            setOpenDialog(true)
          }
        })
        .catch((err) => {
          setDialogMessage("There was an error submitting your inquiry.")
          setOpenDialog(true)
          console.log(err)
        })
    }
  }

  const closeDialog = () => {
    setOpenDialog(false)
    if (dialogMessage !== "There was an error submitting your inquiry.") {
      resetForm()
    }
  }

  const resetForm = () => {
    setEmail("")
    setPhoneNumber("")
    setService("")
    setUserType("")
    setFirstName("")
    setLastName("")
    setMessageField("")
  }

  return (
    <>
      <NavBar />
      {openDialog && (
        <Dialog open={openDialog} fullWidth style={{ padding: "1em" }}>
          <DialogTitle style={{ textAlign: "center", paddingTop: "3em" }}>
            {dialogMessage}
          </DialogTitle>
          <DialogActions
            style={{ justifyContent: "center", paddingBottom: "3em" }}
          >
            <Button
              onClick={closeDialog}
              style={{
                color: theme.palette.background.default,
                backgroundColor: theme.palette.primary.main
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <div style={{ marginTop: "3%", marginLeft: "5%", marginBottom: "5%" }}>
        <h1 style={{ fontFamily: "Roboto" }}> {t.contactUsPage.title} </h1>

        <Typography style={{ fontSize: "large", fontFamily: "Roboto" }}>
          {t.contactUsPage.subTitle}
        </Typography>

        <Grid container spacing={3} className={classes.formStyle}>
          <Grid item xs={12} sm={8}>
            <h3 style={{ marginBottom: "1%" }}>
              <b>{t.contactUsPage.formTitle}</b>
            </h3>

            {/* date */}
            {/*<div>*/}
            {/*  <div style={{ display: "flex" }}>*/}
            {/*    <h5 className={classes.formText}>{t.contactUsPage.date}</h5>*/}
            {/*    <p style={{ marginLeft: "5px", color: "red" }}>*</p>*/}
            {/*  </div>*/}
            {/*  <TextField*/}
            {/*    className={classes.textField}*/}
            {/*    inputProps={{ "data-testid": "Date" }}*/}
            {/*    placeholder="DD/MM/YYYY"*/}
            {/*    type="text"*/}
            {/*    variant="outlined"*/}
            {/*    name="date"*/}
            {/*  />*/}
            {/*</div>*/}

            {/* name */}
            <div style={{ marginTop: "15px" }}>
              <div style={{ display: "flex" }}>
                <h5 className={classes.formText}>{t.contactUsPage.name}</h5>
                <p style={{ marginLeft: "5px", color: "red" }}>*</p>
              </div>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={5}>
                  <TextField
                    className={classes.nameTextField}
                    variant="outlined"
                    label={t.signupPage.firstName}
                    onChange={(event) => {
                      setFirstName(event.target.value)
                      event?.target?.value && event?.target?.value !== ""
                        ? setValidateFirstName("")
                        : setValidateFirstName("First Name is required")
                    }}
                    error={validateFirstName !== ""}
                    value={firstName}
                  />
                  {validateFirstName !== "" && (
                    <FormHelperText error>{validateFirstName}</FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={5}>
                  <TextField
                    className={classes.nameTextField2}
                    variant="outlined"
                    label={t.signupPage.lastName}
                    error={validateLastName !== ""}
                    value={lastName}
                    onChange={(event) => {
                      setLastName(event.target.value)
                      event?.target?.value && event?.target?.value !== ""
                        ? setValidateLastName("")
                        : setValidateLastName("Last Name is required")
                    }}
                  />
                  {validateLastName !== "" && (
                    <FormHelperText error style={{ marginLeft: "17%" }}>
                      {validateLastName}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
            </div>

            {/* phone number */}
            <div style={{ marginTop: "15px" }}>
              <div style={{ display: "flex" }}>
                <h5 className={classes.formText}>
                  {t.contactUsPage.phoneNumber}
                </h5>
                <p style={{ marginLeft: "5px", color: "red" }}>*</p>
              </div>
              <TextField
                className={classes.textField}
                inputProps={{ "data-testid": "phoneNumber" }}
                type="number"
                variant="outlined"
                name="phoneNumber"
                error={validatePhoneNumber !== ""}
                value={phoneNumber}
                onChange={(event) => {
                  setPhoneNumber(event.target.value)
                  event?.target?.value && event?.target?.value !== ""
                    ? setValidatePhoneNumber("")
                    : setValidatePhoneNumber("Phone Number is required")
                }}
              />
              {validatePhoneNumber !== "" && (
                <FormHelperText error>{validatePhoneNumber}</FormHelperText>
              )}
            </div>

            {/* email */}
            <div style={{ marginTop: "15px" }}>
              <div style={{ display: "flex" }}>
                <h5 className={classes.formText}>{t.contactUsPage.email}</h5>
                <p style={{ marginLeft: "5px", color: "red" }}>*</p>
              </div>
              <TextField
                className={classes.textField}
                inputProps={{ "data-testid": "phoneNumber" }}
                type="text"
                variant="outlined"
                name="email"
                error={validateEmail !== ""}
                value={email}
                placeholder={t.contactUsPage.emailText}
                onChange={(event) => {
                  setEmail(event.target.value)
                  event?.target?.value && event?.target?.value !== ""
                    ? setValidateEmail("")
                    : setValidateEmail("Email is required")
                }}
              />
              {validateEmail !== "" && (
                <FormHelperText error>{validateEmail}</FormHelperText>
              )}
            </div>

            {/* choose service */}
            <div style={{ marginTop: "15px" }}>
              <div style={{ display: "flex" }}>
                <h5 className={classes.formText}>
                  {t.contactUsPage.chooseService}
                </h5>
                <p style={{ marginLeft: "5px", color: "red" }}>*</p>
              </div>
              <FormControl variant="outlined" className={classes.textField}>
                <InputLabel id="demo-simple-select-outlined-label">
                  {t.contactUsPage.selectLabel}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  onChange={handleChange}
                  error={validateService !== ""}
                  value={service}
                >
                  {serviceDropDown.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
                {validateService !== "" && (
                  <FormHelperText error>{validateService}</FormHelperText>
                )}
              </FormControl>
            </div>

            {/* user type*/}
            <div style={{ marginTop: "15px" }}>
              <div style={{ display: "flex" }}>
                <h5 className={classes.formText}>
                  {t.contactUsPage.userTypeTitle}
                </h5>
                <p style={{ marginLeft: "5px", color: "red" }}>*</p>
              </div>

              <FormControl component="fieldset" style={{ width: "100%" }}>
                <RadioGroup
                  row
                  aria-label="position"
                  name="position"
                  defaultValue="top"
                  value={userType}
                  onChange={(event) => {
                    setUserType(event.target.value)
                    event?.target?.value && event?.target?.value !== ""
                      ? setValidateUserType("")
                      : setValidateUserType("Please select your user type")
                  }}
                >
                  <FormControlLabel
                    value="Vessel Owner"
                    control={<Radio color="primary" />}
                    label={t.contactUsPage.owner}
                    labelPlacement="end"
                    style={{ color: "#636363" }}
                  />

                  <FormControlLabel
                    value="Renter"
                    control={<Radio color="primary" />}
                    label={t.contactUsPage.renter}
                    labelPlacement="end"
                    style={{ color: "#636363", marginLeft: "10%" }}
                  />
                </RadioGroup>
                {validateUserType !== "" && (
                  <FormHelperText error>{validateUserType}</FormHelperText>
                )}
              </FormControl>
            </div>

            {/* Inquiry */}
            <div style={{ marginTop: "15px" }}>
              <div style={{ display: "flex" }}>
                <h5 className={classes.formText}>
                  {t.contactUsPage.inquiryTitle}
                </h5>
                <p style={{ marginLeft: "5px", color: "red" }}>*</p>
              </div>
              <TextField
                inputProps={{ "data-testid": "messageBox" }}
                className={classes.messageBox}
                multiline
                rows={4}
                value={messageField}
                onChange={(event) => {
                  setMessageField(event.target.value)
                  event?.target?.value && event?.target?.value !== ""
                    ? setValidateMessageField("")
                    : setValidateMessageField(
                        "Inquiry Description is required."
                      )
                }}
                variant="outlined"
                placeholder={t.contactUsPage.inquiryPlaceHolder}
                error={validateMessageField !== ""}
              />
              {validateMessageField !== "" && (
                <FormHelperText error>{validateMessageField}</FormHelperText>
              )}
            </div>
          </Grid>

          {/* contact info */}
          <Grid item xs={12} sm={4}>
            <div>
              <h3>
                <b>{t.contactUsPage.contactInfoTitle}</b>
              </h3>
            </div>

            <div style={{ display: "flex", marginBottom: "5%" }}>
              <PlaceIcon />
              <Typography className={classes.contactInfoText}>
                {" "}
                7 Brimley Road South, Scarborough, ON M1M 3H3{" "}
              </Typography>
            </div>

            <div style={{ display: "flex", marginBottom: "5%" }}>
              <MailIcon />
              <Typography className={classes.contactInfoText}>
                {" "}
                support@wavez.ca{" "}
              </Typography>
            </div>

            <div style={{ display: "flex" }}>
              <PublicIcon />
              <Typography className={classes.contactInfoText}>
                <a
                  href="https://wavez-dev.cf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.wavez.ca
                </a>
              </Typography>
            </div>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          className={classes.bookingBtn}
          onClick={onSubmit}
        >
          {t.contactUsPage.submitBtn}
        </Button>
      </div>
    </>
  )
}
export default ContactUs
