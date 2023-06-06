import React, { useState, useEffect } from "react"
import TextField from "@material-ui/core/TextField"
import CheckInbox from "./checkEmailBox"
import FormHelperText from "@material-ui/core/FormHelperText"

// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import API from "../../pages/api/baseApiIinstance"
import theme from "../../src/theme"

const ForgetPassword = (props) => {
  const [email, setEmail] = useState()
  const [openCheckEmailBox, setOpenCheckEmailBox] = useState(false)
  const [error, setError] = useState("")
  const [isValidated, setIsValidated] = useState(false)
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  const validate = (values) => {
    setIsValidated(true)
    if (!values.email) {
      setIsValidated(false)
      setError("Email required.")
    }
  }

  const handleForgetPassword = () => {
    setError("")
    validate({ email })
  }

  useEffect(() => {
    if (isValidated) {
      API()
        .post(
          "users/forgetPassword",
          { email },
          {
            headers: {
              accept: "application/json",
              "Content-Type": "application/json"
            }
          }
        )
        .then((response) => {
          console.log("forget password success: ", response)
          setOpenCheckEmailBox(true)
        })
        .catch((e) => {
          console.log(e.response)
          setOpenCheckEmailBox(false)
          setError(e.response.data.message)
        })
    }
    setIsValidated(false)
  }, [isValidated])

  return (
    <>
      {openCheckEmailBox ? (
        <CheckInbox
          messageContent={t.checkInboxPage.instructionsResetPassword}
        />
      ) : (
        <div style={{ fontSize: "18px", lineHeight: "2" }}>
          <p
            style={{ fontWeight: "500", font: "Roboto", textAlign: "center" }}
          >
            {t.forgotPasswordPage.header}
          </p>
          <hr></hr>
          <p style={{ fontWeight: "400", textAlign: "center" }}>
            {t.forgotPasswordPage.instructions}
          </p>

          <form method='post'>
            <div >
              <TextField
                inputProps={{ "data-testid": "email" }}
                label={t.email}
                type='email'
                variant='outlined'
                name='email'
                style={{ marginBottom: "20px", width: "100%" }}
                error={error !== ""}
                onFocus={() => setError("")}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error !== "" && <FormHelperText error>{error}</FormHelperText>}
            </div>
            <input
              data-testid='submitBtn'
              id='sign_up'
              type='button'
              defaultValue={t.forgotPasswordPage.buttonText}
              onClick={handleForgetPassword}
              style={{
                backgroundColor: theme.palette.buttonPrimary.main,
                width: "100%",
                height: "50px",
                fontSize: 17,
                color: theme.palette.background.default,
                borderRadius: "5px",
                border:"none",
                marginTop: "10px"
              }}
            />
          </form>
        </div>
      )}
    </>
  )
}
export default ForgetPassword
