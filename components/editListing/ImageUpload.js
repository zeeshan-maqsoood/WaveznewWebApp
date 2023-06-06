import React, {useState, useEffect} from "react"
import {makeStyles} from "@material-ui/core/styles"
import DeleteIcon from "@material-ui/icons/Delete"
import {
    Card,
    CardActionArea,
    CardMedia,
    Grid,
    CardActions,
    TextField,
    Button
} from "@material-ui/core"
import {useRouter} from "next/router"

import API from "../../pages/api/baseApiIinstance"
import Session from "../../sessionService"
import theme from "../../src/theme"

const useStyles = makeStyles({
    root: {
        width: "100%",
        minHeight: "220px",
        border: `1px solid ${  theme.palette.navBar.darkerGrey}`,
        boxSizing: "borderBox",
        borderRadius: "10px",
        paddingTop: "10px"
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
        fontWeight: 300,
        color: theme.palette.background.default,
        padding: "10px",
        backgroundColor: theme.palette.background.deepSkyBlue,
        display: "inline-block",
        cursor: "pointer"
    },
    instructionText: {
        fontSize: 18,
        fontWeight: 500,
        marginLeft: "auto",
        marginRight: "auto",
        width: 750
    },
    header: {
        fontSize: "24px",
        fontWeight: 500,
        width: 700,
        marginLeft: "auto",
        marginRight: "auto"
    },
    renderImg: {
        display: "inline-flex"
    },
    cardRender: {
        margin: 10,
        maxWidth: 400,
        maxHeight: 350,
        padding: 10,
        border: `1px solid ${  theme.palette.navBar.darkerGrey}`,
        boxSizing: "border-box",
        borderRadius: "13px"
    },
    buttonDelete: {
        top: 5,
        right: 5,
        position: "absolute",
        zIndex: 9,
        backgroundColor: theme.palette.background.default,
        height: "40px",
        width: "30px",
        "&:hover": {
            backgroundColor: theme.palette.background.default
        }
    },
    deleteIcon: {
        color: theme.palette.background.silver
    },
    imagePart: {
        position: "relative"
    },
    captionInput: {
        marginTop: 20,
        width: "100%",
        border: 0,
        outline: "none",
        fontSize: "18px"
    }
})

function ImageUpload(props) {
    const classes = useStyles()
    const MAXIMUM_IMAGES = 10
    const token = Session.getToken("Wavetoken")
    const type = props.vesselType
    const [selectedFiles, setSelectedFiles] = useState(props.uploadedImages?.images)

    const handleDelete = (photo) => {
        //delete image which stored in db
        console.log("delete photo: ", photo)
        if (photo._id !== undefined) {
            API()
                .delete(`vessel/image/${photo._id}/${type}`, {
                    headers: {
                        authorization: `Bearer ${  token}`
                    }
                })
                .then((response) => {
                    console.log("response is ", response)
                    if ((response.status = 200)) {
                        //  props.onDeleteUpdate;
                        console.log("delete image response is ", response.data)
                    }
                })
                .catch((e) => {
                    console.log("Error from delete image is: ", e)
                })
        }
        //delete in front end
        const filteredArray = selectedFiles.filter(
            (item) => item.imageURL !== photo.imageURL
        )
        setSelectedFiles(filteredArray)
    }

    const handleImageChange = (e) => {
        console.log("File uploading: ", e.target.files)
        //handle file extension png and jpeg only
        const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i

        //handle limit number of images
        if (
            Array.from(e.target.files).length >
            MAXIMUM_IMAGES - selectedFiles?.length
        ) {
            e.preventDefault()
            alert(`Cannot upload files more than ${MAXIMUM_IMAGES}`)
            return
        }
        //handle size less than 10MB and extensions .jpeg/.jpg/.png/ only.
        if (e.target.files) {
            const files = Array.from(e.target.files).filter(
                (file) =>
                    file.size / 1024 / 1024 < 10 && allowedExtensions.exec(file.name)
            )
            console.log("file uploading here: ", files)
            // set selected files
            files?.map((file) =>
                setSelectedFiles((arr) => [
                    ...arr,
                    {imageURL: URL.createObjectURL(file), caption: "", imageFile: file}
                ])
            )
            console.log("After adding images, there are files: ", files)


            Array.from(e.target.files).map(
                (file) => URL.revokeObjectURL(file) // avoid memory leak
            )
        }
    }

    const handleAddCaption = (name, imgURL) => (e) => {
        const updateArray = selectedFiles?.map((item) => {
            return item.imageURL === imgURL
                ? {...item, [name]: e.target.value}
                : item
        })
        setSelectedFiles(updateArray)
    }

    useEffect(() => {
        //call back from parent
        props.onUploadImage(selectedFiles)
        console.log("Selected files are : ", selectedFiles)
    }, [selectedFiles])
    return (
        <>
            <Grid container xs={12} style={{marginBottom: "10%"}}>
                {selectedFiles?.length === 0 ? (
                    <Card className={classes.root}>
                        <div className={classes.header}>
                            Drag and drop your files here or{"  "}
                            <span>
                <input
                    type="file"
                    name="file"
                    id="file"
                    multiple
                    onChange={handleImageChange}
                    className={classes.hideInput}
                />
                <label htmlFor="file" className={classes.browseButton}>
                  Select Multiple Files
                </label>
              </span>
                        </div>
                        <p className={classes.instructionText}>
                            Images must be .jpg or .png format. Please upload maximum {{MAXIMUM_IMAGES}}
                            images to get better results.
                        </p>
                        <p className={classes.instructionText}>
                            (Ensure to upload high resolution pictures that showcase the
                            Front, Back, Two Sides and Inside of the boat along with any
                            special features/amenities that your boat provides.)
                        </p>
                        <p className={classes.instructionText}>
                            *Do not post pictures with people, places or objects that are not
                            related to the vessel
                        </p>
                    </Card>
                ) : (
                    <Grid container spacing={2}>
                        {selectedFiles?.map((photo) => (
                            <Grid item xs={12} sm={3}>
                                <Card key={photo.imageURL} className={classes.cardRender}>
                                    <div className={classes.imagePart}>
                                        <Button
                                            onClick={() => handleDelete(photo)}
                                            className={classes.buttonDelete}
                                        >
                                            <DeleteIcon className={classes.deleteIcon}/>
                                        </Button>
                                        <CardMedia
                                            component="img"
                                            alt="boat image"
                                            height="250"
                                            style={{marginRight: 10}}
                                            image={photo.imageURL}
                                        />
                                    </div>
                                    <CardActions>
                    <textarea
                        name="caption"
                        id="caption"
                        className={classes.captionInput}
                        value={photo.caption}
                        placeholder="Add a caption"
                        onChange={handleAddCaption("caption", photo.imageURL)}
                    />
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                        {selectedFiles?.length >= MAXIMUM_IMAGES ? (
                            ""
                        ) : (
                            <Grid item xs={3}>
                                <Card style={{width: 300, height: 250}}>
                                    <CardActionArea>
                                        <input
                                            type="file"
                                            name="file"
                                            id="file"
                                            multiple
                                            onChange={handleImageChange}
                                            className={classes.hideInput}
                                        />
                                        <label for="file" style={{cursor: "pointer"}}>
                                            <CardMedia
                                                component="img"
                                                height="250"
                                                width="300"
                                                alt="uploading placeholder"
                                                image="/assets/images/uploadingImage.png"
                                            />
                                        </label>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Grid>

        </>
    )
}

export default ImageUpload
