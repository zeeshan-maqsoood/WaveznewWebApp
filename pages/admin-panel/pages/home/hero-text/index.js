import React, {Component, useState, useEffect, useContext} from "react"
import {makeStyles} from "@material-ui/core/styles"
import NavBar from "../../../../../components/admin-panel/navBar"
import {useRouter} from "next/router"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import API from "../../../../api/baseApiIinstance"
import {
    Typography,
    TextField,
    Card,
    CardActionArea,
    CardMedia,
    CardActions
} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import OpenInNewIcon from "@material-ui/icons/OpenInNew"
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
    charCounter: {
        marginTop: "-37px",
        marginRight: "10px",
        fontWeight: "bold",
        fontSize: "15px",
        color: theme.palette.text.grey
    }
}))

export default function HeroText() {
    const classes = useStyles()
    const router = useRouter()
    const token = Session.getToken("Wavetoken")
    const [loading, setLoading] = useState(false)
    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const [heroText, setHeroText] = useState("")
    const [apiValue, setApiValue] = useState("")
    const [charsLeft, setCharsLeft] = useState(40)

    const samplePayload = {
        key: "",
        stringValue: "",
        booleanValue: false,
        numberValue: 0
    }

    const onClickBack = () => {
        router.push("/admin-panel/pages/home")
    }

    const onClickReset = () => {
        // reset data to api text
        setHeroText(apiValue)
        setUnsavedChanges(false)
        setCharsLeft(apiValue.length)
    }

    useEffect(() => {
        API()
            .get(
                `configuration/HOME_HERO_TEXT`,
                {
                    headers: {
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setApiValue(response.data.stringValue)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })

    }, [])

    // use effect for change of apiValue
    useEffect(() => {
        setHeroText(apiValue)
        setUnsavedChanges(false)
        setCharsLeft(apiValue.length)
    }, [apiValue])

    const onSaveButtonClicked = () => {
        samplePayload.key = "HOME_HERO_TEXT"
        samplePayload.stringValue = heroText
        API()
            .put(
                `configuration/HOME_HERO_TEXT`,
                samplePayload
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
                    setApiValue(response.data.stringValue)
                    console.log("response ", response.data)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })
    }

    return (
        <div>
            <NavBar/>
            <div className={classes.root}>
                <Grid
                    style={{
                        marginRight: "auto",
                        marginLeft: "16rem",
                        marginTop: "6%",
                        width: "73%"
                    }}
                    container
                    spacing={3}
                >
                    <Grid item xs={12}>
                        <Grid container spacing={10}>
                            <Grid style={{display: "flex"}} item xs={4}>
                                <ArrowBackIcon
                                    onClick={onClickBack}
                                    style={{fontSize: "2rem", cursor: "pointer"}}
                                />
                                <Typography
                                    style={{marginLeft: "3%", fontWeight: "500"}}
                                    variant="h5"
                                    gutterBottom
                                >
                                    Hero Text
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <form className={classes.root} noValidate autoComplete="off">
                            <Paper className={classes.paper}>
                                <Grid style={{padding: "2rem 3rem 3rem 3rem"}} container spacing={3}>
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
                                        </Typography>
                                        <TextField
                                            style={{width: "100%"}}
                                            id="outlined-basic"
                                            variant="outlined"
                                            inputProps={{maxLength: 40, "data-testid": "heroTextField"}}
                                            value={heroText}
                                            onChange={(event, value) => {
                                                (event?.target?.value ? setHeroText(event.target.value) : setHeroText(""))
                                                setUnsavedChanges(apiValue !== event?.target?.value)
                                                setCharsLeft(event?.target?.value?.length ? event.target.value.length : 0)
                                            }}
                                        />
                                        <div style={{float: "right"}}
                                             className={`mdc-text-field-character-counter ${classes.charCounter}`}
                                             data-testid="counterContainer">{charsLeft} / 40
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} style={{paddingTop: "3rem"}}>
                                        <Button
                                            data-testid="heroTextSaveBtn"
                                            style={{marginRight: "3rem", padding: "8px 30px 8px 30px"}}
                                            variant="contained"
                                            color="primary"
                                            onClick={onSaveButtonClicked}
                                            disabled={!unsavedChanges || heroText.length === 0}
                                        >
                                            Save
                                        </Button>
                                        <Button style={{color: theme.palette.button.red, padding: "8px 30px 8px 30px"}}
                                                data-testid="heroTextResetBtn" onClick={onClickReset}>Reset</Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </form>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}
