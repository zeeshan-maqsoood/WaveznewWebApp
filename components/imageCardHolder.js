import React, { useState, useEffect, useContext } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Card, Button } from "@material-ui/core"
import CardMedia from "@material-ui/core/CardMedia"
import Snackbar from "@material-ui/core/Snackbar"
import IconButton from "@material-ui/core/IconButton"
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder"
import FavoriteIcon from "@material-ui/icons/Favorite"
import PeopleIcon from "@material-ui/icons/People"
import CloseIcon from "@material-ui/icons/Close"
import CardActionArea from "@material-ui/core/CardActionArea"
import API from "../pages/api/baseApiIinstance"
import Session from "../sessionService"
import { Modal } from "react-responsive-modal"
import ShortListFull from "../components/favourite/shortListFull"
import Context from "../store/context"
import { useRouter } from "next/router"
import ErrorMessageModal from "../pages/editListing/photos/errorMessageModal"
import LoginPrompt from "../components/addList/loginPrompt"
import Login from "../components/login/login"
import HeartIcon from "../components/favourite/heartIcon"
import theme from "../src/theme"

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    height: "95%",
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
  },
  customModal: {
    padding: '41px',
    maxWidth: '616px',
    borderRadius: 10
  }
}))
export default function ImageCardHolder({
  image,
  title,
  passengers,
  id,
  type,
  vessel
}) {
  const classes = useStyles()
  const router = useRouter()
  const token = Session.getToken("Wavetoken")
  const favourite = token !== "" && Session.getFavourite() ? JSON.parse(Session.getFavourite()) : ""

  const handleOnclickImage = () => { 
    console.log("In listing card.callListingInfo")
    router.push(`/listingInfo/${id}`)
  } 

  return (
    <>    
      <div className={classes.imageContainer}>
        <CardActionArea>
          <CardMedia onClick={handleOnclickImage} className={classes.media} image={image} title={title} />
        </CardActionArea>
        <span className={classes.peopleIcon}>
          <PeopleIcon />
          {passengers}
        </span>
        <div className ={classes.favouriteIcon}><HeartIcon vessel={vessel} id={id} type={type}/></div>  
      </div>
    </>
  )
}