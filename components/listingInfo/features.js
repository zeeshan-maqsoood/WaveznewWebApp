import React, { useContext, useEffect, useState, useRef } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Grid } from "@material-ui/core"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import theme from "../../src/theme"

// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  contentTitle: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: "24px",
    color: theme.palette.title.matterhorn,
    marginLeft: "5%",
    marginTop: "30px",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "5px"
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "5px"
    }
  },
  featuresContent: {
    marginLeft: "5%",
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "5px"
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "5px"
    }
  }
}))

export default function Features({features, rope, faKit, light, jacket}) {
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  useEffect(() => {
    rope !== "" && features.push({feature: rope})
    faKit !== "" && features.push({feature:faKit})
    light !== "" && features.push({feature:light})
    jacket !== "" && features.push({feature:jacket})
    console.log("Feature is : ", features)
  }, [features])

  return (
    <>
      {/* Features */}
      <Grid item className={classes.contentTitle}>
        {t.listingInfo.features}
        <div
          style={{
            borderBottom: `1px solid${  theme.palette.background.grayish}`,
            marginTop: "5px",
            marginBottom: "20px"
          }}
        />
      </Grid>

      <Grid container className={classes.featuresContent} >
        {features?.map((item) => (
          <Grid key={item.feature} item xs={6}>
            <FormControlLabel
              control={<Checkbox disabled checked />}
              label={item?.feature}
            />{" "}
          </Grid>
        ))}
      </Grid>
    </>
  )
}
