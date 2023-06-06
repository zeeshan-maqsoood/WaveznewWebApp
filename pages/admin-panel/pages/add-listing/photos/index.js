import React, {Component, useState, useEffect, useContext} from "react"
import {makeStyles} from "@material-ui/core/styles"
import NavBar from "../../../../../components/admin-panel/navBar"
import {useRouter} from "next/router"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"

import {
    Typography,
    TextField,
    Card,
    TextareaAutosize
} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import OpenInNewIcon from "@material-ui/icons/OpenInNew"
import Counter from "../../../../addList/counter"
import API from "../../../../api/baseApiIinstance"
import Session from "../../../../../sessionService"
import theme from "../../../../../src/theme"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        fontFamily: "Roboto",
        color: theme.palette.title.matterhorn
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary
    },
    text: {
        font: "Roboto",
        color: theme.palette.text.grey,
        fontSize: 24
    }
}))
const samplePayloadMin = {
    key: "",
    stringValue: "",
    booleanValue: false,
    numberValue: 0
}
const samplePayloadMax = {
    key: "",
    stringValue: "",
    booleanValue: false,
    numberValue: 0
}
export default function AddListing() {
    const classes = useStyles()
    const token = Session.getToken("Wavetoken")
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [apiMinValue, setApiMinValue] = useState(0)
    const [apiMaxValue, setApiMaxValue] = useState(0)
    const [minimumPhotos, setMinimumPhotos] = useState(0)
    const [maximumPhotos, setMaximumPhotos] = useState(0)
    const [unsavedChanges, setUnsavedChanges] = useState(false)


    const onClickReset = () => {
        setMinimumPhotos(apiMinValue)
        setMaximumPhotos(apiMaxValue)
        setUnsavedChanges(false)
    }
    useEffect(() => {
        setMinimumPhotos(apiMinValue)
        setMaximumPhotos(apiMaxValue)
        setUnsavedChanges(false)
    }, [apiMinValue, apiMaxValue])

    const getPhotoMin = () => {
        API()
            .get(
                `configuration/PHOTO_MINIMUM_NUMBER`,
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setApiMinValue(response.data.numberValue)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })
    }
    const getPhotoMax = () => {
        API()
            .get(
                `configuration/PHOTO_MAXIMUM_NUMBER`,
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setApiMaxValue(response.data.numberValue)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })
    }
    useEffect(() => {
        getPhotoMin()
        getPhotoMax()
    }, [])

    const handleSave = () => {
        samplePayloadMin.key = "PHOTO_MINIMUM_NUMBER"
        samplePayloadMin.numberValue = minimumPhotos
        console.log(samplePayloadMin, minimumPhotos)
        API()
            .put(
                `configuration/PHOTO_MINIMUM_NUMBER`,
                samplePayloadMin
                ,
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setMinimumPhotos(response.data.numberValue)
                    console.log("response ", response.data)
                    getPhotoMin()
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })

        samplePayloadMax.key = "PHOTO_MAXIMUM_NUMBER"
        samplePayloadMax.numberValue = maximumPhotos
        console.log(samplePayloadMax, maximumPhotos)
        API()
            .put(
                `configuration/PHOTO_MAXIMUM_NUMBER`,
                samplePayloadMax
                ,
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setMaximumPhotos(response.data.numberValue)
                    console.log("response ", response.data)
                    getPhotoMax()
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })
    }

    const onClickBack = () => {
        router.push("/admin-panel/pages/add-listing")
    }
    return (
        <>
            <NavBar/>
            <div className={classes.root}>
                <Grid
                    style={{
                        marginRight: "auto",
                        marginLeft: "16rem",
                        marginTop: "8%",
                        width: "73%"
                    }}
                    container
                    spacing={3}
                >
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid style={{display: "flex"}} item xs={12}>

                                <ArrowBackIcon
                                    onClick={onClickBack}
                                    style={{fontSize: "2rem", cursor: "pointer"}}
                                />

                                <Typography
                                    style={{marginLeft: '15px', fontWeight: "500"}}
                                    variant="h5"
                                    gutterBottom
                                >
                                    Photos
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid style={{padding: "2rem"}} container spacing={3}>
                                <Grid style={{textAlign: "left"}} item xs={12}>
                                    <Typography
                                        style={{
                                            marginLeft: "auto",
                                            fontWeight: "500",
                                            fontSize: "1.1rem"
                                        }}
                                        variant="h6"
                                        gutterBottom
                                    >
                                        How many images vessel owner should upload ?
                                    </Typography>

                                </Grid>
                                <Grid style={{textAlign: "left", display: "inline-flex"}} item xs={12}>
                                    <Typography
                                        style={{
                                            fontWeight: "500",
                                            fontSize: "1.1rem"
                                        }}
                                        variant="h6"
                                        gutterBottom
                                    >
                                        Minimum number of images
                                    </Typography>

                                    <div className={classes.text}>
                                        <span>
                                        <Counter
                                            onMinus={() => {
                                                setMinimumPhotos(min => Math.max(min - 1, 0)), setUnsavedChanges(true)
                                            }}
                                            onPlus={() => {
                                                setMinimumPhotos(min => min + 1), setUnsavedChanges(true)
                                            }}
                                            displayValue={minimumPhotos}/>
                                    </span>
                                    </div>
                                </Grid>

                                <Grid style={{textAlign: "left", display: "inline-flex"}} item xs={12}>
                                    <Typography
                                        style={{
                                            fontWeight: "500",
                                            fontSize: "1.1rem"
                                        }}
                                        variant="h6"
                                        gutterBottom
                                    >
                                        Maximum number of images
                                    </Typography>
                                    <div className={classes.text}>
                                        <span>
                                        <Counter
                                            onMinus={() => {
                                                setMaximumPhotos(max => Math.max(max - 1, 0)), setUnsavedChanges(true)
                                            }}
                                            onPlus={() => {
                                                setMaximumPhotos(max => max + 1), setUnsavedChanges(true)
                                            }}
                                            displayValue={maximumPhotos}/>
                                    </span>
                                    </div>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        style={{marginRight: "3rem"}}
                                        variant="contained"
                                        color="primary"
                                        disabled={!unsavedChanges || (minimumPhotos === 0 && maximumPhotos === 0) || maximumPhotos > 20}
                                        onClick={handleSave}
                                        data-testid="textSaveBtn"
                                    >
                                        Save
                                    </Button>
                                    <Button data-testid="textResetBtn" onClick={onClickReset}
                                            style={{color: theme.palette.button.red}}>Reset</Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </>
    )
}
