import React from "react"
import { makeStyles } from "@material-ui/core/styles"
// eslint-disable-next-line no-duplicate-imports
import { withStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import StarRateRoundedIcon from "@material-ui/icons/StarRateRounded"
import theme from "../../src/theme"
import Rating from "@material-ui/lab/Rating"
import ImageCardHolder from "../imageCardHolder"
import { useRouter } from 'next/router'

const useStyles = makeStyles((theme) => ({
  card_container: {
    borderRadius: "20px"
  },
  boat_card_name: {
    float: "left",
    color: theme.palette.wavezHome.reviewsText,
    fontWeight: 500,
    fontSize: "22px",
    fontFamily: "Nunito Sans, Roboto, sans-serif",

    [theme.breakpoints.down("sm")]: {
      fontSize: "16px"
    }
  },
  boat_card_price: {
    float: "right",
    color: theme.palette.wavezHome.reviewsText,
    fontWeight: 500,
    fontSize: "22px",
    fontFamily: "Nunito Sans, Roboto, sans-serif",

    [theme.breakpoints.down("sm")]: {
      fontSize: "16px"
    }
  },
  boat_card_location: {
    color: theme.palette.buttonPrimary.main,
    fontWeight: 500,
    fontSize: "20px"
  },
  boat_card_description: {
    fontSize: "18px",
    color: theme.palette.boatCard.description
  },
  boat_image: {
    position: "relative"
  },
  heart_icon: {
    float: "right",
    position: "absolute",
    right: "4%",
    top: "88%",
    bottom: "5%"
  },
  heart_icon_a: {
    fill: "darkblue"
  },
  icons: {
    display: "inline",
    position: "absolute",
    bottom: "3%",
    left: "10px",
    color: theme.palette.background.default
  },
  card_img: {
    height: "400px",
    width: "100%",
    objectFit: "cover",
    [theme.breakpoints.down("md")]: {
      height: "300px"
    },

    [theme.breakpoints.down("sm")]: {
      height: "200px"
    }
  },
  card_img_lowRes: {
    height: "250px",
    width: "100%",
    objectFit: "cover",
    [theme.breakpoints.down("sm")]: {
      height: "200px"
    },
    [theme.breakpoints.down("xs")]: {
      height: "150px"
    }
  },
  priceInline: {
    display: "flex",
    justifyContent: "flex-end",
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  priceBlock: {
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  }
}))

const StyledRating = withStyles({
  iconFilled: {
    color: theme.palette.userReview.iconFilled
  },
  iconHover: {
    color: theme.palette.userReview.iconHover
  }
})(Rating)

const BoatCard = (props) => {
  const styles = useStyles()
  const router = useRouter()

  const goToListingInfo = (id) => { 
    console.log("In listing card.callListingInfo")
    router.push(`/listingInfo/${id}`)
  } 

  return (
    <Grid className={styles.card_container} item xs={12} sm={4} >
        <Card> 
          <ImageCardHolder vessel={props.vessel} image={props.img} title={props.name} passengers={props.numberOfPassengers} id={props.id} type={props.type} />
          <CardContent onClick={() => goToListingInfo(props.id)} style={{cursor: "pointer"}}>
            <Grid item xs={12} container>
              <Grid item xs container direction="column" spacing={0}>
                <Grid item xs container direction="row" spacing={0}>
                  <Grid item xs md={9}>
                    <Typography color="textPrimary" variant="body1" noWrap>
                      {props.name || "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={false} sm={false} md={3} className={styles.priceInline}>
                    <Typography color="textPrimary" variant="body1">${props.price}</Typography>
                  </Grid>
                </Grid>
                <Grid item xs>
                  <Typography variant="body1" noWrap
                    color="primary">
                     <StyledRating
                        name='customized-color'
                        defaultValue={props?.vessel?.averageRating}
                        getLabelText={(value) =>
                          `${value} Heart${value !== 1 ? "s" : ""}`
                        }
                        precision={0.5}
                        icon={<StarRateRoundedIcon fontSize='medium' />}
                        disabled
                      />
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography variant="body1" noWrap color="primary">
                    {props.location || "-"}
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography variant="body1" color="secondary" noWrap>
                    {props.description || "-"}
                  </Typography>
                </Grid>
                <Grid item xs sm md={false} className={styles.priceBlock}>
                  <Typography color="textPrimary" variant="body1">${props.price}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
    </Grid>
  )
}

export default BoatCard
