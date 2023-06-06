import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import FormControl from "@material-ui/core/FormControl"
import OutlinedInput from "@material-ui/core/OutlinedInput"
import FormHelperText from "@material-ui/core/FormHelperText"
import InputLabel from "@material-ui/core/InputLabel"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import NavBar from "../../components/navbar/navBar"
import API from "../../pages/api/baseApiIinstance"
import { Alert, AlertTitle } from "@material-ui/lab"
import Validation from "../../components/login/validation"
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import theme from "../../src/theme"

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: 50,
    width: "500px",
    marginRight: "auto",
    marginLeft: "auto",
    [theme.breakpoints.down("sm")]: {
      paddingTop: 7,
      width: "100%"
    }
  },
  header: {
    fontSize: "18px",
    fontWeight: 500,
    font: "Roboto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"

    }
  },
  input: {
    width: "400px",
    display: "flex",
    marginRight: "auto",
    marginLeft: "auto",
    [theme.breakpoints.down("xs")]: {
      width: "70%",
      height: "18%"
    }

  },
  validation: {
    margin: 20,
    marginLeft: 50
  },
  button: {
    color: theme.palette.wavezHome.backgroundColorSearch,
    fontSize: "16px",
    cursor: "pointer",
    background: theme.palette.buttonPrimary.main,
    width: "200px",
    height: "50px",
    borderRadius: "5px",
    border: "none",
    display: "flex",
    marginRight: "auto",
    marginLeft: "auto",
    textAlign: "center",
    marginBottom: "40px",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      width: "150px",
      height: "50px"

    }
  },
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
      marginLeft: "200"
    }
  }
}))

const SetPassword = (props) => {
  const classes = useStyles()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validateNewPassword, setValidateNewPassword] = useState("")
  const [validateConfirmPassword, setValidateConfirmPassword] = useState("")
  const [isValidated, setIsValidated] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [displaySetPasswordPage, setDisplaySetPasswordPage] = useState(false)
  const [invalidToken, setInvalidToken] = useState(false)
  const [error, setError] = useState()
  const [token, setToken] = useState("")
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  const onClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const onClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const validate = (values) => {
    setIsValidated(true)
    if (!values.password) {
      setIsValidated(false)
      setValidateNewPassword("Password required")
    } else if (values.password.length < 8 || values.password.length > 16) {
      setIsValidated(false)
      setValidateNewPassword("Password must be 8-16 characters")
    } else if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,16}$/.test(
        values.password
      )
    ) {
      setIsValidated(false)
      setValidateNewPassword(
        "Password must include at least 1 Uppercase, 1 Lowercase, 1 Number, and 1 special case"
      )
    }
    if (!values.confirmPassword) {
      setIsValidated(false)
      setValidateConfirmPassword("Password required")
    } else if (
      values.confirmPassword.length < 8 ||
      values.password.length > 16
    ) {
      setIsValidated(false)
      setValidateConfirmPassword("Password must be 8-16 characters")
    } else if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,16}$/.test(
        values.password
      )
    ) {
      setIsValidated(false)
      setValidateConfirmPassword(
        "Password must include at least 1 Uppercase, 1 Lowercase, 1 Number, and 1 special case"
      )
    }

    if (values.password !== values.confirmPassword) {
      setIsValidated(false)
      setValidateConfirmPassword("Confirm password must match password")
    }
  }

  const renderValidation = () => {
    return (
      <div>
        <Validation
          validated={/[A-Z]/.test(newPassword)}
          validationContent='Upper Case'
        />
        <Validation
          validated={/[a-z]/.test(newPassword)}
          validationContent='Lower Case'
        />
        <Validation
          validated={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(newPassword)}
          validationContent='Special Case'
        />
        <Validation
          validated={/\d/.test(newPassword)}
          validationContent='Number'
        />
        <Validation
          validated={newPassword.length >= 8 && newPassword.length <= 16}
          validationContent='Password is 8-16 characters'
        />
        <Validation
          validated={newPassword !== "" && newPassword === confirmPassword}
          validationContent='Confirmed Password matched'
        />
      </div>
    )
  }

  useEffect(() => {
    if (isValidated) {
      const passwordObject = {
        password: newPassword,
        confirmPassword
      }
      API()
        .post("setpassword", passwordObject, {
          headers: {
            authorization: `Bearer ${  token}`
          }
        })
        .then((response) => {
          console.log("SetPassword successfull")
          router.push("/")
        })
        .catch((e) => {
          console.log("SetPassword failed : ", e)
          setInvalidToken(true)
          setError("Set password fail")
        })
    }
    setIsValidated(false)
  }, [isValidated])

  const handleSetPassword = () => {
    const passwordObject = {
      password: newPassword,
      confirmPassword
    }
    console.log("in handleSetPassword: ", passwordObject)
    console.log("tokennnnnnn: ", token)
    //validation
    setValidateConfirmPassword("")
    setValidateNewPassword("")
    validate(passwordObject)
  }

  useEffect(() => {
    if (router.asPath !== router.route) {
      const { token } = router.query
      setToken(token)
      const tokenValidateApi = `validatePasswordToken/${  token}`
      API()
        .get(tokenValidateApi)
        .then((response) => {
          setDisplaySetPasswordPage(true)
          console.log("validatePasswordToken response: ", response)
        })
        .catch((e) => {
          console.log("get token wrong: ", tokenValidateApi)
          console.log("error from validatePasswordToken: ", e)
          setInvalidToken(true)
          setDisplaySetPasswordPage(false)
        })
    }
  }, [router])
  return (
    <>
      <NavBar />
      {displaySetPasswordPage && (
        <div className={classes.container}>
          {error && <span>{error}</span>}
          <p className={classes.header}>{props.header}</p>
          <hr></hr>
          <form method='post'>
            <FormControl variant='outlined' className={classes.input}>
              <InputLabel htmlFor='outlined-adornment-password'>
                {t.password}
              </InputLabel>
              <OutlinedInput
                inputProps={{ "data-testid": "password" }}
                id='outlined-adornment-password'
                type={showPassword ? "text" : "password"}
                name='newPassword'
                error={validateNewPassword !== ""}
                onChange={(event) => { setValidateNewPassword(""); setNewPassword(event.target.value) }}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={onClickShowPassword}
                      edge='end'
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={70}
              />
              {/* {validateNewPassword !== "" && (
                <FormHelperText error>{validateNewPassword}</FormHelperText>
              )} */}
            </FormControl>
            <br />
            <FormControl variant='outlined' className={classes.input}>
              <InputLabel htmlFor='outlined-adornment-password'>
                {t.setPasswordPage.confirmPassword}
              </InputLabel>
              <OutlinedInput
                inputProps={{ "data-testid": "confirmPassword" }}
                id='outlined-adornment-password'
                type={showConfirmPassword ? "text" : "password"}
                name='confirmPassword'
                error={validateConfirmPassword !== ""}
                onChange={(event) => { setValidateConfirmPassword(""); setConfirmPassword(event.target.value) }}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={onClickShowConfirmPassword}
                      edge='end'
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={132}
              />
              {/* {validateConfirmPassword !== "" && (
                <FormHelperText error>{validateConfirmPassword}</FormHelperText>
              )} */}
            </FormControl>
            <div className={classes.validation}> {renderValidation()}</div>
            <input
              data-testid='submitBtn'
              className={classes.button}
              id='sign_up'
              type='button'
              defaultValue='Set New Password'
              onClick={handleSetPassword}
            />
          </form>
        </div>
      )}
      {invalidToken && (
        <div className={classes.root}>
          <Alert severity='error'>
            <AlertTitle>Invalid Token</AlertTitle>
            Token is <strong>Invalid/Expired!</strong>
          </Alert>
        </div>
      )}
    </>
  )
}
export default SetPassword
