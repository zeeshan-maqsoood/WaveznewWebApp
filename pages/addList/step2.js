import React, {useContext, useState, useEffect} from "react"
import {makeStyles} from "@material-ui/core/styles"
import {Container, Grid} from "@material-ui/core"
import Counter from "./counter"
import Map from "../../components/search/map"
import TextField from "@material-ui/core/TextField"
import Autocomplete from "@material-ui/lab/Autocomplete"
import MapAutocomplete from "../../components/editListing/mapAutocomplete"
import Context from "../../store/context"
import Button from "@material-ui/core/Button"
import MapCharterDestinations from "../../components/editListing/mapCharterDestinations"
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import {Modal} from "react-responsive-modal"
import MobileHint from "../../components/addList/mobileHint"
// i18n
import {useRouter} from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import theme from "../../src/theme"

const boatData = [
    {location: "Scarborough"},
    {location: "Toronto"},
    {location: "London"},
    {location: "Hamilton"},
    {location: "Vancourver"},
    {location: "Bradford"}
]

const useStyles = makeStyles((theme) => ({
    container: {
        width: "100%",
        paddingLeft: "10px",
        color: theme.palette.title.matterhorn,

        [theme.breakpoints.down("md")]: {
            margin: "10px"
        },
        [theme.breakpoints.down("xs")]: {
            margin: "0px"
        }
    },
    header: {
        fontSize: 30,
        font: "Roboto",
        margin: 0
    },
    text: {
        font: "Roboto",
        color: theme.palette.text.grey,
        fontSize: 24
    },
    input: {
        height: "40px",
        width: "100%",
        borderRadius: 6
    },
    map: {
        marginTop: "20px",
        marginBottom: "90px",
        width: "50vw",
        height: "40vh",
        [theme.breakpoints.up("lg")]: {
            width: "30vw",
            height: "40vh"
        },
        [theme.breakpoints.down("md")]: {
            width: "40vw",
            height: "40vh"
        },
        [theme.breakpoints.down("sm")]: {
            width: "40vw",
            height: "60vh"
        },
        [theme.breakpoints.down("xs")]: {
            width: "100%",
            height: "60vh"
        }
    },
    title: {
        fontSize: 24,
        fontWeight: 500,
        paddingTop: 20
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
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: `1px solid ${  theme.palette.background.lightGrey}`
    },
    hintModal: {
        width: "90vw",
        borderRadius: 10,
        position: "fixed",
        left: 0
    }
}))

const Step2 = (props) => {
    const {globalState, globalDispatch} = useContext(Context)
    const classes = useStyles()
    const router = useRouter()
    const {locale} = router
    const t = locale === "en" ? en : fr

    const startingCenter = {lat: 43.653226, lng: -79.3831843} // starting center for map, currently "Toronto"
    const [mapCenter, setMapCenter] = useState(startingCenter)
    const [locationIsValid, setLocationIsValid] = useState(true)
    const [destinationIsValid, setDestinationIsValid] = useState(true)

    const [hintIsOpen, setHintIsOpen] = useState(false)

    useEffect(() => {
        globalState.addListLatLng !== undefined ? setMapCenter({
            lat: globalState.addListLatLng[0],
            lng: globalState.addListLatLng[1]
        }) : null
    }, [])

    const validateForm = () => {
        let formIsValid = true
        setLocationIsValid(true)
        setDestinationIsValid(true)

        {
            !globalState.addListLocation ? (formIsValid = false, setLocationIsValid(false)) : null
        }
        {
            globalState.addListService === "Charter" && (!globalState.addListDestination?.some(destination => destination !== undefined) || globalState.addListDestination?.length === 0 || globalState?.addListDestination === [undefined]) ? (formIsValid = false, setDestinationIsValid(false)) : null
        }

        return formIsValid
    }

    const handleNext = () => {
        validateForm() && globalDispatch({type: "SET_ADDLIST_STEP", payload: globalState.addListStep + 1})
    }

    const onUpdate = (newValue, latLng, dispValue) => {
        setLocationIsValid(true)
        if (newValue !== undefined && latLng !== undefined) {
            setMapCenter({lat: latLng[0], lng: latLng[1]})
        }
        globalDispatch({type: "SET_ADDLIST_LOCATION", payload: newValue, displayPayload: dispValue})
        globalDispatch({type: "SET_ADDLIST_LATLNG", payload: latLng})
    }

    const onUpdateDestination = (destinationList, dispDestinationList, destinationLatLngList) => {
        setDestinationIsValid(true)
        globalDispatch({
            type: "SET_ADDLIST_DESTINATION",
            payload: destinationList,
            displayPayload: dispDestinationList
        })
        globalDispatch({type: "SET_ADDLIST_DESTINATION_LATLNG", payload: destinationLatLngList})
    }

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
                <MobileHint content={[{hint: props.hint1Text}, {hint: props.hint2Text}]}
                            closeHint={() => setHintIsOpen(false)}/>
            </Modal>
            <Container className={classes.container}>
                <form method="post">
                    <h1 className={classes.header}>{t.listBoat}{props.isMobile &&
                        <HelpOutlineIcon onClick={() => setHintIsOpen(true)} style={{marginLeft: 5}}/>}</h1>
                    <p className={classes.title}>{t.addListStep2.passLabel}</p>
                    <div className={classes.text}>
                        {t.addListStep2.numPassengers}
                        <span style={{float: "right"}}>
              <Counter
                  onMinus={() => globalDispatch({
                      type: "SET_ADDLIST_PASSENGERS",
                      payload: Math.max(globalState.addListPassengers - 1, 1)
                  })}
                  onPlus={() => globalDispatch({
                      type: "SET_ADDLIST_PASSENGERS",
                      payload: (globalState.addListPassengers + 1)
                  })}
                  displayValue={globalState.addListPassengers}/>
            </span>
                    </div>
                    <p className={classes.title}>{t.addListStep2.locationLabel}</p>
                    <div className={classes.autocomplete}>
                        <MapAutocomplete inpProps={{"data-testid": "mapInput"}} inputWidth={"100%"}
                                         locationIsValid={locationIsValid} onUpdate={onUpdate}
                                         restoreValue={globalState.addListLocationDisplay}/>
                        <br/>
                    </div>
                    {globalState.addListService === "Charter" ?
                        (<MapCharterDestinations setMapCenter={setMapCenter} inputWidth={"calc(100% - 70px"}
                                                 updateDestination={onUpdateDestination}
                                                 destination={globalState.addListDestination}
                                                 destinationLatLng={globalState.addListDestinationLatLng}
                                                 destinationDisplay={globalState.addListDestinationDisplay}
                                                 destinationIsValid={destinationIsValid}/>) : (null)}
                    <div className={classes.map}>
                        <Map locationData={globalState.addListDestinationLatLng}
                             individualLocation={globalState.addListLatLng} center={mapCenter}/>
                    </div>
                    <div/>

                    <Grid item container xs={12} className={classes.bottomNav}>
                        <Grid item xs={1} sm={1} lg={2}/>
                        <Grid item xs={10} sm={4} lg={4} className={classes.navbtn}>
                            <Button
                                onClick={props.handleBack}
                                style={{
                                    textTransform: "capitalize",
                                    backgroundColor: theme.palette.background.default,
                                    fontWeight: "400",
                                    fontSize: "18px",
                                    color: theme.palette.buttonPrimary.main,
                                    height: "60%"
                                }}
                            >
                                &lt; {t.back}
                            </Button>
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
                </form>

            </Container>
        </>
    )
}

export default Step2
