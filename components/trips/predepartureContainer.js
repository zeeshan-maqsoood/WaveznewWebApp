import React, {  } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Grid } from "@material-ui/core"
import Image from "next/image"
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import theme from '../../src/theme'
// i18n
import { useRouter } from 'next/router'
import en from '../../locales/en.js'
import fr from '../../locales/fr.js'

const predepartureContainer = ({ children, header, imgSource, onBackClick, onNextClick, onHintClick, onReportClick, isPreDeparture = true }) => {
  const router = useRouter()
  const { locale } = router
  const t = locale === 'en' ? en : fr

  const useStyles = makeStyles((theme) => ({
    container: {
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
      textAlign: "center",
      font: "Roboto",
      [theme.breakpoints.down("xs")]: {
        fontSize: 24
      }
    },
    text: {
      fontSize: 24,
      textAlign: "center",
      [theme.breakpoints.down("xs")]: {
        fontSize: 16
      }
    },
    imageForWebView: {
      [theme.breakpoints.down("xs")]: {
        display: "none"
      }
    },
    imageForMobileView: {
      marginBottom: "10px",
      [theme.breakpoints.up("sm")]: {
        display: "none"
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
    reportButton: {
      background: "white",
      width: "100vw",
      maxWidth: "322px",
      height: "40px",
      borderRadius: "5px",
      border: "none"
    },
    reportText: {
      color: "red",
      fontSize: "18px"
    },
    subHeader: {
      fontSize: "18px",
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "space-between"
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
    }
  }))

  const classes = useStyles()

  return (
    <>
      <Grid container className={classes.container}>
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "space-between" }}>
          <div className={classes.subHeader}>
            <div className={classes.iconDiv}>
              <ArrowBackIcon onClick={() => { onBackClick() }} />
            </div>
            <span className={classes.text}>
              {isPreDeparture
                ? t.predepartureChecklist.subHeader
                : t.postdepartureChecklist.subHeader
              }
            </span>
            <div className={classes.iconDiv}>
              <ErrorOutlineIcon onClick={() => { onHintClick() }} style={{ color: theme.palette.background.flamingo }} />
            </div>
          </div>
        </div>
        <Grid item xs={false} sm={1} />
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <h1 className={classes.header}>{header}</h1>
        </div>
        <Grid item xs={false} sm={1} />
        <Grid item xs={12} sm={false} className={classes.imageForMobileView}>
          <Image
            src={imgSource}
            alt="image of checklist behaviour"
            width="640px"
            height="410px"
          />
        </Grid>
        <Grid item xs={12} sm={4} >
          {children}
        </Grid>
        <Grid item xs={false} sm={1} />
        <Grid item xs={false} sm={5} className={classes.imageForWebView}>
          <Image
            src={imgSource}
            alt="image of checklist behaviour"
            width="640px"
            height="410px"
          />
        </Grid>
      </Grid>
      <div className={classes.buttonDiv}>
        <button data-testid="nextBtn" className={classes.nextButton} onClick={() => { onNextClick() }} style={{ cursor: "pointer" }}>
          <span className={classes.nextText}>{t.next}</span>
        </button>
      </div>
      <div className={classes.buttonDiv}>
        <button data-testid="reportBtn" className={classes.reportButton} onClick={() => { onReportClick() }} style={{ cursor: "pointer" }}>
          <span className={classes.reportText}>{t.report}</span>
        </button>
      </div>
      <div className={classes.paddingDiv} />
    </>
  )
}

export default predepartureContainer
