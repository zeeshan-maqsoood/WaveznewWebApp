import React, {useState, useCallback, useEffect} from "react"
import Router from "next/router"
import Button from "@material-ui/core/Button"
// i18n
// eslint-disable-next-line no-duplicate-imports
import {useRouter} from "next/router"
import en from "../../../../../locales/en"
import fr from "../../../../../locales/fr"
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"
import Cropper from "react-easy-crop"
import Slider from "@material-ui/core/Slider"
import {makeStyles} from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import API from "../../../../../pages/api/baseApiIinstance"
import Session from "../../../../../sessionService"
import theme from "../../../../../src/theme"

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper
    },
    crop_container: {
        position: "absolute",
        top: "100px",
        left: "50px",
        right: "50px",
        bottom: "100px",
        marginBottom: "50px"
    },
    controls: {
        position: "absolute",
        bottom: "0",
        left: "50%",
        width: "50%",
        transform: "translateX(-50%)",
        height: "80px",
        display: "flex",
        alignItems: "center",
        marginBottom: "70px"
    },
    slider: {
        padding: "22px 0px"
    }
}))

const HeroImageCropDialog = (props) => {
    const {open, setOpen, imageSrc, setImageSrc, setDate, date} = props
    const router = useRouter()
    const classes = useStyles()
    const token = Session.getToken("Wavetoken")
    const [crop, setCrop] = useState({x: 0, y: 0})
    const [zoom, setZoom] = useState(1)
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)

    const handleClose = () => {
        setOpen(false)
    }

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels
            )
            console.log('done', {croppedImage})
            await uploadImage(croppedImage)
        } catch (e) {
            console.error(e)
        }
    }, [imageSrc, croppedAreaPixels])

    const uploadImage = async (croppedImageFile) => {
        const formData = new FormData()
        formData.append("image", croppedImageFile)
        API()
            .post(
                `configuration/uploadImage/GET_STARTED_IMAGE`,
                formData,
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json",
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
                            `configuration/GET_STARTED_IMAGE`,
                            {
                                key: "GET_STARTED_IMAGE",
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
                                setOpen(false)
                                setDate(new Date())
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

    async function getCroppedImg(imageSrc, pixelCrop = 0) {
        const image = await createImage(imageSrc)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const maxSize = Math.max(image.width, image.height)
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

        // set each dimensions to double largest dimension to allow for a safe area for the
        // image to rotate in without being clipped by canvas context
        canvas.width = safeArea
        canvas.height = safeArea

        // translate canvas context to a central location on image to allow rotating around the center.
        ctx.translate(safeArea / 2, safeArea / 2)
        ctx.translate(-safeArea / 2, -safeArea / 2)

        // draw rotated image and store data.
        ctx.drawImage(
            image,
            safeArea / 2 - image.width * 0.5,
            safeArea / 2 - image.height * 0.5
        )
        const data = ctx.getImageData(0, 0, safeArea, safeArea)

        // set canvas width to final desired crop size - this will clear existing context
        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height

        // paste generated rotate image with correct offsets for x,y crop values.
        ctx.putImageData(
            data,
            Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
            Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
        )

        // As Base64 string
        // return canvas.toDataURL('image/jpeg');

        // As a blob
        return new Promise((resolve) => {
            canvas.toBlob((file) => {
                file.lastModifiedDate = new Date()
                file.name = "HomeImage"
                resolve(file)
            }, 'image/png')
        })
    }

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image()
            image.addEventListener('load', () => resolve(image))
            image.addEventListener('error', (error) => reject(error))
            image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
            image.src = url
        })

    return (
        <>
            <Dialog
                open={open}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        handleClose()
                    }
                }}
                fullWidth
                maxWidth="md"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div style={{padding: '2rem'}}>
                    <CloseIcon
                        onClick={handleClose}
                        style={{fontSize: "2rem", cursor: "pointer", float: 'right'}}
                    />
                    <DialogTitle style={{textAlign: 'center'}} id="alert-dialog-title">Crop
                        Image</DialogTitle>
                    <DialogContent style={{width: '600px', height: '400px'}}>
                        <div className={classes.crop_container}>
                            {imageSrc && (
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={4 / 3}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            )}
                            {/*<p style={{fontWeight: "400"}}>*/}
                            {/*    <Grid container item xs={12}>*/}

                            {/*        <Grid style={{marginBottom: '2rem'}} container item xs={12}>*/}
                            {/*            <Grid style={{textAlign: "left", alignSelf: 'center'}} item xs={2}>*/}
                            {/*                <Typography*/}
                            {/*                    style={{*/}
                            {/*                        marginLeft: "auto",*/}
                            {/*                        fontWeight: "500",*/}
                            {/*                        fontSize: "1.1rem"*/}
                            {/*                    }}*/}
                            {/*                    variant="h6"*/}
                            {/*                    gutterBottom*/}
                            {/*                >*/}
                            {/*                    Name*/}
                            {/*                </Typography>*/}
                            {/*            </Grid>*/}
                            {/*            <Grid style={{textAlign: "left"}} item xs={10}>*/}
                            {/*                <form*/}
                            {/*                    className={classes.root}*/}
                            {/*                    noValidate*/}
                            {/*                    autoComplete="off"*/}
                            {/*                >*/}
                            {/*                    <TextField*/}
                            {/*                        style={{width: "100%"}}*/}
                            {/*                        id="outlined-basic"*/}
                            {/*                        variant="outlined"*/}
                            {/*                        placeholder="Enter your name"*/}
                            {/*                    />*/}
                            {/*                </form>*/}
                            {/*            </Grid>*/}
                            {/*        </Grid>*/}

                            {/*        <Grid style={{marginBottom: '2rem'}} container item xs={12}>*/}
                            {/*            <Grid style={{textAlign: "left"}} item xs={2}>*/}
                            {/*                <Typography*/}
                            {/*                    style={{*/}
                            {/*                        marginLeft: "auto",*/}
                            {/*                        fontWeight: "500",*/}
                            {/*                        fontSize: "1.1rem",*/}
                            {/*                    }}*/}
                            {/*                    variant="h6"*/}
                            {/*                    gutterBottom*/}
                            {/*                >*/}
                            {/*                    Service*/}
                            {/*                </Typography>*/}
                            {/*            </Grid>*/}
                            {/*            <Grid style={{textAlign: "left"}} item xs={10}>*/}
                            {/*                <FormGroup row>*/}
                            {/*                    <FormControlLabel*/}
                            {/*                        control={*/}
                            {/*                            <Checkbox*/}
                            {/*                                checked={state.rentalsCb}*/}
                            {/*                                onChange={handleChange}*/}
                            {/*                                name="rentalsCb"*/}
                            {/*                                color="primary"*/}
                            {/*                            />*/}
                            {/*                        }*/}
                            {/*                        label="Rentals"*/}
                            {/*                    />*/}
                            {/*                    <FormControlLabel*/}
                            {/*                        style={{marginRight: '4rem'}}*/}
                            {/*                        control={*/}
                            {/*                            <Checkbox*/}
                            {/*                                checked={state.staysCb}*/}
                            {/*                                onChange={handleChange}*/}
                            {/*                                name="staysCb"*/}
                            {/*                                color="primary"*/}
                            {/*                            />*/}
                            {/*                        }*/}
                            {/*                        label="Stays"*/}
                            {/*                    />*/}
                            {/*                    <FormControlLabel*/}
                            {/*                        control={*/}
                            {/*                            <Checkbox*/}
                            {/*                                checked={state.chartersCb}*/}
                            {/*                                onChange={handleChange}*/}
                            {/*                                name="chartersCb"*/}
                            {/*                                color="primary"*/}
                            {/*                            />*/}
                            {/*                        }*/}
                            {/*                        label="Charters"*/}
                            {/*                    />*/}
                            {/*                </FormGroup>*/}
                            {/*            </Grid>*/}
                            {/*        </Grid>*/}

                            {/*        <Grid style={{textAlign: "left"}} item xs={12}>*/}
                            {/*            <Typography*/}
                            {/*                style={{*/}
                            {/*                    marginLeft: "auto",*/}
                            {/*                    fontWeight: "500",*/}
                            {/*                    fontSize: "1.1rem"*/}
                            {/*                }}*/}
                            {/*                variant="h6"*/}
                            {/*                gutterBottom*/}
                            {/*            >*/}
                            {/*                Verification Files Needed*/}
                            {/*            </Typography>*/}
                            {/*        </Grid>*/}

                            {/*        <Grid container item xs={12}>*/}
                            {/*            <Grid style={{textAlign: "left"}} item xs={2}>*/}
                            {/*            </Grid>*/}
                            {/*            <Grid style={{textAlign: "left"}} item xs={10}>*/}
                            {/*                <FormGroup row>*/}
                            {/*                    <FormControlLabel*/}
                            {/*                        control={*/}
                            {/*                            <Checkbox*/}
                            {/*                                checked={state.proofOfIdCb}*/}
                            {/*                                onChange={handleChange}*/}
                            {/*                                name="proofOfIdCb"*/}
                            {/*                                color="primary"*/}
                            {/*                            />*/}
                            {/*                        }*/}
                            {/*                        label="Proof of Id"*/}
                            {/*                    />*/}
                            {/*                    <FormControlLabel*/}
                            {/*                        control={*/}
                            {/*                            <Checkbox*/}
                            {/*                                checked={state.vesselDriversLiCb}*/}
                            {/*                                onChange={handleChange}*/}
                            {/*                                name="vesselDriversLiCb"*/}
                            {/*                                color="primary"*/}
                            {/*                            />*/}
                            {/*                        }*/}
                            {/*                        label="Vessel Driver's License"*/}
                            {/*                    />*/}
                            {/*                    <FormControlLabel*/}
                            {/*                        style={{marginRight: '4rem'}}*/}
                            {/*                        control={*/}
                            {/*                            <Checkbox*/}
                            {/*                                checked={state.vesselLicenseCb}*/}
                            {/*                                onChange={handleChange}*/}
                            {/*                                name="vesselLicenseCb"*/}
                            {/*                                color="primary"*/}
                            {/*                            />*/}
                            {/*                        }*/}
                            {/*                        label="Vessel License"*/}
                            {/*                    />*/}
                            {/*                    <FormControlLabel*/}
                            {/*                        style={{marginRight: '6rem'}}*/}
                            {/*                        control={*/}
                            {/*                            <Checkbox*/}
                            {/*                                checked={state.vesselSafetyCb}*/}
                            {/*                                onChange={handleChange}*/}
                            {/*                                name="vesselSafetyCb"*/}
                            {/*                                color="primary"*/}
                            {/*                            />*/}
                            {/*                        }*/}
                            {/*                        label="Vessel Safety"*/}
                            {/*                    />*/}
                            {/*                    <FormControlLabel*/}
                            {/*                        control={*/}
                            {/*                            <Checkbox*/}
                            {/*                                checked={state.insuranceCb}*/}
                            {/*                                onChange={handleChange}*/}
                            {/*                                name="insuranceCb"*/}
                            {/*                                color="primary"*/}
                            {/*                            />*/}
                            {/*                        }*/}
                            {/*                        label="Insurance"*/}
                            {/*                    />*/}
                            {/*                </FormGroup>*/}
                            {/*            </Grid>*/}
                            {/*        </Grid>*/}

                            {/*    </Grid>*/}
                            {/*</p>*/}
                        </div>
                        <div className={classes.controls}>
                            <Typography
                                variant="h6"
                                style={{minWidth: 80}}
                            >
                                Zoom
                            </Typography>
                            <Slider
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e, zoom) => setZoom(zoom)}
                                classes={{root: 'slider'}}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions style={{justifyContent: 'center'}}>
                        <Button
                            style={{marginRight: "1rem"}}
                            variant="contained"
                            color="primary"
                            onClick={showCroppedImage}
                        >
                            Apply
                        </Button>
                        <Button onClick={handleClose} variant="outlined" style={{
                            color: theme.palette.button.red,
                            borderColor: theme.palette.button.red
                        }}>Cancel</Button>
                    </DialogActions>
                </div>
            </Dialog>
        </>
    )
}

export default HeroImageCropDialog
