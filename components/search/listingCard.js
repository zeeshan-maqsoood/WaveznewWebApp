import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import clsx from "clsx"
import { Card, Button } from "@material-ui/core"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import CardActionArea from "@material-ui/core/CardActionArea"
import ImageCardHolder from "../imageCardHolder"
import { useRouter } from 'next/router'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    height: "100%",
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10
  },
  imageContainer: {
    position: "relative"
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  favouriteIcon: {
    position: "absolute",
    bottom: 5,
    right: 5
  },
  peopleIcon: {
    position: "absolute",
    bottom: 5,
    left: 15,
    color: theme.palette.background.default
  }
}))
export default function ListingCard({image, title, price, passengers, id, type, vessel}) {
  const classes = useStyles() 
  const router = useRouter()
  
  const goToListingInfo = (id) => {
    router.push(`/listingInfo/${id}`)
  } 

  return (
    <>     
      <Card className={classes.root} key={id} >
        <ImageCardHolder vessel={vessel} image={image} title={title} passengers = {passengers} id={id} type={type} />
        <CardContent onClick={() => goToListingInfo(id)} style={{cursor: "pointer"}}>
            {/* Title */}
            <Typography variant='body1' color='textPrimary' component='p'>
              {title}
            </Typography>
            {/* Price */}
            <Typography variant='body2' color='textSecondary' component='p'>
              {price}
            </Typography>
        </CardContent>
      </Card>
    </>
  )
}
