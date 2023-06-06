import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Container, Grid, Typography } from "@material-ui/core"
import Link from "next/link"
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import Image from "next/image"
import Geocode from "react-geocode"
import Session from "../../sessionService"
// i18n
import { useRouter } from 'next/router'
import en from '../../locales/en.js'
import fr from '../../locales/fr.js'

const useStyles = makeStyles((theme) => ({
    container: {
        height: "calc(100vh - 100px)",
        paddingTop: 30,
        paddingLeft: 57,
        paddingRight: 57,
        [theme.breakpoints.down("sm")]: {
            paddingLeft: 40,
            paddingRight: 40
        },
        [theme.breakpoints.down("xs")]: {
            paddingTop: 20
        }
    },
    header: {
        fontSize: 30,
        font: "Roboto",
        textAlign: "center",
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
    subHeader: {
        fontSize: "18px",
        width: "100%",
        maxWidth: "500px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    iconDiv: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "40px",
        height: "40px",
        cursor: "pointer"
    },
    paddingDiv: {
        marginBottom: "30px"
    },
    subContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        textAlign: "center"
    },
    link: {
        cursor: "pointer",
        color: "purple"
    }
}))

const liveNav = (props) => {
    Geocode.setApiKey(process.env.googleMapsApiKey)
    const classes = useStyles()
    const router = useRouter()
    const { locale } = router
    const t = locale === 'en' ? en : fr
    const [isGooglePlay, setIsGooglePlay] = useState(false)
    const [isAppStore, setIsAppStore] = useState(false)

    const onBackClick = () => {
        router.back()
    }

    useEffect(() => {
        setDeviceType()
    }, [])

    const setDeviceType = () => {
        const googlePlayList = [
            /Android/i,
            /BlackBerry/i,
            /Windows Phone/i
        ]
        const appStoreList = [
            /iPhone/i,
            /iPad/i,
            /iPod/i
        ]

        googlePlayList.map((googlePlayItem) => {
            if (navigator.userAgent.match(googlePlayItem)) {
                setIsGooglePlay(true)
                console.log("Detected Google Play device: ", googlePlayItem)
            }
        })

        appStoreList.map((appStoreItem) => {
            if (navigator.userAgent.match(appStoreItem)) {
                setIsAppStore(true)
                console.log("Detected App Store device: ", appStoreItem)
            }
        })

        if (isGooglePlay && isAppStore) { // fail-safe
            setIsGooglePlay(false)
            setIsAppStore(false)
        }
    }

    const mapClicked = () => {
        isAppStore
            // ? window.open("http://maps.apple.com?q=Current+Location") // can highlight general location of user, but forces user to delete input to enter a destination
            // : window.open("https://maps.google.com?q=Current+Location"); // can highlight general location of user, but forces user to delete input to enter a destination
            ? window.open("http://maps.apple.com?q=") // http://maps.apple.com/ links to an informative website. Adding a query uses the site or app (if in mobile)
            : window.open("https://maps.google.com")
    }

    return (
        <>
            <div className={classes.container}>
                <div style={{ width: "100%" }}>
                    <div className={classes.subHeader}>
                        <div className={classes.iconDiv}>
                            <ArrowBackIcon onClick={() => { onBackClick() }} />
                        </div>
                        <span />
                        <span />
                    </div>
                </div>
                <div className={classes.subContainer}>
                    <h1 className={classes.header}>{t.predepartureChecklist.liveNav.header}</h1>
                    <div className={classes.paddingDiv} />
                    {/* Display App Store link if device is not using Google Play */}
                    {!isGooglePlay &&
                        < Link href="">
                            <a>
                                <Image
                                    src={Session.getTheme() !== "DARK" ? "/assets/images/App_Store_2.png" : "/assets/images/App_Store_Dark.png"}
                                    alt="logo"
                                    width="288px"
                                    height="85px"
                                />
                            </a>
                        </Link>}
                    {/* Add spacing if both links are needed */}
                    {!isGooglePlay && !isAppStore && <div className={classes.paddingDiv} />}
                    {/* Display Google Play link if device is not using App Store */}
                    {!isAppStore &&
                        < Link href="" className={classes.link}>
                            <a>
                                <Image
                                    src={Session.getTheme() !== "DARK" ? "/assets/images/Google_Store_2.png" : "/assets/images/Google_Store_Dark.png"}
                                    alt="logo"
                                    width="288px"
                                    height="85px"
                                />
                            </a>
                        </Link>}
                    <div className={classes.paddingDiv} />
                    <h1 className={classes.header}>{t.predepartureChecklist.liveNav.p1}</h1>
                    <h1 className={classes.header}><div className={classes.link} onClick={() => mapClicked()}>{t.predepartureChecklist.liveNav.p2}</div></h1>
                </div>
            </div >
            <div className={classes.paddingDiv} />
        </>
    )
}

export default liveNav
