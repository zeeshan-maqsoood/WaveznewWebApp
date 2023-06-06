import React, { useState } from "react"
import Router from "next/router"
// i18n
// eslint-disable-next-line no-duplicate-imports
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  buttonDiv: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "1.6em",
    width: "200px"
  }
}))

const CheckInbox = (props) => {
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr
  const [done, setDone] = useState(false)

  return (
    <>
      <div style={{ fontSize: "18px", lineHeight: "2" }}>
        <p
          className='text-center'
          style={{ fontWeight: "500", font: "Roboto" }}
        >
          {t.checkInboxPage.header}
        </p>
        <hr></hr>
        <p className='text-center' style={{ fontWeight: "400" }}>
          {props.messageContent}
        </p>
        <div
          className={classes.buttonDiv}
        >
          <input
            className='btn btn-primary btn-lg btn-block'
            id='sign_up'
            type='button'
            defaultValue={t.checkInboxPage.buttonText}
            onClick={() => {
              console.log("close button here")
              Router.reload()
            }}
          />
        </div>
      </div>
    </>
  )
}
export default CheckInbox
