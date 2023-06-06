import React, { useState, useEffect } from "react"
import TextField from "@material-ui/core/TextField"
import FormHelperText from "@material-ui/core/FormHelperText"
import ReactPhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { makeStyles } from "@material-ui/core/styles"
import Login from "./login"
import CheckEmailBox from "./checkEmailBox"
import API from "../../pages/api/baseApiIinstance"
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import { Grid } from "@material-ui/core"
import theme from "../../src/theme"

const useStyles = makeStyles((theme) => ({
  link: {
    color: theme.palette.buttonPrimary.main,
    cursor: "pointer"
  },
  registerButton: {
    backgroundColor: theme.palette.buttonPrimary.main,
    width: "100%",
    height: "50px",
    fontSize: 17,
    color: theme.palette.background.default,
    borderRadius: "5px",
    border: "none",
    marginTop: "5px"
  },
  container: {
    fontSize: "15px",
    lineHeight: "1.5",
    paddingLeft: 30,
    paddingRight: 30,
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 0,
      paddingRight: 0
    }
  },
  firstName: {
    paddingRight: "10px",
    [theme.breakpoints.down("xs")]: {
      paddingRight: "0px",
      marginBottom: "20px"
    }
  },
  lastName: {
    paddingLeft: "10px",
    [theme.breakpoints.down("xs")]: {
      paddingLeft: "0px"
    }
  },
  nameInput: {
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    }
  },
  header: {
    fontWeight: "500",
    font: "Roboto",
    textAlign: "center"
  },
  subheader: {
    fontWeight: "400",
    textAlign: "center"
  }
}))

const SignUp = (props) => {
  const classes = useStyles()
  const [login, setLogin] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [firstname, setFirstName] = useState()
  const [lastname, setLastName] = useState()
  const [email, setEmail] = useState()
  const [agreement, setAgreement] = useState(false)
  const [phone, setPhone] = useState()
  const [error, setError] = useState()
  const [validateFirstName, setValidateFirstName] = useState("")
  const [validateLastName, setValidateLastName] = useState("")
  const [validatePhone, setValidatePhone] = useState("")
  const [validateEmail, setValidateEmail] = useState("")
  const [validateAgreement, setValidateAgreement] = useState("")
  const [isValidated, setIsValidated] = useState(false)
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  const validate = (values) => {
    setIsValidated(true)
    if (!values.firstName) {
      setIsValidated(false)
      setValidateFirstName("First Name required")
    } else if (values.firstName.length > 25) {
      setIsValidated(false)
      setValidateFirstName("First Name should less than 25.")
    }

    if (!values.lastName) {
      setIsValidated(false)
      setValidateLastName("Last Name required.")
    } else if (values.lastName.length > 25) {
      setIsValidated(false)
      setValidateLastName("Last Name should less than 25.")
    }

    if (!values.phoneNumber) {
      setIsValidated(false)
      setValidatePhone("Phone Number required.")
    } else if (values.phoneNumber.length < 10) {
      setIsValidated(false)
      setValidatePhone("Phone Number should contain 10 digits.")
    }
    if (!values.email) {
      setIsValidated(false)
      setValidateEmail("Email required.")
    } else if (values.email.indexOf("@") < 0 || values.email.indexOf(".") < 0 || values.email.indexOf(".", values.email.indexOf("@")) < 0) {
      setIsValidated(false)
      setValidateEmail("Invalid Email Id.")
    } else if (values.email.length > 320) {
      setIsValidated(false)
      setValidateEmail("Email must be less than 320 characters.")
    } else if (values.email.substring(0, values.email.indexOf("@")).length > 64) {
      setIsValidated(false)
      setValidateEmail("Local part should be less than 64 characters.")
    } else if (
      values.email.substring(values.email.indexOf("@") + 1).length > 255
    ) {
      setIsValidated(false)
      setValidateEmail("Domain part should be less than 64 characters.")
    }
    if (values.agreementAccepted === false) {
      setIsValidated(false)
      setValidateAgreement("Please agree to the terms and conditions to proceed further.")
    }
  }

  const register = () => {   
    const user = {
      firstName: firstname,
      lastName: lastname,
      email,
      phoneNumber: phone,
      agreementAccepted: agreement
    }    
    validate(user)
  }

  const openInNewTab = (url) => {
    // const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    // if (newWindow) newWindow.opener = null
    console.log("doing something")
    const win = window.open(url, "_blank")
    win.focus()
  }

  const openConfigurationInPdfNewTab = (key) => {
    API()
        .get(`configuration/${key}`)
        .then((response) => {
          console.log("response is ", response)
          if (response?.data?.stringValue && response?.data?.stringValue !== "") {
            const win = window.open(response?.data?.stringValue, "_blank")
            win.focus()
          }
        })
        .catch((e) => {
          console.log("Error: ", e.response)
        })
  }

  useEffect(() => {
    if (isValidated) {
      const user = {
        firstName: firstname,
        lastName: lastname,
        email,
        phoneNumber: phone,
        agreementAccepted: agreement,
        strikeCount: 0,
        paymentDue: 0
      }
      API()
        .post("users/signup", user)
        .then((response) => {
          console.log("response is ", response)
          if (response.data.status === false) {
            setError(response.data.message)
          } else {
            setSubmitted(true)
          }
        })
        .catch((e) => {
          console.log("Error: ", e.response)
          setValidateEmail(e.response.data.message)
          setIsValidated(false)
        })
    }
  }, [isValidated])

  return (
    <>
      {!login ? (
        !submitted ? (
          <div className={classes.container}>
            <p
              className={classes.header}
            >
              {t.signup}
            </p>
            <hr></hr>
            <p className={classes.subheader}>
              {t.signupPage.header}
            </p>
            <form method="post">
              <Grid container style={{ display: "flex" }}>
                <Grid item xs={12} sm={6} className={classes.firstName}>
                  <TextField
                    inputProps={{ "data-testid": "firstName" }}
                    label={t.signupPage.firstName}
                    type="text"
                    variant="outlined"
                    name="firstname"
                    size="small"
                    defaultValue={firstname}
                    onFocus={() => setValidateFirstName("")}
                    onChange={(event) => setFirstName(event.target.value)}
                    error={validateFirstName !== ""}
                    className={classes.nameInput}
                  />
                  {validateFirstName !== "" && (
                    <FormHelperText error>
                      {validateFirstName}
                    </FormHelperText>)}
                </Grid>
                <Grid item xs={12} sm={6} className={classes.lastName}>
                  <TextField
                    inputProps={{ "data-testid": "lastName" }}
                    label={t.signupPage.lastName}
                    type="text"
                    variant="outlined"
                    name="lastname"
                    size="small"
                    defaultValue={lastname}
                    onFocus={() => setValidateLastName("")}
                    onChange={(event) => setLastName(event.target.value)}
                    error={validateLastName !== ""}
                    className={classes.nameInput}
                  />
                  {validateLastName !== "" && (
                    <FormHelperText error>
                      {validateLastName}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
              <div style={{ marginBottom: 20, marginTop: 20 }}>
                <ReactPhoneInput
                  inputProps={{ "data-testid": "phone" }}
                  inputStyle={{ width: "100%", height: "40px", borderColor: validatePhone !== "" ? theme.palette.error.main: theme.palette.navBar.darkerGrey }}
                  country={"ca"}
                  countryCodeEditable={false}
                  onlyCountries={['ca']}
                  value={phone}
                  onFocus={() => setValidatePhone("")}
                  onChange={setPhone}
                />
                {validatePhone !== "" && (
                  <FormHelperText error>
                    {validatePhone}
                  </FormHelperText>
                )}
              </div>
              <div>
                <TextField
                  style={{ width: "100%" }}
                  inputProps={{ "data-testid": "email" }}
                  label={t.email}
                  type="email"
                  name="email"
                  size="small"
                  variant="outlined"
                  defaultValue={email}
                  onFocus={() => setValidateEmail("")}
                  onChange={(event) => setEmail(event.target.value)}
                  error={validateEmail !== ""}
                />
                {validateEmail !== "" && (
                  <FormHelperText error>
                    {validateEmail}
                  </FormHelperText>
                )}
              </div>
              <div style={{ marginTop: 20 }}>
                  <input
                    data-testid="agreementBox"
                    name="agreement"
                    type="checkbox"
                    value={agreement}
                    style={{ marginRight: 10, textAlign: "center", cursor: "pointer" }}
                    onFocus={() => setValidateAgreement("")}
                    onClick={() => setAgreement(!agreement)}
                  />
                  <span>
                    {t.signupPage.agreement}{" "}
                    <a className={classes.link} onClick={() => openConfigurationInPdfNewTab("TERMS_OF_SERVICE_PAGE_CONTENT")}> {t.signupPage.termsOfUse}</a>,&nbsp;
                    <a className={classes.link} onClick={() => openConfigurationInPdfNewTab("COMMUNITY_GUIDELINES_PAGE_CONTENT")}>
                      {t.signupPage.guidelines}
                    </a> {t.signupPage.and} <a className={classes.link} onClick={() => openConfigurationInPdfNewTab("PRIVACY_POLICY_PAGE_CONTENT")}> {t.signupPage.privacyPolicy}</a>
                  </span>
                {validateAgreement !== "" && (
                  <FormHelperText error>
                    {validateAgreement}
                  </FormHelperText>
                )}
              </div>
              <input
                data-testid="submitBtn"
                className={classes.registerButton}
                id="sign_up"
                type="button"
                defaultValue={t.signup}
                onClick={register}
              />
            </form>
            <div
              style={{ marginTop: "2em", display: "flex" }}
            >
              <span>
                {t.signupPage.alreadyHave}{" "}
                <a className={classes.link} onClick={() => setLogin(true)}>
                  {t.login}
                </a>
              </span>
            </div>
          </div>
        ) : (
          <CheckEmailBox messageContent={t.checkInboxPage.instructions} />
        )
      ) : (
        <Login />
      )}
    </>
  )
}
export default SignUp
