import React, { useState, useContext, useEffect } from "react"
import NavBar from "../../components/navbar/navBar"
import { makeStyles } from "@material-ui/core/styles"
import { Grid } from "@material-ui/core"

import AddListing from "./addListing"
import Context from "../../store/context"
import Session from "../../sessionService"
import LoginPrompt from "../../components/addList/loginPrompt"
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import BaseApiInstance from "../api/baseApiIinstance"
import { Modal } from "react-responsive-modal"
import Login from "../../components/login/login"
import theme from "../../src/theme"

const addListScreen = (props) => {
  const { globalState, globalDispatch } = useContext(Context)
  const [userName, setUserName] = useState("")
  const token = Session.getToken("Wavetoken")
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")

  const onClickGetStarted = () => {
    // setGetStarted(true);
    globalDispatch({ type: "GET_STARTED", payload: true })
  }

  const useStyles = makeStyles((theme) => ({
    container: {
      paddingTop: 89,
      paddingLeft: 57,
      [theme.breakpoints.down("sm")]: {
        paddingLeft: 40
      },
      [theme.breakpoints.down("xs")]: {
        paddingTop: 20
      }
    },
    header: {
      fontSize: 30,
      font: "Roboto",
      [theme.breakpoints.down("xs")]: {
        fontSize: 24
      }
    },
    text: {
      fontSize: 24,
      [theme.breakpoints.down("xs")]: {
        fontSize: 16
      }
    },
    button: {
      background: theme.palette.buttonPrimary.main,
      width: "120px",
      height: "40px",
      borderRadius: "5px",
      border: "none",
      marginRight: "10px"
    },
    imageForWebView: {
      [theme.breakpoints.down("xs")]: {
        display: "none"
      }
    },
    imageForMobileView: {
      [theme.breakpoints.up("sm")]: {
        display: "none"
      }
    },
    customModal: {
      padding: "41px",
      maxWidth: "616px",
      borderRadius: 10
    }
  }))

  const classes = useStyles()

  useEffect(() => {
    let isMounted = true // note mutable flag
    const callgetStartedGetUserDetails = () => {
      if (token !== "") {
        BaseApiInstance()
          .get("configuration", {
            headers: {
              authorization: `Bearer ${  token}`
            }
          })
          .then((response) => {
            console.log("response for user .get:", response)
            if (isMounted) {
              const configTitle = response.data.find(
                (item) => item.key === "GET_STARTED_TITLE"
              )
              setTitle(configTitle.stringValue)
              const configDescription = response.data.find(
                (item) => item.key === "GET_STARTED_DESCRIPTION"
              )
              setDescription(configDescription.stringValue)
              const configImage = response.data.find(
                (item) => item.key === "GET_STARTED_IMAGE"
              )
              setImage(configImage.stringValue)
            }
          })

        BaseApiInstance()
          .get("users/getUserDetails", {
            headers: {
              authorization: `Bearer ${  token}`
            }
          })
          .then((response) => {
            console.log("response for user .get:", response)
            if (isMounted && response.data.firstName) {
              setUserName(response.data.firstName)
            }
          })

        return () => {
          isMounted = false
        } // use cleanup to toggle value, if unmounted
      } else {
        //call login promt
        onLandingAddListingGetStartedPage()
      }
    }
    callgetStartedGetUserDetails()
  }, [])

  //Invalid Token Login Prompt
  const [login, setLogin] = useState(false)
  const [loginPrompt, setLoginPrompt] = useState(false)
  const onClosePrompt = () => {
    setLoginPrompt(false)
  }
  const onCloseModal = (closeState) => {
    setCloseState(closeState)
  }

  const onOpenLoginModal = () => {
    setLogin(!login)
  }
  const onLandingAddListingGetStartedPage = () => {
    token ? router.push("/addList/getStarted") : setLoginPrompt(true)
  }

  // const customImgLoader = ({ src }) => {
  //   return "${src}";
  // };

  return (
    <>
      <NavBar />
      <Modal
        open={loginPrompt}
        onClose={() => setLoginPrompt(false)}
        classNames={{
          modal: classes.customModal
        }}
        center
      >
        <LoginPrompt closeModal={onClosePrompt} setLogin={onOpenLoginModal} />
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
      {!globalState.getStarted ? (
        <Grid container className={classes.container}>
          <Grid item xs={false} sm={1} />
          <Grid item xs={10} sm={false} className={classes.imageForMobileView}>
            <img
              src={image}
              alt="get started image"
              width="260px"
              height="auto"
            />
          </Grid>
          <Grid item xs={10} sm={4}>
            <h1 className={classes.header}>
              {t.welcome} {userName}
            </h1>
            <p className={classes.text}>{title || t.listBoatAbbrv}</p>
            <p className={classes.text}>{description}</p>
            <div style={{ paddingTop: "40px", paddingBottom: "30px" }}>
              <button
                data-testid="startBtn"
                className={classes.button}
                onClick={() => onClickGetStarted()}
                style={{ cursor: "pointer" }}
              >
                <span
                  style={{
                    color: theme.palette.wavezHome.backgroundColorSearch,
                    fontSize: "18px"
                  }}
                >
                  {t.getStarted}
                </span>
              </button>
            </div>
          </Grid>
          <Grid item xs={1} sm={1} />
          <Grid item xs={false} sm={5} className={classes.imageForWebView}>
            <img
              src={image}
              alt="get started image"
              width="auto"
              height="410px"
            />
          </Grid>
        </Grid>
      ) : (
        <AddListing />
      )}
    </>
  )
}

export default addListScreen
