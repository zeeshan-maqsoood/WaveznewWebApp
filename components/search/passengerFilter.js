import React, { useEffect, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Router from "next/router"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import Counter from "../../pages/addList/counter"

// i18n
// eslint-disable-next-line no-duplicate-imports
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"

const useStyles = makeStyles((theme) => ({
  counterText: {
    fontSize: 24,
    width: "100%",
    display: "inline-block"
  }
}))

const PassengerFilter = ({ numPassengers, setNumPassengers, setNumPassengersShow, closeModal = () => { } }) => {
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  const classes = useStyles()

  useEffect(() => {
    setNumPassengersShow(numPassengers)
  }, [numPassengers])

  return (
    <>
      <Grid container>
        <Grid item xs={false} lg={1} />
        <Grid item xs={12} lg={11}>
          <Typography variant="h5" color="textPrimary">
            {t.search.filter.passengers}
          </Typography>
        </Grid>
        <Grid item xs={false} lg={1} />
        <Grid item xs={6} lg={6}>
          <Typography variant="h5" color="textSecondary">
            {t.search.filter.passDescription}
          </Typography>
        </Grid>
        <Grid item xs={6} lg={5} className={classes.counterText}>
          <Counter
            onMinus={() => setNumPassengers((currCount) => Math.max(currCount - 1, 1))}
            onPlus={() => setNumPassengers((currCount) => currCount + 1)}
            displayValue={numPassengers}
          />
        </Grid>
      </Grid>

      <Grid container >
        <Grid item xs={4} sm={7} />
        <Grid item xs={4} sm={2}>
          <Button
            onClick={() => closeModal(setNumPassengers(1), setNumPassengersShow(0))}
            variant="outlined"
            color="primary"
            style={{
              fontWeight: "400",
              textTransform: "capitalize",
              fontSize: "18px",
              maxWidth: "150px"
            }}
          >
            <Typography variant="body2" color="primary">
              {t.search.filter.clear}
            </Typography>
          </Button>
        </Grid>
        <Grid item xs={4} sm={2}>
          <Button
            onClick={() => {
              closeModal()
              setNumPassengersShow(numPassengers)
              setNumPassengers(numPassengers)
            }}
            variant="contained"
            color="primary"
            style={{
              fontWeight: "400",
              textTransform: "capitalize",
              fontSize: "18px",
              maxWidth: "150px"
            }}
          >
            <Typography variant="body2">{t.search.filter.save}</Typography>
          </Button>
        </Grid>
      </Grid>
    </>
  )
}
export default PassengerFilter
