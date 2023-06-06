import React, {Component, useState, useEffect, useContext, useCallback} from "react"
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
    CardActionArea,
    CardMedia,
    CardActions, Dialog, Backdrop, CircularProgress
} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import ImageCropDialog from "../../../../../components/imageCropDialog/imageCropDialog"
import API from "../../../../api/baseApiIinstance"
import Session from "../../../../../sessionService"
import {Alert, AlertTitle} from "@material-ui/lab"

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
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: theme.palette.background.default
    }
}))

export default function HeroImage() {
    const classes = useStyles()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [imageSrc, setImageSrc] = useState(null)
    const [apiValue, setApiValue] = useState({
        _id: "",
        key: "",
        stringValue: "",
        booleanValue: false,
        numberValue: 0,
        arrayValue: []
    })
    const [openCropImageDialog, setOpenCropImageDialog] = useState(false)
    const token = Session.getToken("Wavetoken")

    const openCropDialog = () => {
        setOpenCropImageDialog(true)
    }

    useEffect(() => {
        API()
            .get(
                `configuration/HOME_HERO_IMAGE`,
                {
                    headers: {
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setApiValue(response.data)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })

    }, [])

    const handleImageChange = async (e) => {
        setErrorMessage("")
        const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i

        // get the first file
        if (e?.target?.files && e.target.files.length !== 0) {
            const files = Array.from(e.target.files).filter(
                (file) =>
                    file.size / 1024 / 1024 < 10 && allowedExtensions.exec(file.name)
            )
            console.log("file uploading here: ", files)

            if (e.target.files[0]) {
                setErrorMessage(null)
                const file = e.target.files[0]
                const imageDataUrl = await readFile(file)

                setImageSrc(imageDataUrl)
                setOpenCropImageDialog(true)
            } else {
                setErrorMessage("Image Size greater than 10 MB not allowed")
            }
            // to clear the file input for the same image to be uploaded twice
            e.target.value = null
        }
    }

    const uploadImage = async (croppedImageFile) => {
        if (croppedImageFile.size / 1024 / 1024 > 25) {
            setErrorMessage('Cropped Image Size Greater than 10MB.')
        } else {
            setErrorMessage(null)
            console.log(croppedImageFile)
            const formData = new FormData()
            formData.append("image", croppedImageFile)
            const oldUrl = `${  apiValue.stringValue}`
            API()
                .post(
                    `configuration/uploadImage/HOME_HERO_IMAGE`,
                    formData,
                    {
                        headers: {
                            authorization: `Bearer ${  token}`,
                            "Content-Type": "multipart/form-data"
                        }
                    }
                )
                .then((response) => {
                    console.log("response is ", response)
                    if ((response.status = 200)) {
                        console.log("upload response is ", response.data)
                        API()
                            .put(
                                `configuration/HOME_HERO_IMAGE`,
                                {
                                    key: "HOME_HERO_IMAGE",
                                    stringValue: response.data.url,
                                    booleanValue: false,
                                    numberValue: 0,
                                    arrayValue: []
                                },
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
                                    console.log("update response is ", response.data)
                                    setApiValue(response.data)
                                    if (oldUrl && oldUrl !== "") {
                                        // delete the old image once the image has been updated
                                        if (oldUrl.includes("HOME_HERO_IMAGE")) {
                                            API()
                                                .delete(`configuration/deleteImage?url=${oldUrl}`,
                                                    {
                                                        headers: {
                                                            authorization: `Bearer ${  token}`,
                                                            accept: "application/json"
                                                        }
                                                    })
                                                .then((response) => {
                                                    console.log("response is ", response)
                                                    if ((response.status = 200)) {
                                                        console.log("old image deleted")
                                                    }
                                                }).catch((err) => {
                                                console.log("There was an error deleting the old image")
                                            })
                                        }
                                    }
                                }
                            })
                            .catch((e) => {
                                console.log("Error from upload image is: ", e)
                            })
                    }
                })
                .catch((e) => {
                    console.log("Error from upload image is: ", e)
                })
        }
    }

    const onClickBack = () => {
        router.push("/admin-panel/pages/home")
    }
    return (
        <div>
            <NavBar/>
            <div className={classes.root}>
                <Backdrop className={classes.backdrop} open={loading}>
                    <CircularProgress color="inherit"/>
                </Backdrop>
                <Grid
                    style={{
                        marginRight: "auto",
                        marginLeft: "16rem",
                        marginTop: "6%",
                        width: "73%"
                    }}
                    container
                    spacing={3}>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid style={{display: "flex"}} item xs={3}>
                                <ArrowBackIcon
                                    onClick={onClickBack}
                                    style={{fontSize: "2rem", cursor: "pointer"}}
                                />
                                <Typography
                                    style={{marginLeft: "3%", fontWeight: "500"}}
                                    variant="h5"
                                    gutterBottom
                                >
                                    Hero Image
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            {(errorMessage && errorMessage !== '') && (
                                <Alert severity='error'>
                                    <AlertTitle>Error</AlertTitle>
                                    {errorMessage}
                                </Alert>
                            )}
                            {apiValue?.stringValue && apiValue?.stringValue !== "" ? (
                                <div>
                                    <Grid container spacing={2}
                                          direction="column"
                                          alignItems="center"
                                          justify="center">
                                        <Grid item xs={6} className={classes.imageContainer}>
                                            <img src={apiValue?.stringValue} alt="Hero Image"
                                                 style={{height: "100%", width: "100%"}}/>
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
                                                data-testid="uploadBtn"
                                            />
                                            <label htmlFor="file" className={classes.browseButton}
                                                   style={{marginTop: "25px"}}>
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
                                                    data-testid="browseBtn"
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
                                                 imageSrc={imageSrc} getBlobUrl={false} setImageSrc={setImageSrc}
                                                 saveImage={uploadImage}/>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.addEventListener('load', () => resolve(reader.result), false)
        reader.readAsDataURL(file)
    })
}

