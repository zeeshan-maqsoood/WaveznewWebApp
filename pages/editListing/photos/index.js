import React, { Component, useState, useEffect, useContext } from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  Grid,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Card,
  CardActionArea,
  CardMedia,
  CardActions
} from "@material-ui/core"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import API from "../../../pages/api/baseApiIinstance"
import Session from "../../../sessionService"
import FormData from "form-data"
// i18n
import { useRouter } from "next/router"
import en from "../../../locales/en.js"
import fr from "../../../locales/fr.js"
import CircularProgress from "@material-ui/core/CircularProgress"
import { Modal } from "react-responsive-modal"
import ErrorMessageModal from "./errorMessageModal"
import theme from "../../../src/theme"

const useStyles = makeStyles((theme) => ({
  padding_top: {
    paddingTop: 120,
    fontSize: "24px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "18px"
  }
},
  cardUploader: {
  maxWidth: 400,
  maxHeight: "350",
  border: `1px solid ${  theme.palette.navBar.darkerGrey}`,
  boxSizing: "border-box",
  borderRadius: "13px",
  height:'250px',
  color: theme.palette.text.grey,
  fontWeight: "100",
  fontSize: 200,
  [theme.breakpoints.down("xs")]: {
    height: "150px"
}
  },
  root: {
    width: "100%",
    minHeight: "220px",
    border: `1px solid ${theme.palette.navBar.darkerGrey}`,
    boxSizing: "borderBox",
    borderRadius: "10px",
    paddingTop: "10px"
  },
  hideInput: {
    width: "0.1px",
    height: "2.1px",
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
    cursor: "pointer",
    boxSizing: "borderBox",
    borderRadius: "5px"
  },
  instructionText: {
    fontSize: 18,
    fontWeight: 500,
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 750,
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
     width: "300px",
     fontSize: 12
  }
  },
  header: {
    fontSize: "24px",
    fontWeight: 500,
    width: 700,
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
      width: 300,
      fontSize: 14
   }
  },
  cardRender: {
    margin: 10,
    maxWidth: 400,
    maxHeight: "350",
    padding: 10,
    border: `1px solid ${theme.palette.navBar.darkerGrey}`,
    boxSizing: "border-box",
    borderRadius: "13px",
    [theme.breakpoints.down("xs")]: {
      height: "150px",
      margin: 2,
      padding: 2
  }
  },
  buttonDelete: {
    top: 5,
    right: 5,
    position: "absolute",
    zIndex: 5,
    backgroundColor: theme.palette.background.default,
    boxSizing: "border-box",
    borderRadius: "5px",
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
    height: "100%",
    border: 0,
    outline: "none",
    fontSize: "18px",
    [theme.breakpoints.down("xs")]: {
      marginTop: 0,
      marginBottom: 0,
      fontSize: "10px"
    }
  },
  coverMarker: {
    float: "left",
    padding: 10,
    position: "absolute",
    background: theme.palette.background.default,
    fontSize: 14,
    margin: 10,
    textAlign: "center",
    borderRadius: 4,
    fontWeight: 500,
    [theme.breakpoints.down("xs")]: {
      padding: 5,
      fontSize: 12
    }
  },
  modalStyle: {
    borderRadius: 10
  },
  cardA: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "5px",
      width: "100%",
      height: "100px"
    }
  },
  bottomDiv: {
    position: "fixed",
    backgroundColor: theme.palette.background.default,
    bottom: 0,
    height: 80,
    width: "100%",
    alignItems: "center",
    zIndex: 11,
    borderTop: `1px ${ theme.palette.background.lightGrey} solid`
},
saveDiv: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 12
}
}))

export default function Photos({
  listingStartValue,
  getListingInfo,
  setUnsavedChanges,
  onSubmit,
  nextPage
}) {
  const classes = useStyles()
  const token = Session.getToken("Wavetoken")
  const [errorOpen, setErrorOpen] = useState(false)
  const [minimumImages, setMinimumImages] = useState(0)
  const [maximumImages, setMaximumImages] = useState(0)
  const type = listingStartValue?.vesselType
  const vesselId = listingStartValue?._id
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  const [images, setImages] = useState(listingStartValue?.images)
  const [currentFocusImage, setCurrentFocusImage] = useState()
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const [options, setOptions] = useState()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (photo) => (event) => {
    if (photo.sequence === 1) {
      setOptions([t.editListing.photo.delete])
    }   else {
      setOptions([t.editListing.photo.delete, t.editListing.photo.makeAsCover])
    }
    setAnchorEl(event.currentTarget)
    setCurrentFocusImage(photo)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setCurrentFocusImage()
  }

  const handleClickOption = (option) => {
    if (option === t.editListing.photo.delete) {
      handleDelete(currentFocusImage)
    } else if (option === t.editListing.photo.makeAsCover) {
      handleMakeAsCover(currentFocusImage)
    } else if (option === t.editListing.photo.replacePhoto) {
      handleReplacePhoto(currentFocusImage)
    }
    handleClose()
  }

  const handleDelete = (photo) => {
    setLoading(true)
    API()
      .delete(`vessel/image/${photo?._id}`, {
        headers: {
          authorization: `Bearer ${  token}`
        }
      })
      .then((response) => {
        if ((response.status = 200)) {
          getListingInfo()
        }
      })
      .catch((e) => {
        console.log("Error from delete image is: ", e)
      })
    setLoading(false)
  }

  const handleReplacePhoto = (e) => {
    setLoading(true)
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i

    const newReplaceImageUpload = e.target.files[0]
    if (
      newReplaceImageUpload.size / 1024 / 1024 < 10 &&
      allowedExtensions.exec(newReplaceImageUpload.name)
    ) {
      const formData = new FormData()
      formData.append("image", newReplaceImageUpload)
      API()
        .put(`vessel/updateImage/${currentFocusImage._id}`, formData, {
          headers: {
            authorization: `Bearer ${  token}`,
            accept: "application/json",
            "Content-Type": "multipart/form-data"
          }
        })
        .then((response) => {
          if (response.status === 200) {
            setLoading(false)
            getListingInfo()
            console.log("replace image response is ", response.data.success)
          }
        })
        .catch((e) => {
          console.log("Error from upload image is: ", e)
        })
    }
    handleClose()
  }

  const handleMakeAsCover = (photo) => {
    API()
      .put(
        `vessel/updateCoverImage`,
        { imageId: photo?._id },
        {
          headers: {
            authorization: `Bearer ${  token}`
          }
        }
      )
      .then((response) => {
        if ((response.status = 200)) {
          getListingInfo()
          console.log("delete image response is ", response.data)
        }
      })
      .catch((e) => {
        console.log("Error from delete image is: ", e)
      })
  }

  //handle  on change caption
  const handleUpdateCaption = (name, photo) => (e) => {
    const updateArray = images?.map((item) => {
      return item._id === photo._id
        ? { ...item, caption: e.target.value }
        : item
    })
    setImages(updateArray)
  }

  // handle on blur caption , save to database
  const handleSubmitCaption = (photo) => (e) => {
    API()
      .put(
        `vessel/updateImageCaptions/${vesselId}`,
        [{ imageId: photo._id, caption: photo.caption }],
        {
          headers: {
            authorization: `Bearer ${  token}`
          }
        }
      )
      .then((response) => {
        if ((response.status = 200)) {
          getListingInfo()
          console.log("upload response is ", response.data)
        }
      })
      .catch((e) => {
        console.log("Error from upload image is: ", e)
      })
  }

  const handleImageChange = (e) => {
    setLoading(true)
    setErrorMessage("")
    setErrorOpen(false)
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i

    //handle not select any file
    if (Array.from(e.target.files).length === 0) {
      setErrorMessage(`No file chosen`)
      setErrorOpen(true)
      setLoading(false)
      return
    }

    //handle limit number of images
    if (Array.from(e.target.files).length > maximumImages - images?.length) {
      e.preventDefault()
      setErrorMessage(`Cannot upload more than ${maximumImages} files`)
      setErrorOpen(true)
      setLoading(false)
      return
    }
    if (e.target.files) {
      const validFiles = []
      const invalidFiles = []

      Array.from(e.target.files).map((file) => {
        if (
          file.size / 1024 / 1024 <= 10 &&
          allowedExtensions.exec(file.name)
        ) {
          validFiles.push(file)
        } else {
          invalidFiles.push(file)
        }
      })

      console.log("file uploading here: ", validFiles)

      const formData = new FormData()
      const captions = []
      validFiles.map((file) => {
        formData.append("images", file)

        captions.push("")
      })
      formData.append("captions", "")
      API()
        .put(`vessel/images/${vesselId}`, formData, {
          headers: {
            authorization: `Bearer ${  token}`,
            accept: "application/json",
            "Content-Type": "multipart/form-data"
          }
        })
        .then((response) => {
          if ((response.status = 200)) {
            setLoading(false)
            getListingInfo()
            // console.log("upload multiple files response with no caption is ",  response.data);
          }
        })
        .catch((e) => {
          console.log("Error from upload multiple files is: ", e)
        })

      //handle invalid files
      const invalidFileName = []
      if (invalidFiles.length > 0) {
        invalidFiles.map((item) => invalidFileName.push(item.name))
        setErrorMessage(
          `File format not supported for the following files: ${invalidFileName.join()}`
        )
        setErrorOpen(true)
      }
    }
  }

  useEffect(() => {
    API()
      .get(`configuration/PHOTO_MAXIMUM_NUMBER`)
      .then((response) => {
        console.log("PHOTO_MAXIMUM_NUMBER: ", response.data)
        setMaximumImages(response.data.numberValue)
      })
      .catch((e) => {
        console.log("Error from getting PHOTO_MAXIMUM_NUMBER: ", e)
      })

    API()
      .get(`configuration/PHOTO_MINIMUM_NUMBER`)
      .then((response) => {
        console.log("PHOTO_MINIMUM_NUMBER: ", response.data)
        setMinimumImages(response.data.numberValue)
      })
      .catch((e) => {
        console.log("Error from getting PHOTO_MINIMUM_NUMBER: ", e)
      })
  }, [])

  useEffect(() => {
    setUnsavedChanges(false)
    setLoading(false)
    console.log("Listing start value : ", listingStartValue)
    setImages(listingStartValue?.images)
    if (listingStartValue?.images?.length === 0) {
      onSubmit(false)
    }
  }, [listingStartValue])

  return (
    <>
      <Modal classNames={{modal: classes.modalStyle}} open={errorOpen} onClose={() => setErrorOpen(false)} center>
        <ErrorMessageModal
          message={errorMessage}
          questionMessage={""}
          closeModal={() => setErrorOpen(false)}
        />
      </Modal>
      <div style={{ marginLeft: "5%", marginRight: "5%" }}>
        <h1 className={classes.padding_top}>
          {t.editListing.photo.uploadYourVessel}
        </h1>
        {loading && (
          <div>
            <CircularProgress />
          </div>
        )}
        <Grid item xs={12} style={{ marginBottom: "10%" }}>
          {images?.length === 0 ? (
            <Card className={classes.root}>
              <div className={classes.header}>
                {t.editListing.photo.dragAndDrop}
                <span>
                  <input
                    type='file'
                    name='file'
                    id='file'
                    multiple
                    accept='image/jpg, image/jpeg, image/png'
                    onChange={handleImageChange}
                    className={classes.hideInput}
                  />
                  <label htmlFor='file' className={classes.browseButton}>
                    {t.editListing.photo.selectMultipleFiles}
                  </label>
                </span>
              </div>
              <p className={classes.instructionText}>
                {t.editListing.photo.imageMustBeBefore}
                {minimumImages}
                {t.editListing.photo.imageMustBeAfter}
                {maximumImages}
                {t.editListing.photo.imageMustBeLast}
              </p>
              <p className={classes.instructionText}>
                {t.editListing.photo.ensureToUpload}
              </p>
              <p className={classes.instructionText}>
                {t.editListing.photo.doNotPost}
              </p>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {images?.map((photo) => (
                <Grid key={photo._id} item xs={6} sm={4} md={3}>
                  <Card className={classes.cardRender}>
                    <div className={classes.imagePart}>
                      {photo.sequence === 1 && (
                        <div className={classes.coverMarker}>{t.editListing.photo.coverImage}</div>
                      )}
                      <div className={classes.buttonDelete}>
                        <IconButton
                          data-testid={`photoOption${photo._id}`}
                          aria-label='more'
                          aria-controls='long-menu'
                          aria-haspopup='true'
                          onClick={handleClick(photo)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          id='long-menu'
                          anchorEl={anchorEl}
                          keepMounted
                          open={open}
                          onClose={handleClose}
                        >
                          {options?.map((option) => (
                            <MenuItem
                              key={option}
                              onClick={() => handleClickOption(option)}
                            >
                              {option}
                            </MenuItem>
                          ))}
                          <MenuItem key='ReplacePhoto'>
                            <input
                              type='file'
                              name='file'
                              id='newFile'
                              accept='image/jpg, image/jpeg, image/png'
                              onChange={handleReplacePhoto}
                              className={classes.hideInput}
                            />
                            <label
                              htmlFor='newFile'
                              style={{ cursor: "pointer" }}
                            >
                             {t.editListing.photo.replacePhoto}
                            </label>
                          </MenuItem>
                        </Menu>
                      </div>
                      <CardMedia
                        component='img'
                        alt='boat image'
                        height='250'
                        style={{ marginRight: 10 }}
                        image={`${photo.imageURL}?${Date.now()}`}
                        className={classes.cardA}
                      />
                    </div>
                    <CardActions>
                      <textarea
                        name='caption'
                        data-testid={`caption${photo._id}`}
                        className={classes.captionInput}
                        value={photo.caption}
                        placeholder={t.editListing.photo.addACaption}
                        onChange={handleUpdateCaption("caption", photo)}
                        onBlur={handleSubmitCaption(photo)}
                      />
                    </CardActions>
                  </Card>
                </Grid>
              ))}
              {images?.length >= maximumImages ? ("") : (
                <Grid item xs={6} sm={4} md={3}>
                  <Card className={classes.cardUploader}>
                    <CardActionArea>
                      <input
                        data-testid="uploadImageButton"
                        type='file'
                        name='file'
                        id='file'
                        multiple
                        accept='image/jpg, image/jpeg, image/png'
                        onChange={handleImageChange}
                        className={classes.hideInput}
                      />
                      <label htmlFor='file' style={{ cursor: "pointer" }}>
                  <Button className={classes.cardUploader}  style={{width:"100%", backgroundColor: theme.palette.search.outline}} component="span">
                    +
                   </Button>
                      </label>
                    </CardActionArea>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </Grid>
      </div>
      {/* Bottom Div Buttons */}
      < Grid container item xs={12} className={classes.bottomDiv} >
                    <Grid item xs={3} sm={2} />
                    <Grid item xs={6} sm={4} className={classes.saveDiv}>
                        <Button
                            variant="contained"
                            onClick={() => nextPage()}
                            style={{
                                fontWeight: "400",
                                textTransform: "capitalize",
                                backgroundColor: theme.palette.buttonPrimary.main,
                                color: theme.palette.background.default,
                                fontSize: "18px",
                                maxHeight: "70%",
                                maxWidth: "150px",
                                marginLeft: 20
                            }}
                            data-testid="saveBtn"
                        >
                            {t.continue}
                        </Button>
                    </Grid>
                    <Grid item xs={6} />
                </Grid >
                <div style={{marginBottom: 100}}/>
    </>
  )
}
