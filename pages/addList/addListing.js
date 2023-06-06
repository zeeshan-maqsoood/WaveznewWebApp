import React, { useState, useContext, useEffect } from "react"
import { makeStyles, withStyles, createTheme } from '@material-ui/core/styles'
import Grid from "@material-ui/core/Grid"
import { Typography, Container } from "@material-ui/core"
import { ThemeProvider } from '@material-ui/styles'
import Stepper from "@material-ui/core/Stepper"
import Step from "@material-ui/core/Step"
import StepConnector from "@material-ui/core/StepConnector"
import Button from "@material-ui/core/Button"
// eslint-disable-next-line no-duplicate-imports
import Step1 from "./step1"
import Step2 from "./step2"
import Step3 from "./step3"
import Hint from "./hint"
import Context from "../../store/context"
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import theme from "../../src/theme"

// const theme = createTheme({
//   palette: {
//     action: {
//       disabledBackground: theme.palette.background.default,
//       disabled: theme.palette.background.default,
//     },
//   },
// });
const QontoConnector = withStyles({
  active: {
    "& $line": {
      borderColor: theme.palette.border.turquoiseBlue
    }
  },
  completed: {
    "& $line": {
      borderColor: theme.palette.border.dodgerBlue
    }
  },
  line: {
    borderColor: theme.palette.navBar.darkerGrey,
    borderTopWidth: 8
  }
})(StepConnector)

function getSteps() {
  return ["0", "1", "2", "3"]
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: "3%",
    [theme.breakpoints.down("sm")]: {
      padding: 3
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
  step: {
    padding: "0px",
    position: "sticky",
    top: "60px",
    zIndex: 5
  },
  hintBlue: {
    backgroundColor: theme.palette.background.pattensBlue,
    height: "100vh",
    position: "fixed",
    top: 68,
    zIndex: -1
  },
  hint: {
    position: "fixed",
    top: 140,
    width: "32vw",
    zIndex: 10,
    [theme.breakpoints.down("xs")]: {
      width: "38vw"
    },
    [theme.breakpoints.down("sm")]: {
      width: "40vw"
    }
  }
}))


export default function AddListing(props) {
  const { globalState, globalDispatch } = useContext(Context)
  const classes = useStyles()
  const steps = getSteps()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr
  const mobileBreakpoint = 600
  const [windowSize, setWindowSize] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== "undefined") {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize(window.innerWidth)
        window.innerWidth <= mobileBreakpoint ? setIsMobile(true) : setIsMobile(false)
      }

      // Add event listener
      window.addEventListener("resize", handleResize)

      // Call handler right away so state gets updated with initial window size
      handleResize()

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize)
    }
  }, []) // Empty array ensures that effect is only run on mount

  const handleBack = () => {
    globalDispatch({
      type: "SET_ADDLIST_STEP",
      payload: globalState.addListStep - 1
    })
  }

  const renderHint = () => {
    switch (globalState.addListStep) {
      case 1:
        return <div>
          {globalState.addListService.toUpperCase() === "RENTAL" && <Hint className={classes.hint} content={t.hint.hintRental} title={t.rental} />}
          {globalState.addListService.toUpperCase() === "CHARTER" && <Hint className={classes.hint} content={t.hint.hintCharter} title={t.charter} />}
          {globalState.addListService.toUpperCase() === "STAY" && <Hint className={classes.hint} content={t.hint.hintStay} title={t.stay} />}
          <Hint className={classes.hint} content={t.hint.step1Hint1} />
          {globalState.addListService.toUpperCase() === "STAY" && <Hint className={classes.hint} content={t.hint.step1Hint2} />}
        </div>
      case 2:
        return (
          <div>
            <Hint className={classes.hint} content={t.hint.step2Hint1} />
            <Hint className={classes.hint} content={t.hint.step2Hint2} />
          </div>
        )
      default:
        return (
          <div>
            <Hint className={classes.hint} content={t.hint.step3Hint1} />
          </div>
        )
    }
  }

  const renderStepComponent = () => {
    switch (globalState.addListStep) {
      case 1:
        return <Step1 isMobile={isMobile} hint1Text={t.hint.step1Hint1} hint2Text={t.hint.step1Hint2} hintRental={t.hint.hintRental}
          hintRentalTitle={t.rental} hintCharter={t.hint.hintCharter} hintCharterTitle={t.charter} hintStay={t.hint.hintStay} hintStayTitle={t.stay} />
      case 2:
        return <Step2 isMobile={isMobile} hint1Text={t.hint.step2Hint1} hint2Text={t.hint.step2Hint2} handleBack={handleBack} />
      default:
        return <Step3 isMobile={isMobile} hint1Text={t.hint.step3Hint1} handleBack={handleBack} />
    }
  }

  return (
    <>
      <div>
        <Stepper
          activeStep={globalState.addListStep}
          connector={<QontoConnector />}
          className={classes.step}
        >
          {steps.map((label) => (
            <Step key={label} style={{ padding: "1px" }}></Step>
          ))}
        </Stepper>
        <Container className={classes.container}>
          {isMobile ?
            (<Grid item xs={12}>
              {renderStepComponent()}
            </Grid>)
            :
            (<Grid container className={classes.root}>
              <Grid item xs={6} sm={6}>
                {renderStepComponent()}
              </Grid>
              <Grid item xs={1} />
              <Grid container item xs={5}>
                <Grid item xs={1} md={2} />
                <Grid item xs={10} md={8} className={classes.hintBlue}>
                  {renderHint()}
                </Grid>
                <Grid item xs={1} md={2} />
              </Grid>
            </Grid>)}
        </Container>
      </div>

    </>
  )
}
