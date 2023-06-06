import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { FormControl, FormHelperText, Container, Grid, Typography } from "@material-ui/core"
// eslint-disable-next-line no-duplicate-imports
import { Link } from "@material-ui/core"
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import OtpInput from 'react-otp-input'
import Session from "../../../sessionService"
import API from "../../api/baseApiIinstance"
import CryptoJS from "crypto-js"
// i18n
import { useRouter } from 'next/router'
import en from '../../../locales/en.js'
import fr from '../../../locales/fr.js'

const useStyles = makeStyles((theme) => ({
    container: {
        minHeight: "300px",
        height: "calc(100vh - 100px)",
        paddingTop: 30,
        paddingLeft: 57,
        paddingRight: 57,
        [theme.breakpoints.down("sm")]: {
            paddingLeft: 40,
            paddingRight: 40
        },
        [theme.breakpoints.down("xs")]: {
            paddingTop: 20
        }
    },
    header: {
        fontSize: 30,
        font: "Roboto",
        textAlign: "center",
        [theme.breakpoints.down("xs")]: {
            fontSize: 24
        }
    },
    text: {
        fontSize: 24,
        [theme.breakpoints.down("xs")]: {
            fontSize: 16
        }
    },
    buttonDiv: {
        paddingTop: "20px",
        paddingBottom: "10px",
        width: "100%",
        display: "flex",
        justifyContent: "center"
    },
    nextButton: {
        background: theme.palette.buttonPrimary.main,
        width: "100vw",
        maxWidth: "322px",
        height: "40px",
        borderRadius: "5px",
        border: "none"
    },
    nextText: {
        color: "white",
        fontSize: "18px"
    },
    subHeader: {
        fontSize: "18px",
        width: "100%",
        maxWidth: "500px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    iconDiv: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "40px",
        height: "40px",
        cursor: "pointer"
    },
    paddingDiv: {
        marginBottom: "30px"
    },
    subContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        height: "100%"
    },
    content: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
    },
    subContent: {
        width: "100%",
        marginBottom: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontSize: "16px"
    },
    otpInput: {
        border: "none",
        borderBottom: `2px solid ${  theme.palette.background.lightGrey}`,
        fontSize: 32,
        width: "80px",
        marginLeft: 10,
        marginRight: 10
    },
    otpFocus: {
        borderColor: theme.palette.background.lightGrey
    },
    otpDisabled: {
        backgroundColor: theme.palette.background.default
    },
    errorText: {
        fontSize: "16px",
        textAlign: "center"
    },
    resendCode: {
        fontSize: "16px",
        color: theme.palette.buttonPrimary.main,
        textDecoration: "underline",
        cursor: "pointer"
    }
}))

const EndTripCode = (props) => {
    const token = Session.getToken("Wavetoken")
    const classes = useStyles()
    const router = useRouter()
    const { locale } = router
    const t = locale === 'en' ? en : fr
    const SECRET_KEY = "mypassword"

    const [otp, setOtp] = useState()
    const [apiError, setApiError] = useState(false)
    const [tripNotCompleteError, setTripNotCompleteError] = useState(false)

    const onNextClick = () => {
        setTripNotCompleteError(false)
        setApiError(false)
        verifyStatus()
    }

    const verifyStatus = () => {
        if (router.asPath !== router.route) {
            API()
                .get(`trip/${  router.query?.id}`, {
                    headers: {
                        authorization: `Bearer ${  token}`
                    }
                })
                .then((response) => {
                    if (response.status = 200) {
                        if (response.data.tripStatus === "COMPLETED") {
                            router.push(`/trips/${  router.query?.id  }/endSuccessful`)
                        } else {
                            setTripNotCompleteError(true)
                        }
                    }
                })
                .catch((e) => {
                    setApiError(true)
                })
        }
    }

    const onBackClick = () => {
        router.back()
    }

    useEffect(() => {
        const endTripOtp = Session.getCode().find((code) => code.tripId === router.query?.id)?.endCode
        endTripOtp
            ? setOtp(endTripOtp)
            : retrieveFromBackend()
    }, [])

    const retrieveFromBackend = () => {
        setTripNotCompleteError(false)
        setApiError(false)
        if (router.asPath !== router.route) {
            API()
                .get(`trip/${  router.query?.id}`, {
                    headers: {
                        authorization: `Bearer ${  token}`
                    }
                })
                .then((response) => {
                    if (response.status = 200) {
                        const decryptedStartCode = response.data?.startVerificationCode ? CryptoJS.AES.decrypt(response.data.startVerificationCode, SECRET_KEY).toString(CryptoJS.enc.Utf8) : ""
                        const decryptedEndCode = response.data?.endVerificationCode ? CryptoJS.AES.decrypt(response.data.endVerificationCode, SECRET_KEY).toString(CryptoJS.enc.Utf8) : ""
                        const codes = Session.getCode()
                        codes.filter(code => code.tripId === router.query?.id).length > 0 ? null : codes.push({ tripId: router.query?.id, startCode: decryptedStartCode, endCode: decryptedEndCode })
                        Session.setCode(codes)
                        setOtp(decryptedEndCode)
                    }
                })
                .catch((e) => {
                    console.log("e", e)
                    setApiError(true)
                })
        }
    }

    return (
        <>
            <div className={classes.container}>
                <div style={{ width: "100%" }}>
                    <div className={classes.subHeader}>
                        <div className={classes.iconDiv}>
                            <ArrowBackIcon onClick={() => { onBackClick() }} />
                        </div>
                        <span />
                        <span />
                    </div>
                </div>
                <div className={classes.subContainer}>
                    <div className={classes.content}>
                        <div className={classes.subContent}>
                            <h1 className={classes.header}>{t.predepartureChecklist.startVerification.otpHeader}</h1>
                            <p>
                                {t.postdepartureChecklist.endVerification.subHeader}
                            </p>
                        </div>
                        <br />
                        <div className={classes.subContent}>
                            <OtpInput
                                value={otp}
                                onChange={() => { }}
                                numInputs={4}
                                inputStyle={classes.otpInput}
                                focusStyle={classes.otpFocus}
                                focusedBorderColor='black'
                                shouldAutoFocus={true}
                                isDisabled={true}
                                disabledStyle={classes.otpDisabled}
                            />
                        </div>
                        <FormHelperText error className={classes.errorText}> {apiError ? t.tripsPage.otpError : null} </FormHelperText>
                        <FormHelperText error className={classes.errorText}> {tripNotCompleteError ? t.tripsPage.tripNotCompleteError : null} </FormHelperText>
                        <p className={classes.resendCode} onClick={() => retrieveFromBackend()}>
                            {t.postdepartureChecklist.endVerification.resend}
                        </p>
                    </div>
                    <div className={classes.buttonDiv}>
                        <button data-testid="nextBtn" className={classes.nextButton} onClick={() => onNextClick()} style={{ cursor: "pointer" }}>
                            <span className={classes.nextText}>{t.predepartureChecklist.startVerification.verify}</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className={classes.paddingDiv} />
        </>
    )
}

export default EndTripCode
