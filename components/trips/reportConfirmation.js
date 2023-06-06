import React, { useEffect, useState } from "react"
import Router from "next/router"
import Button from "@material-ui/core/Button"
import theme from '../../src/theme'
import Session from "../../sessionService"
import API from "../../pages/api/baseApiIinstance"
// i18n
// eslint-disable-next-line no-duplicate-imports
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import { Chip, FormHelperText, Grid, makeStyles, TextField } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
    container: {

    },
    hideInput: {
        width: "0.1px",
        height: "0.1px",
        opacity: 0,
        overflow: "hidden",
        position: "absolute",
        zIndex: "-1"
    },
    addPhotosButton: {
        fontWeight: 400,
        fontSize: 18,
        color: theme.palette.buttonPrimary.main,
        textDecoration: "underline",
        width: "100px",
        cursor: "pointer"
    },
    chip: {
        margin: theme.spacing(0.5),
        paddingLeft: "0px",
        width: "250px",
        overflow: "hidden"
    }
}))

const ReportConfirmation = ({ closeModal, reportInfo }) => {
    const token = Session.getToken("Wavetoken")
    const classes = useStyles()
    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : fr
    const [description, setDescription] = useState("")
    const [photos, setPhotos] = useState([])
    const [error, setError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)

    const sendReport = () => {
        if (description.length === 0) {
            setDescriptionError(true)
        } else {
            const body = new FormData()
            body.append("description", description)
            photos.map(photo => body.append("photos", photo))
            body.append("userType", "GUEST")
            body.append("reportType", reportInfo)
            API()
                .post(`reports/${  router.query?.id}`, body, {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json",
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then((response) => {
                    console.log("response is ", response)
                    if (response.status = 200) {
                        closeModal()
                    }
                })
                .catch((e) => {
                    // router.push("/somethingWentWrong");
                })
        }
    }

    const handleFileUpload = (event) => {
        setError(false)
        const newPhotos = []
        for (let index = 0; index < event.target.files.length; index++) { // iterate through chosen files and create an array to append
            const file = event.target.files[index]
            newPhotos.push(file)
        }
        const approvedPhotos = []
        newPhotos.map((photo) => { // ensure all photos are under the file size limit
            photo.size / 1024 / 1024 > 5 ? setError(true) : approvedPhotos.push(photo)
        })
        setPhotos([...photos, ...approvedPhotos])
    }

    const handleDelete = (deletedPhoto, index) => {
        console.log("index: ", index)
        const remainingPhotos = [...photos]
        remainingPhotos.splice(index, 1)
        // var remainingPhotos = photos.filter((photo) => photo.fileName !== deletedPhoto.fileName);
        setPhotos([...remainingPhotos])
    }

    return (
        <Grid container className={classes.container}>
            <Grid item xs={12} style={{ fontSize: "18px", lineHeight: "2" }}>
                <p
                    style={{ fontWeight: "500", font: "Roboto", textAlign: "center" }}
                >
                    {t.report}
                </p>
                <hr style={{ width: 50, backgroundColor: theme.palette.buttonPrimary.main, height: 3 }}></hr>
                <p style={{ fontWeight: "400", textAlign: "center", width: "100%" }}>
                    {t.predepartureChecklist.reportDescription}
                </p>
                <TextField
                    inputProps={{ "data-testid": "reportInput", maxLength: 1000 }}
                    style={{ width: "100%" }}
                    multiline
                    rows={4}
                    value={description || ""}
                    onChange={(event) => { setDescription(event.target.value), setDescriptionError(false) }}
                    variant='outlined'
                />
                <FormHelperText error> {descriptionError ? t.predepartureChecklist.reportError : null} </FormHelperText>
                <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                    <input
                        type='file'
                        name='file'
                        multiple="multiple"
                        id={'file'}
                        className={classes.hideInput}
                        accept='application/pdf, image/png, image/jpeg, image/jpg'
                        onChange={(event) =>
                            handleFileUpload(event)
                        }
                    />
                    <label
                        htmlFor={'file'}
                        className={classes.addPhotosButton}
                    >
                        {t.predepartureChecklist.addPhotos}
                    </label>
                    {photos.map((photo, index) => {
                        return (
                            <li key={photo.name + (Math.random() * 1000) + index} style={{ listStyleType: "none", width: "90%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Chip
                                    label={photo.name}
                                    onDelete={() => handleDelete(photo, index)}
                                    className={classes.chip}
                                    color="primary"
                                    style={{ borderRadius: 5 }}
                                />
                            </li>
                        )
                    })}
                    <FormHelperText error> {error ? t.predepartureChecklist.photoSizeError : null} </FormHelperText>
                </div>
                <div style={{ marginTop: "20px", width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
                    <Button
                        onClick={() => closeModal()}
                        style={{
                            fontWeight: "400",
                            textTransform: "capitalize",
                            backgroundColor: "white",
                            color: theme.palette.buttonPrimary.main,
                            fontSize: "18px",
                            maxWidth: "150px"
                        }}>{t.cancel}</Button>
                    <Button
                        onClick={() => { sendReport() }}
                        style={{
                            fontWeight: "400",
                            textTransform: "capitalize",
                            backgroundColor: theme.palette.background.flamingo,
                            color: "white",
                            fontSize: "18px",
                            maxWidth: "150px"
                        }}>{t.report}</Button>
                </div>
            </Grid>
        </Grid>
    )
}
export default ReportConfirmation
