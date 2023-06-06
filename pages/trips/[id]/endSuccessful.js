import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Container, Grid, Typography } from "@material-ui/core"
// eslint-disable-next-line no-duplicate-imports
import { Link } from "@material-ui/core"
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import CheckIcon from '@material-ui/icons/Check'
// i18n
import { useRouter } from 'next/router'
import en from '../../../locales/en.js'
import fr from '../../../locales/fr.js'

const useStyles = makeStyles((theme) => ({
    container: {
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
        justifyContent: "center",
        alignItems: "center"
    }
}))

const EndSuccessful = ({ }) => {
    const classes = useStyles()
    const router = useRouter()
    const { locale } = router
    const t = locale === 'en' ? en : fr

    const onNextClick = () => {
        router.push("/trips")
    }

    const onBackClick = () => {
        router.push("/trips")
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
                            <h1 className={classes.header}>{t.postdepartureChecklist.endVerification.successHeader}</h1>
                        </div>
                        <br />
                        <div className={classes.subContent}>
                            <CheckIcon style={{ fontSize: 100, color: "#219653" }} />
                        </div>
                    </div>
                    <div className={classes.buttonDiv}>
                        <button data-testid="nextBtn" className={classes.nextButton} onClick={() => { onNextClick() }} style={{ cursor: "pointer" }}>
                            <span className={classes.nextText}>{t.continue}</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className={classes.paddingDiv} />
        </>
    )
}

export default EndSuccessful
