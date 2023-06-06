import React from "react"
import Link from "next/link"
import { makeStyles } from "@material-ui/core/styles"
// i18n
import { useRouter } from "next/router"
import en from "../locales/en.js"
import fr from "../locales/fr.js"
import theme from "../src/theme"

const useStyles = makeStyles((theme) => ({
  covid_container: {
    background: `${theme.palette.background.darkerGrey} center`,
    height: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  covid_container_a: {
    color: theme.palette.background.default,
    "&:hover": {
      color: theme.palette.background.default
    }
  },
main_div:{
        background: theme.palette.covidResponse.background,
        height: "30px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
}))

const CovidResponse = (props) => {
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr
  return (
    <>
      <div className={classes.main_div}>
        <Link legacyBehavior href="/information/covid-19">
          <a
            style={{
              color: theme.palette.background.default,
              '&:hover': {
                color: theme.palette.background.default,
              },
            }}
          >
            {props?.bannerData?.bannerTitle?.stringValue
              ? props?.bannerData?.bannerTitle?.stringValue
              : t.covidHeader}
          </a>
        </Link>
      </div>
    </>
  );
}

export default CovidResponse
