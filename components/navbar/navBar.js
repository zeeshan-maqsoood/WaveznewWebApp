/* eslint-disable no-duplicate-imports */
import React, { useEffect, useState, useContext, useRef } from "react"
import Image from "next/image"
import clsx from "clsx"
import { makeStyles } from "@material-ui/core/styles"
import Drawer from "@material-ui/core/Drawer"
import Button from "@material-ui/core/Button"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import "react-responsive-modal/styles.css"
import Session from "../../sessionService"
import { Modal } from "react-responsive-modal"
import LoginPrompt from "../../components/addList/loginPrompt"
import styles from "../../components/navbar/navBar.module.css"
import LocaleDropdown from "../../components/navbar/localeDropdown"
import SearchInput from "./searchInput"
import Login from "../../components/login/login"
import ProfileDropDown from "../../components/navbar/profileDropDown"

import { faBars } from "@fortawesome/free-solid-svg-icons"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import API from "../../pages/api/baseApiIinstance"
import Link from "next/link"
import MapAutocompleteNav from "../../components/navbar/mapAutocompleteNav"

// i18n imports
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"

import { VERSION } from "../../config/_constants"
import Context from "../../store/context"
import theme from "../../src/theme"

export const HEIGHT = "30px"
const breakpoint = 600
const searchBreakPoint = 1100

export const IMAGE_HEIGHT = 50
const IMAGE_WIDTH = 55

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1)
    }
  },
  shape: {
    backgroundColor: theme.palette.primary.main,
    width: 30,
    height: HEIGHT,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.buttonPrimary.main,
    borderRadius: "50%"
  },
  customModal: {
    padding: "41px",
    maxWidth: "616px",
    borderRadius: 10
  },
  addList: {
    textDecoration: "none",
    color: theme.palette.background.default
  },
  fullList: {
    width: "auto",
    justifyContent: "center",
    color: theme.palette.background.default,
    cursor: "pointer",
    height: "40%"
  },
  ".react-responsive-modal-modal": {
    width: "00px"
  },
  navbar: {
    backGround: theme.palette.navBar.background,
    display: "flex",
    fontSize: "1.0rem",
    top: "0",
    zIndex: "20",
    height: "60px",
    justifyContent: "center",
    color: theme.palette.background.default,
    position: "sticky"
  },
  nav_container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "70px",
    maxWidth: "1900px"
  },
  menu_web: {
    display: "flex",
    listStyle: "none",
    textAlign: "center",
    marginRight: "20px",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  menu_mobile: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "flex"
    }
  },
  list_item: {
    backgroundColor: theme.palette.navBar.background
  },

  nav_item: {
    cursor: "pointer",
    marginRight: "15px",
    "&hover": {
      borderBottom: "3px solid theme.palette.background.default",
      transition: "all 0.2s ease-out"
    }
  },
  nav_input: {
    border: "none",
    width: "70%",
    borderColor: theme.palette.background.default
  },
  nav_search: {
    display: "flex",
    flexDirection: "row",
    borderRadius: "5px",
    width: "450px",
    marginRight: "50px",
    height: "35px",
    backgroundColor: theme.palette.background.default,
    padding: "5px"
  },
  nav_searchIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    backgroundColor: theme.palette.buttonPrimary.main,
    width: "40px",
    borderRadius: "5px"
  }
}))
const NavBar = (props) => {
  const userInitials = Session.getUserInitials("UserInitials")
  const [login, setLogin] = useState(false)
  const [click, setClick] = useState(false)
  const [profileClicked, setProfileClicked] = useState(false)
  const [closeState, setCloseState] = useState(false)
  const classes = useStyles()
  const token = Session.getToken("WaveToken")
  const [loginPrompt, setLoginPrompt] = useState(false)
  const [state, setState] = React.useState({
    top: false
  })
  const [wasVesselOwner, setWasVesselOwner] = useState(
    Session.getIsVesselOwner()
  )
  // i18n
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  const { globalState, globalDispatch } = useContext(Context)
  const [windowSize, setWindowSize] = useState(null)
  const [windowHeight, setWindowHeight] = useState(null)

  const onClosePrompt = () => {
    setLoginPrompt(false)
  }

  const onCloseModal = (closeState) => {
    setCloseState(closeState)
  }

  const onOpenLoginModal = () => {
    setLogin(!login)
  }

  const onClickAddList = () => {
    token ? router.push("/addList/getStarted") : setLoginPrompt(true)
  }

  useEffect(() => {}, [click])

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return
    }

    setState({ ...state, [anchor]: open })
  }

  const list = (anchor) => (
    <List className={classes.list_item}>
      <div className={classes.fullList} onClick={toggleDrawer(anchor, false)}>
        <ListItem
          button
          className={classes.fullList}
          onClick={() => onClickAddList()}
        >
          <span style={{}}>{t.addList}</span>
        </ListItem>
      </div>
      <div className={classes.fullList}>
        <ListItem
          button
          className={classes.fullList}
          style={{ width: "100%" }}
          onClick={toggleDrawer(anchor, true)}
        >
          <LocaleDropdown />
        </ListItem>
      </div>
      {token === "" ? (
        <div className={classes.fullList} onClick={toggleDrawer(anchor, false)}>
          <ListItem
            button
            className={classes.fullList}
            onClick={() => onOpenLoginModal()}
          >
            {t.signupLogin}
          </ListItem>
        </div>
      ) : (
        <ListItem
          button
          className={classes.fullList}
          onClick={() => setProfileClicked(!profileClicked)}
        >
          <ProfileDropDown />
        </ListItem>
      )}{" "}
    </List>
  )

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== "undefined") {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize(window.innerWidth)
        setWindowHeight(window.innerHeight)
      }

      // Add event listener
      window.addEventListener("resize", handleResize)

      // Call handler right away so state gets updated with initial window size
      handleResize()

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize)
    }
  }, []) // Empty array ensures that effect is only run on mount

  useEffect(() => {
    if (Session.getFavourite() === "" && token !== "") {
      API()
        .get(`favourite`, {
          headers: {
            authorization: `Bearer ${  token}`
          }
        })
        .then((response) => {
          globalDispatch({
            type: "SET_FAVOURITE_DATA",
            payload: response.data
          })
          if (response.data.length > 0) {
            const rentalFavourites = []
            const stayFavourites = []
            const charterFavourites = []
            const rentalShortlist = []
            const charterShortlist = []
            const stayShortlist = []
            response.data[0].favoriteRentals.map((item) =>
              rentalFavourites.push(item._id)
            )
            response.data[0].favoriteStays.map((item) =>
              stayFavourites.push(item._id)
            )
            response.data[0].favoriteCharters.map((item) =>
              charterFavourites.push(item._id)
            )
            response.data[0].shortListRentals.map((item) =>
              rentalShortlist.push(item._id)
            )
            response.data[0].shortListCharters.map((item) =>
              charterShortlist.push(item._id)
            )
            response.data[0].shortListStays.map((item) =>
              stayShortlist.push(item._id)
            )

            const favObject = {
              favoriteRentals: rentalFavourites,
              favoriteCharters: charterFavourites,
              favoriteStays: stayFavourites,
              shortListRentals: rentalShortlist,
              shortListCharters: charterShortlist,
              shortListStays: stayShortlist,
              _id: response.data[0]._id
            }
            Session.setFavourite(JSON.stringify(favObject))
            globalDispatch({ type: "SET_FAVOURITE", payload: favObject })
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }, [])

  const checkIsVesselOwner = () => {
    API()
      .get("/users/getUserDetails", {
        headers: {
          authorization: `Bearer ${  token}`
        }
      })
      .then((response) => {
        if (response.status === 200) {
          response.data.isVesselOwner === wasVesselOwner
            ? null
            : (Session.setIsVesselOwner(response.data.isVesselOwner),
              setWasVesselOwner(response.data.isVesselOwner))
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }

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
        <LoginPrompt closeModal={onClosePrompt} setLogin={onOpenLoginModal} />
      </Modal>
      <nav className={styles.navbar}>
        <div className={styles.nav_container}>
          <span className={styles.logo}>
            <Link
              legacyBehavior
              href="/"
              style={{
                textDecoration: 'none',
                color: theme.palette.background.default
              }}
            >
              <a>
                {windowSize > breakpoint ? (
                  <Image
                    src="/assets/images/titlelogo.png"
                    alt="logo"
                    width={IMAGE_WIDTH}
                    height={IMAGE_HEIGHT}
                    className={styles.pointer_style}
                  />
                ) : (
                  <Image
                    src="/assets/images/mobilelogo.png"
                    alt="logo"
                    width={IMAGE_WIDTH}
                    height={IMAGE_HEIGHT}
                    className={styles.pointer_style}
                  />
                )}
              </a>
            </Link>
            {windowSize > breakpoint ? (
              <span style={{ color: theme.palette.background.default }}>
                {' '}
                {VERSION}
              </span>
            ) : (
              ''
            )}
          </span>
          {/*Search starts*/}
          {props.search_bar &&
            (windowSize > searchBreakPoint ? <SearchInput /> : '')}
          {/*Search ends*/}

          <ul className={classes.menu_web}>
            <li className={styles.nav_item}>
              <span
                onClick={onClickAddList}
                className={classes.addList}
                style={{
                  textDecoration: 'none',
                  color: theme.palette.background.default
                }}
                data-testid="addListButton"
              >
                <span
                  style={{
                    color: theme.palette.background.default,
                    cursor: 'pointer'
                  }}
                >
                  {t.addList}
                </span>
              </span>
            </li>
            <li className={styles.nav_item} data-testid="localeButton">
              <LocaleDropdown data-testid="frenchBtn" />
            </li>
            {/* add here */}
            {token === '' ? (
              <li
                className={styles.nav_item}
                onClick={() => onOpenLoginModal()}
                data-testid="signUpButton"
              >
                {t.signupLogin}
              </li>
            ) : (
              <li
                className={styles.nav_item}
                onClick={() => (
                  checkIsVesselOwner(), setProfileClicked(!profileClicked)
                )}
              >
                <ProfileDropDown isVesselOwner={wasVesselOwner} />
              </li>
            )}
            {/* finish adding */}
          </ul>
          <div className={classes.menu_mobile} style={{}}>
            {['top'].map((anchor) => (
              <React.Fragment key={anchor}>
                <Button onClick={toggleDrawer(anchor, true)}>
                  <FontAwesomeIcon
                    icon={click ? faTimes : faBars}
                    className={styles.faBars}
                  />
                </Button>
                <Drawer
                  anchor={anchor}
                  open={state[anchor]}
                  onClose={toggleDrawer(anchor, false)}
                >
                  {list(anchor)}
                </Drawer>
              </React.Fragment>
            ))}
          </div>
        </div>
      </nav>
      {login && !closeState && (
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
      )}
    </>
  )
}

export default NavBar
