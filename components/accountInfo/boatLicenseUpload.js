import React, {useEffect, useState} from "react"
import {makeStyles} from "@material-ui/core/styles"
// i18n
import {useRouter} from "next/router"
import {Button, Card, CardContent, Grid} from "@material-ui/core"

import ProofFormBanner from "./proofFormBanner.js"
import API from "../../pages/api/baseApiIinstance"
import Session from "../../sessionService"
import theme from "../../src/theme"
import en from "../../locales/en"
import fr from "../../locales/fr"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        fontFamily: "Roboto",
        color: "#4F4F4F"
    },
    customModal: {
        height: 520,
        width: 500
    },
    topPadding: {
        paddingTop: 30
    },
    paper: {
        margin: 50,
        paddingBottom: 50
    },
    navbtn: {
        backgroundColor: theme.palette.background.default,
        display: "flex",
        width: "100%",
        alignItems: "center"
    },
    submitButton: {
        backgroundColor: theme.palette.buttonPrimary.main,
        color: theme.palette.background.default,
        justifyContent: "center",
        "&:hover": {
            backgroundColor: theme.palette.buttonPrimary.main
        }
    },
    bottomNav: {
        position: "fixed",
        bottom: 0,
        left: 0,
        backgroundColor: theme.palette.background.default,
        height: 70,
        width: "100%"
    },
    input: {
        display: "none"
    },
    centerInput: {
        textAlign: "-webkit-center"
    },
    photoCard: {
        // maxHeight: 320,
        // maxWidth: 350,
    }
}))

const BoatLicenseUpload = () => {
    const classes = useStyles()
    const router = useRouter()
    const {locale} = router
    const t = locale === "en" ? en : fr
    const [uploadedImages, setUploadedImages] = useState()
    const [newUpload, setNewUpload] = useState(false)
    const token = Session.getToken()
    const side = ["front", "back"]

    const getUploadedDoc = () => {
        API()
            .get(`users/vesselLicense`, {
                headers: {
                    authorization: `Bearer ${  token}`
                }
            })
            .then((response) => {
                console.log("Documents are: ", response.data.documents)
                setUploadedImages(response.data.documents)
            })
            .catch((e) => {
                console.log("Error from upload multiple files is: ", e)
            })
    }

    const handleUpload = (e, item) => {
        console.log("Side ", item)
        setNewUpload(false)
        if (e.target.files) {
            const formData = new FormData()
            if (item === "front") {
                formData.append("licenseFront", e.target.files[0])
                formData.append("licenseBack", "")
            } else if (item === "back") {
                formData.append("licenseFront", "")
                formData.append("licenseBack", e.target.files[0])
            }
            API()
                .post(`users/uploadVesselLicense`, formData, {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json",
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then((response) => {
                    console.log("response upload: ", response.data)
                    setNewUpload(true)
                })
                .catch((e) => {
                    console.log("Error from upload multiple files is: ", e)
                })
        }
    }

    const renderImages = (side) => {
        if (side === "front") return uploadedImages?.find(
                (item) => item.fileType === "VesselLicenseFront"
            )?.fileURL ? (
                <Card className={classes.photoCard}>
                    <img
                        style={{width: "60%"}}
                        src={
                            uploadedImages?.find(
                                (item) => item.fileType === "VesselLicenseFront"
                            )?.fileURL
                        }
                        alt='Image Document'
                    />
                </Card>
            ) : null
        else return uploadedImages?.find(
                (item) => item?.fileType === "VesselLicenseBack"
            )?.fileURL ? (
                <Card className={classes.photoCard}>
                    <img
                        style={{width: "60%"}}
                        src={
                            uploadedImages?.find(
                                (item) => item.fileType === "VesselLicenseBack"
                            )?.fileURL
                        }
                        alt='Image Document'
                    />
                </Card>
            ) : null
    }

    useEffect(() => {
        console.log(token)
        getUploadedDoc()
    }, [newUpload])

    return (
        <>
            <ProofFormBanner/>
            <Grid container style={{height: "100%"}}>
                <Grid item xs={false} lg={2} style={{backgroundColor: theme.palette.background.whiteSmoke}}/>
                <Grid
                    container
                    item
                    xs={12}
                    lg={8}
                    spacing={3}
                    className={classes.topPadding}
                >
                    {side.map((item) => (
                        <Grid item xs={12} sm={12} className={classes.centerInput} key={item}>
                            <input
                                accept='image/*'
                                className={classes.input}
                                id={`contained-button-file-${item}`}
                                type='file'
                                onChange={() => handleUpload(event, item)}
                            />
                            <label htmlFor={`contained-button-file-${item}`}>
                                <a
                                    style={{
                                        color: theme.palette.buttonPrimary.main,
                                        cursor: "pointer"
                                    }}
                                >
                                    Upload {item}
                                </a>
                            </label>
                            {renderImages(item)}
                        </Grid>
                    ))}
                </Grid>
                <Grid item xs={false} lg={2} style={{backgroundColor: theme.palette.background.whiteSmoke}}/>
            </Grid>
            {/* <Grid item container xs={12} className={classes.bottomNav}>
        <Grid item xs={5} />
        <Grid className={classes.navbtn} style={{ justifyContent: "center" }}>
          <Button className={classes.submitButton}>
            {t.truliooVerification.submit}
          </Button>
        </Grid>
        <Grid item xs={5} />
      </Grid> */}
        </>
    )
}

export default BoatLicenseUpload
