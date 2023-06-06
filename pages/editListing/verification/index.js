import React, {useState, useEffect, useContext} from "react"
import {makeStyles, withStyles} from "@material-ui/core/styles"
import {
    Button,
    Container,
    Grid,
    Chip,
    Paper,
    TextField,
    FormHelperText,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@material-ui/core"
import Hint from "../../addList/hint"
import GetAppIcon from "@material-ui/icons/GetApp"
import Session from "../../../sessionService"
import {Modal} from "react-responsive-modal"
import DeleteWarningBox from "../../../components/yourListing/deleteWarningBox"
import API from "../../../pages/api/baseApiIinstance"
import MobileHint from "../../../components/addList/mobileHint"
// i18n
import {useRouter} from "next/router"
import en from "../../../locales/en"
import fr from "../../../locales/fr"
import ThanksOrRejection from "../../../components/editListing/thanksOrRejection"
import ProofForm from "../../../components/accountInfo/proofForm"
import theme from "../../../src/theme"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginTop: "3%",
        //paddingTop: "50px",
        [theme.breakpoints.down("sm")]: {
            padding: 3
        }
    },
    uploadContainer: {
        marginTop: "8%",
        display: "flex",
        marginLeft: "10%",
        paddingLeft: "10%",
        [theme.breakpoints.down("sm")]: {
            padding: 0
        },
        [theme.breakpoints.down("xs")]: {
            paddingTop: 20,
            marginLeft: "0%",
            paddingLeft: "10%",
            paddingRight: "10%"
        }
    },
    serialContainer: {
        marginTop: "8%",
        display: "flex",
        marginLeft: "10%",
        paddingLeft: "10%",
        [theme.breakpoints.down("md")]: {
            display: "block"
        },
        [theme.breakpoints.down("sm")]: {
            marginRight: "10%",
            padding: 0
        },
        [theme.breakpoints.down("xs")]: {
            paddingTop: 20,
            marginLeft: "0%",
            paddingLeft: "10%"
        }
    },
    serialErrorMessage: {
        marginLeft: "10%",
        paddingLeft: "10%",
        [theme.breakpoints.down("sm")]: {
            padding: 0
        },
        [theme.breakpoints.down("xs")]: {
            paddingTop: 20,
            marginLeft: "0%",
            paddingLeft: "10%",
            paddingRight: "10%"
        }
    },
    documentName: {
        fontWeight: 500,
        fontSize: 18,
        width: 400,
        padding: 0,
        [theme.breakpoints.down("xs")]: {
            paddingTop: 15,
            width: "80%",
            paddingRight: "5%"
        }
    },
    serialNumberName: {
        fontWeight: 500,
        fontSize: 18,
        minWidth: 200,
        marginBottom: "5%",
        [theme.breakpoints.down("xs")]: {
            paddingTop: 15
        }
    },
    serialInput: {
        display: "flex",
        [theme.breakpoints.down("md")]: {
            maxWidth: "100%"
        }
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
        fontWeight: 400,
        fontSize: 18,
        color: theme.palette.background.default,
        padding: "15px 20px",
        width: "100px",
        backgroundColor: theme.palette.buttonPrimary.main,
        cursor: "pointer",
        borderRadius: "6px"
    },
    uploadSection: {
        marginLeft: "auto",
        marginRight: "0",
        [theme.breakpoints.down("sm")]: {
            marginRight: "50px"
        },
        [theme.breakpoints.down("xs")]: {
            paddingTop: 20,
            paddingLeft: 0
        }
    },
    container: {
        [theme.breakpoints.down("sm")]: {
            padding: 0
        }
    },
    navbtn: {
        position: "fixed",
        backgroundColor: theme.palette.background.default,
        bottom: 0,
        left: 0,
        height: 80,
        display: "flex",
        width: "100%",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    hint: {
        // position:"fixed",
        width: "32vw",
        zIndex: 10,
        top: 140,
        [theme.breakpoints.down("xs")]: {
            width: "38vw"
        },
        [theme.breakpoints.down("sm")]: {
            width: "40vw"
        }
    },
    hintBlue: {
        top: 160,
        backgroundColor: theme.palette.background.pattensBlue,
        height: "100vh",
        position: "fixed",
        zIndex: -1
    },
    text: {
        font: "Roboto",
        color: theme.palette.text.grey,
        fontSize: 24
    },
    chip: {
        borderRadius: 5,
        maxWidth: 250,
        zIndex: 10
    },
    modalStyle: {
        borderRadius: 10
    },
    bottomDiv: {
        position: "fixed",
        backgroundColor: theme.palette.background.default,
        bottom: 0,
        height: 80,
        width: "100%",
        alignItems: "center",
        zIndex: 11,
        borderTop: `1px ${  theme.palette.background.lightGrey  } solid`
    },
    saveDiv: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 12
    },
    hintModal: {
        width: "90vw",
        borderRadius: 10,
        position: "fixed",
        left: 0
    },
    customModal: {
        maxWidth: "100%",
        margin: 0,
        padding: 0
    }
}))

export default function Verification({
                                         listingStartValue,
                                         setUnsavedChanges,
                                         trulioo,
                                         getListingInfo,
                                         hintIsOpen,
                                         setHintIsOpen,
                                         documents,
                                         updateCheckMark,
                                         getUploadedDocuments,
                                         startingUploadedDocuments,
                                         getTransactionStatus
                                     }) {
    const classes = useStyles()
    const token = Session.getToken("Wavetoken")
    const router = useRouter()
    const type = listingStartValue?.vesselType
    const vesselId = listingStartValue?._id
    const {locale} = router
    const t = locale === "en" ? en : fr
    const [vesselTypeDocument, setVesselTypeDocument] = useState()
    const mobileBreakpoint = 600
    const [isMobile, setIsMobile] = useState(false)
    const [windowSize, setWindowSize] = useState("")
    const [uploadedDocs, setUploadedDocs] = useState()
    const [deleteWarningBox, setDeleteWarningBox] = useState(false)
    const [deleteFile, setDeleteFile] = useState({name: "", type: ""})
    const [isSerialNumber, setIsSerialNumber] = useState(false)
    const [serialNumber_countryCode, setSerialNumber_countryCode] = useState(
        listingStartValue?.serialNumber?.length > 12
            ? listingStartValue?.serialNumber?.slice(0, -12)
            : ""
    )
    const [
        serialNumber_manufactureIdentificationCode,
        setSerialNumber_manufactureIdentificationCode
    ] = useState(listingStartValue?.serialNumber?.length > 0
        ? listingStartValue?.serialNumber?.substr(-12)?.substr(0, 3) : "") // get 3 character before manufacture serial number
    const [
        serialNumber_manufactureSerialNumber,
        setSerialNumber_manufactureSerialNumber
    ] = useState(listingStartValue?.serialNumber?.length > 0
        ? listingStartValue?.serialNumber?.substr(-9)?.substr(0, 5) : "") // get 5 character before commence of construction
    const [
        serialNumber_commencementOfConstruction,
        setSerialNumber_commencementOfConstruction
    ] = useState(listingStartValue?.serialNumber?.length > 0
        ? listingStartValue?.serialNumber?.substr(-4)?.substr(0, 2) : "") // get 2 characters before model year
    const [serialNumber_modelYear, setSerialNumber_modelYear] = useState(listingStartValue?.serialNumber?.length > 0
        ? listingStartValue?.serialNumber?.substr(-2) : ""
    ) //get last 2 character of serial number

    const [isValid, setIsValid] = useState(false)
    const [
        snem_manufactureIdentificationCode,
        setSnem_manufactureIdentificationCode
    ] = useState("")
    const [
        snem_manufactureSerialNumber,
        setSnem_manufactureSerialNumber
    ] = useState("")
    const [
        snem_commencementOfConstruction,
        setSnem_commencementOfConstruction
    ] = useState("")
    const [
        snem_modelYear,
        setSnem_modelYear
    ] = useState("")

    const [openTruliooForm, setOpenTruliooForm] = useState(false)
    const [truliooVerification, setTruliooVerification] = useState(trulioo)

    const handleOnClickFinish = () => {
        console.log("Submit serial number: ", documents.find(item => item.shortForm === "SerialNumber"))
        const newSerialNumber =
            serialNumber_countryCode +
            serialNumber_manufactureIdentificationCode +
            serialNumber_manufactureSerialNumber +
            serialNumber_commencementOfConstruction +
            serialNumber_modelYear
        //serial number required
        if (isSerialNumber && documents.find(item => item.shortForm === "SerialNumber")?.isRequired) {
            validateSerialNumber()
        } else if (isSerialNumber && !(documents.find(item => item.shortForm === "SerialNumber")?.isRequired) && newSerialNumber.length > 0) {
            validateSerialNumber()
        } else if (isSerialNumber && !(documents.find(item => item.shortForm === "SerialNumber")?.isRequired) && newSerialNumber.length === 0) {
            setIsValid(true)
        } else {
            router.push("/yourListings")
        }
    }

    const validateSerialNumber = () => {
        setIsValid(true)

        serialNumber_manufactureIdentificationCode.split("").map((item) => {
            if (/[a-z]/i.test(item) === false) {
                setSnem_manufactureIdentificationCode(
                    "Please enter a valid Manufacture’s Identification code"
                )
                setIsValid(false)
            }
        })
        if (serialNumber_manufactureIdentificationCode.length < 3) {
            setSnem_manufactureIdentificationCode(
                "Please enter a valid Manufacture’s Identification code"
            )
            setIsValid(false)
        }

        serialNumber_manufactureSerialNumber.split("").map((item) => {
            if (/[a-z0-9]/i.test(item) === false) {
                setSnem_manufactureSerialNumber(
                    "Please enter a valid Manufacture’s Serial Number"
                )
                setIsValid(false)
            }
        })
        if (serialNumber_manufactureSerialNumber.length < 5) {
            setSnem_manufactureSerialNumber(
                "Please enter a valid Manufacture’s Serial Number"
            )
            setIsValid(false)
        }

        serialNumber_commencementOfConstruction.split("").map((item) => {
            if (/[a-z0-9]/i.test(item) === false) {
                setSnem_commencementOfConstruction(
                    "Please enter a valid Commencement of Construction"
                )
                setIsValid(false)
            }
        })
        if (serialNumber_commencementOfConstruction.length < 2) {
            setSnem_commencementOfConstruction(
                "Please enter a valid Commencement of Construction"
            )
            setIsValid(false)
        }

        serialNumber_modelYear.split("").map((item) => {
            if (/[0-9]/i.test(item) === false) {
                setSnem_modelYear(
                    "Please enter a valid Model Year"
                )
                setIsValid(false)
            }
        })
        if (serialNumber_modelYear.length < 2) {
            setSnem_modelYear("Please enter a valid Model Year")
            setIsValid(false)
        }
    }

    useEffect(() => {
        // only execute all the code below in client side
        if (typeof window !== "undefined") {
            // Handler to call on window resize
            function handleResize() {
                // Set window width/height to state
                setWindowSize(window.innerWidth)
                window.innerWidth <= mobileBreakpoint
                    ? setIsMobile(true)
                    : setIsMobile(false)
            }

            // Add event listener
            window.addEventListener("resize", handleResize)

            // Call handler right away so state gets updated with initial window size
            handleResize()

            // Remove event listener on cleanup
            return () => window.removeEventListener("resize", handleResize)
        }
      }, [])
    const confirmDelete = (deleteFile) => {
        const docId = uploadedDocs?.find(
            (item) => item.fileType === deleteFile.type
        )?._id
        API()
            .delete(`vessel/document/${docId}`, {
                headers: {
                    authorization: `Bearer ${  token}`
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    setDeleteWarningBox(false)
                    getUploadedDocuments()
                    console.log("delete document response is ", response.data)
                }
            })
      .catch((e) => {
        console.log("Error from delete document is: ", e)
        // router.push("/somethingWentWrong");
      })
  }

    const handleDelete = (docTitle, originalFileName) => {
        setDeleteFile({name: originalFileName, type: docTitle})
        setDeleteWarningBox(true)
    }

  const handleFileUpload = (docTitle, event) => {
    const formData = new FormData()
    formData.append("fileType", docTitle)
    formData.append("file", event.target.files[0])
    API()
      .put(`vessel/document/${vesselId}`, formData, {
        headers: {
          authorization: `Bearer ${  token}`,
          accept: "application/json",
          "Content-Type": "multipart/form-data"
        }
      })
      .then((response) => {
        if ((response.status = 200)) {
          getUploadedDocuments()
          console.log("new file upload response is ", response.data)
        }
      })
      .catch((e) => {
        console.log("Error from new file upload is: ", e)
        // router.push("/somethingWentWrong");
      })
  }

    const handleSerialNumberCountryCode = (event) => {
        setSerialNumber_countryCode(event.target.value)
        setUnsavedChanges(true)
    }

    const closeTruliooForm = () => {
        setOpenTruliooForm(false)
        getTransactionStatus()
    }

  // call API
  useEffect(() => {
    const newSerialNumber = serialNumber_countryCode +
    serialNumber_manufactureIdentificationCode +
    serialNumber_manufactureSerialNumber +
    serialNumber_commencementOfConstruction +
    serialNumber_modelYear
    if (isValid) {
      API()
        .put(
          `${listingStartValue.vesselType.toLowerCase()}s/${
            listingStartValue._id
          }`,
          { serialNumber: newSerialNumber },
          {
            headers: {
              authorization: `Bearer ${  token}`
            }
          }
        )
        .then((response) => {
          console.log("Success update serial number", response.data)
        })
        .catch((e) => {
          console.log("Error Call api serial number ")
          // router.push("/somethingWentWrong");
        })
      router.push("/yourListings")
    }
    setIsValid(false)
  }, [isValid])

    useEffect(() => {
        const documentsExcludeSerialNumber = documents.filter(
            (item) => item.shortForm !== "SerialNumber"
        )
        setIsSerialNumber(
            documents.filter((item) => item.shortForm === "SerialNumber").length > 0
        )
        //without serial number and proof of Id
        setVesselTypeDocument(documentsExcludeSerialNumber)
        updateCheckMark()
    }, [uploadedDocs])

    useEffect(() => {
        setUnsavedChanges(false)
        getListingInfo()
        getTransactionStatus()
    }, [])

    useEffect(() => {
        setTruliooVerification(trulioo)
    }, [trulioo])

    useEffect(() => {
        setUploadedDocs(startingUploadedDocuments)
    }, [startingUploadedDocuments])

    return (
        <>
            <Modal
                open={openTruliooForm}
                onClose={() => setOpenTruliooForm(false)}
                center
                styles={{modal: {width: "100%", height: "100%"}}}
                classNames={{modal: classes.customModal}}
            >
                <ProofForm isOwner={true} close={closeTruliooForm}/>
            </Modal>
            <Modal
                open={hintIsOpen}
                onClose={() => setHintIsOpen(false)}
                classNames={{
                    modal: classes.hintModal
                }}
                center
                blockScroll={false}
            >
                <MobileHint
                    content={[{hint: t.editListing.verification.hintText}]}
                    closeHint={() => setHintIsOpen(false)}
                />
            </Modal>
            <Modal
                classNames={{modal: classes.modalStyle}}
                open={deleteWarningBox}
                onClose={() => setDeleteWarningBox(false)}
                center
            >
                <DeleteWarningBox
                    title={`file ${deleteFile.name}`}
                    confirmDelete={() => confirmDelete(deleteFile)}
                    cancelDelete={() => setDeleteWarningBox(false)}
                />
            </Modal>
            <Grid container>
                <Grid container item xs={12} sm={7} style={{marginBottom: "100px"}}>
                    <Grid item xs={12} md={10}>
                        <div style={{paddingTop: 110}}/>
                        <Grid item xs={12} className={classes.serialContainer}>
                            {isSerialNumber === true && (
                                <>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={5}
                                        className={classes.serialNumberName}
                                    >
                                        {t.editListing.verification.serialNumer}
                                        <span style={{
                                            color: theme.palette.error.main,
                                            display: documents.find(item => item.shortForm === "SerialNumber")?.isRequired ? "inline" : "none"
                                        }}>*</span>
                                    </Grid>
                                    <Grid item xs={12} sm={7} className={classes.serialInput}>
                                        <FormControl
                                            variant='outlined'
                                            style={{width: 150}}
                                            size='small'
                                        >
                                            <Select
                                                value={serialNumber_countryCode}
                                                onChange={handleSerialNumberCountryCode}
                                            >
                                                {["", "CA", "US"].map(item => <MenuItem key={item}
                                                                                        value={item}>{item}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            size='small'
                                            name='serialNumber_manufactureIdentificationCode'
                                            variant='outlined'
                                            error={snem_manufactureIdentificationCode !== ""}
                                            value={serialNumber_manufactureIdentificationCode}
                                            onFocus={() => setSnem_manufactureIdentificationCode("")}
                                            onChange={(event) => {
                                                setSerialNumber_manufactureIdentificationCode(
                                                    event.target.value.toUpperCase()
                                                ), setUnsavedChanges(true)
                                            }}
                                            inputProps={{maxLength: 3}}
                                            style={{width: 160, marginLeft: 5}}
                                        />
                                        <TextField
                                            size='small'
                                            name='serialNumber_manufactureSerialNumber'
                                            variant='outlined'
                                            error={snem_manufactureSerialNumber !== ""}
                                            value={serialNumber_manufactureSerialNumber}
                                            onFocus={() =>
                                                setSnem_manufactureSerialNumber("")
                                            }
                                            onChange={(event) => {
                                                setSerialNumber_manufactureSerialNumber(
                                                    event.target.value.toUpperCase()
                                                ), setUnsavedChanges(true)
                                            }}
                                            inputProps={{maxLength: 5}}
                                            style={{width: 210, marginLeft: 5}}
                                        />
                                        <TextField
                                            size='small'
                                            name='serialNumber_commencementOfConstruction'
                                            variant='outlined'
                                            error={snem_commencementOfConstruction !== ""}
                                            value={serialNumber_commencementOfConstruction}
                                            onFocus={() =>
                                                setSnem_commencementOfConstruction(
                                                    ""
                                                )
                                            }
                                            onChange={(event) => {
                                                setSerialNumber_commencementOfConstruction(
                                                    event.target.value.toUpperCase()
                                                ), setUnsavedChanges(true)
                                            }}
                                            inputProps={{maxLength: 2}}
                                            style={{width: 130, marginLeft: 5}}
                                        />
                                        <TextField
                                            size='small'
                                            name='serialNumber_modelYear'
                                            variant='outlined'
                                            error={snem_modelYear !== ""}
                                            value={serialNumber_modelYear}
                                            onFocus={() =>
                                                setSnem_modelYear(
                                                    ""
                                                )
                                            }
                                            onChange={(event) => {
                                                setSerialNumber_modelYear(
                                                    event.target.value.toUpperCase()
                                                ), setUnsavedChanges(true)
                                            }}
                                            inputProps={{maxLength: 2}}
                                            style={{width: 130, marginLeft: 5}}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                        {[snem_manufactureIdentificationCode, snem_manufactureSerialNumber, snem_commencementOfConstruction, snem_modelYear].map((item) =>
                            item !== "" &&
                            <FormHelperText error className={classes.serialErrorMessage}>{item}</FormHelperText>)}
                        {vesselTypeDocument?.filter((item) => item.shortForm === "ProofOfId")?.length > 0 && <>
                            <div
                                className={classes.uploadContainer}
                                style={{display: isMobile && "block"}}
                            >
                                <div className={classes.documentName}>
                                    {
                                        vesselTypeDocument?.find(
                                            (item) => item.shortForm === "ProofOfId"
                                        )?.name
                                    }
                                    <span style={{
                                        color: theme.palette.error.main,
                                        display: documents.find(item => item.shortForm === "ProofOfId").isRequired ? "inline" : "none"
                                    }}>*</span>
                                </div>
                                <div className={classes.uploadSection}>
                                    <div
                                        className={classes.browseButton}
                                        onClick={() => setOpenTruliooForm(true)}
                                    >
                                        {t.editListing.verification.uploadButton}
                                    </div>

                                </div>
                            </div>
                            {truliooVerification?.isProvided && (
                                <ThanksOrRejection
                                    status={truliooVerification.status}
                                    reason={truliooVerification.reason}
                                />
                            )}
                        </>}
                        {vesselTypeDocument?.map(
                            (doc) =>
                                doc.shortForm !== "ProofOfId" && (
                                    <div key={doc.name}>
                                        <div
                                            className={classes.uploadContainer}
                                            style={{
                                                display:
                                                    uploadedDocs?.find(
                                                        (item) => item.fileType === doc.shortForm
                                                    ) &&
                                                    isMobile &&
                                                    "block"
                                            }}
                                        >
                                            <div className={classes.documentName}>
                                                {doc.name}
                                                <span
                                                    style={{
                                                        display: !doc.isRequired && "none",
                                                        color: theme.palette.error.main
                                                    }}
                                                >
                          *
                        </span>
                                            </div>
                                            <div className={classes.uploadSection}>
                                                {uploadedDocs?.filter(
                                                    (item) => item.fileType === doc.shortForm
                                                ).length === 0 ? (
                                                    <div>
                                                        <input
                                                            type='file'
                                                            name='file'
                                                            data-testid={doc.shortForm}
                                                            id={doc.shortForm}
                                                            className={classes.hideInput}
                                                            accept='application/pdf, image/png, image/jpeg, image/jpg, .doc,.docx,application/msword'
                                                            onChange={(event) =>
                                                                handleFileUpload(doc.shortForm, event)
                                                            }
                                                        />
                                                        <label
                                                            data-testid={`upload${doc.shortForm}`}
                                                            htmlFor={doc.shortForm}
                                                            className={classes.browseButton}
                                                        >
                                                            {t.editListing.verification.uploadButton}
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <Chip
                                                        icon={
                                                            <a
                                                                target='_blank'
                                                                href={
                                                                    uploadedDocs?.find(
                                                                        (item) => item.fileType === doc.shortForm
                                                                    )?.fileURL
                                                                }
                                                                download
                                                            >
                                                                <GetAppIcon/>
                                                            </a>
                                                        }
                                                        data-testid={`chip${doc.shortForm}`}
                                                        className={classes.chip}
                                                        label={
                                                            uploadedDocs?.find(
                                                                (item) => item.fileType === doc.shortForm
                                                            )?.originalFileName
                                                        }
                                                        onDelete={() =>
                                                            handleDelete(
                                                                doc.shortForm,
                                                                uploadedDocs?.find(
                                                                    (item) => item.fileType === doc.shortForm
                                                                )?.originalFileName
                                                            )
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        {uploadedDocs?.map((item) => {
                                            if (item.fileType === doc.shortForm) {
                                                return (
                                                    <ThanksOrRejection
                                                        status={item.status}
                                                        reason={item?.rejectionReason}
                                                    />
                                                )
                                            }
                                        })}
                                    </div>
                                )
                        )}
                    </Grid>
                    <Grid item xs={1} md={1}/>
                </Grid>
                {/* Hint */}
                <Container classsname={classes.container}>
                    {isMobile ? (
                        <Grid item xs={12}></Grid>
                    ) : (
                        <Grid container className={classes.root}>
                            <Grid item xs={6} sm={6}></Grid>
                            <Grid item xs={1}/>
                            <Grid container item xs={5}>
                                <Grid item xs={1} md={2}/>
                                <Grid item xs={10} md={8} className={classes.hintBlue}>
                                    <div className={classes.hint}>
                                        <Hint content={t.editListing.verification.hintText}/>
                                        {type === "STAY" && <Hint content={t.editListing.verification.hintFloatHome}/>}

                                    </div>
                                </Grid>
                                <Grid item xs={1} md={2}/>
                            </Grid>
                        </Grid>
                    )}
                </Container>
            </Grid>
            {/* Bottom Div Buttons */}
            <Grid container item xs={12} className={classes.bottomDiv}>
                <Grid item xs={3} sm={2}/>
                <Grid item xs={6} sm={4} className={classes.saveDiv}>
                    <Button
                        variant='contained'
                        onClick={handleOnClickFinish}
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
                        data-testid='saveBtn'
                    >
                        {t.finish}
                    </Button>
                </Grid>
                <Grid item xs={6}/>
            </Grid>
        </>
    )
}
