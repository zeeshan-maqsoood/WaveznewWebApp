/* eslint-disable no-duplicate-imports */
import React, {useState, useEffect} from "react"
import {makeStyles, withStyles} from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import {FormControl, FormHelperText, MenuItem, Select, TextField} from "@material-ui/core"
import {Typography, Container} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import {createTheme} from "@material-ui/core/styles"
import {ThemeProvider} from "@material-ui/styles"
import NavBar from '../../../components/navbar/navBar'
import Counter from '../../addList/counter'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Hint from "../../addList/hint"
import FeatureAutocomplete from "../../../components/editListing/featuresAutocomplete"
import API from '../../../pages/api/baseApiIinstance'
import Session from "../../../sessionService"
import MobileHint from "../../../components/addList/mobileHint"
import {Modal} from "react-responsive-modal"
import YearDropdown from "../../../components/addList/yearDropdown"
import EssentialFeatures from "../../../components/editListing/essentialFeatures"
// i18n
import {useRouter} from "next/router"
import en from "../../../locales/en"
import fr from "../../../locales/fr"
import theme from "../../../src/theme"

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
    hintContainer: {
        [theme.breakpoints.down("xs")]: {
            display: "none"
        }
    },
    hintBlue: {
        backgroundColor: theme.palette.background.pattensBlue
    },
    hint: {
        position: "absolute",
        top: 140,
        width: "32vw",
        zIndex: 3,
        [theme.breakpoints.down("xs")]: {
            width: "38vw"
        },
        [theme.breakpoints.down("sm")]: {
            width: "40vw"
        }
    },
    featureDiv: {
        position: "absolute",
        top: 440,
        marginLeft: 60,
        width: "20vw",
        zIndex: 4,
        [theme.breakpoints.down("xs")]: {
            width: "36vw",
            marginLeft: 10,
            top: 500
        },
        [theme.breakpoints.up("sm")]: {
            width: "32vw",
            marginLeft: 30
        },
        [theme.breakpoints.up("md")]: {
            width: "26vw",
            marginLeft: 30
        },
        [theme.breakpoints.up("lg")]: {
            width: "26vw",
            marginLeft: 60
        }
    },
    featureAutocomplete: {
        backgroundColor: theme.palette.background.default,
        borderRadius: 5
    },
    step: {
        padding: "0px",
        position: "sticky",
        top: "60px"
    },
    text: {
        font: "Roboto",
        color: theme.palette.text.grey,
        fontSize: 24
    },
    title: {
        fontSize: 24,
        fontWeight: 500,
        paddingTop: 10
    },
    paddingTop: {
        paddingTop: 50,
        [theme.breakpoints.down("md")]: {
            paddingTop: 90
        }
    },
    botPadding: {
        paddingBottom: 120
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
    thinInput: {
        width: 200,
        [theme.breakpoints.down("xs")]: {
            width: "90%"
        }
    },
    featureLabel: {
        backgroundColor: theme.palette.background.pattensBlue,
        fontSize: 24,
        fontWeight: 500,
        paddingBottom: 20
    },
    featureLabelMobile: {
        fontSize: 24,
        fontWeight: 500,
        paddingBottom: 20,
        paddingTop: 30
    },
    hintModal: {
        width: "90vw",
        borderRadius: 10,
        position: "fixed",
        left: 0
    },
    weightError: {
        marginLeft: "0px"
    }
}))

// const theme = createTheme({
//     palette: {
//         action: {
//             disabledBackground: theme.palette.background.default,
//             disabled: theme.palette.background.default,
//         },
//     },
// });

export default function VesselDescription({
                                              listingStartValue,
                                              getListingInfo,
                                              nextPage,
                                              setUnsavedChanges,
                                              onSubmit,
                                              isMobile,
                                              hintIsOpen,
                                              setHintIsOpen
                                          }) {
    const token = Session.getToken("Wavetoken")
    const YEARS_OLD_ALLOWED = 25
    const classes = useStyles()
    const router = useRouter()
    const {locale} = router
    const t = locale === "en" ? en : fr
    // year picker
    const [fuelOptions, setFuelOptions] = useState([{fuel: ""}])
    // full listing
    const [listing, setListing] = useState(listingStartValue)
    const [numPassengers, setNumPassengers] = useState(0)
    const [vesselMake, setVesselMake] = useState("")
    const [vesselModel, setVesselModel] = useState("")
    const [vesselYear, setVesselYear] = useState("")
    const [vesselLength, setVesselLength] = useState("")
    const [vesselWeight, setVesselWeight] = useState("")
    const [vesselWeightUnit, setVesselWeightUnit] = useState("")
    const [vesselMaxSpeed, setVesselMaxSpeed] = useState("")
    const [vesselHorsePower, setVesselHorsePower] = useState("")
    const [vesselFuelType, setVesselFuelType] = useState("")
    const [featureStartingIds, setFeatureStartingIds] = useState([])
    const [essentialsChecked, setEssentialsChecked] = useState(false)
    const [features, setFeatures] = useState([])
    // validation
    const [makeIsValid, setMakeIsValid] = useState(true)
    const [modelIsValid, setModelIsValid] = useState(true)
    const [yearIsValid, setYearIsValid] = useState(true)
    const [lengthIsValid, setLengthIsValid] = useState(true)
    const [weightIsValid, setWeightIsValid] = useState(true)
    const [weightUnitIsValid, setWeightUnitIsValid] = useState(true)
    const [maxSpeedIsValid, setMaxSpeedIsValid] = useState(true)
    const [horsePowerIsValid, setHorsePowerIsValid] = useState(true)
    const [fuelTypeIsValid, setFuelTypeIsValid] = useState(true)
    const [featuresIsValid, setFeaturesIsValid] = useState(true)
    const [validateEssentials, setValidateEssentials] = useState(false)
    const [clearEssentialsErrors, setClearEssentialsErrors] = useState(false)

    useEffect(() => {
        getListingInfo() // call for updated information
        FetchFuelTypes()
    }, []) // Empty array ensures that effect is only run on mount

    const FetchFuelTypes = () => {
        API().get(`/vessel/fuel`)
            .then((response) => {
                if (response.data) {
                    console.log("Fuel type response.data: ", response.data)
                    const fuels = response.data.filter(x => x.status !== "SOFT_DELETE")
                    setFuelOptions(fuels)
                }
            }).catch((e) => {
            // router.push("/somethingWentWrong");
        })
    }

    const setAllValid = () => {
        setMakeIsValid(true)
        setModelIsValid(true)
        setYearIsValid(true)
        setLengthIsValid(true)
        setWeightIsValid(true)
        setWeightUnitIsValid(true)
        setMaxSpeedIsValid(true)
        setHorsePowerIsValid(true)
        setFuelTypeIsValid(true)
        setFeaturesIsValid(true)
        setClearEssentialsErrors(true)
    }

    useEffect(() => { // Update listing values after API GET finishes updating
        setUnsavedChanges(false)
        setListing(listingStartValue || "")
        setNumPassengers(listingStartValue?.numberOfPassengers || "")
        setVesselMake(listingStartValue?.vesselBrand || "")
        setVesselModel(listingStartValue?.vesselModelInfo || "")
        setVesselYear(listingStartValue?.vesselYear?.toString() || "")
        setVesselLength(listingStartValue?.vesselLength || "")
        setVesselWeight(listingStartValue?.vesselWeight?.weight || "")
        setVesselWeightUnit(listingStartValue?.vesselWeight?.unit || "GT")
        setVesselMaxSpeed(listingStartValue?.vesselMaxSpeed || "")
        setVesselHorsePower(listingStartValue?.vesselHorsePower || "")
        setVesselFuelType(listingStartValue?.vesselFuelType || "")
        setFeatureStartingIds(listingStartValue?.vesselFeatures || "")
        if (listingStartValue?.hasLifeJackets && listingStartValue?.hasFirstAidKit && listingStartValue?.hasFlashlight && listingStartValue?.hasRope) {
            setEssentialsChecked(true)
        }
    }, [listingStartValue])

    useEffect(() => {
        const previousFuelSelected = fuelOptions.find(option => option._id === listingStartValue?.vesselFuelType)
        if (previousFuelSelected) {
            setVesselFuelType(previousFuelSelected)
        }
    }, [fuelOptions, listingStartValue])

    const updateFeatures = (newValue) => {
        setFeatures(newValue)
    }

    const submitForm = () => {
        validate() && sendUpdate()
    }

    const validate = () => {
        let formIsValid = true
        setValidateEssentials(true)
        {
            !vesselMake ? (formIsValid = false, setMakeIsValid(false)) : null
        }
        {
            !vesselModel ? (formIsValid = false, setModelIsValid(false)) : null
        }
        {
            !vesselYear ? (formIsValid = false, setYearIsValid(false)) : null
        }
        {
            !vesselLength ? (formIsValid = false, setLengthIsValid(false)) : null
        }
        {
            !vesselWeight ? (formIsValid = false, setWeightIsValid(false)) : null
        }
        {
            !vesselWeightUnit ? (formIsValid = false, setWeightUnitIsValid(false)) : null
        }
        {
            !vesselMaxSpeed ? (formIsValid = false, setMaxSpeedIsValid(false)) : null
        }
        {
            !vesselHorsePower ? (formIsValid = false, setHorsePowerIsValid(false)) : null
        }
        {
            !vesselFuelType ? (formIsValid = false, setFuelTypeIsValid(false)) : null
        }
        {
            !essentialsChecked ? (formIsValid = false) : null
        }
        return formIsValid
    }

    const sendUpdate = () => {
        const featureIds = []
        for (let i = 0; i <= features.length - 1; i++) {
            featureIds.push(features[i]._id)
        }
        const updatedListing = {
            numberOfPassengers: numPassengers,
            vesselBrand: vesselMake,
            vesselModelInfo: vesselModel,
            vesselYear: Number(vesselYear),
            vesselLength: Number(vesselLength),
            vesselWeight: {
                weight: Number(vesselWeight),
                unit: vesselWeightUnit
            },
            vesselMaxSpeed: Number(vesselMaxSpeed),
            vesselHorsePower: Number(vesselHorsePower),
            vesselFuelType,
            vesselFeatures: featureIds,
            hasLifeJackets: essentialsChecked,
            hasFirstAidKit: essentialsChecked,
            hasFlashlight: essentialsChecked,
            hasRope: essentialsChecked
        }
        console.log("Sending update: ", updatedListing)
        API()
            .put(`${listing.vesselType.toLowerCase()  }s/${  listing._id}`, updatedListing, {
                headers: {
                    authorization: `Bearer ${  token}`
                }
            })
            .then((response) => {
                console.log("response is ", response)
                if (response.status === 200) {
                    onSubmit(true)
                    setUnsavedChanges(false)
                    getListingInfo()
                    nextPage()
                }
            })
            .catch((e) => {
                // router.push("/somethingWentWrong");
            })
    }

    return (
        <>
            <form method='post'>
                <Modal
                    open={hintIsOpen}
                    onClose={() => setHintIsOpen(false)}
                    classNames={{
                        modal: classes.hintModal
                    }}
                    center
                    blockScroll={false}
                >
                    <MobileHint content={[
{
                        title: t.editListing.vesselDescription.hintTitle,
                        hint: t.editListing.vesselDescription.hintText
                    }
]} closeHint={() => setHintIsOpen(false)}/>
                </Modal>
                <Grid container className={classes.root}>
                    <Grid item container xs={12} sm={6}>
                        <Grid item xs={1} md={4}/>
                        <Grid item xs={10} md={8}>
                            <div className={classes.paddingTop}/>
                            {/* Render contents */}
                            <div>
                                {/* Passengers */}
                                <p className={classes.title}>{t.addListStep2.passLabel}</p>
                                <div className={classes.text}>
                                    {t.addListStep2.numPassengers}
                                    <span style={{float: "right"}}>
                                        <Counter
                                            onMinus={() => {
                                                setNumPassengers(currPassengers => Math.max(currPassengers - 1, 0)), setUnsavedChanges(true)
                                            }}
                                            onPlus={() => {
                                                setNumPassengers(currPassengers => currPassengers + 1), setUnsavedChanges(true)
                                            }}
                                            displayValue={numPassengers}/>
                                    </span>
                                </div>
                                {/* Make/Brand */}
                                <p className={classes.title}>{t.editListing.vesselDescription.makeLabel}</p>
                                <TextField style={{width: "100%"}} value={vesselMake || ""} error={!makeIsValid}
                                           label={t.editListing.vesselDescription.makeLabel} variant="outlined"
                                           inputProps={{maxLength: 40}} 
                                           onChange={(event, value) => {
                                               (event?.target?.value ? setVesselMake(event.target.value) : setVesselMake("")), setUnsavedChanges(true), setMakeIsValid(true)
                                           }}/>
                                <FormHelperText
                                    error> {!makeIsValid ? t.editListing.vesselDescription.errorMake : null} </FormHelperText>
                                {/* Model */}
                                <p className={classes.title}>{t.editListing.vesselDescription.modelLabel}</p>
                                <TextField style={{width: "100%"}} value={vesselModel || ""} error={!modelIsValid}
                                           label={t.editListing.vesselDescription.modelPlaceholder} variant="outlined"
                                           inputProps={{"data-testid": "model"}}
                                           onChange={(event, value) => {
                                               (event?.target?.value ? setVesselModel(event.target.value) : setVesselModel("")), setUnsavedChanges(true), setModelIsValid(true)
                                           }}/>
                                <FormHelperText
                                    error> {!modelIsValid ? t.editListing.vesselDescription.errorModel : null} </FormHelperText>
                                {/* Year */}
                                <YearDropdown setUnsavedChanges={(val) => setUnsavedChanges(val)}
                                              vesselYear={vesselYear} setVesselYear={(val) => setVesselYear(val)}
                                              yearIsValid={yearIsValid} setYearIsValid={(val) => setYearIsValid(val)}/>
                                {/* Length */}
                                <p className={classes.title}>{t.editListing.vesselDescription.lengthLabel}</p>
                                <TextField type={"number"} className={classes.thinInput} value={vesselLength || ""}
                                           onWheel={(e) => e.target.blur()}
                                           error={!lengthIsValid} label={t.editListing.vesselDescription.lengthLabel}
                                           variant="outlined" inputProps={{"data-testid": "length"}}
                                           onChange={(event, value) => {
                                               (event?.target?.value ? setVesselLength(Math.max(event.target.value, 0)) : setVesselLength("")), setUnsavedChanges(true), setLengthIsValid(true)
                                           }}/>
                                <FormHelperText
                                    error> {!lengthIsValid ? t.editListing.vesselDescription.errorLength : null} </FormHelperText>
                                {/* Weight */}
                                <p className={classes.title}>{t.editListing.vesselDescription.weightLabel}</p>
                                <div style={{display: "flex", height: 36, alignItems: "center" }}>
                                    <FormControl error={!weightUnitIsValid}>
                                        <div style={{marginRight: 10 }}>
                                            <Button disableElevation={vesselWeightUnit !== "GT"}
                                                    style={{borderTopRightRadius: 0, borderBottomRightRadius: 0}}
                                                    onClick={() => {
                                                        setVesselWeightUnit("GT"), setUnsavedChanges(true), setWeightUnitIsValid(true)
                                                    }} color={vesselWeightUnit === "GT" ? "primary" : "default"}
                                                    variant={"contained"} data-testid="btnGT">GT</Button>
                                            <Button disableElevation={vesselWeightUnit !== "lbs"}
                                                    style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}
                                                    onClick={() => {
                                                        setVesselWeightUnit("lbs"), setUnsavedChanges(true), setWeightUnitIsValid(true)
                                                    }} color={vesselWeightUnit === "lbs" ? "primary" : "default"}
                                                    variant={"contained"} data-testid="btnLbs">lbs</Button>
                                            <FormHelperText>{!weightUnitIsValid ? t.required : null}</FormHelperText>
                                        </div>
                                    </FormControl>
                                    <TextField type={"number"} className={classes.thinInput} value={vesselWeight}
                                               onWheel={(e) => e.target.blur()}
                                               error={!weightIsValid}
                                               helperText={!weightIsValid ? t.editListing.vesselDescription.errorWeight : null}
                                               FormHelperTextProps={{className: classes.weightError}}
                                               onChange={(event, value) => {
                                                   (event?.target?.value ? setVesselWeight(Math.max(event.target.value, 0)) : setVesselWeight("")), setUnsavedChanges(true), setWeightIsValid(true)
                                               }} label={t.editListing.vesselDescription.weightLabel} variant="outlined"
                                               inputProps={{"data-testid": "weight"}}/>
                                </div>
                                {/* Max Speed */}
                                <p className={classes.title}>{t.editListing.vesselDescription.maxSpeedLabel}</p>
                                <TextField type={"number"} className={classes.thinInput} value={vesselMaxSpeed || ""}
                                           onWheel={(e) => e.target.blur()}
                                           error={!maxSpeedIsValid}
                                           label={t.editListing.vesselDescription.maxSpeedPlaceholder}
                                           variant="outlined" inputProps={{"data-testid": "maxSpeed"}}
                                           onChange={(event, value) => {
                                               (event?.target?.value ? setVesselMaxSpeed(Math.max(event.target.value, 0)) : setVesselMaxSpeed("")), setUnsavedChanges(true), setMaxSpeedIsValid(true)
                                           }}/>
                                <FormHelperText
                                    error> {!maxSpeedIsValid ? t.editListing.vesselDescription.errorMaxSpeed : null} </FormHelperText>
                                {/* Horse Power */}
                                <p className={classes.title}>{t.editListing.vesselDescription.horsePowerLabel}</p>
                                <TextField type={"number"} className={classes.thinInput} value={vesselHorsePower || ""}
                                           onWheel={(e) => e.target.blur()}
                                           error={!horsePowerIsValid}
                                           label={t.editListing.vesselDescription.horsePowerLabel} variant="outlined"
                                           inputProps={{"data-testid": "horsePower"}}
                                           onChange={(event, value) => {
                                               (event?.target?.value ? setVesselHorsePower(Math.max(event.target.value, 0)) : setVesselHorsePower("")), setUnsavedChanges(true), setHorsePowerIsValid(true)
                                           }}/>
                                <FormHelperText
                                    error> {!horsePowerIsValid ? t.editListing.vesselDescription.errorHorsePower : null} </FormHelperText>
                                {/* Fuel Type */}
                                <p className={classes.title}>{t.editListing.vesselDescription.fuelTypeLabel}</p>
                                <FormControl className={classes.thinInput} error={!fuelTypeIsValid}>
                                    <Select
                                        inputProps={{"data-testid": "fuelType"}}
                                        variant="outlined"
                                        value={vesselFuelType.fuel || ""}
                                        renderValue={() => {
                                            return vesselFuelType.fuel
                                        }} // shows the selected value if it is not in the options or is not visible
                                        displayEmpty
                                        onChange={(event) => {
                                            setVesselFuelType(event?.target?.value), setUnsavedChanges(true), setFuelTypeIsValid(true), console.log("event: ", event)
                                        }}
                                    >
                                        {fuelOptions.map((fuelItem) => (
                                            fuelItem.isVisible && <MenuItem key={fuelItem._id}
                                                                            value={fuelItem}>{fuelItem.fuel}</MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{!fuelTypeIsValid ? t.editListing.vesselDescription.errorFuelType : null}</FormHelperText>
                                </FormControl>

                            </div>
                            {/* Essential Features */}
                            <EssentialFeatures shouldBeRestored={essentialsChecked}
                                               setIsValid={(checked) => setEssentialsChecked(checked)}
                                               validate={validateEssentials}
                                               resetFlag={() => setValidateEssentials(false)}
                                               clearErrors={clearEssentialsErrors}
                                               resetClearErrors={() => setClearEssentialsErrors(false)}/>
                            {/* Features for Mobile */}
                            {isMobile && <div>
                                <Typography className={classes.featureLabelMobile}>
                                    {t.editListing.vesselDescription.features}
                                </Typography>
                                <div className={classes.featureAutocomplete}>
                                    <FeatureAutocomplete startingIds={featureStartingIds} features={features}
                                                         updateFeatures={updateFeatures}
                                                         setUnsavedChanges={() => setUnsavedChanges(true)}/>
                                </div>
                            </div>}
                            <div className={classes.botPadding}/>
                            {/* End contents */}
                        </Grid>
                    </Grid>

                    {/* Hints */}
                    <Grid container item xs={false} sm={6} className={classes.hintContainer}>
                        <Grid item xs={false} sm={1} md={2}/>
                        <Grid item xs={false} sm={10} md={8} className={classes.hintBlue}>
                            <div className={classes.hint}>
                                <Hint title={t.editListing.vesselDescription.hintTitle}
                                      content={t.editListing.vesselDescription.hintText}/>
                            </div>
                            {/* Features */}
                            <div className={classes.featureDiv}>
                                <Typography className={classes.featureLabel}>
                                    {t.editListing.vesselDescription.features}
                                </Typography>
                                <div className={classes.featureAutocomplete}>
                                    <FeatureAutocomplete startingIds={featureStartingIds} features={features}
                                                         updateFeatures={updateFeatures}
                                                         setUnsavedChanges={() => setUnsavedChanges(true)}
                                                         setBackgroundBlue/>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={1} md={2}/>
                    </Grid>
                </Grid>

                {/* Bottom Div Buttons */}
                < Grid container item xs={12} className={classes.bottomDiv}>
                    <Grid item xs={1} sm={false} md={2}/>
                    <Grid item xs={10} sm={6} md={4} className={classes.saveDiv}>
                        <Button
                            onClick={() => {
                                getListingInfo(), setAllValid()
                            }}
                            style={{
                                textTransform: "capitalize",
                                backgroundColor: theme.palette.background.default,
                                fontWeight: "400",
                                fontSize: "18px",
                                color: theme.palette.buttonPrimary.main,
                                height: "60%",
                                marginRight: 20
                            }}
                        >
                            {t.reset}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => submitForm()}
                            style={{
                                fontWeight: "400",
                                textTransform: "capitalize",
                                backgroundColor: theme.palette.buttonPrimary.main,
                                color: theme.palette.background.default,
                                fontSize: "18px",
                                maxHeight: "50px",
                                maxWidth: "250px",
                                marginLeft: 20
                            }}
                            data-testid="saveBtn"
                        >
                            {t.saveContinue}
                        </Button>
                    </Grid>
                </Grid>

            </form>
        </>
    )
}
