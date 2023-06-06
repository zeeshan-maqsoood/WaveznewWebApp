import { Grid, makeStyles, Button } from '@material-ui/core'
import React from 'react'
import AccountInfoBanner from '../../../components/accountInfo/accountInfoBanner'
import AccountInfoTabs from '../../../components/accountInfo/accountInfoTabs'
import NavBar from '../../../components/navbar/navBar'
import Image from "next/image"
import Session from "../../../sessionService"
import API from '../../../pages/api/baseApiIinstance'
// i18n
import { useRouter } from "next/router"
import en from "../../../locales/en.js"
import fr from "../../../locales/fr.js"

const useStyles = makeStyles((theme) => ({
    filler: {
        backgroundColor: "lightgrey"
    },
    content: {
        backgroundColor: "white",
        borderLeft: "2px solid lightgrey",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    theme: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "10px",
        border: "2px solid lightgrey",
        borderRadius: 10
    },
    divider: {
        marginTop: "30px",
        width: "90%"
    },
    imageContainer: {
        borderRadius: 10,
        marginBottom: "20px"
    },
    button: {
        fontWeight: "400",
        textTransform: "capitalize",
        backgroundColor: "#4d96fb",
        color: "white",
        fontSize: "18px",
        maxHeight: "70px",
        maxWidth: "150px",
        marginBottom: "20px"
    }
}))

function index(props) {
    const token = Session.getToken("Wavetoken")
    const classes = useStyles()
    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : fr

    const setLightTheme = () => {
        Session.setTheme("LIGHT")
        updateUserInfo("LIGHT")
    }

    const setDarkTheme = () => {
        Session.setTheme("DARK")
        updateUserInfo("DARK")
    }

    const updateUserInfo = (theme) => {
        const body = {
            theme
        }
        API()
            .put("users/updateUserInfo", body, {
                headers: {
                    authorization: `Bearer ${  token}`
                }
            })
            .then((response) => {
                console.log("theme update response: ", response)
                router.reload(router.pathname)
            })
            .catch((e) => {
                // router.push("/somethingWentWrong");
            })
    }

    return (
        <>
            <NavBar />
            <AccountInfoBanner />
            <Grid container>
                <Grid item xs={false} lg={2} className={classes.filler} />
                <Grid item xs={3} lg={2}>
                    <AccountInfoTabs currentTab={3} />
                </Grid>
                <Grid item xs={9} lg={6} className={classes.content}>
                    <div className={classes.theme}>
                        <h1>{t.themes.light}</h1>
                        <div className={classes.imageContainer}>
                            <Image src="/assets/images/lightThemePreview.png" alt="light theme preview" width={866} height={146} />
                        </div>
                        <Button
                            variant="contained"
                            onClick={() => setLightTheme()}
                            className={classes.button}>
                            {t.themes.button}
                        </Button>
                    </div>
                    <div className={classes.divider} />
                    <div className={classes.theme}>
                        <h1>{t.themes.dark}</h1>
                        <div className={classes.imageContainer}>
                            <Image src="/assets/images/darkThemePreview.png" alt="dark theme preview" width={866} height={146} />
                        </div>
                        <Button
                            variant="contained"
                            onClick={() => setDarkTheme()}
                            className={classes.button}>
                            {t.themes.button}
                        </Button>
                    </div>
                </Grid>
                <Grid item xs={false} lg={2} className={classes.filler} />
            </Grid>
        </>
    )
}

export default index
