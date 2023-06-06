import {
  Grid,
  makeStyles,
  Select,
  Typography,
  MenuItem, DialogTitle, DialogContent, DialogActions, Dialog
} from "@material-ui/core"
import React, { useState, useEffect } from "react"
import AccountInfoBanner from "../../../components/accountInfo/accountInfoBanner"
import AccountInfoTabs from "../../../components/accountInfo/accountInfoTabs"
import NavBar from "../../../components/navbar/navBar"
import CreateIcon from "@material-ui/icons/Create"
import TextField from "@material-ui/core/TextField"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import Paper from "@material-ui/core/Paper"
import MapAutocomplete from "../../../components/editListing/mapAutocomplete"
import FormControl from "@material-ui/core/FormControl"
import ImageCropDialog from "../../../components/imageCropDialog/imageCropDialog"
import API from "../../api/baseApiIinstance"
import Session from "../../../sessionService"
import Avatar from "@material-ui/core/Avatar"
import CloseIcon from "@material-ui/icons/Close"
import ReactPhoneInput from "react-phone-input-2"
import buildAddress from "../../../components/addList/api/buildAddress"
import FormHelperText from "@material-ui/core/FormHelperText"
import languageList from "../../../components/accountInfo/languageList"
import Autocomplete from "@material-ui/lab/Autocomplete"
import ErrorMessageModal from "../../editListing/photos/errorMessageModal"
import { Modal } from "react-responsive-modal"
import DeleteIcon from "@material-ui/icons/Delete"
import moment from "moment"
import imageCompression from 'browser-image-compression'

// i18n
import { useRouter } from "next/router"
import en from "../../../locales/en.js"
import fr from "../../../locales/fr.js"
import theme from "../../../src/theme"

const useStyles = makeStyles((theme) => ({
  filler: {
    backgroundColor: theme.palette.background.lightGrey
  },
  content: {
    backgroundColor: theme.palette.background.default,
    borderLeft: `2px solid ${  theme.palette.background.lightGrey}`
  },
  tableHeader: {
    textAlign: "left",
    color: theme.palette.border.dimGray,
    width: "15%"
  },
  header: {
    width: "48px",
    height: "16px",
    left: "425px",
    top: "201px",
    font: "Roboto",
    fontWeight: "bold",
    fontSize: "14px",
    textTransform: "uppercase",
    color: theme.palette.border.dimGray,
    letterSpacing: "0.4px",
    marginTop: "23px",
    marginBottom: "26px",
    marginLeft: "25px"
  },
  listCell: {
    font: "Roboto",
    textAlign: "left",
    color: theme.palette.border.dimGray,
    textTransform: "uppercase",
    fontSize: "14px",
    fontWeight: 500,
    fontStyle: "normal",
    letterSpacing: "0.4px",
    paddingLeft: "10px",
    width: "100%"
  },
  lastDetailsFields: {
    font: "Roboto",
    textAlign: "left",
    color: theme.palette.border.dimGray,
    fontSize: "14px",
    fontWeight: 500,
    fontStyle: "normal",
    letterSpacing: "0.4px",
    paddingLeft: "10px",
    width: "100%"
  },
  textDetails: {
    font: "Roboto",
    textAlign: "left",
    color: theme.palette.border.dimGray,
    fontSize: "14px",
    fontWeight: 500,
    fontStyle: "normal",
    letterSpacing: "0.4px",
    marginLeft: "10px"
  },
  subTitle: {
    font: "Roboto",
    textAlign: "left",
    color: theme.palette.border.dimGray,
    fontSize: "14px",
    fontWeight: 500,
    fontStyle: "normal",
    letterSpacing: "0.4px",
    marginLeft: "25px"
  },
  textInputDiv: {
    marginTop: "25px",
    marginLeft: "10px",
    marginBottom: "20px"
  },
  hideInput: {
    width: "0.1px",
    height: "0.1px",
    opacity: 0,
    overflow: "hidden",
    position: "absolute",
    zIndex: "-1"
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    width: "100%",
    minHeight: "400px"
  },

  badge: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    backgroundColor: theme.palette.wavezHome.backgroundColorSearch,
    color: theme.palette.text.darkCerulean,
    fontFamily: "Roboto",
    fontSize: "4em"
  },
  profilePhotoContainer: {
    width: "18%",
    marginLeft: "44px",
    paddingTop: "5%",
    paddingBottom: "1em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginLeft: "0px"
    },
    position: "relative"
  },
  profilePictureLabel: {
    color: theme.palette.buttonPrimary.main,
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: "14px",
    paddingTop: "15px",
    cursor: "pointer"
  },
  inputLabel: {
    paddingRight: "32px",
    width: "100%"
  },
  inputLabelText: {
    font: "Roboto",
    textAlign: "left",
    color: theme.palette.title.matterhorn,
    fontSize: "14px",
    fontWeight: 500,
    fontStyle: "normal",
    letterSpacing: "0.4px",
    paddingBottom: "5px"
  },
  icon: {
    alignItems: "right"
  },
  saveButton: {
    backgroundColor: "#4D96FB",
    minWidth: "83px",
    height: "31px",
    fontSize: 17,
    color: theme.palette.background.default,
    borderRadius: "5px",
    border: "none",
    marginTop: "25px",
    cursor: "pointer"
  },
  cancelButton: {
    backgroundColor: "white",
    minWidth: "83px",
    height: "31px",
    fontSize: 17,
    color: theme.palette.buttonPrimary.main,
    borderRadius: "5px",
    border: "none",
    marginTop: "25px",
    cursor: "pointer"
  },
  listItem: {
    display: "flex",
    flexDirection: "column"
  },
  genderInput: {
    width: "200px",
    height: "40px"
  },
  errorMessage: {
    position: "relative",
    left: "-14px"
  },
  modalStyle: {
    borderRadius: 10
  },
  paddingDiv: {
    paddingBottom: "100px"
  },
  deleteIcon: {
    width: 30,
    height: 30,
    backgroundColor: theme.palette.buttonPrimary.main,
    borderRadius: "500px",
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: 85,
    left: 85,
    cursor: "pointer"
  },
  contentContainer: {
    justifyContent: "center",
    display: "flex",
    alignContent: "inherit",
    alignItems: "center",
    color: theme.palette.title.matterhorn,
    fontSize: "18px"
  },
  titleDivider: {
    width: "50%",
    position: "relative",
    left: "27%",
    height: "4px",
    backgroundColor: theme.palette.buttonPrimary.main,
    top: "8%"
  }
}))

export default function GeneralInfo() {
  const token = Session.getToken("Wavetoken")
  const userInitials = Session.getUserInitials("UserInitials")
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr
  // data
  const [profileData, setProfileData] = useState({})
  const [imageUrl, setImageUrl] = useState("")
  const [userName, setUserName] = useState("")
  const [userLastName, setUserLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [gender, setGender] = useState("")
  const [language, setLanguage] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [address, setAddress] = useState("")
  const [rawAddress, setRawAddress] = useState("")
  const [email, setEmail] = useState("")
  // misc
  const genderList = [
    { label: "Female", key: "female" },
    { label: "Male", key: "male" },
    { label: "Other", key: "other" }
  ]
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [imageSrc, setImageSrc] = useState(null)
  const defaultCenter = { lat: 43.653226, lng: -79.3831843 }
  const [mapCenter, setMapCenter] = useState(defaultCenter)
  const NUM_MB_ALLOWED = 5
  const [dobDisabled, setDobDisabled] = useState(false)
  // display booleans
  const [openCropImageDialog, setOpenCropImageDialog] = useState(false)
  const [displayName, setDisplayName] = useState(false)
  const [displayPhone, setDisplayPhone] = useState(false)
  const [displayGender, setDisplayGender] = useState(false)
  const [displayLanguage, setDisplayLanguage] = useState(false)
  const [displayDateBirth, setDisplayDateBirth] = useState(false)
  const [displayAddress, setDisplayAddress] = useState(false)
  // validation
  const [firstNameIsValid, setFirstNameIsValid] = useState(true)
  const [lastNameIsValid, setLastNameIsValid] = useState(true)
  const [phoneNumIsValid, setPhoneNumIsValid] = useState(true)
  const [genderIsValid, setGenderIsValid] = useState(true)
  const [dobIsValid, setDobIsValid] = useState(true)
  const [languageIsValid, setLanguageIsValid] = useState(true)
  const [addressIsValid, setAddressIsValid] = useState(true)

  const [deleteDialogMessage, setDeleteDialogMessage] = useState("")
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [canDelete, setCanDelete] = useState(false)

  useEffect(() => {
    getUserInfo()
  }, [])

  const setUserInitials = () => {
    Session.setUserInitials(
      userName.toUpperCase().substring(0, 1) +
        userLastName.toUpperCase().substring(0, 1)
    )
  }

  const onUpdateLocation = (newValue, latLng, dispValue) => {
    setAddressIsValid(true)
    if (newValue !== undefined && latLng !== undefined) {
      setMapCenter({ lat: latLng[0], lng: latLng[1] })
    }

    setAddress(buildAddress(newValue?.address_components))
    setRawAddress(dispValue)
  }

  const getUserInfo = () => {
    API()
      .get("users/getUserDetails", {
        headers: {
          authorization: `Bearer ${  token}`
        }
      })
      .then((response) => {
        if (response.status === 200) {
          setProfileData(response.data)
          setUserName(response.data.firstName)
          setUserLastName(response.data.lastName)
          setGender(response.data.gender)
          setLanguage(response.data.primaryLanguage)
          setPhone(response.data.phoneNumber)
          setDateOfBirth(response.data.dateOfBirth)
          response.data.dateOfBirth ? setDobDisabled(true) : null
          setImageUrl(response.data.profileImageUrl)
          setAddress(response.data.userAddress)
          setRawAddress(response.data.rawAddress)
          setEmail(response.data.email)
        }
      })
      .catch((e) => {
        // router.push("/somethingWentWrong");
      })
  }

  const setUserInfo = (imageUrl, updatedItem) => {
    const body = { ...profileData }
    switch (updatedItem) {
      case "IMAGE":
        body.profileImageUrl = imageUrl
        updateUserInfo(body)
        return
      case "NAME":
        body.firstName = userName
        body.lastName = userLastName
        updateUserInfo(body)
        return
      case "PHONE":
        body.phoneNumber = phone
        updateUserInfo(body)
        return
      case "GENDER":
        body.gender = gender
        updateUserInfo(body)
        return
      case "DOB":
        body.dateOfBirth = dateOfBirth
        updateUserInfo(body)
        setDobDisabled(true)
        setDisplayDateBirth(false)
        return
      case "LANGUAGE":
        body.primaryLanguage = language
        updateUserInfo(body)
        return
      case "ADDRESS":
        body.userAddress = address
        body.rawAddress = rawAddress
        updateUserInfo(body)
        
      default:
        
    }
  }

  const updateUserInfo = (body) => {
    setProfileData(body)
    API()
      .put(`users/updateUserInfo`, body, {
        headers: {
          authorization: `Bearer ${  token}`
        }
      })
      .catch((e) => {
        // router.push("/somethingWentWrong");
      })
  }

  const handleImageChange = async (e) => {
    setErrorMessage("")
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i

    // get the first file
    if (e?.target?.files && e.target.files.length !==0) {
      //check if file is greater than NUM_MB_ALLOWED
      if (e?.target?.files[0].size / 1024 / 1024 > NUM_MB_ALLOWED) {
        setErrorMessage(t.profilePage.imageSizeError)
        return
      }
      const files = Array.from(e.target.files).filter(
        (file) =>
          file.size / 1024 / 1024 <= NUM_MB_ALLOWED &&
          allowedExtensions.exec(file.name)
      )

      files.map((file) => {
        console.log("file: ", file)
        console.log("original file.size: ", file.size)
      })

      if (e.target.files[0]) {
        setErrorMessage(null)
        const file = e.target.files[0]
        const imageDataUrl = await readFile(file)

        setImageSrc(imageDataUrl)
        setOpenCropImageDialog(true)
        const oldUrl = `${  imageUrl}`
      } else {
        setErrorMessage(t.profilePage.imageSizeError)
      }
      // to clear the file input for the same image to be uploaded twice
      e.target.value = null
    }
  }

  const uploadImage = async (croppedImageFile) => {
    // if (croppedImageFile.size / 1024 / 1024 > NUM_MB_ALLOWED) {
    //   setErrorMessage(t.profilePage.imageSizeError);
    // } else {
      console.log("cropped Image File : ", croppedImageFile)
      const options = {
        maxSizeMB: 5,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }
      let compressedFile
      try {
        compressedFile = await imageCompression(croppedImageFile, options)
        console.log('compressed file is', compressedFile) // true
        console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`) // smaller than maxSizeMB
        setErrorMessage(null)
              const formData = new FormData()              
              formData.append("image", compressedFile)
              const oldUrl = `${  imageUrl?.toString()}`
              API()
                .post(`users/uploadImage`, formData, {
                  headers: {
                    authorization: `Bearer ${  token}`,
                    "Content-Type": "multipart/form-data"
                  }
                })
                .then((response) => {
                  if ((response.status = 200)) {
                    formData.append("existingUrl", response.data)
                    API()
                      .put(`users/uploadImage`, formData, {
                        headers: {
                          authorization: `Bearer ${  token}`,
                          accept: "multipart/form-data"
                        }
                      })
                      .then((response) => {
                        if ((response.status = 200)) {
                          setImageUrl(response.data.url)
                          setUserInfo(response.data.url, "IMAGE")
                        }
                      })
                      .catch((e) => {
                        // router.push("/somethingWentWrong");
                        console.log("FAiled at upload image")
                      })
                  }
                })
                .catch((e) => {
                  console.log("FAiled at upload image ", e)
                  // router.push("/somethingWentWrong");
                })
      } catch (error) {
        console.log(error)
      }     
  }

  // name methods
  const validateName = () => {
    let isInvalid = false

    !userName ? (setFirstNameIsValid(false), (isInvalid = true)) : null
    userName.length > 25
      ? (setFirstNameIsValid(false), (isInvalid = true))
      : null
    !userLastName ? (setLastNameIsValid(false), (isInvalid = true)) : null
    userLastName.length > 25
      ? (setLastNameIsValid(false), (isInvalid = true))
      : null

    !isInvalid
      ? (setUserInfo(undefined, "NAME"),
        setDisplayName(false),
        setUserInitials())
      : null
  }
  const cancelName = () => {
    setUserName(profileData?.firstName)
    setUserLastName(profileData?.lastName)
    setDisplayName(false)
    setFirstNameIsValid(true)
    setLastNameIsValid(true)
  }
  const onClickShowName = () => {
    displayName ? cancelName() : (setDisplayName(true), setUserInitials())
  }
  // phone methods
  const validatePhoneNumber = () => {
    phone.toString().length === 11
      ? (setUserInfo(undefined, "PHONE"), setDisplayPhone(false))
      : setPhoneNumIsValid(false)
  }
  const cancelPhoneNumber = () => {
    setPhone(profileData?.phoneNumber)
    setDisplayPhone(false)
    setPhoneNumIsValid(true)
  }
  const onClickShowPhoneNumber = () => {
    displayPhone ? cancelPhoneNumber() : setDisplayPhone(true)
  }
  // gender methods
  const validateGender = () => {
    gender
      ? (setUserInfo(undefined, "GENDER"), setDisplayGender(false))
      : setGenderIsValid(false)
  }
  const cancelGender = () => {
    setGender(profileData?.gender)
    setDisplayGender(false)
    setGenderIsValid(true)
  }
  const onClickShowGender = () => {
    displayGender ? cancelGender() : setDisplayGender(true)
  }
  // date of birth methods
  const validateDob = () => {
    dateOfBirth
      ? (setUserInfo(undefined, "DOB"), setDisplayDateBirth(false))
      : setDobIsValid(false)
  }
  const cancelDob = () => {
    setDateOfBirth(profileData?.dateOfBirth)
    setDisplayDateBirth(false)
    setDobIsValid(true)
  }
  const onClickShowDateBirth = () => {
    displayDateBirth ? cancelDob() : setDisplayDateBirth(true)
  }
  // language methods
  const validateLanguage = () => {
    language
      ? (setUserInfo(undefined, "LANGUAGE"), setDisplayLanguage(false))
      : setLanguageIsValid(false)
  }
  const cancelLanguage = () => {
    setLanguage(profileData?.primaryLanguage)
    setDisplayLanguage(false)
    setLanguageIsValid(true)
  }
  const onClickShowLanguage = () => {
    displayLanguage ? cancelLanguage() : setDisplayLanguage(true)
  }
  // address methods
  const validateAddress = () => {
    rawAddress
      ? (setUserInfo(undefined, "ADDRESS"), setDisplayAddress(false))
      : setAddressIsValid(false)
  }
  const cancelAddress = () => {
    setAddress(profileData?.userAddress)
    setRawAddress(profileData?.rawAddress)
    setDisplayAddress(false)
    setAddressIsValid(true)
  }
  const onClickShowAddress = () => {
    displayAddress ? cancelAddress() : setDisplayAddress(true)
  }

  const checkUserDeleteStatus = () => {
    const id = Session.getUserId()
    if (id) {
      setLoading(true)
      API()
          .get(
              `users/checkUserStatusForDeleting/${id}`,
              {
                headers: {
                  authorization: `Bearer ${  token}`,
                  accept: "application/json"
                }
              }
          )
          .then((response) => {
            if (response.status === 200) {
              console.log("response is ", response)
              setLoading(false)
              setCanDelete(true)
              setOpenDeleteDialog(true)
              setDeleteDialogMessage("Please note that, once your account is deleted you will no longer be able to access \n" +
                  "your account information such as your past trips, messages, payment history etc. \n" +
                  "Also, kindly be aware that all your account related data will be retained for next 30 \n" +
                  "days and during this period you cannot register back with us. Are you sure you want\n" +
                  "to delete your account?")
            }
          })
          .catch((e) => {
            setLoading(false)
            setCanDelete(false)
            setOpenDeleteDialog(true)
            setDeleteDialogMessage("An account cannot be deleted if there are any upcoming/ on-going trips or \n" +
                "payment dues. Please cancel/ complete your upcoming/on-going trips or clear the \n" +
                "dues to delete your account.")
            console.log("delete user error: ", e)
          })
    }
  }

  const deleteUser = () => {
    const id = Session.getUserId()
    if (id) {
      setLoading(true)
      API()
          .put(
              `users/requestAccountDeletion`,
              {disabled: true}
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
            setLoading(false)
            router.push("/")
            Session.clear()
          })
          .catch((e) => {
            setLoading(false)
            console.log("delete user error: ", e)
          })
    }
  }
  const deleteAccount = () => {
    deleteUser()
  }

  const handleDeleteDialogClose = () => {
    setCanDelete(false)
    setOpenDeleteDialog(false)
    setDeleteDialogMessage("")
  }

  return (
    <>
      <Modal
        classNames={{ modal: classes.modalStyle }}
        open={errorMessage}
        onClose={() => setErrorMessage(null)}
        center
      >
        {" "}
        {/* Image Error Modal */}
        <ErrorMessageModal
          message={errorMessage}
          questionMessage={""}
          closeModal={() => setErrorMessage(null)}
        />
      </Modal>
      <Dialog
          open={openDeleteDialog}
          onClose={(event, reason) => {
            if (reason !=='backdropClick') {
              handleDeleteDialogClose()
            }
          }}
          fullWidth
          maxWidth="sm"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
      >
        <div style={{padding: '2rem'}}>
          <CloseIcon
              onClick={handleDeleteDialogClose}
              style={{fontSize: "2rem", cursor: "pointer", float: 'right', top: "5%", position: "relative"}}
          />
          <DialogTitle style={{textAlign: 'center'}} id="alert-dialog-title">
            <div style={{display: "inline-grid"}}>
              Delete Account
              <Divider className={classes.titleDivider}/>
            </div>
          </DialogTitle>
          <DialogContent  className={classes.contentContainer}>
            <div style={{textAlign: "center"}}>
              {deleteDialogMessage}
            </div>
          </DialogContent>
          <DialogActions style={{justifyContent: 'center'}}>
            {canDelete ? (
                <>
                    <Button
                        style={{marginRight: "1rem", color: theme.palette.background.default, backgroundColor: theme.palette.background.flamingo}}
                        variant="contained"
                        onClick={deleteUser}
                    >
                      Delete
                    </Button>
                <Button onClick={handleDeleteDialogClose} variant="outlined" style={{color: theme.palette.buttonPrimary.main, border: "none"}}>Cancel</Button>
                </>
            ) : (
                <>
                  <Button onClick={handleDeleteDialogClose} variant="outlined" style={{color: theme.palette.buttonPrimary.main, border: "none"}}>Close</Button>
                </>
            )}
          </DialogActions>
        </div>
      </Dialog>
      <NavBar />
      <AccountInfoBanner />
      <Grid container>
        <Grid item xs={false} lg={2} className={classes.filler} />
        <Grid item xs={3} lg={2}>
          <AccountInfoTabs currentTab={0} />
        </Grid>
        <Grid item xs={9} lg={6} className={classes.content}>
          {/* Name Section */}
          <Typography className={classes.header}>
            {t.profilePage.photoLabel}
          </Typography>
          <Typography className={classes.subTitle}>
            {t.profilePage.photoDesc}
          </Typography>

          <Paper>
            <div className={classes.profilePhotoContainer}>
              <div style={{ position: "relative" }}>
                <Avatar
                  alt="Remy Sharp Avatar"
                  src={imageUrl?.toString()}
                  className={classes.badge}
                >
                  {userInitials}
                </Avatar>
                <div
                  className={classes.deleteIcon}
                  onClick={() => (setUserInfo(null, "IMAGE"), setImageUrl(""))}
                >
                  <DeleteIcon
                    style={{
                      color: theme.palette.text.darkCerulean,
                      paddingLeft: "1px"
                    }}
                  />
                </div>
              </div>
              <span style={{ marginTop: "25px" }}>
                <input
                  type="file"
                  name="file"
                  id="file"
                  accept="image/jpg, image/jpeg, image/png"
                  onChange={handleImageChange}
                  className={classes.hideInput}
                  data-testid="uploadBtn"
                />
                <label htmlFor="file" className={classes.profilePictureLabel}>
                  {t.profilePage.photoLabel2}
                </label>
              </span>
            </div>

            <div>
              <ImageCropDialog
                open={openCropImageDialog}
                setOpen={setOpenCropImageDialog}
                imageSrc={imageSrc}
                getBlobUrl={false}
                setImageSrc={setImageSrc}
                saveImage={uploadImage}
              />
            </div>
          </Paper>
          <Divider />
          {/* Name Section */}
          <List>
            <ListItem style={{ alignItems: "center" }}>
              <Typography
                className={classes.listCell}
                style={{ width: "250px" }}
              >
                {t.profilePage.fullName}
              </Typography>
              {displayName ? (
                <Typography
                  className={classes.listCell}
                  style={{
                    display: "block"
                  }}
                >
                  {""}
                </Typography>
              ) : (
                <Typography
                  className={classes.lastDetailsFields}
                  style={{
                    display: "block"
                  }}
                >
                  {userName} {userLastName}
                </Typography>
              )}

              <Button onClick={onClickShowName}>
                {displayName ? (
                  <CloseIcon />
                ) : (
                  <CreateIcon className={classes.icon} />
                )}
              </Button>
            </ListItem>
            {/* Expanded Name Section */}
            {displayName && (
              <ListItem>
                <FormControl variant="outlined" style={{ width: "100%" }}>
                  <Typography className={classes.textDetails}>
                    {t.profilePage.nameDesc}
                  </Typography>
                  <div className={classes.textInputDiv}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <div style={{ width: "45%" }}>
                        <Typography className={classes.inputLabelText}>
                          {t.profilePage.firstName}
                        </Typography>

                        <TextField
                          id="firstNameInput"
                          variant="outlined"
                          defaultValue={userName}
                          className={classes.inputLabel}
                          onChange={(event) => {
                            setUserName(event.target.value)
                            setFirstNameIsValid(true)
                          }}
                          error={!firstNameIsValid}
                          size="small"
                        />
                        <FormHelperText error className={classes.errorMessage}>
                          {!firstNameIsValid ? t.profilePage.nameInvalid : null}
                        </FormHelperText>
                      </div>
                      <div style={{ width: "45%" }}>
                        <Typography className={classes.inputLabelText} id="1">
                          {t.profilePage.lastName}
                        </Typography>
                        <TextField
                          id="lastNameInput"
                          variant="outlined"
                          defaultValue={userLastName}
                          className={classes.inputLabel}
                          onChange={(event) => {
                            setUserLastName(event.target.value)
                            setLastNameIsValid(true)
                          }}
                          error={!lastNameIsValid}
                          size="small"
                        />
                        <FormHelperText error className={classes.errorMessage}>
                          {!lastNameIsValid ? t.profilePage.nameInvalid : null}
                        </FormHelperText>
                      </div>
                    </div>
                    <div>
                      {" "}
                      <input
                        data-testid="nameSaveBtn"
                        id="nameSaveBtn"
                        type="button"
                        defaultValue={t.save}
                        className={classes.saveButton}
                        onClick={() => {
                          validateName()
                        }}
                      />{" "}
                      <input
                        data-testid="nameCancelBtn"
                        id="nameCancelBtn"
                        type="button"
                        defaultValue={t.cancel}
                        className={classes.cancelButton}
                        onClick={() => {
                          cancelName()
                        }}
                      />
                    </div>
                  </div>
                </FormControl>
              </ListItem>
            )}
            {/* End Name Section */}
            <Divider />
            {/* Phone Section */}
            <ListItem className={classes.listItem}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center"
                }}
              >
                <Typography
                  className={classes.listCell}
                  style={{ width: "250px" }}
                >
                  {t.profilePage.phoneNumber}
                </Typography>
                {displayPhone ? (
                  <Typography className={classes.listCell}> </Typography>
                ) : (
                  <Typography className={classes.listCell}>
                    {phone
                      ? `${phone.toString().substring(0, 1) 
                        } (${ 
                        phone.toString().substring(1, 4) 
                        }) ${ 
                        phone.toString().substring(4, 7) 
                        }-${ 
                        phone.toString().substring(7)}`
                      : ""}
                  </Typography>
                )}

                <Button onClick={onClickShowPhoneNumber}>
                  {displayPhone ? (
                    <CloseIcon />
                  ) : (
                    <CreateIcon className={classes.icon} />
                  )}
                </Button>
              </div>
              {/* Expanded Phone Section */}
              {displayPhone && (
                <FormControl variant="outlined" style={{ width: "100%" }}>
                  <div className={classes.textInputDiv}>
                    <div style={{ width: "45%" }}>
                      <Typography className={classes.inputLabelText}>
                        {t.profilePage.phoneNumber}
                      </Typography>
                      <ReactPhoneInput
                        inputProps={{ "data-testid": "phoneInput" }}
                        inputStyle={{
                          width: "100%",
                          minWidth: "180px",
                          height: "40px"
                        }}
                        country={"ca"}
                        countryCodeEditable={false}
                        onlyCountries={['ca']}
                        value={phone?.toString()}
                        onChange={(val) => {
                          setPhone(val), setPhoneNumIsValid(true)
                        }}
                        size="small"
                        isValid={phoneNumIsValid}
                      />
                      <FormHelperText error className={classes.errorMessage}>
                        {!phoneNumIsValid ? t.profilePage.phoneInvalid : null}
                      </FormHelperText>
                    </div>
                    <div>
                      {" "}
                      <input
                        data-testid="phoneSaveBtn"
                        id="phoneSaveBtn"
                        type="button"
                        defaultValue={t.save}
                        className={classes.saveButton}
                        onClick={() => {
                          validatePhoneNumber()
                        }}
                      />{" "}
                      <input
                        data-testid="phoneCancelBtn"
                        id="phoneCancelBtn"
                        type="button"
                        defaultValue={t.cancel}
                        className={classes.cancelButton}
                        onClick={() => {
                          cancelPhoneNumber()
                        }}
                      />
                    </div>
                  </div>
                </FormControl>
              )}
            </ListItem>
            {/* End Phone Section */}
            <Divider />
            {/* Gender Section */}
            <ListItem className={classes.listItem}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center"
                }}
              >
                <Typography
                  className={classes.listCell}
                  style={{ width: "250px" }}
                >
                  {t.profilePage.gender}
                </Typography>
                {displayPhone ? (
                  <Typography className={classes.listCell}> </Typography>
                ) : (
                  <Typography className={classes.listCell}>{gender}</Typography>
                )}

                <Button onClick={onClickShowGender}>
                  {displayGender ? (
                    <CloseIcon />
                  ) : (
                    <CreateIcon className={classes.icon} />
                  )}
                </Button>
              </div>
              {/* Expanded Gender Section */}
              {displayGender && (
                <FormControl variant="outlined" style={{ width: "100%" }}>
                  <div className={classes.textInputDiv}>
                    <div style={{ width: "45%" }}>
                      <Typography className={classes.inputLabelText}>
                        {t.profilePage.gender}
                      </Typography>
                      <Select
                        className={classes.genderInput}
                        inputProps={{ "data-testid": "genderInput" }}
                        variant="outlined"
                        value={gender || ""}
                        renderValue={() => {
                          return gender || t.profilePage.genderPlaceholder
                        }}
                        displayEmpty
                        onChange={(event) => {
                          setGender(event?.target?.value),
                            setGenderIsValid(true)
                        }}
                        error={!genderIsValid}
                      >
                        {genderList.map((option) => (
                          <MenuItem key={option.label} value={option.label}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText error className={classes.errorMessage}>
                        {!genderIsValid ? t.profilePage.genderInvalid : null}
                      </FormHelperText>
                    </div>
                    <div>
                      {" "}
                      <input
                        data-testid="genderSaveBtn"
                        id="genderSaveBtn"
                        type="button"
                        defaultValue={t.save}
                        className={classes.saveButton}
                        onClick={() => {
                          validateGender()
                        }}
                      />{" "}
                      <input
                        data-testid="genderCancelBtn"
                        id="genderCancelBtn"
                        type="button"
                        defaultValue={t.cancel}
                        className={classes.cancelButton}
                        onClick={() => {
                          cancelGender()
                        }}
                      />
                    </div>
                  </div>
                </FormControl>
              )}
            </ListItem>
            {/* End Gender Section */}
            <Divider />
            {/* Date of Birth Section */}
            <ListItem className={classes.listItem}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center"
                }}
              >
                <Typography
                  className={classes.listCell}
                  style={{ width: "250px" }}
                >
                  {t.profilePage.dob}
                </Typography>
                {displayPhone ? (
                  <Typography className={classes.listCell}> </Typography>
                ) : (
                  <Typography className={classes.listCell}>
                    {(dateOfBirth && dateOfBirth !== "") && moment(dateOfBirth).format('MM/DD/YYYY')}
                  </Typography>
                )}

                {!dobDisabled ? (
                  <Button onClick={onClickShowDateBirth}>
                    {displayDateBirth ? (
                      <CloseIcon />
                    ) : (
                      <CreateIcon className={classes.icon} />
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => {}}
                    style={{ display: "hidden", visibility: "hidden" }}
                  >
                    <CloseIcon
                      style={{ display: "hidden", visibility: "hidden" }}
                    />
                  </Button>
                )}
              </div>
              {/* Expanded Date of Birth Section */}
              {displayDateBirth && (
                <FormControl variant="outlined" style={{ width: "100%" }}>
                  <div className={classes.textInputDiv}>
                    <div style={{ width: "45%" }}>
                      <Typography className={classes.inputLabelText}>
                        {t.profilePage.dob}
                      </Typography>

                      <TextField
                        id="dobInput"
                        type="date"
                        disabled={dobDisabled}
                        defaultValue={
                          dateOfBirth && dateOfBirth !== ""
                            ? moment(dateOfBirth).format("YYYY-MM-DD")
                            : ""
                        }
                        InputLabelProps={{
                          shrink: true
                        }}
                        onChange={(event) => {
                          setDateOfBirth(
                            moment(event.target.value, "YYYY-MM-DD")
                              .toDate()
                              .toISOString()
                          )
                          setDobIsValid(true)
                        }}
                        error={!dobIsValid}
                      />
                      <FormHelperText error className={classes.errorMessage}>
                        {!dobIsValid ? t.profilePage.dobInvalid : null}
                      </FormHelperText>
                    </div>
                    <div>
                      {" "}
                      <input
                        data-testid="dobSaveButton"
                        id="dobSaveButton"
                        type="button"
                        defaultValue={t.save}
                        className={classes.saveButton}
                        onClick={() => {
                          validateDob()
                        }}
                      />{" "}
                      <input
                        data-testid="dobCancelButton"
                        id="dobCancelButton"
                        type="button"
                        defaultValue={t.cancel}
                        className={classes.cancelButton}
                        onClick={() => {
                          cancelDob()
                        }}
                      />
                    </div>
                  </div>
                </FormControl>
              )}
            </ListItem>
            {/* End Date of Birth Section */}
            <Divider />
            {/* Language Section */}
            <ListItem className={classes.listItem}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center"
                }}
              >
                <Typography
                  className={classes.listCell}
                  style={{ width: "250px" }}
                >
                  {t.profilePage.primaryLanguage}
                </Typography>
                {displayLanguage ? (
                  <Typography className={classes.listCell}> </Typography>
                ) : (
                  <Typography className={classes.listCell}>
                    {language}
                  </Typography>
                )}

                <Button onClick={onClickShowLanguage}>
                  {displayLanguage ? (
                    <CloseIcon />
                  ) : (
                    <CreateIcon className={classes.icon} />
                  )}
                </Button>
              </div>
              {/* Expanded Language Section */}
              {displayLanguage && (
                <FormControl variant="outlined" style={{ width: "100%" }}>
                  <div className={classes.textInputDiv}>
                    <div style={{ width: "45%" }}>
                      <Typography className={classes.inputLabelText}>
                        {t.profilePage.primaryLanguage}
                      </Typography>
                      <Autocomplete
                        size={"small"}
                        id="autocompleteLanguage"
                        options={languageList}
                        getOptionLabel={(option) => option.label || ""}
                        style={{ width: 300 }}
                        value={{ label: language }}
                        getOptionSelected={(option, value) =>
                          option?.labe=== value?.label
                        }
                        onChange={(event, data) => {
                          setLanguage(data?.label), setLanguageIsValid(true)
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={!languageIsValid}
                            label={t.profilePage.languagePlaceholder}
                            variant="outlined"
                          />
                        )}
                      />
                      <FormHelperText error className={classes.errorMessage}>
                        {!languageIsValid
                          ? t.profilePage.languageInvalid
                          : null}
                      </FormHelperText>
                    </div>
                    <div>
                      {" "}
                      <input
                        data-testid="languageSaveBtn"
                        id="languageSaveBtn"
                        type="button"
                        defaultValue={t.save}
                        className={classes.saveButton}
                        onClick={() => {
                          validateLanguage()
                        }}
                      />{" "}
                      <input
                        data-testid="languageCancelBtn"
                        id="languageCancelBtn"
                        type="button"
                        defaultValue={t.cancel}
                        className={classes.cancelButton}
                        onClick={() => {
                          cancelLanguage()
                        }}
                      />
                    </div>
                  </div>
                </FormControl>
              )}
            </ListItem>
            {/* End Language Section */}
            <Divider />
            {/* Address Section */}
            <ListItem className={classes.listItem}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center"
                }}
              >
                <Typography
                  className={classes.listCell}
                  style={{ width: "250px" }}
                >
                  {t.profilePage.address}
                </Typography>
                {displayAddress ? (
                  <Typography className={classes.listCell}> </Typography>
                ) : (
                  <Typography className={classes.listCell}>
                    {rawAddress}
                  </Typography>
                )}

                <Button onClick={onClickShowAddress}>
                  {displayAddress ? (
                    <CloseIcon />
                  ) : (
                    <CreateIcon className={classes.icon} />
                  )}
                </Button>
              </div>
              {/* Expanded Address Section */}
              {displayAddress && (
                <FormControl variant="outlined" style={{ width: "100%" }}>
                  <div className={classes.textInputDiv}>
                    <div>
                      <Typography className={classes.inputLabelText}>
                        {t.profilePage.address}
                      </Typography>

                      <div style={{ width: "95%", maxWidth: "500px" }}>
                        <MapAutocomplete
                          restoreValue={rawAddress}
                          locationIsValid={addressIsValid}
                          className={classes.inputLabel}
                          onUpdate={onUpdateLocation}
                          inputWidth={"100%"}
                          errorShift={"-14px"}
                          size={"small"}
                        />
                      </div>
                    </div>
                    <div>
                      {" "}
                      <input
                        data-testid="addressSaveBtn"
                        id="addressSaveBtn"
                        type="button"
                        defaultValue={t.save}
                        className={classes.saveButton}
                        onClick={() => {
                          validateAddress()
                        }}
                      />{" "}
                      <input
                        data-testid="addressCancelBtn"
                        id="addressCancelBtn"
                        type="button"
                        defaultValue={t.cancel}
                        className={classes.cancelButton}
                        onClick={() => {
                          cancelAddress()
                        }}
                      />
                    </div>
                  </div>
                </FormControl>
              )}
            </ListItem>
            {/* End Address Section */}
            <Divider />
            {/* Email Address Section */}
            <ListItem className={classes.listItem}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center"
                }}
              >
                <Typography
                  className={classes.listCell}
                  style={{ width: "250px" }}
                >
                  {t.email}
                </Typography>
                <Typography className={classes.listCell}>{email}</Typography>
                <Button
                  onClick={() => {}}
                  style={{ display: "hidden", visibility: "hidden" }}
                >
                  <CloseIcon
                    style={{ display: "hidden", visibility: "hidden" }}
                  />
                </Button>
              </div>
            </ListItem>
            <ListItem className={classes.listItem}>
              <div style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "center"
                  }}>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => { checkUserDeleteStatus() }}
                    style={{backgroundColor: "red", color: "#FFFFFF"}}>
                  Delete Account
                </Button>
              </div>
            </ListItem>
          </List>
          <div className={classes.paddingDiv} />
        </Grid>
        <Grid item xs={false} lg={2} className={classes.filler} />
      </Grid>
    </>
  )
}
function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.addEventListener("load", () => resolve(reader.result), false)
    reader.readAsDataURL(file)
  })
}
