import React, { useState, useContext, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Container, FormControl, FormHelperText, Grid } from "@material-ui/core"
import { Modal } from "react-responsive-modal"
import ServiceButton from "./serviceButton"
import CategoryCheckbox from "../../components/editListing/categoryCheckbox"
import Context from "../../store/context"
import Button from "@material-ui/core/Button"
import Counter from './counter'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import MobileHint from "../../components/addList/mobileHint"
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import theme from "../../src/theme"

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    paddingLeft: "10px"
  },
  header: {
    fontSize: 30,
    font: "Roboto",
    margin: 0,
    color: theme.palette.title.matterhorn
  },
  text: {
    font: "Roboto",
    color: theme.palette.title.matterhorn,
    fontSize: 24,
    fontWeight: 500,
    paddingTop: 20
  },
  button: {
    background: theme.palette.buttonPrimary.main,
    width: "120px",
    height: "40px",
    borderRadius: "5px",
    border: "none",
    marginRight: "10px"
  },
  bottomNav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    backgroundColor: theme.palette.background.default,
    height: 80,
    width: "100%"
  },
  navbtn: {
    backgroundColor: theme.palette.background.default,
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    borderTop: `1px solid ${theme.palette.background.lightGrey}`
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    paddingTop: 20
  },
  counterText: {
    font: "Roboto",
    color: theme.palette.text.grey,
    fontSize: 24
  },
  paddingBottom: {
    marginTop: "100px"
  },
  hintModal: {
    width: "90vw",
    borderRadius: 10,
    position: "fixed",
    left: 0
  }
}))

const Step1 = (props) => {
  const { globalState, globalDispatch } = useContext(Context)
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  const [serviceIsValid, setServiceIsValid] = useState(true)
  const [categoriesIsValid, setCategoriesIsValid] = useState(true)
  const [restoreCategories, setRestoreCategories] = useState("")

  const [hintIsOpen, setHintIsOpen] = useState(false)

  const handleNext = () => {
    validateForm() && globalDispatch({ type: "SET_ADDLIST_STEP", payload: globalState.addListStep + 1 })
  }

  const validateForm = () => {
    let formIsValid = true
    setServiceIsValid(true)
    setCategoriesIsValid(true)

    { !globalState.addListService ? (formIsValid = false, setServiceIsValid(false)) : null }
    { globalState.addListCategories.length === 0 ? (formIsValid = false, setCategoriesIsValid(false)) : null }

    return formIsValid
  }

  const updateCategories = (newCategories) => {
    globalDispatch({ type: "SET_ADDLIST_CATEGORIES", payload: newCategories })
    setCategoriesIsValid(true)
  }

  const onVesselTypeChange = () => {
    globalDispatch({ type: "SET_ADDLIST_PASSENGERS", payload: 1 })
    globalDispatch({ type: "SET_ADDLIST_LOCATION", payload: undefined, displayPayload: undefined })
    globalDispatch({ type: "SET_ADDLIST_LATLNG", payload: undefined })
    globalDispatch({ type: "SET_ADDLIST_DESTINATION", payload: [undefined], displayPayload: [undefined] })
    globalDispatch({ type: "SET_MAKE", payload: "" })
    globalDispatch({ type: "SET_YEAR", payload: "" })
    globalDispatch({ type: "SET_ADDLIST_WASHROOMS", payload: 1 })
    globalDispatch({ type: "SET_ADDLIST_BEDS", payload: 1 })
    globalDispatch({ type: "SET_ADDLIST_KITCHENETTES", payload: 1 })
  }

  useEffect(() => {
    setRestoreCategories(globalState.addListCategories.map((cat) => {
      return (
        cat._id
      )
    }))
  }, [globalState.addListService])

  return (
    <>
      <Modal
        open={hintIsOpen}
        onClose={() => setHintIsOpen(false)}
        classNames={{
          modal: classes.hintModal
        }}
        center
        blockScroll={false}
      >
        {globalState.addListService === "" && <MobileHint content={[{ hint: props.hint1Text }]} closeHint={() => setHintIsOpen(false)} />}
        {globalState.addListService.toUpperCase() === "RENTAL" && <MobileHint content={[{ hint: props.hintRental, title: props.hintRentalTitle }, { hint: props.hint1Text }]} closeHint={() => setHintIsOpen(false)} />}
        {globalState.addListService.toUpperCase() === "CHARTER" && <MobileHint content={[{ hint: props.hintCharter, title: props.hintCharterTitle }, { hint: props.hint1Text }]} closeHint={() => setHintIsOpen(false)} />}
        {globalState.addListService.toUpperCase() === "STAY" && <MobileHint content={[{ hint: props.hintStay, title: props.hintStayTitle }, { hint: props.hint1Text }, { hint: props.hint2Text }]} closeHint={() => setHintIsOpen(false)} />}
      </Modal>
      <Container className={classes.container}>
        <h1 className={classes.header}>{t.listBoat}{props.isMobile && <HelpOutlineIcon onClick={() => setHintIsOpen(true)} style={{ marginLeft: 5 }} />}</h1>
        <p className={classes.text}>{t.addListStep1.whatService}</p>
        <FormControl error={!serviceIsValid} style={{ display: "inline-block" }}>
          <ServiceButton
            isClicked={globalState.addListService === "Rental"}
            service={t.rental}
            onClick={() => { globalDispatch({ type: "SET_ADDLIST_CATEGORIES", payload: [] }), globalDispatch({ type: "SET_ADDLIST_SERVICE", payload: "Rental" }); setServiceIsValid(true); onVesselTypeChange() }}
            isSelected={globalState.addListService === "Rental"}
          />
          <ServiceButton
            isClicked={globalState.addListService === "Charter"}
            service={t.charter}
            onClick={() => { globalDispatch({ type: "SET_ADDLIST_CATEGORIES", payload: [] }), globalDispatch({ type: "SET_ADDLIST_SERVICE", payload: "Charter" }); setServiceIsValid(true); onVesselTypeChange() }}
            isSelected={globalState.addListService === "Charter"}
          />
          <ServiceButton
            isClicked={globalState.addListService === "Stay"}
            service={t.dockedStay}
            onClick={() => { globalDispatch({ type: "SET_ADDLIST_CATEGORIES", payload: [] }), globalDispatch({ type: "SET_ADDLIST_SERVICE", payload: "Stay" }); setServiceIsValid(true); onVesselTypeChange() }}
            isSelected={globalState.addListService === "Stay"}
          />
          <FormHelperText>{!serviceIsValid ? t.addListStep1.errorService : null}</FormHelperText>
        </FormControl>

        {globalState.addListService &&
          (<>
            <p className={classes.text}>{t.addListStep1.chooseCategory}</p>
            <div className={classes.categoryCheckBox}>
              <CategoryCheckbox service={globalState.addListService.toUpperCase()} startingIds={restoreCategories} categoriesIsValid={categoriesIsValid} categories={globalState.addListCategories} updateCategories={updateCategories} />
            </div>
          </>)}

        {globalState.addListService === "Stay" ?
          (<>
            <p className={classes.text}>{t.addListStep1.washLabel}</p>
            <div className={classes.counterText}>
              {t.addListStep1.numWashrooms}
              <span style={{ float: "right" }}>
                <Counter
                  onMinus={() => globalDispatch({ type: "SET_ADDLIST_WASHROOMS", payload: Math.max(globalState.addListWashrooms - 1, 1) })}
                  onPlus={() => globalDispatch({ type: "SET_ADDLIST_WASHROOMS", payload: Math.min(globalState.addListWashrooms + 1, 20) })}
                  displayValue={globalState.addListWashrooms} />
              </span>
            </div>

            <p className={classes.text}>{t.addListStep1.bedLabel}</p>
            <div className={classes.counterText}>
              {t.addListStep1.numBeds}
              <span style={{ float: "right" }}>
                <Counter
                  onMinus={() => globalDispatch({ type: "SET_ADDLIST_BEDS", payload: Math.max(globalState.addListBeds - 1, 1) })}
                  onPlus={() => globalDispatch({ type: "SET_ADDLIST_BEDS", payload: Math.min(globalState.addListBeds + 1, 20) })}
                  displayValue={globalState.addListBeds} />
              </span>
            </div>

            <p className={classes.text}>{t.addListStep1.kitchLabel}</p>
            <div className={classes.counterText}>
              {t.addListStep1.numKitchenettes}
              <span style={{ float: "right", marginBottom: 100 }}>
                <Counter
                  onMinus={() => globalDispatch({ type: "SET_ADDLIST_KITCHENETTES", payload: Math.max(globalState.addListKitchenettes - 1, 1) })}
                  onPlus={() => globalDispatch({ type: "SET_ADDLIST_KITCHENETTES", payload: Math.min(globalState.addListKitchenettes + 1, 20) })}
                  displayValue={globalState.addListKitchenettes} />
              </span>
            </div>
          </>)
          : (null)}
        <div className={classes.paddingBottom} />
        <Grid item container xs={12} className={classes.bottomNav}>
          <Grid item xs={1} lg={2} />
          <Grid item xs={10} sm={4} lg={4} className={classes.navbtn} >
            <Button
              variant="contained"
              onClick={handleNext}
              style={{
                fontWeight: "400",
                textTransform: "capitalize",
                backgroundColor: theme.palette.buttonPrimary.main,
                color: theme.palette.background.default,
                fontSize: "18px",
                maxHeight: "70%",
                maxWidth: "150px"
              }}
              data-testid="nextBtn"
            >
              {t.next}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default Step1
