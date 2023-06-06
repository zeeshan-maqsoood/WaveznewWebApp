import React, { useContext, useEffect, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { useRouter } from "next/router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import en from "../../locales/en"
import fr from "../../locales/fr"
import Context from "../../store/context"
import MapAutocompleteNav from '../../components/navbar/mapAutocompleteNav'
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import styles from '../../components/navbar/navBar.module.css'

const breakpoint = 768
const searchBreakPoint = 1100

export default function DropDown(props) {
    const router = useRouter()
    const { locale } = router
    const t = locale === 'en' ? en : fr


    const { globalState, globalDispatch } = useContext(Context)
    const [searchTerm, setSearchTerm] = useState("")
    const [searchTermFrom, setSearchTermFrom] = useState("")
    const [searchTermTo, setSearchTermTo] = useState("")

    const [windowSize, setWindowSize] = useState(null)
    const [windowHeight, setWindowHeight] = useState(null)

    const useStyles = makeStyles((theme) => ({

        select: {
            marginLeft: '5px',
            marginRight: '5px',
            paddingRight: '2px',
            color: theme.palette.buttonPrimary.main,
            borderLeft: "none",
            borderTop: "none",
            borderBottom: "none",
            borderRadius: "unset",
            fontSize: '17px',
            fontFamily: 'Arial, Helvetica, sans-serif',

            [theme.breakpoints.down('sm')]: {
                fontSize: '15px'
            },
            [theme.breakpoints.down('xs')]: {
                fontSize: '10px'

            }
        },
        option: {
            color: theme.palette.search.option,
            fontSize: '14px',
            borderRadius: "50%",
            border: 'unset',
            [theme.breakpoints.down('sm')]: {
                fontSize: '14px'
            },
            [theme.breakpoints.down('xs')]: {
                fontSize: '12px'
            }
        },
        nav_search: {
            width: "100%",
            display: "flex",
            flexDirection: "row",
            borderRadius: "5px",
            marginRight: "20px",
            backgroundColor: theme.palette.background.default,
            padding: "5px",
            border: `1px solid ${theme.palette.search.outline}`,
            height: (windowSize < breakpoint && router.query?.vesselType === "CHARTER" ? "80px" : "45px")
        },
        search_button_div: {
            display: "flex",
            alignItems: "center"
        },
        nav_search_button: {
            cursor: "pointer",
            fontWeight: 400,
            border: "none",
            backgroundColor: theme.palette.buttonPrimary.main,
            color:theme.palette.background.default,
            fontSize: "18px",
            // height: (windowSize < breakpoint && globalState.vesselType === "CHARTER" ? "40px" : "30px"),
            height: "40px",
            width: "40px",
            maxHeight: "80px",
            maxWidth: "250px",
            marginLeft: "15px",
            borderRadius: "5px"

        },
        locationInputs: {
            display: "flex",
            width: "100%",
            justifyContent: "flex-end"
        },
        autoCompleteInputs: {
            display: "flex",
            width: "100%",
            '& input': {
                '&::placeholder': {
                    color: theme.palette.search.placeholder,
                    textOverflow: 'ellipsis !important'
                }
            }
        },
        charter_mobile_input: {
            display: "inline",
            width: "100%"
        }
    }))
    const classes = useStyles()

    useEffect(() => {

    }, [])

    const handleChange = (e) => {
        globalDispatch({ type: "SET_SEARCH_TERM", payload: "" })
        globalDispatch({ type: "SET_SELECTION_OPTION", payload: e.target.value })
        globalDispatch({ type: "SET_VESSEL_TYPE", payload: e.target.value })
        router.push(`/search/${e.target.value}`)
    }
    const onUpdate = (newValue, latLng, dispValue) => {
        setSearchTerm(newValue?.formatted_address)
    }
    const setSearchState = () => {
        if (router.query?.vesselType === "RENTAL") {
            globalDispatch({ type: "SET_SEARCH_TERM", payload: searchTerm })
            globalDispatch({ type: "SET_CHARTER_FROM", payload: "" })
            globalDispatch({ type: "SET_CHARTER_TO", payload: "" })
        }
        if (router.query?.vesselType === "STAY") {
            globalDispatch({ type: "SET_SEARCH_TERM", payload: searchTerm })
            globalDispatch({ type: "SET_CHARTER_FROM", payload: "" })
            globalDispatch({ type: "SET_CHARTER_TO", payload: "" })
        }
        if (router.query?.vesselType === "CHARTER") {
            globalDispatch({ type: "SET_SEARCH_TERM", payload: "" })
            globalDispatch({ type: "SET_CHARTER_TO", payload: searchTermTo })
            globalDispatch({ type: "SET_CHARTER_FROM", payload: searchTermFrom })
        }
    }
    const onCharterFromUpdate = (newValue) => {
        globalDispatch({ type: "SET_VESSEL_TYPE", payload: "CHARTER" })
        setSearchTermFrom(newValue?.formatted_address)
    }
    const onCharterToUpdate = (newValue) => {
        globalDispatch({ type: "SET_VESSEL_TYPE", payload: "CHARTER" })
        setSearchTermTo(newValue?.formatted_address)
    }
    const operations = [
        {
            label: t.rentals,
            value: "RENTAL"
        },
        {
            label: t.charters,
            value: "CHARTER"
        },
        {
            label: t.stays,
            value: "STAY"
        }
    ]

    useEffect(() => {
        // only execute all the code below in client side
        if (typeof window !== 'undefined') {
            // Handler to call on window resize
            function handleResize() {
                // Set window width/height to state
                setWindowSize(window.innerWidth)
                setWindowHeight(window.innerHeight)
            }

            // Add event listener
            window.addEventListener('resize', handleResize)

            // Call handler right away so state gets updated with initial window size
            handleResize()

            // Remove event listener on cleanup
            return () => window.removeEventListener('resize', handleResize)
        }
    }, []) // Empty array ensures that effect is only run on mount
    return (
        <div className={classes.nav_search}>
            <select data-testid="navBarSearchSelect" className={classes.select} value={router.query?.vesselType} onChange={handleChange}>
                {operations.map((item) => (
                    <option key={`${item.value}`} className={classes.option} value={item.value}>{item.label} </option>
                ))}
            </select>
            <div className={classes.locationInputs}>
                <div className={classes.autoCompleteInputs}>
                    {router.query?.vesselType !== 'CHARTER' ?
                        (
                            <MapAutocompleteNav placeholder={t.landingSearchPlaceholder.location} onUpdate={onUpdate} />
                        ) : (
                            router.query?.vesselType === "CHARTER" && windowSize > breakpoint ?
                                <>
                                    {/*<label*/}
                                    {/*    className={styles.nav_label}>{t.landingSearchPlaceholder.charters.leavingAbbrv}</label>*/}
                                    <MapAutocompleteNav placeholder={t.landingSearchPlaceholder.charters.leaving} onUpdate={onCharterFromUpdate} />
                                    <hr />
                                    {/*<label*/}
                                    {/*    className={styles.nav_label}> {t.landingSearchPlaceholder.charters.goingAbbrv} </label>*/}
                                    <MapAutocompleteNav placeholder={t.landingSearchPlaceholder.charters.going} onUpdate={onCharterToUpdate} />
                                </> :
                                <div className={classes.charter_mobile_input}>
                                    {/*<label*/}
                                    {/*    className={styles.nav_label}>{t.landingSearchPlaceholder.charters.leavingAbbrv}</label>*/}
                                    <MapAutocompleteNav placeholder={t.landingSearchPlaceholder.charters.leavingAbbrv} onUpdate={onCharterFromUpdate} />
                                    {/*<label*/}
                                    {/*    className={styles.nav_label}> {t.landingSearchPlaceholder.charters.goingAbbrv} </label>*/}
                                    <MapAutocompleteNav placeholder={t.landingSearchPlaceholder.charters.goingAbbrv} onUpdate={onCharterToUpdate} />
                                </div>
                        )
                    }
                </div>
                <div className={classes.search_button_div}>
                    <button variant="contained" className={classes.nav_search_button}
                        onClick={setSearchState} data-testid="setSearchBtn">
                        {windowSize > breakpoint ? (
                            <FontAwesomeIcon icon={faSearch} style={{ fontSize: '1.2rem' }} />) : (
                            <FontAwesomeIcon icon={faSearch} style={{ fontSize: '0.9rem' }} />)}
                    </button>
                </div>
            </div>
        </div>
    )
}

