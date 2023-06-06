import React, { useEffect, useState } from 'react'
import { makeStyles, Grid, Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core'
import ArrowIcon from '@material-ui/icons/ArrowForwardIos'
import MessageIcon from '@material-ui/icons/Message'
import NearMeIcon from '@material-ui/icons/NearMe'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import theme from "../../../src/theme"
import API from "../../../pages/api/baseApiIinstance"
import Session from "../../../sessionService"
import moment from "moment"
// i18n
import { useRouter } from 'next/router'
import en from '../../../locales/en.js'
import fr from '../../../locales/fr.js'

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: 15,
        borderRadius: 10,
        marginRight: "auto",
        marginLeft: "auto",
        maxWidth: 345,
        [theme.breakpoints.up("sm")]: {
            maxWidth: "60vw"
        },
        [theme.breakpoints.up("md")]: {
            maxWidth: "50vw"
        },
        [theme.breakpoints.up("lg")]: {
            maxWidth: "40vw"
        },
        [theme.breakpoints.up("xl")]: {
            maxWidth: "30vw"
        }
    },
    media: {
        height: 0,
        paddingTop: "56.25%" // 16:9
        // height: "100%",
        // width: "100%",
        // maxHeight: 200,
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        color: theme.palette.buttonPrimary.main,
        textTransform: "capitalize",
        width: "100%",
        paddingLeft: 15,
        paddingRight: 15,
        fontSize: 16,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        height: "60px"
    },
    cancelButton: {
        color: theme.palette.background.flamingo,
        textTransform: "capitalize",
        width: "100%",
        fontSize: 16,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        height: "60px"
    },
    hr: {
        width: "94%",
        border: `1px solid ${  theme.palette.background.lightGrey}`,
        height: "1px"
    },
    text: {
        fontSize: 16
    },
    iconDiv: {
        paddingTop: 30,
        paddingLeft: 57,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "40px",
        height: "40px",
        cursor: "pointer"
    },
    header: {
        marginTop: 15,
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center"
    }
}))

export default function MediaCard() {
    const token = Session.getToken("WaveToken")
    const classes = useStyles()
    const router = useRouter()
    const { locale } = router
    const t = locale === 'en' ? en : fr

    const [trip, setTrip] = useState({})

    useEffect(() => {
        if (router.asPath !== router.route) {
            API().get(`/trip/${  router.query?.id}`, {
                headers: {
                    authorization: `Bearer ${  token}`
                }
            }).then((response) => {
                if (response.status === 200) {
                    console.log("response.data: ", response.data)
                    setTrip(response.data)
                }
            })
        }
    }, [])

    const onBackClick = () => {
        router.push("/trips")
    }

    const onLiveNavClick = () => {
        router.push("/trips/liveNav")
    }

    const endTripClicked = () => {
        if (router.asPath !== router.route) {
            router.push(`/trips/${  router.query?.id  }/postdepartureChecklist`)
        }
    }

    const onClickVesselDetails = () => {
        if (trip?.vessel?._id) {
            router.push(`/listingInfo/${  trip?.vessel?._id}`)
        }
    }

    return (
        <>
            <div className={classes.iconDiv}>
                <ArrowBackIcon onClick={() => { onBackClick() }} />
            </div>
            <Typography gutterBottom variant="h5" color="textPrimary" component="h1" className={classes.header} style={{ textTransform: "capitalize" }}>
                {trip?.vessel?.title || ""}
            </Typography>
            <Card className={classes.root}>
                <CardActionArea
                    onClick={() => onClickVesselDetails()}>
                    <CardMedia
                        className={classes.media}
                        image={trip?.vessel?.images?.[0]?.imageURL || ""}
                        title="Cover picture of watercraft"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="body2" color="textSecondary" component="h2" className={classes.text} style={{ textTransform: "capitalize" }}>
                            {trip?.vessel?.title || ""}
                        </Typography>
                        <Typography variant="body2" color="textPrimary" component="p" className={classes.text}>
                            {moment(new Date(trip?.bookingStartDate)).format("YYYY-MM-DD LT").toString() || ""} - {moment(new Date(trip?.bookingEndDate)).format("YYYY-MM-DD LT").toString() || ""}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Grid container>
                        <Grid item xs={12} className={classes.buttonContainer}>
                            <Button
                                size='small'
                                className={classes.button}
                                onClick={() => onClickVesselDetails()}
                            >
                                {t.tripsPage.started.button1}
                                <ArrowIcon style={{ fontSize: 16 }} />
                            </Button>
                        </Grid>
                        <hr className={classes.hr} style={{ backgroundColor: theme.palette.background.lightGrey }} />
                        {/*<Grid item xs={12} className={classes.buttonContainer}>*/}
                        {/*    <Button*/}
                        {/*        size='small'*/}
                        {/*        className={classes.button}*/}
                        {/*    >*/}
                        {/*        <MessageIcon style={{ fontSize: 20, color: theme.palette.buttonPrimary.main, marginRight: 10, }} />*/}
                        {/*        {t.tripsPage.started.button2}*/}
                        {/*    </Button>*/}
                        {/*</Grid>*/}
                        {/*<hr className={classes.hr} />*/}
                        <Grid item xs={12} className={classes.buttonContainer}>
                            <Button
                                size='small'
                                className={classes.button}
                                onClick={onLiveNavClick}
                            >
                                <NearMeIcon style={{ fontSize: 20, color: theme.palette.buttonPrimary.main, marginRight: 10 }} />
                                {t.tripsPage.started.button3}
                            </Button>
                        </Grid>
                        <hr className={classes.hr} />
                        <Grid item xs={12} className={classes.buttonContainer}>
                            <Button
                                size='small'
                                onClick={() => { endTripClicked() }}
                                className={classes.cancelButton}
                            >
                                {t.tripsPage.started.button4}
                            </Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </>
    )
}
