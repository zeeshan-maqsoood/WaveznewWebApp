import React, { useState, useEffect, useContext } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Card, Button } from "@material-ui/core"
import CardMedia from "@material-ui/core/CardMedia"
import Snackbar from "@material-ui/core/Snackbar"
import IconButton from "@material-ui/core/IconButton"
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder"
import FavoriteIcon from "@material-ui/icons/Favorite"
import CloseIcon from "@material-ui/icons/Close"
import API from "../../pages/api/baseApiIinstance"
import Session from "../../sessionService"
import { Modal } from "react-responsive-modal"
import ShortListFull from "../favourite/shortListFull"
import Context from "../../store/context"
import { useRouter } from "next/router"
import ErrorMessageModal from "../../pages/editListing/photos/errorMessageModal"
import LoginPrompt from "../addList/loginPrompt"
import Login from "../login/login"
import theme from "../../src/theme"
// i18n
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
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
    color: "white"
  },
  customModal: {
    padding: '41px',
    maxWidth: '616px',
    borderRadius: 10
  },
  addShortListVesselInfo: {
    fontSize: 16,
    textTransform: "none"
  }
}))
export default function HeartIcon({ id, type, inVesselInfo, vessel}) {
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr
  const [open, setOpen] = useState(false)
  const [openShortlistSnackbar, setOpenShortListSnackbar] = useState(false)
  const [openDeleteMessage, setOpenDeleteMessage] = useState(false)
  const [shortListFull, setShortListFull] = useState(false)
  let token = Session.getToken("Wavetoken")
  let favourite = token !== "" && Session.getFavourite() ? JSON.parse(Session.getFavourite()) : ""
  const [color, setColor] = useState()
  const [isDelete, setIsDelete] = useState(false)
  const [shortlistLength, setShortlistLength] = useState(0)
  const [openDeleteInShortListMessage, setOpenDeleteInShortListMessage] = useState(false)
  const [openWarningModal, setOpenWarningModal] = useState(false)
  const { globalState, globalDispatch } = useContext(Context)

  const [login, setLogin] = useState(false)
  const [loginPrompt, setLoginPrompt] = useState(false)

  const onClosePrompt = () => {
    setLoginPrompt(false)
  }
  const onCloseModal = (closeState) => {
    setCloseState(closeState)
  }

  const buildFavouriteRequestBody = (data) => {
    return {
      favoriteRentals: data.favoriteRentals.map((item) => item._id),
      favoriteCharters: data.favoriteCharters.map((item) => item._id),
      favoriteStays: data.favoriteStays.map((item) => item._id),
      shortListRentals: data.shortListRentals.map((item) => item._id),
      shortListCharters: data.shortListCharters.map((item) => item._id),
      shortListStays: data.shortListStays.map((item) => item._id),
      _id: data._id
    }
  }

  const putIntoFavourite = (requestBody) => {
    API()
      .put(`favourite/${favourite._id}`, requestBody, {
        headers: {
          authorization: `Bearer ${  token}`
        }
      })
      .then((response) => {
        globalDispatch({ type: "SET_FAVOURITE_DATA", payload: response.data })
        const favObject = buildFavouriteRequestBody(response.data)
        setShortlistLength(
          favObject.shortListRentals.length +
            favObject.shortListCharters.length +
            favObject.shortListStays.length
        )
        Session.setFavourite(JSON.stringify(favObject))
        setTimeout(() => {
          globalDispatch({ type: "SET_FAVOURITE", payload: favObject })
        }, 1000)

      })
      .catch((e) => {
        console.log(e)
        // router.push("/somethingWentWrong");
      })
  }

  const createFavourite = () => {
    const requestBody = {
      favoriteRentals: type === "RENTAL" ? [id] : [],
      favoriteCharters: type === "CHARTER" ? [id] : [],
      favoriteStays: type === "STAY" ? [id] : []
    }
    API()
      .post(`favourite`, requestBody, {
        headers: {
          authorization: `Bearer ${  token}`
        }
      })
      .then((response) => {
        globalDispatch({ type: "SET_FAVOURITE_DATA", payload: response.data })
        const favObject = buildFavouriteRequestBody(response.data)
        Session.setFavourite(JSON.stringify(favObject))
        globalDispatch({ type: "SET_FAVOURITE", payload: favObject })
        colorSetter(favObject)
      })
      .catch((e) => {
        console.log(e)
        // router.push("/somethingWentWrong");
      })
  }

  //handle click to heart icon
  const handleClick = () => {
    if (token === "") {
      setLoginPrompt(true)
      return
    } 
    let isDeletee = false
    //fav exist in session storage or not
    if (token !== "" && favourite !== "" && favourite?._id !== "") {
      const shortListVessel = []
      const vessels = []
      let favReqBody = {}
      //get list of fav vessel id
      favourite?.favoriteRentals?.map((item) => vessels.push(item))
      favourite?.favoriteCharters?.map((item) => vessels.push(item))
      favourite?.favoriteStays?.map((item) => vessels.push(item))
      //get list of shortlist vessel
      favourite?.shortListRentals?.map((item) => shortListVessel.push(item))
      favourite?.shortListCharters?.map((item) => shortListVessel.push(item))
      favourite?.shortListStays?.map((item) => shortListVessel.push(item))
      //handle delete vessel in shortlist
      if (shortListVessel.filter((item) => item === id).length > 0) {
        setIsDelete(true)
        favReqBody = {
          shortListRentals:
            type === "RENTAL"
              ? favourite.shortListRentals.filter((item) => item !== id)
              : favourite.shortListRentals,
          shortListCharters:
            type === "CHARTER"
              ? favourite.shortListCharters.filter((item) => item !== id)
              : favourite.shortListCharters,
          shortListStays:
            type === "STAY"
              ? favourite.shortListStays.filter((item) => item !== id)
              : favourite.shortListStays
        }
        putIntoFavourite(favReqBody)
        setOpenDeleteInShortListMessage(true)
        return
      }
      //filter id to see it delete or update vessel in favourite list
      isDeletee =
        vessels.filter((item) => item === id).length > 0 ? true : false
      setIsDelete(isDeletee)
      if (isDeletee === false) {
        favReqBody = {
          favoriteRentals:
            type === "RENTAL"
              ? [...favourite?.favoriteRentals, id]
              : favourite?.favoriteRentals,
          favoriteCharters:
            type === "CHARTER"
              ? [...favourite?.favoriteCharters, id]
              : favourite?.favoriteCharters,
          favoriteStays:
            type === "STAY"
              ? [...favourite?.favoriteStays, id]
              : favourite?.favoriteStays
        }
      } else {
        //do delete api
        favReqBody = {
          favoriteRentals:
            type === "RENTAL"
              ? favourite?.favoriteRentals.filter((item) => item !== id)
              : favourite?.favoriteRentals,
          favoriteCharters:
            type === "CHARTER"
              ? favourite?.favoriteCharters.filter((item) => item !== id)
              : favourite?.favoriteCharters,
          favoriteStays:
            type === "STAY"
              ? favourite?.favoriteStays.filter((item) => item !== id)
              : favourite?.favoriteStays
        }
      }
      putIntoFavourite(favReqBody)
    } else if (token !== "" && favourite === "") {
      createFavourite()
    }
    //decide which snackbar show
    if (isDeletee) {
      setOpenDeleteMessage(true)
    } else {
      setOpen(true)
    }
  }

  const handleClose = (event, reason) => {
    setOpen(false)
  }

  const handleClickAddToShortlist = (id, type, vessel) => {
    if (favourite !== "") {
     // case shortlist is full
     const favObject=JSON.parse(Session.getFavourite())
     const length = favObject?.shortListRentals?.length +
            favObject?.shortListCharters?.length +
            favObject?.shortListStays?.length
      if (length >= 3) {
        setOpen(false)
        Session.setCandidate(vessel)
        setShortListFull(true)
        return
      }
      //build up request body
      const shortListReqBody = {
        favoriteRentals:
          type === "RENTAL"
            ? favourite.favoriteRentals.filter((item) => item !== id)
            : favourite.favoriteRentals,
        favoriteCharters:
          type === "CHARTER"
            ? favourite.favoriteCharters.filter((item) => item !== id)
            : favourite.favoriteCharters,
        favoriteStays:
          type === "STAY"
            ? favourite.favoriteStays.filter((item) => item !== id)
            : favourite.favoriteStays,
        shortListRentals:
          type === "RENTAL"
            ? [...favourite.shortListRentals, id]
            : favourite.shortListRentals,
        shortListCharters:
          type === "CHARTER"
            ? [...favourite.shortListCharters, id]
            : favourite.shortListCharters,
        shortListStays:
          type === "STAY"
            ? [...favourite.shortListStays, id]
            : favourite.shortListStays
      }
      putIntoFavourite(shortListReqBody)
    }
    setOpenShortListSnackbar(true)
  }

  const handleCloseShortlistSnackbar = () => {
    setOpenShortListSnackbar(false)
  }

  const colorSetter = (favouriteObject) => {
    const favVessels = []
    const shortListVessels = []

    favouriteObject.favoriteRentals?.map((item) => favVessels.push(item))
    favouriteObject.favoriteCharters?.map((item) => favVessels.push(item))
    favouriteObject.favoriteStays?.map((item) => favVessels.push(item))

    favouriteObject.shortListRentals?.map((item) =>
      shortListVessels.push(item)
    )
    favouriteObject.shortListCharters?.map((item) =>
      shortListVessels.push(item)
    )
    favouriteObject.shortListStays?.map((item) => shortListVessels.push(item))

    if (shortListVessels.filter((item) => item === id).length > 0) {
      setColor(theme.palette.favorite.shortList)
      
    } else if (favVessels.filter((item) => item === id).length > 0) {
      setColor(theme.palette.background.flamingo)
      
    } else {
      setColor()
      
    }
  }

  const handleViewShortList = () => {
    setOpenShortListSnackbar(false)
    if (shortlistLength > 3) {
      setShortListFull(true)
    } else {
      router.push("/favourite")
    }
  }

  const handleCloseShortListFull = () => {
    favourite = JSON.parse(Session.getFavourite())
    const shortListSize =
      favourite?.shortListRentals?.length +
      favourite?.shortListCharters?.length +
      favourite?.shortListStays?.length
    console.log("Short list length is ", shortListSize)
    if (shortListSize <= 3) {
      setShortListFull(false)
    } else {
      setOpenWarningModal(true)
    }
  }

  useEffect(() => {
    if (shortlistLength > 3) {
      setShortListFull(true)
    }
  }, [shortlistLength])

  useEffect(() => {
    setColor()
    setIsDelete(false)
  }, [isDelete])

  useEffect(() => {
    token = Session.getToken("Wavetoken")
    favourite =
      token !== "" && Session.getFavourite()
        ? JSON.parse(Session.getFavourite())
        : ""
    if (favourite !== "") {
      colorSetter(favourite)
    } else {
      setColor()
    }
  }, [
token,
    globalState.favourite.shortListRentals,
    globalState.favourite.shortListCharters,
    globalState.favourite.shortListStays,
    globalState.favourite.favoriteRentals,
    globalState.favourite.favoriteCharters,
    globalState.favourite.favoriteStays
  ])

  return (
    <>
    <Modal
          open={loginPrompt}
          onClose={() => setLoginPrompt(false)}
          classNames={{
            modal: classes.customModal
          }}
          center
      >
        <LoginPrompt closeModal={onClosePrompt} setLogin={() => setLogin(!login)} />
      </Modal>
      <Modal
          open={login}
          onClose={() => setLogin(false)}
          classNames={{
            modal: classes.customModal
          }}
          center
      >
        <Login onCloseModal={onCloseModal} />
      </Modal>
      <Modal open={shortListFull} onClose={handleCloseShortListFull} center>
        <ShortListFull onCloseModal={() => setShortListFull(false)} />
      </Modal>
      <Modal
        open={openWarningModal}
        onClose={() => setOpenWarningModal(false)}
        center
      >
        <ErrorMessageModal
          message='You can add maximum 3 listings to your shortlist. Please remove one from the list.'
          closeModal={() => setOpenWarningModal(false)}
        />
      </Modal>
  
        <IconButton  onClick={handleClick}>
          {color ? (
            <FavoriteIcon style={{ color }} />
          ) : (
            <FavoriteBorderIcon style={{ color: inVesselInfo ? theme.palette.text.grey : theme.palette.background.default }} />
          )}
        </IconButton>
        {color === theme.palette.background.flamingo && inVesselInfo ? <Button className={classes.addShortListVesselInfo} onClick={() => handleClickAddToShortlist(id, type, vessel)}>{t.favourite.addToShortList}</Button> : null}
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={open}
          autoHideDuration={5000}
          onClose={handleClose}
          message='Added to favourite'
          action={
            <React.Fragment>
              <Button
                style={{ color: theme.palette.favorite.addshortListTxt, textTransform: "none" }}
                variant='text'
                size='small'
                onClick={() => handleClickAddToShortlist(id, type, vessel)}
              >
                {t.favourite.addToShortList}
              </Button>
              <IconButton
                size='small'
                aria-label='close'
                color='inherit'
                onClick={handleClose}
              >
                <CloseIcon fontSize='small' />
              </IconButton>
            </React.Fragment>
          }
        />
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={openShortlistSnackbar}
          autoHideDuration={5000}
          onClose={handleCloseShortlistSnackbar}
          message={`Added to Shortlist (${shortlistLength}/3)`}
          action={
            <React.Fragment>
              <Button
                style={{ color: theme.palette.favorite.addshortListTxt, textTransform: "none" }}
                variant='text'
                size='small'
                onClick={handleViewShortList}
              >
                {t.favourite.viewShortList}
              </Button>
              <IconButton
                size='small'
                color='inherit'
                onClick={handleCloseShortlistSnackbar}
              >
                <CloseIcon fontSize='small' />
              </IconButton>
            </React.Fragment>
          }
        />
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={openDeleteMessage}
          autoHideDuration={5000}
          onClose={() => setOpenDeleteMessage(false)}
          message='Removed from Favourite'
          action={
            <React.Fragment>
              <IconButton
                size='small'
                color='inherit'
                onClick={() => setOpenDeleteMessage(false)}
              >
                <CloseIcon fontSize='small' />
              </IconButton>
            </React.Fragment>
          }
        />
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={openDeleteInShortListMessage}
          autoHideDuration={5000}
          onClose={() => setOpenDeleteInShortListMessage(false)}
          message='Removed from Shortlist'
          action={
            <React.Fragment>
              <IconButton
                size='small'
                color='inherit'
                onClick={() => setOpenDeleteInShortListMessage(false)}
              >
                <CloseIcon fontSize='small' />
              </IconButton>
            </React.Fragment>
          }
        />
    </>
  )
}
