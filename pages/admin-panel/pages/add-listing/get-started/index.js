import React, {useState, useEffect} from "react"
import {makeStyles} from "@material-ui/core/styles"
import NavBar from "../../../../../components/admin-panel/navBar"
import {useRouter} from "next/router"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"

import {Card, TextareaAutosize, TextField, Typography} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import OpenInNewIcon from "@material-ui/icons/OpenInNew"
import API from "../../../../api/baseApiIinstance"
import Session from "../../../../../sessionService"
import ImageCropDialog from "../../../../../components/admin-panel/pages/add-listing/get-started/ImageCropDialog"
import theme from "../../../../../src/theme"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        fontFamily: "Roboto",
        color: theme.palette.title.matterhorn
    },
    hideInput: {
        width: "0.1px",
        height: "0.1px",
        opacity: 0,
        overflow: "hidden",
        position: "absolute",
        zIndex: "-1"
    },
    browseButton: {
        fontWeight: 500,
        color: theme.palette.background.default,
        padding: "10px 20px 10px 20px",
        backgroundColor: theme.palette.background.deepSkyBlue,
        display: "inline-block",
        cursor: "pointer",
        marginTop: "12px",
        borderRadius: "4px"
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
        width: "100%",
        minHeight: "400px"
    },
    header: {
        font: "Roboto",
        color: theme.palette.title.matterhorn,
        fontWeight: "600",
        fontSize: 30
    },
    imageContainer: {
        width: "100%",
        minHeight: "200px",
        backgroundColor: theme.palette.addPayment.borderBottom,
        boxSizing: "borderBox",
        borderRadius: "10px",
        marginTop: "30px"
    },
    charCounter: {
        marginTop: "-37px",
        marginRight: "10px",
        fontSize: "15px"
    }
}))

export default function AddListing() {
    const classes = useStyles()
    const router = useRouter()
    const token = Session.getToken("Wavetoken")

    const [apiValue, setApiValue] = useState("")
    const [apiValueDescription, setApiValueDescription] = useState("")
    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const [titleText, setTitleText] = useState("")
    const [descriptionText, setDescriptionText] = useState("")
    const [charsLeft, setCharsLeft] = useState(0)
    const [imageSrc, setImageSrc] = useState(null)
    const [date, setDate] = useState(new Date())
    const [apiValueImage, setApiValueImage] = useState({
        _id: "",
        key: "",
        stringValue: "",
        booleanValue: false,
        numberValue: 0,
        arrayValue: []
    })
    const [openCropImageDialog, setOpenCropImageDialog] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [loading, setLoading] = useState(false)

    const openCropDialog = () => {
        setOpenCropImageDialog(true)
    }

    const getImage = () => {
        API()
            .get(
                `configuration/GET_STARTED_IMAGE`,
                {
                    headers: {
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setApiValueImage(response.data)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })
    }
    useEffect(() => {
        getImage()
    }, [])

    const handleImageChange = async (e) => {
        setLoading(true)
        setErrorMessage("")
        const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i

        // get the first file
        if (e?.target?.files && e.target.files.length !== 0) {
            const files = Array.from(e.target.files).filter(
                (file) =>
                    file.size / 1024 / 1024 < 10 && allowedExtensions.exec(file.name)
            )
            console.log("file uploading here: ", files)

            const file = e.target.files[0]
            const imageDataUrl = await readFile(file)

            setImageSrc(imageDataUrl)
            setOpenCropImageDialog(true)
            // to clear the file input for the same image to be uploaded twice
            e.target.value = null
        }
    }

    const samplePayload = {
        key: "",
        stringValue: "",
        booleanValue: false,
        numberValue: 0
    }

    const samplePayloadDescription = {
        key: "",
        stringValue: "",
        booleanValue: false,
        numberValue: 0
    }

    const onClickBack = () => {
        router.push("/admin-panel/pages/add-listing")
    }
    useEffect(() => {
        setTitleText(apiValue)
        setDescriptionText(apiValueDescription)
        setUnsavedChanges(false)
        setCharsLeft(apiValueDescription.length)
    }, [apiValue, apiValueDescription])

    useEffect(() => {
        console.log("Get")
        getImage()
    }, [date])

    useEffect(() => {
        API()
            .get(
                `configuration/GET_STARTED_TITLE`,
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
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })

        API()
            .get(
                `configuration/GET_STARTED_DESCRIPTION`,
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
                    setApiValueDescription(response.data.stringValue)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })

    }, [])

    const onClickReset = () => {
        setTitleText(apiValue)
        setDescriptionText(apiValueDescription)
        setUnsavedChanges(false)
        setCharsLeft(apiValueDescription.length)
    }

    const handleSave = () => {
        samplePayload.key = "GET_STARTED_TITLE"
        samplePayload.stringValue = titleText
        console.log(samplePayload, titleText)
        API()
            .put(
                `configuration/GET_STARTED_TITLE`,
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
                    setTitleText(response.data.stringValue)
                    console.log("response ", response.data)
                    setUnsavedChanges(false)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })

        samplePayloadDescription.key = "GET_STARTED_DESCRIPTION"
        samplePayloadDescription.stringValue = descriptionText
        console.log(samplePayloadDescription, descriptionText)
        API()
            .put(
                `configuration/GET_STARTED_DESCRIPTION`,
                samplePayloadDescription
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
                    setDescriptionText(response.data.stringValue)
                    console.log("response ", response.data)
                    setUnsavedChanges(false)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })
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
                            <Grid style={{display: "flex"}} item xs={4}>
                                <ArrowBackIcon
                                    onClick={onClickBack}
                                    style={{fontSize: "2rem", cursor: "pointer"}}
                                />
                                <Typography
                                    style={{marginLeft: '15px', fontWeight: "500"}}
                                    variant="h5"
                                    gutterBottom
                                >
                                    Get Started Page
                                </Typography>
                            </Grid>
                            <Grid style={{textAlign: "right"}} item xs={8}>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid style={{padding: "2rem"}} container spacing={3}>
                                <form method='post' className={classes.root} noValidate autoComplete="off">
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
                                            Title
                                        </Typography>

                                        <TextField
                                            style={{width: "100%"}}
                                            id="outlined-basic"
                                            variant="outlined"
                                            inputProps={{maxLength: 60, "data-testid": "titleTextField"}}
                                            placeholder="Enter your title"
                                            value={titleText}
                                            onChange={(event, value) => {
                                                (event?.target?.value ? setTitleText(event.target.value) : setTitleText(""))
                                                setUnsavedChanges(apiValue !== event?.target?.value)
                                            }}
                                        />
                                    </Grid>
                                    <Grid style={{textAlign: "left", marginTop: "2rem"}} item xs={12}>
                                        <Typography
                                            style={{
                                                marginLeft: "auto",
                                                fontWeight: "500",
                                                fontSize: "1.1rem"
                                            }}
                                            variant="h6"
                                            gutterBottom
                                        >
                                            Description
                                        </Typography>
                                        <TextField
                                            style={{
                                                width: "100%",
                                                maxWidth: "100%",
                                                minWidth: "100%",
                                                maxHeight: "300px",
                                                overflow: 'auto'
                                            }}
                                            id="outlined-basic"
                                            multiline
                                            inputProps={{maxLength: 300, "data-testid": "descriptionTextField"}}
                                            placeholder="Enter your description"
                                            variant="outlined"
                                            value={descriptionText}
                                            onChange={(event, value) => {
                                                (event?.target?.value ? setDescriptionText(event.target.value) : setDescriptionText(""))
                                                setUnsavedChanges(apiValueDescription !== event?.target?.value)
                                                setCharsLeft(event?.target?.value?.length ? event.target.value.length : 0)
                                            }}
                                        />
                                        <div style={{float: "right"}} data-testid="counterContainer"
                                             className={`mdc-text-field-character-counter ${classes.charCounter}`}>{charsLeft} /
                                            300
                                        </div>
                                    </Grid>
                                    <Grid style={{marginTop: '2rem'}} item xs={12}>

                                        <Button
                                            data-testid="textSaveBtn"
                                            style={{marginRight: "3rem"}}
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSave}
                                            disabled={!unsavedChanges || titleText.length === 0 || descriptionText.length === 0}
                                        >
                                            Save
                                        </Button>
                                        <Button disabled={!unsavedChanges} onClick={onClickReset}
                                                data-testid="textResetBtn"
                                                style={{color: theme.palette.button.red}}>Reset</Button>
                                    </Grid>
                                </form>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            {apiValueImage?.stringValue !== "" ? (
                                <div>
                                    <Grid container spacing={2}
                                          direction="column"
                                          alignItems="center"
                                          justify="center">
                                        <Grid item xs={6} className={classes.imageContainer}>
                                            <h3>IMAGE</h3>
                                            <img src={apiValueImage?.stringValue} alt="Get Started Image"
                                                 style={{width: "100%"}}/>
                                        </Grid>
                                    </Grid>
                                    <div>
                                    <span>
                    <input
                        type="file"
                        name="file"
                        id="file"
                        accept="image/jpg, image/jpeg, image/png"
                        onChange={handleImageChange}
                        className={classes.hideInput}
                    />
                    <label htmlFor="file" className={classes.browseButton}>
                    Upload
                    </label>
                  </span></div>
                                </div>
                            ) : (
                                <div className={classes.root}>
                                    <Grid container spacing={2} style={{position: "relative", marginTop: "12%"}}>
                                        <Grid style={{display: "flex", alignItems: "center"}} direction="column"
                                              container item xs={7}>
                                            <h2 style={{alignSelf: "flex-end"}}>Drag And Drop Your Files Here or</h2>
                                            <br/>
                                            <p style={{
                                                alignSelf: "flex-end",
                                                marginRight: "22px",
                                                marginTop: "0"
                                            }}>Note: Supported file format: jpg, jpeg, png</p>
                                        </Grid>
                                        <Grid style={{display: "flex"}} item xs={5}>
                                        <span>
                                            <input
                                                type="file"
                                                name="file"
                                                id="file"
                                                accept="image/jpg, image/jpeg, image/png"
                                                onChange={handleImageChange}
                                                className={classes.hideInput}
                                            />
                                         </span>
                                            <label style={{alignSelf: "flex-start"}} htmlFor="file"
                                                   className={classes.browseButton}>
                                                Browse
                                            </label>
                                        </Grid>
                                    </Grid>
                                </div>
                            )}
                            <div>
                                <ImageCropDialog open={openCropImageDialog} setOpen={setOpenCropImageDialog}
                                                 imageSrc={imageSrc} date={date} setDate={setDate}
                                                 setImageSrc={setImageSrc}/>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </>
    )
}

function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.addEventListener('load', () => resolve(reader.result), false)
        reader.readAsDataURL(file)
    })
}
