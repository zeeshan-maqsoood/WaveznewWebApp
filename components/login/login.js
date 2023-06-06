import React, {Component, useState, useEffect, useContext} from "react"
import FormControl from "@material-ui/core/FormControl"
import TextField from "@material-ui/core/TextField"
import OutlinedInput from "@material-ui/core/OutlinedInput"
import FormHelperText from "@material-ui/core/FormHelperText"
import InputLabel from "@material-ui/core/InputLabel"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import API from "../../pages/api/baseApiIinstance"
import { makeStyles } from "@material-ui/core/styles"
import SignUp from "./signUp"
import ForgetPassword from "./forgetPassword"
import Session from "../../sessionService"
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import { Grid } from "@material-ui/core"
import theme from "../../src/theme"
import Context from "../../store/context"

const useStyles = makeStyles((theme) => ({
  error: {
    color: theme.palette.error.main,
    marginTop: 20,
    marginBottom: 10
  },
  loginContainer: {
    fontSize: "15px",
    lineHeight: "1.5",
    paddingLeft: 30,
    paddingRight: 30,
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 0,
      paddingRight: 0
    }
  },
  loginHeader: {
    fontWeight: "500",
    font: "Roboto",
    textAlign: "center"
  },
  rememberMe: {
    marginRight: 10,
    textAlign: "center"
  },
  loginButton: {
    backgroundColor: theme.palette.buttonPrimary.main,
    width: "100%",
    height: "50px",
    fontSize: 17,
    color: theme.palette.background.default,
    borderRadius: "5px",
    border: "none"
  },
  suggestion: {
    flexDirection: "column",
    marginTop: 20,
    display: "flex"
  },
  link: {
    color: theme.palette.buttonPrimary.main,
    cursor: "pointer"
  },
  password: {
    marginTop: 20,
    marginBottom: 20,
    width: "500px",
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    }
  },
  passwordInput: {
    width: "475px",
    height: "40px",
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    }
  },
  smallPadding: {
    padding: 12
  }
}))

const Login = (props) => {
  const classes = useStyles()
  const [forget, setForget] = useState(false)
  const [signup, setSignup] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState()
  const [email, setEmail] = useState(window.localStorage.getItem("email"))
  const [error, setError] = useState()
  const [validateEmail, setValidateEmail] = useState("")
  const [validatePassword, setValidatePassword] = useState("")
  const [isValidated, setIsValidated] = useState(false)
  const [rememberMe, setRememberMe] = useState(window.localStorage.getItem("email") ? true:false)
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr
  const {globalDispatch} = useContext(Context)
  const onClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const validate = (values) => {
    setIsValidated(true)
    if (!values.email) {
      setIsValidated(false)
      setValidateEmail("Email required.")
    }
    if (!values.password) {
      setIsValidated(false)
      setValidatePassword("Password required")
    }
  }

  const handleLogin = () => {
    const accountData = { email, password }

    setValidateEmail("")
    setValidatePassword("")
    setError("")

    if (rememberMe) {
      window.localStorage.setItem("email", email)
    } else {
      window.localStorage.clear()
    }

    validate(accountData)   
  }

  const handleRememberMe = () => {
    setRememberMe(event.target.checked)
  }

  useEffect(() => {
    if (isValidated) {
      const accountData = { email, password }
      API()
        .post("signin", accountData, {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json"
          }
        })
        .then((response) => {
          console.log("account login is : ", accountData)
          console.log("signin response: ", response)
          Session.setTheme(response.data.theme)
          Session.setToken(response.data.token)
          Session.setUserInitials(response.data.userInitials)
          response.data.notification 
          ? Session.setNotifications(response.data.notification) 
          : Session.setNotifications({user: response.data.userId, listings: 0, trips: 0, conversations: 0})
          Session.setUserLoggedInData(response.data)
          Session.setUserId(response.data.userId)
          Session.setProfileImage(response.data.profileImageUrl)
          Session.setFirstName(response.data.firstName)
          Session.setLastName(response.data.lastName)
          Session.setIsVesselOwner(response.data.isVesselOwner)

          console.log("get from local storage : ", accountData)
          if (response.data.isAdmin || response.data.isPseudoAdmin) {
            globalDispatch({type: "SET_PSEUDO_LOGIN", payload: true})
            router.push("/admin-panel")
          } else {
            router.reload()
          }

        })
        .catch((e) => {
          if (e.response !== undefined) {
            setError(e.response.data.message)
            console.log("login error: ", e.response)
          }
        })
    }
    setIsValidated(false)
  }, [isValidated])

  return (
    <Grid container>
      {!signup ? (
        !forget ? (
          <Grid item xs={12} className={classes.loginContainer}>
            <p className={classes.loginHeader}>{t.login}</p>
            <hr></hr>
            <form method="post">
              <TextField
                inputProps={{ "data-testid": "email" }}
                label={t.email}
                type="email"
                variant="outlined"
                name="email"
                defaultValue={email}
                onFocus={() => setValidateEmail("")}
                onChange={(event) => setEmail(event.target.value)}
                error={validateEmail !== ""}
                size="small"
                style={{ width: "100%", marginBottom: "5px" }}
              />
              {validateEmail !== "" && (
                <FormHelperText error>{validateEmail}</FormHelperText>
              )}
              <div className={classes.password}>
                <FormControl variant="outlined">
                  <InputLabel
                    htmlFor="outlined-adornment-password"
                    style={{ width: "100%", height: "40px", top: -8 }}
                  >
                    {t.password}
                  </InputLabel>
                  <OutlinedInput
                    inputProps={{ "data-testid": "password" }}
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    error={validatePassword !== ""}
                    onFocus={() => setValidatePassword("")}
                    onChange={(event) => setPassword(event.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    labelWidth={70}
                    className={classes.passwordInput}
                    classes={{input: classes.smallPadding}}
                  />
                </FormControl>
                {validatePassword !== "" && (
                  <FormHelperText error>{validatePassword}</FormHelperText>
                )}
                {error && (
                  <div className={classes.error} data-testid="errorMessage">
                    {error}
                  </div>
                )}
              </div>
              <div>
                <label>
                  <input
                    name="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onClick={handleRememberMe}
                    className={classes.rememberMe}
                  />
                  <span>{t.loginPage.remember}</span>
                </label>
              </div>
              <input
                className={classes.loginButton}
                id="login"
                type="button"
                value={t.login}
                data-testid="submitBtn"
                onClick={handleLogin}
              />
            </form>
            <div className={classes.suggestion}>
              <a className={classes.link} onClick={() => setForget(true)}>
                {t.loginPage.forgot}
              </a>
              <span>
                {t.loginPage.donthave}{" "}
                <a className={classes.link} onClick={() => setSignup(true)}>
                  {t.signup}
                </a>
              </span>
            </div>
          </Grid>
        ) : (
          <ForgetPassword />
        )
      ) : (
        <SignUp />
      )}
    </Grid>
  )
}
export default Login
