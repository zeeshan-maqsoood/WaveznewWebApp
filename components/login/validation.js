import React, { useEffect } from "react"
import CheckIcon from "@material-ui/icons/Check"
import ClearIcon from "@material-ui/icons/Clear"
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import theme from "../../src/theme"

const Validation = (props) => {
  const router = useRouter()

  const { locale } = router
  const t = locale === "en" ? en : fr

  return (
    <>
      <div style={{ display: "flex", paddingBottom: "5px" }}>
        <span>
          {props.validated ? (
            <CheckIcon data-testid='checkicon' style={{ color: theme.palette.background.green }} />
          ) : (
            <ClearIcon data-testid='clearicon' style={{ color: theme.palette.error.main }} />
          )}</span>
        <span>{props.validationContent}</span>
      </div>
    </>
  )
}

export default Validation
