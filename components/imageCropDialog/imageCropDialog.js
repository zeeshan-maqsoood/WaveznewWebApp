import React, {useCallback, useState} from "react"
// i18n
import {useRouter} from "next/router"
import Button from "@material-ui/core/Button"
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"
import Cropper from "react-easy-crop"
import Slider from "@material-ui/core/Slider"
import {makeStyles} from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import theme from "../../src/theme"

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

const ImageCropDialog = (props) => {
    const {open, setOpen, imageSrc, setImageSrc, saveImage, getBlobUrl} = props
    const router = useRouter()
    const classes = useStyles()
    const [crop, setCrop] = useState({ x: 0, y: 0 })
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
            console.log('done', { croppedImage })
            saveImage(croppedImage)
            setOpen(false)
        } catch (e) {
            console.error(e)
        }
    }, [imageSrc, croppedAreaPixels])

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
            if (getBlobUrl) {
                canvas.toBlob(file => {
                    file.lastModifiedDate = new Date()
                    file.name = "Image"
                    resolve({url: URL.createObjectURL(file), file})
                }, 'image/png')
            } else {
                canvas.toBlob(async (file) => {
                    file.lastModifiedDate = new Date()
                    file.name = "image.png"
                    resolve(file)
                }, 'image/png')
            }

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
                    <DialogTitle style={{textAlign: 'center'}} id="alert-dialog-title">Crop Image</DialogTitle>
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
                            data-testid="applyBtn"
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

export default ImageCropDialog
