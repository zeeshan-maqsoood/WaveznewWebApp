import React, { Component, useState, useEffect, useContext } from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  Paper,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  FormHelperText
} from "@material-ui/core"
import Session from "../../sessionService"
import theme from "../../src/theme"
import Rating from "@material-ui/lab/Rating"
import API from "../../pages/api/baseApiIinstance"

// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    overflow: "auto",
    flexDirection: "column"
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: 600,
    overflow: "auto",
    flexDirection: "column"
  },
  saveDiv: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px"
  },
  textArea: {
    width: "95%",
    marginLeft: "15px"
  },
  reviewTxt: {
    textAlign: "center",
    fontSize: 16
  },
  btm: {
    borderBottom: `solid${  theme.palette.buttonPrimary.main}`,
    width: "60px",
    marginBottom: 10,
    margin: "auto"
  },
  heading: {
    fontSize: "16px", 
    fontWeight: 500, 
    marginTop: "15px", 
    marginLeft: "15px", 
    color: theme.palette.title.matterhorn
  }
})

export default function ReviewModal({reviewItem, close, fetchPastTrips}) {
  const token = Session.getToken("Wavetoken")
  const router = useRouter()
  const classes = useStyles()
  const { locale } = router
  const t = locale === "en" ? en : fr
  const [reviewText, setReviewText] = useState("")
  const [reviewRating, setReviewRating] = useState(0)
  const [ratingError, setRatingError] = useState(false)

  // max character
  const CHARACTER_LIMIT = 500
  
  const onClickPost = () => {
    setRatingError(false)
    reviewRating ? saveReview() : setRatingError(true)
  }

  const saveReview = () => {
    const reqBody = {
      tripId: reviewItem?._id,
      description: reviewText, 
      rating: reviewRating
    }
    API()
    .post(`reviews/${reviewItem?.vessel?._id}`, reqBody, {
      headers: {
        authorization: `Bearer ${  token}`
      }
    })
    .then((response) => {
      fetchPastTrips()
      close()
    })
    .catch((e) => {
      console.log("error: ", e)
    })
  }

  return (
    <>
      <div className={classes.paper}>
        <h2 className={classes.reviewTxt}>
          {t.review.reviewHeader}
        </h2>
        <Grid><div className={classes.btm} /></Grid>

          <Typography
            component="legend"
            className={classes.heading}
          >
            {t.review.rateYourExp}
          </Typography>
          <Rating
            style={{ marginTop: "15px", marginLeft: "15px" }}
            name="ratingValue"
            value={reviewRating}
            onChange={(event) => setReviewRating(event.target.value)}
          />

        {/* Text Box */}
        <p className={classes.heading}>
          {t.review.reviewComments}
        </p>
        <TextField
          inputProps={{ "data-testid": "TextBox", maxLength: CHARACTER_LIMIT }}
          className={classes.textArea}
          multiline
          rows={4}
          value={reviewText}
          onChange={(event) => setReviewText(event.target.value)}
          variant="outlined"
          helperText={`${reviewText.length}/${CHARACTER_LIMIT}`}
        />
        <FormHelperText error style={{paddingLeft: 15}}> {ratingError ? t.review.ratingError : null} </FormHelperText>
        {/* Bottom Div Buttons */}
        <Grid item xs={12} className={classes.saveDiv}>
          <Button
            variant="contained"
            onClick={() => onClickPost()}
            style={{
              fontWeight: "400",
              textTransform: "capitalize",
              backgroundColor: theme.palette.buttonPrimary.main,
              color: "white",
              fontSize: "18px",
              maxHeight: "50px",
              maxWidth: "250px"
            }}
          >
            {t.review.post}
          </Button>

          <Button
            onClick={close}
            style={{
              textTransform: "capitalize",
              backgroundColor: "white",
              fontWeight: "400",
              fontSize: "18px",
              color: theme.palette.buttonPrimary.main,
              height: "60%",
              marginLeft: "10px"
            }}
            data-testid="saveBtn"
          >
             {t.review.cancel}
          </Button>
        </Grid>
      </div>
    </>
  )
}
