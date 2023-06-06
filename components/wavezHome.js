/* eslint-disable no-duplicate-imports */
import React, { useContext, useEffect, useState, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Link from 'next/link'
import RecommendationBar from './recommendationSection/recommendationBar'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// i18n
import { useRouter } from 'next/router'
import en from '../locales/en.js'
import fr from '../locales/fr.js'
import ApiInstance from '../pages/api/baseApiIinstance'
import UserReview from './userReview'
import Session from "../sessionService"
import Context from "../store/context"
import Geocode from "react-geocode"
import API from "../pages/api/baseApiIinstance"
import MapAutocompleteNav from '../components/navbar/mapAutocompleteNav'
import theme from "../src/theme"

const breakpoint = 620

const useStyles = makeStyles((theme) => ({
    hero_container: {
        // background: `url('../assets/images/background.jpg') 50%/cover no-repeat`,
        backgroundSize: '100% 100%',
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            height: '70vh'
        },
        [theme.breakpoints.down('xs')]: {
            height: '43.75vh'
        }
    },
    header_title: {
        width: '60%',
        color: theme.palette.background.default,
        fontSize: '65px',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sansserif",
        [theme.breakpoints.down('sm')]: {
            fontSize: '40px'
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '25px'
        }
    },
    menu_container: {
        display: 'flex',
        alignItems: 'center',
        height: '50px',
        color:theme.palette.background.default,
        fontSize: '24px',
        fontWeight: '500',
        width: '50%',
        backgroundColor: theme.palette.buttonPrimary.main,
        borderRadius: '10px',
        marginTop: '70px',
        [theme.breakpoints.down('sm')]: {
            height: '50px',
            width: '65%',
            marginTop: '48px'
        },
        [theme.breakpoints.down('xs')]: {
            height: '31.25px',
            width: '70%',
            marginTop: '36px'
        }
    },
    menu: {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        listStyle: 'none',
        textAlign: 'center',
        width: '60vw',
        fontSize: '20px',
        padding: '30px',
        marginBottom: '0',
        [theme.breakpoints.down('sm')]: {
            margin: '20px',
            padding: '0'
        }
    },
    menu_item: {
        borderRadius: '10px',
        width: '50%',
        height: '40px',
        paddingTop: '5px',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor:theme.palette.background.default,
            transition: 'all 0.2s ease-out',
            color: theme.palette.buttonPrimary.main,
            paddingTop: '4px',
            height: '30px'
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '18px',
            paddingTop: '8px'
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '12px',
            paddingTop: '10px',
            '&:hover': {
                paddingTop: '3px',
                height: '25px'
            }
        }
    },
    menu_item_selected: {
        borderRadius: '10px',
        width: '50%',
        height: '40px',
        paddingTop: '5px',
        cursor: 'pointer',
        backgroundColor:theme.palette.background.default,
        color: theme.palette.buttonPrimary.main,
        [theme.breakpoints.down('sm')]: {
            fontSize: '18px',
            paddingTop: '3px',
            height: '30px'
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '12px',
            paddingTop: '3px',
            height: '25px'
        }
    },
    seperator: {
        padding: '0 10px 0 10px',
        [theme.breakpoints.down('sm')]: {
            fontSize: '18px'
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '12px'
        }
    },
    search_container: {
        display: 'flex',
        backgroundColor: theme.palette.wavezHome.backgroundColorSearch,
        width: '50%',
        alignItems: 'center',
        height: '50px',
        marginTop: '20px',
        marginBottom: '10px',
        borderRadius: '10px',
        paddingLeft: '10px',
        justifyContent: 'center',

        [theme.breakpoints.down('sm')]: {
            width: '65%',
            height: '40px'
        },
        [theme.breakpoints.down('xs')]: {
            height: '35px',
            width: '70%'
        },
        '& input': {
            color: theme.palette.buttonPrimary.main,
            padding: '10px',
            marginBottom: '0',
            backgroundColor: theme.palette.wavezHome.backgroundColorSearch,
            '&::placeholder': {
                color: theme.palette.text.black,
                textOverflow: 'ellipsis !important'
            },
            [theme.breakpoints.down('sm')]: {
                fontSize: '15px'
            },
            [theme.breakpoints.down('xs')]: {
                fontSize: '10px'
            }
        }
    },
    search_container_input: {},
    search_button: {
        backgroundColor: theme.palette.buttonPrimary.main,
        width: '25%',
        height: '65%',
        borderRadius: '5px',
        border: 'none',
        marginLeft: '10px',
        marginRight: '10px',
        [theme.breakpoints.down('sm')]: {
            width: '20%',
            height: '60%'
        },
        [theme.breakpoints.down('xs')]: {
            width: '25%',
            height: '60%',
            fontSize: '80%'
        }
    },
    search_link: {
        color: theme.palette.background.default
    },
    search_input: {
        Color: theme.palette.buttonPrimary.main,
        flexGrow: '1',
        border: 'none',
        outlineWidth: '0',
        backgroundColor: 'transparent',
        [theme.breakpoints.down('xs')]: {
            width: '75%'
        }
    },
    charterSearch_container: {
        display: 'flex',
        backgroundColor: theme.palette.wavezHome.backgroundColorSearch,
        width: '50%',
        alignItems: 'center',
        height: '50px',
        marginTop: '20px',

        borderRadius: '10px',
        justifyContent: "flex-end",
        [theme.breakpoints.down('sm')]: {
            width: '65%'
        },
        [theme.breakpoints.down('xs')]: {
            marginTop: '10px',
            width: '70%',
            height: '40px'
        }
    },
    placeInputBox: {
        flexDirection: 'column',
        width: '30%',
        [theme.breakpoints.down('xs')]: {
            fontSize: '11px'
        }
    },
    reviews_text: {
        color: theme.palette.wavezHome.reviewsText,
        fontWeight: '500',
        fontSize: '20px',
        marginTop: '120px',
        marginBottom: '40px',
        textAlign: 'center',
        fontFamily: "'Roboto', 'Nunito Sans', 'sansserif'"
    },
    reviews_text_highlighted: {
        color: theme.palette.buttonPrimary.main
    }
}))
const WavezHome = (props) => {
    Geocode.setApiKey(process.env.googleMapsApiKey)
    const classes = useStyles()
    const router = useRouter()
    const { locale } = router
    const t = locale === 'en' ? en : fr
    const [isReload, setIsReload] = useState(false)
    const { globalState, globalDispatch } = useContext(Context)
    const [searchTerm, setSearchTerm] = useState("")
    const [searchTermFrom, setSearchTermFrom] = useState("")
    const [searchTermTo, setSearchTermTo] = useState("")

    const selections = {
        RENTALS: 'Rentals',
        CHARTERS: 'Charters',
        STAYS: 'Stays'
    }

    // The current width of the viewport
    // The width below which the mobile view should be rendered
    const [selection, setSelection] = useState(selections.RENTALS)
    const [selectionUpper, setSelectionUpper] = useState(selections.RENTALS)
    const [windowSize, setWindowSize] = useState(null)
    const [windowHeight, setWindowHeight] = useState(null)
    const [rentals, setRentals] = useState(false)
    const [charters, setCharters] = useState(false)
    const [stays, setStays] = useState(false)
    const [recommendationsData, setRecommendationsData] = useState([])
    const [userReviewsData, setUserReviewsData] = useState([])

    const appStoreList = [
        /iPhone/i,
        /iPad/i,
        /iPod/i
    ]

    const handlePermission = () => {
        let safariAgent = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
        appStoreList.map((appStoreItem) => {
            if (navigator.userAgent.match(appStoreItem)) {
                safariAgent = true
                console.log("navigator.userAgent.match: ", appStoreItem)
            }
        })
        console.log("safariAgent: ", safariAgent)

        if (!safariAgent) {
            navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
                if (result.state === 'granted') {
                    report(result.state)
                    navigator.geolocation.getCurrentPosition(successMethod, failureMethod)
                } else if (result.state === 'prompt') {
                    report(result.state)
                    navigator.geolocation.getCurrentPosition(successMethod, failureMethod)
                } else if (result.state === 'denied') {
                    report(result.state)
                }
                result.onchange = function () {
                    report(result.state)
                }
            })
        }
    }
        
    const successMethod = (geoLocation) => {
        console.log("Permission Granted. geoLocation: ", geoLocation)
        Geocode.fromLatLng(geoLocation.coords.latitude.toString(), geoLocation.coords.longitude.toString()).then(
            (response) => {
                const address = response.results[0].formatted_address
                Session.setLocation(address)
                console.log(address)
            },
            (error) => {
                console.error(error)
            }
        )
    }

    const failureMethod = () => {
        console.log("Permission Denied")
    }

    const report = (state) => {
        console.log(`Permission ${  state}`)
    }

    const getUserReviews = () => {        
        API()
        .get(`reviews/featuredReviews`)
        .then((response) => {
            console.log("User review homepage: ", response.data)      
            setUserReviewsData(response.data.slice(0, 3))
        })
        .catch((e) => {
        console.log("Error from get information files is: ", e)
        // router.push("/somethingWentWrong");
        })
    }

    useEffect(() => {
        handlePermission()
        globalDispatch({ type: "SET_VESSEL_TYPE", payload: "RENTAL" })
    }, [])

    const fetchData = () => {
        // const rentalsData = ApiInstance().get('rentals');
        // const staysData = ApiInstance().get('stays');
        // const chartersData = ApiInstance().get('charters');
        ApiInstance().get(
            "vessel/getFeaturedListings"
        ).then(responses => {

            const recommendations = [
                {
                    id: '001',
                    introductionText: t.recommendationBar.nextAdventure,
                    sectionName: t.rentals,
                    buttonText: t.rentals,
                    dataList: ''
                },
                {
                    id: '002',
                    introductionText: t.recommendationBar.find,
                    sectionName: t.charters,
                    buttonText: t.charters,
                    dataList: ''
                },
                {
                    id: '003',
                    introductionText: t.recommendationBar.explore,
                    sectionName: t.recommendationBar.places,
                    buttonText: t.stays,
                    dataList: ''
                }
            ]

            recommendations[0].dataList = responses.data.rentals
            recommendations[1].dataList = responses.data.charters
            recommendations[2].dataList = responses.data.stays
            recommendations[0].vesselType = "RENTAL"
            recommendations[1].vesselType = "CHARTER"
            recommendations[2].vesselType = "STAY"
            
            
            setRecommendationsData(recommendations)
            getUserReviews()
        })
            .catch((error) => {
                console.log('wavezHome fetchData() error : ', error)
                // router.push("/somethingWentWrong");
            })
    }

    useEffect(() => {
        console.log("recommendationsData: ", recommendationsData)
    }, [recommendationsData])

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

    useEffect(() => {
        fetchData()
    }, [t])
    //Pass search Data to Search Page

    const onUpdate = (newValue, latLng, dispValue) => {
        setSearchTerm(newValue?.formatted_address)
    }
    const setSearchState = () => {
        if (selection === "Rentals") {
            globalDispatch({ type: "SET_SEARCH_TERM", payload: searchTerm })
            globalDispatch({ type: "SET_CHARTER_FROM", payload: "" })
            globalDispatch({ type: "SET_CHARTER_TO", payload: "" })
        }
        if (selection === "Stays") {
            globalDispatch({ type: "SET_SEARCH_TERM", payload: searchTerm })
            globalDispatch({ type: "SET_CHARTER_FROM", payload: "" })
            globalDispatch({ type: "SET_CHARTER_TO", payload: "" })
        }
        if (selection === "Charters") {
            globalDispatch({ type: "SET_SEARCH_TERM", payload: "" })
            globalDispatch({ type: "SET_CHARTER_TO", payload: searchTermTo })
            globalDispatch({ type: "SET_CHARTER_FROM", payload: searchTermFrom })
        }
    }
    const onCharterFromUpdate = (newValue) => {
        setSearchTermFrom(newValue?.formatted_address)
    }
    const onCharterToUpdate = (newValue) => {
        setSearchTermTo(newValue?.formatted_address)
    }

    return (
      <>
        <div
          className={classes.hero_container}
          style={{
            background: `url(${
              props?.homeData?.heroImage?.stringValue &&
              props?.homeData?.heroImage?.stringValue !== ''
                ? props?.homeData?.heroImage?.stringValue
                : '/assets/images/background.jpg'
            }) center center/cover no-repeat`
          }}
        >
          <p className={classes.header_title}>
            {props?.homeData?.heroText?.stringValue
              ? props?.homeData?.heroText?.stringValue
              : t.landingHeader}
          </p>
          <div className={classes.menu_container}>
            <ul className={classes.menu}>
              <li
                className={
                  selection === selections.RENTALS
                    ? classes.menu_item_selected
                    : classes.menu_item
                }
                onClick={() => {
                  setRentals(!rentals)
                  setSelection(selections.RENTALS)
                  globalDispatch({
                    type: 'SET_VESSEL_TYPE',
                    payload: 'RENTAL'
                  })
                }}
              >
                {t.rentals}
              </li>
              <span className={classes.seperator}>|</span>
              <li
                className={
                  selection === selections.CHARTERS
                    ? classes.menu_item_selected
                    : classes.menu_item
                }
                onClick={() => {
                  setCharters(!charters)
                  setSelection(selections.CHARTERS)
                  globalDispatch({
                    type: 'SET_VESSEL_TYPE',
                    payload: 'CHARTER'
                  })
                }}
              >
                {t.charters}
              </li>
              <span className={classes.seperator}>|</span>
              <li
                className={
                  selection === selections.STAYS
                    ? classes.menu_item_selected
                    : classes.menu_item
                }
                onClick={() => {
                  setStays(!stays)
                  setSelection(selections.STAYS)
                  globalDispatch({ type: 'SET_VESSEL_TYPE', payload: 'STAY' })
                }}
              >
                {t.stays}
              </li>
            </ul>
          </div>

          {/* Set search bar for rentals/stays */}
          {selection === selections.RENTALS ||
          selection === selections.STAYS ? (
            <div className={classes.search_container}>
              {/* Adjust placeholder for window size */}
              {
                windowSize > breakpoint ? (
                  <MapAutocompleteNav
                    placeholder={t.landingSearchPlaceholder.location}
                    onUpdate={onUpdate}
                  />
                ) : (
                  <MapAutocompleteNav
                    placeholder={t.landingSearchPlaceholder.locationAbbrv}
                    onUpdate={onUpdate}
                  />
                )
                // end placeholder adjust
              }
              <Link legacyBehavior href={`/search/${globalState.vesselType}`}>
                <button
                  onClick={setSearchState}
                  className={classes.search_button}
                >
                  <span className={classes.search_link}>{t.search.search}</span>
                </button>
              </Link>
            </div>
          ) : (
            // Set search bar for charter
            <div className={classes.search_container}>
              <div className={classes.placeInputBox}>
                <MapAutocompleteNav
                  placeholder={
                    windowSize > breakpoint
                      ? t.landingSearchPlaceholder.charters.leaving
                      : t.landingSearchPlaceholder.charters.leavingAbbrv
                  }
                  onUpdate={onCharterFromUpdate}
                />
              </div>
              <FontAwesomeIcon
                icon={faExchangeAlt}
                onClick={() => {}}
                style={{
                  marginRight: 10,
                  marginLeft: 10,
                  color: theme.palette.buttonPrimary.main
                }}
              />
              <div className={classes.placeInputBox}>
                <MapAutocompleteNav
                  placeholder={
                    windowSize > breakpoint
                      ? t.landingSearchPlaceholder.charters.going
                      : t.landingSearchPlaceholder.charters.goingAbbrv
                  }
                  onUpdate={onCharterToUpdate}
                />
              </div>
              <Link legacyBehavior href={`/search/${globalState.vesselType}`}>
                <button className={classes.search_button}>
                  <span className={classes.search_link}>{t.search.search}</span>
                </button>
              </Link>
            </div>
          )}
          {/* End search bar */}
        </div>
        <div
          style={{
            marginLeft: '5%',
            marginRight: '5%',
            marginTop: '1%',
            marginBottom: '2%',
            padding: '10px'
          }}
        >
          {recommendationsData
            ? recommendationsData.map((data) => {
                return (
                  <RecommendationBar
                    key={data.id}
                    introductionText={data.introductionText}
                    sectionName={data.sectionName}
                    buttonText={data.buttonText}
                    dataList={data.dataList}
                    windowHeight={windowHeight}
                    vesselType={data.vesselType}
                  />
                )
              })
            : ''}

          <div className={classes.reviews_text}>
            <span>
              What{' '}
              <span className={classes.reviews_text_highlighted}>
                {t.wavez}
              </span>{' '}
              {t.reviewHeader}
            </span>
          </div>
          <div
            style={{
              justifyContent: 'space-evenly'
            }}
          >
            {userReviewsData
              ? userReviewsData.map((data, _id) => {
                  return (
                    <UserReview
                      key={data._id}
                      data={data}
                      isInHomePage={true}
                    />
                  )
                })
              : ''}
          </div>
        </div>
      </>
    )
}

export default WavezHome
