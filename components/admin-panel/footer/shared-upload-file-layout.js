import React, {useState, useEffect} from "react"
import {makeStyles} from "@material-ui/core/styles"
import NavBar from "../../../components/admin-panel/navBar"
import {useRouter} from "next/router"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import DescriptionIcon from '@material-ui/icons/Description'
import {
    Typography,
    TextField, withStyles, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar
} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import API from "../../../pages/api/baseApiIinstance"
import Session from "../../../sessionService"
import {grey, lightBlue} from "@material-ui/core/colors"
import PropTypes from "prop-types"
import CloseIcon from "@material-ui/icons/Close"
import {Alert} from "@material-ui/lab"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        fontFamily: "Roboto",
        color: "#4F4F4F"
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
        fontSize: "15px"
    },
    wrapperClass: {
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
        border: "1px solid #ccc"
    },
    editorClass: {
        order: 1,
        padding: "1rem",
        minHeight: '250px'
        // border: "1px solid #ccc"
    },
    toolbarClass: {
        order: 2,
        border: "1px solid #ccc"
    },
    imageContainer: {
        width: "100%",
        minHeight: "150px",
        backgroundColor: theme.palette.addPayment.borderBottom,
        boxSizing: "borderBox",
        borderRadius: "10px",
        marginTop: "30px"
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
    }
}))

export default function SharedUploadFileLayout(props) {
    const {type} = props
    const [titleEnum, setTitleEnum] = useState(null)
    const [pageTitle, setPageTitle] = useState(null)
    const classes = useStyles()
    const router = useRouter()
    const token = Session.getToken("Wavetoken")
    const [loading, setLoading] = useState(false)
    const [fileSource, setFileSource] = useState(null)
    const [apiFileSource, setApiFileSource] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [contentEnum, setContentEnum] = useState(null)
    const [backEnabled, setBackEnabled] = useState(true)
    const [openSnackBar, setOpenSnackBar] = useState(false)
    const [fileName, setFileName] = useState("")

    const samplePayload = {
        key: "",
        stringValue: "",
        booleanValue: false,
        numberValue: 0
    }

    const onClickBack = () => {
        router.push("/admin-panel/footer")
    }

    useEffect(() => {
        getSavedDocument()
    }, [])

    const uploadImage = async (e) => {
        if (e?.target?.files && e.target.files.length !== 0) {

            if (e.target.files[0] && e.target.files[0].size / 1024 / 1024 <= 10) {
                setErrorMessage(null)
                const file = e.target.files[0]
                setErrorMessage(null)
                console.log(file)
                const formData = new FormData()
                formData.append("image", file)
                const oldUrl = `${  fileSource}`
                API()
                    .post(
                        `configuration/uploadImage/${contentEnum}`,
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
                                    `configuration/${contentEnum}`,
                                    {
                                        key: contentEnum,
                                        stringValue: response.data.url,
                                        booleanValue: false,
                                        numberValue: 0,
                                        arrayValue: [file ? file?.name : ""]
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
                                        setOpenSnackBar(true)
                                        console.log("update response is ", response.data)
                                        if (oldUrl && oldUrl !== "") {
                                            // delete the old image once the image has been updated
                                            if (oldUrl.includes(contentEnum)) {
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
                                                        getSavedDocument()
                                                        if ((response.status = 200)) {
                                                            console.log("old image deleted")
                                                        }
                                                    }).catch((err) => {
                                                    getSavedDocument()
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
            } else {
                setErrorMessage("File Size greater than 10 MB not allowed")
                console.log("File Size greater than 10 MB not allowed")
            }
            // to clear the file input for the same image to be uploaded twice
            e.target.value = null
        }
    }

    const getSavedDocument = async () => {
        if (type) {
            const typeObj = getEnumType(type)
            if (typeObj) {
                setPageTitle(typeObj.title)
                setTitleEnum(typeObj.titleEnum)
                setContentEnum(typeObj.contentEnum)
                if (typeObj.titleEnum === "HOW_IT_WORKS_ADMIN_PANEL") {
                    setBackEnabled(false)
                } else {
                    setBackEnabled(true)
                }

                API()
                    .get(
                        `configuration/${typeObj.contentEnum}`,
                        {
                            headers: {
                                accept: "application/json"
                            }
                        }
                    )
                    .then((response) => {
                        console.log("response is ", response)
                        if ((response.status = 200)) {
                            setFileSource(response.data.stringValue)
                            setApiFileSource(response.data.stringValue)
                            setFileName(response.data.arrayValue[0] || "")
                        }
                    })
                    .catch((e) => {
                        console.log("Configuration Not found: ", e)
                    })
            }
        }
    }

    const handleSnackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenSnackBar(false)
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
                    <Snackbar open={openSnackBar} autoHideDuration={3000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} onClose={handleSnackBarClose}>
                        <Alert onClose={handleSnackBarClose} severity="success" sx={{ width: '100%' }}>
                            Document Uploaded Successfully!!
                        </Alert>
                    </Snackbar>
                    <Snackbar open={errorMessage && errorMessage !== ""} autoHideDuration={3000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} onClose={() => setErrorMessage(null)}>
                        <Alert onClose={() => setErrorMessage(null)} severity="error" sx={{ width: '100%' }}>
                            {errorMessage}
                        </Alert>
                    </Snackbar>
                    <Grid item xs={12}>
                        <Grid container spacing={10}>
                            <Grid style={{display: "flex"}} item xs={6}>
                                {backEnabled && (
                                    <ArrowBackIcon
                                        onClick={onClickBack}
                                        style={{fontSize: "2rem", cursor: "pointer"}}
                                    />
                                )}
                                <Typography
                                    style={{marginLeft: "3%", fontWeight: "500"}}
                                    variant="h5"
                                    gutterBottom
                                >
                                    {pageTitle}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid style={{padding: "2rem"}} container spacing={3} justifyContent={"center"}>
                                {fileSource && fileSource !== "" ? (
                                    <div>
                                        <Grid container spacing={2}
                                              direction="column"
                                              alignItems="center"
                                              justifyContent="center">
                                            <Grid item xs={12} className={classes.imageContainer}>
                                                {/*<img src={fileSource?.stringValue} alt="Hero Image"*/}
                                                {/*     style={{height: "100%", width: "100%"}}/>*/}
                                                <a href={fileSource} rel="noopener noreferrer" target="_blank"
                                                   style={{textDecoration: 'none', color: 'inherit'}}>
                                                    <div style={{display: "grid",
                                                        alignItems: "center"}}>
                                                        <DescriptionIcon style={{fontSize: "5rem", margin: "1em 1em", marginTop: "0.5em"}}/>
                                                        <span>
                                                        {pageTitle} Document
                                                    </span>
                                                        <span>({fileName})</span>
                                                    </div>
                                                </a>
                                            </Grid>
                                        </Grid>
                                        <div>
                                        <span>
                                            <input
                                                type="file"
                                                name="file"
                                                id="file"
                                                accept="iapplication/pdf"
                                                onChange={uploadImage}
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
                                        <div>
                                        <span>
                                            <input
                                                type="file"
                                                name="file"
                                                id="file"
                                                accept="application/pdf"
                                                onChange={uploadImage}
                                                className={classes.hideInput}
                                                data-testid="uploadBtn"
                                            />
                                            <label htmlFor="file" className={classes.browseButton}
                                                   style={{marginTop: "25px"}}>
                                                Upload
                                            </label>
                                        </span></div>
                                )}

                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export function getEnumType(en) {
    switch (en) {
        case "ABOUT_WAVEZ":
            return {
                titleEnum: 'ABOUT_WAVEZ_TITLE',
                contentEnum: 'ABOUT_WAVEZ_PAGE_CONTENT',
                title: 'About Wavez'
            }
        case "HOW_IT_WORKS":
            return {
                titleEnum: 'HOW_IT_WORKS_TITLE',
                contentEnum: 'HOW_IT_WORKS_PAGE_CONTENT',
                title: 'How It Works'
            }
        case "PARTNERS":
            return {
                titleEnum: 'PARTNERS_TITLE',
                contentEnum: 'PARTNERS_PAGE_CONTENT',
                title: 'Partners'
            }
        case "CONTACT_US":
            return {
                titleEnum: 'CONTACT_US_TITLE',
                contentEnum: 'CONTACT_US_PAGE_CONTENT',
                title: 'Contact Us'
            }
        case "PRIVACY_POLICY":
            return {
                titleEnum: 'PRIVACY_POLICY_TITLE',
                contentEnum: 'PRIVACY_POLICY_PAGE_CONTENT',
                title: 'Privacy Policy'
            }
        case "TERMS_OF_SERVICE":
            return {
                titleEnum: 'TERMS_OF_SERVICE_TITLE',
                contentEnum: 'TERMS_OF_SERVICE_PAGE_CONTENT',
                title: 'Terms Of Service'
            }
        case "HOW_IT_WORKS_ADMIN_PANEL":
            return {
                titleEnum: 'HOW_IT_WORKS_ADMIN_PANEL',
                contentEnum: 'HOW_IT_WORKS_ADMIN_PANEL',
                title: 'How It Works (Admin)'
            }
        case "COMMUNITY_GUIDELINES_PAGE_CONTENT":
            return {
                titleEnum: 'COMMUNITY_GUIDELINES_PAGE_CONTENT',
                contentEnum: 'COMMUNITY_GUIDELINES_PAGE_CONTENT',
                title: 'Community Guidelines'
            }
        default:
            return null
    }
}

SharedUploadFileLayout.propTypes = {
    type: PropTypes.string.isRequired
}

