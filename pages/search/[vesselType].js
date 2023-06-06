/* eslint-disable no-useless-concat */
import React, { useState, useEffect, useContext } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import NavBar from "../../components/navbar/navBar"
import ListingCard from "../../components/search/listingCard"
import Button from "@material-ui/core/Button"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"
import Footer from "../../components/footer"
import Typography from "@material-ui/core/Typography"
import { Modal } from "react-responsive-modal"
import Map from "../../components/search/map"
import API from "../api/baseApiIinstance"
import SESSION from "../../sessionService"
import PriceFilter from "../../components/search/priceFilter"
import PassengerFilter from "../../components/search/passengerFilter"
import DurationFilter from "../../components/search/durationFilter"
import MoreFilter from "../../components/search/moreFilter"
import ReactPaginate from "react-paginate"
import styles from "./index.module.css"
import ErrorMessageModal from "../editListing/photos/errorMessageModal"

// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import useGlobalState from "../../store/useGlobalState"
import Context from "../../store/context"
import SearchInput from "../../components/navbar/searchInput"
import {ImageList} from "@material-ui/core"
const breakpoint = 600
const searchBreakPoint = 1100
const tileData = [
    { id: 1, title: "a", image: "https://picsum.photos/200/300" },
    { id: 2, title: "b", image: "https://picsum.photos/200/300" },
    { id: 3, title: "c", image: "https://picsum.photos/200/300" },
    { id: 4, title: "d", image: "https://picsum.photos/200/300" },
    { id: 5, title: "e", image: "https://picsum.photos/200/300" },
    { id: 6, title: "f", image: "https://picsum.photos/200/300" },
    { id: 7, title: "g", image: "https://picsum.photos/200/300" },
    { id: 8, title: "h", image: "https://picsum.photos/200/300" },
    { id: 9, title: "i", image: "https://picsum.photos/200/300" },
    { id: 10, title: "j", image: "https://picsum.photos/200/300" },
    { id: 11, title: "k", image: "https://picsum.photos/200/300" },
    { id: 12, title: "l", image: "https://picsum.photos/200/300" }
]

const locationData = [
    [43, -79],
    [43.521, -79.532],
    [42.9532, -78.952],
    [43.1263, -79.853]
]

const useStyles = makeStyles((theme) => ({
    container: {
        flexGrow: 1,
        [theme.breakpoints.up("sm")]: {
            paddingLeft: 24
        }
    },
    header: {
        marginLeft: 24,
        [theme.breakpoints.up("sm")]: {
            marginLeft: 0,
            fontSize: 14
        },
        [theme.breakpoints.up("xs")]: {
            marginLeft: 20

        }
    },
    gridListContainer: {
        width: "100%",
        [theme.breakpoints.down("xs")]: {
            marginLeft: 24
        }
    },
    gridList: {
        height: "70 vh",
        width: "70 vh"
    },
    filters: {
        marginTop: 15,
        marginLeft: 24,
        [theme.breakpoints.up("sm")]: {
            marginLeft: 0
        }
    },
    filterButton: {
        marginRight: 10,
        marginTop: 10,
        height: 40,
        [theme.breakpoints.down("xs")]: {
            marginTop: '16px'

        }
    },
    filterLabel: {
        [theme.breakpoints.down("xs")]: {
            fontSize: '8px'

        }
    },
    mapButtonContainer: {
        [theme.breakpoints.down("xs")]: {
            display: "none"
        }
    },
    mapContainer: {
        marginLeft: 15,

        [theme.breakpoints.down("xs")]: {
            display: "none"
        }
    },
    mapToggleButton: {
        marginRight: 10,
        marginTop: 10,
        color: theme.palette.background.default,
        float: "right"
    },
    arrowIcon: {
        marginLeft: 10
    },
    customModal: {
        width: "50%",
        minWidth: "300px",
        maxWidth: "600px",
        maxHeight: "890px",
        borderRadius: 10,
        position: "center",
        left: "0%",


        [theme.breakpoints.down("xs")]: {
            margin: "auto",
            width: "98%",
            position: "center"
        }
    }

}))

export default function Search(props) {
    const classes = useStyles()
    const [priceFilterOpen, setPriceFilterOpen] = useState(false)
    const [passFilterOpen, setPassFilterOpen] = useState(false)
    const [durationFilterOpen, setDurationFilterOpen] = useState(false)
    const [moreFilterOpen, setMoreFilterOpen] = useState(false)
    const [windowSize, setWindowSize] = useState(null)
    const [windowHeight, setWindowHeight] = useState(null)
    const defaultCenter = {
        lat: 43.653226,
        lng: -79.3831843
    }
    const [mapCenter, setMapCenter] = useState(defaultCenter)
    const [showMap, setShowMap] = useState(true)
    // filter values
    const [numPassengers, setNumPassengers] = useState(1)
    const [numPassengersShow, setNumPassengersShow] = useState(0)
    const [numPrice, setNumPrice] = useState(100)
    const [numMinPrice, setMNumMinPrice] = useState(10)
    const [numMaxPrice, setMNumMaxPrice] = useState(1000)
    const [locationData, setLocationData] = useState([])
    // Create useState for send data to sibling ListingCard component
    const { globalState, globalDispatch } = useContext(Context)

    //Pagination
    const [pageNumber, setPageNumber] = useState(0)
    const [categories, setCategories] = useState([])
    const [features, setFeatures] = useState([])
    const router = useRouter()
    const { locale } = router
    const t = locale === 'en' ? en : fr

    const [checkedCategories, setCheckedCategories] = useState({})
    const [checkedFeatures, setCheckedFeatures] = useState({})

    const [categoryFilters, setCategoryFilters] = useState([])
    const [featureFilters, setFeatureFilters] = useState([])

    const [invalidCharterSearchOpen, setInvalidCharterSearchOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    const closePriceFilter = () => {
        setPriceFilterOpen(false)
    }

    const closePassFilter = () => {
        setPassFilterOpen(false)
    }

    const closeDurationFilter = () => {
        setDurationFilterOpen(false)
    }
    const closeMoreFilter = () => {
        setMoreFilterOpen(false)
    }
    //Calling Vessel Search Api
    const apiCaller = (simpleFilter) => {
        API()
            .post("/vessel/search", simpleFilter, {
                header: {
                    accept: "application/json"
                }
            })
            .then((response) => {

                if ((response.status = 200)) {
                    setLocationData(response.data)
                }
            })
            .catch((err) => {
            })
    }
    const createNewSearch = () => {
        const createNewSearch = {
            vesselType: router.query?.vesselType === "" ? "CHARTER" : router.query?.vesselType,
            searchLocation: (globalState.addSearchTerm === "" ? SESSION.getLocation() : globalState.addSearchTerm),
            locationFrom: globalState.addCharterFrom,
            locationTo: globalState.addCharterTo,
            minPrice: numMinPrice,
            maxPrice: numMaxPrice,
            passengers: numPassengers,
            // durationType: globalState.durationType,
            // durationFlexible: {
            //     type: "WEEKEND",
            //     value: "string",
            // },
            // durationFrom: globalState.durationFilter[0]?.startDate ? globalState.durationFilter[0].startDate.toISOString() : "",
            // durationTo: globalState.durationFilter[0]?.endDate ? globalState.durationFilter[0].endDate.toISOString() : "",
            categories: categoryFilters,
            features: featureFilters,
            priceType: (globalState.searchSliderPriceType && globalState.searchSliderPriceType !== "") ? globalState.searchSliderPriceType : 'HOUR'
        }
        //  console.log("createNewSearch", createNewSearch)
        
        apiCaller(createNewSearch)
    }

    useEffect(() => {
        if (isMounted && router.query.vesselType === "CHARTER" && (globalState.addCharterFrom || globalState.addCharterTo) && (!globalState.addCharterFrom || !globalState.addCharterTo)) {
            setInvalidCharterSearchOpen(true)
        } else {
            createNewSearch()
        }
    }, [globalState.addSearchTerm, globalState.addCharterFrom, globalState.addCharterTo, numPassengers, numMinPrice, numMaxPrice, globalState.durationFilter, categoryFilters, featureFilters, globalState.searchSliderPriceType])

    useEffect(() => {
        setIsMounted(true)
        getCategoriesAndFeatures()
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

    const getCategoriesAndFeatures = () => {
        API()
            .get("vessel/category")
            .then(res => {
                let checkedCat = {}
                res.data.forEach(cat => {
                    checkedCat = {...checkedCat, [cat._id]: false}
                })
                setCheckedCategories(checkedCat)
                setCategories(res.data)
            })
            .catch(err => {
                console.log(`There was an error fetching categories ${err}`)
            })

        API()
            .get("vessel/feature")
            .then(res => {
                let checkedFeature = {}
                res.data.forEach(feat => {
                    checkedFeature = {...checkedFeature, [feat._id]: false}
                })
                setCheckedFeatures(checkedFeature)
                setFeatures(res.data)
            })
            .catch(err => {
                console.log(`There was an error fetching features ${err}`)
            })
    }

    const handleMoreFiltersSave = (clearFilters) => {
        setMoreFilterOpen(false)
        const featuresArray = Object.entries(checkedFeatures)
        const categoriesArray = Object.entries(checkedCategories)
        if (!clearFilters) {
            const features = []
            const categories = []
            categoriesArray.forEach(cat => {
                if (cat[1]) {
                    categories.push(cat[0])
                }
            })
            featuresArray.forEach(feat => {
                if (feat[1]) {
                    features.push(feat[0])
                }
            })
            setCategoryFilters(categories)
            setFeatureFilters(features)
        } else {
            let checkedFeatObj = {}
            featuresArray.forEach(featur => {
                checkedFeatObj = {...checkedFeatObj, [featur[0]]: false}
            })
            setCheckedFeatures(checkedFeatObj)
            let checkedCatObj = {}
            categoriesArray.forEach(categ => {
                checkedCatObj = {...checkedCatObj, [categ[0]]: false}
            })
            setCheckedCategories(checkedCatObj)
            setCategoryFilters([])
            setFeatureFilters([])
        }
        console.log(categories)
        console.log(features)
    }

    //Pagination

    const cardsPerPage = 8
    const pageCount = Math.ceil(locationData.length / cardsPerPage)
    const pagesVisited = pageNumber * cardsPerPage
    let displayCards = ""

    displayCards = locationData.slice(pagesVisited, pagesVisited + cardsPerPage).map((item) => (
        <Grid item xs={12} sm={showMap ? 12 : 6} md={showMap ? 6 : 4}
            lg={showMap ? 6 : 3} key={item._id}>
            <ListingCard
                vessel={item}
                id={item._id}
                type={item.vesselType}
                image={item.images.length === 0 ? "/assets/images/maskGroup.png" : item.images[0].imageURL}
                title={item.title === "" ? "No Title Provided" : item.title}
                price={router.query?.vesselType === 'RENTAL' ? (item.vesselPricing?.perHour?.amount > 0 ? `$${  item.vesselPricing?.perHour?.amount  }/` + `${t.search.filter.hour}` : `$${  0  }/` + `${t.search.filter.hour}`) : (item.vesselPricing?.perDay?.amount > 0 ? `$${  item.vesselPricing?.perDay?.amount  }/${t.search.filter.day}` : `$${  0  }/${t.search.filter.day}`)}
                passengers={item.numberOfPassengers === 0 ? "0" : item.numberOfPassengers}
            />
        </Grid>
    ))

    const changePage = ({ selected }) => {
        setPageNumber(selected)
    }

    return (
        <>
            <NavBar search_bar={true} />
            <div className={classes.container}>
                {/* Main Grid */}
                <Grid container item direction="row" xs={12} spacing={3}>
                    {/* Top Buttons*/}
                    <Grid xs={false} item container lg={1} />
                    <Grid container item direction="row" xs={12} lg={11} className={classes.filters}>
                        {/* Filter Buttons */}
                        {windowSize > searchBreakPoint ? "" : <SearchInput />}
                        <Grid item xs={12} sm={8}>
                            <Button data-testid="searchPriceBtn" className={classes.filterButton} variant="outlined"
                                onClick={() => setPriceFilterOpen(true)}>
                                <Typography className={classes.filterLabel} variant="body2" color="textPrimary">
                                    {numMinPrice !== 0 || numMaxPrice !== 0 ? `${t.searchResultScreen.maxPrice}: $${numMinPrice} - $${numMaxPrice}` : `${t.searchResultScreen.maxPrice}`}
                                </Typography>
                                <ArrowDropDownIcon className={classes.arrowIcon} />
                            </Button>
                            <Button data-testid="searchPassengerBtn" className={classes.filterButton} variant="outlined"
                                onClick={() => setPassFilterOpen(true)}>
                                <Typography className={classes.filterLabel} variant="body2" color="textPrimary">
                                    {numPassengersShow !== 0 ?
                                        (
                                            (
                                                numPassengersShow === 1 ? (`${numPassengersShow} ${t.search.filter.passengers}`
                                                ) :
                                                    `${numPassengersShow} ${t.search.filter.passengers}`)
                                        ) : `${t.searchResultScreen.numPassengers}`
                                    }

                                </Typography>
                                <ArrowDropDownIcon className={classes.arrowIcon} />
                            </Button>
                            {/* <Button data-testid="searchDurationBtn" className={classes.filterButton} variant="outlined"
                                onClick={() => setDurationFilterOpen(true)}>
                                <Typography className={classes.filterLabel} variant="body2" color="textPrimary">
                                    {t.searchResultScreen.addDuration}
                                </Typography>
                                <ArrowDropDownIcon className={classes.arrowIcon} />
                            </Button> */}
                            {/*More Filter Button*/}
                            <Button className={classes.filterButton} variant="outlined" onClick={() => setMoreFilterOpen(true)}>
                                <Typography className={classes.filterLabel} variant="body2" color="textPrimary">
                                    {t.searchResultScreen.more}
                                </Typography>
                                <ArrowDropDownIcon className={classes.arrowIcon} />
                            </Button>
                        </Grid>
                        {/* Map Toggle Button */}
                        <Grid item xs={false} sm={2} className={classes.mapButtonContainer}>
                            <Button data-testid="searchToggleMapBtn"
                                className={classes.mapToggleButton}
                                onClick={() => {
                                    setShowMap((currentVal) => !currentVal)
                                }}
                                variant="contained"
                                color="primary"
                            >
                                <Typography variant="body2">{showMap ? "Hide Map" : "Show Map"}</Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={2} />
                        {/* Filters */}
                        <Grid item xs={12} sm={6}>
                            {/* Price Filter */}
                            <Modal
                                center={true}
                                showCloseIcon={true}
                                open={priceFilterOpen}
                                onClose={closePriceFilter}
                                aria-labelledby="Max Price Filter Box"
                                aria-describedby="Max Price Filter Box"
                                classNames={{
                                    modal: classes.customModal
                                }}
                            >
                                <PriceFilter
                                    setNumPrice={(value) => setNumPrice(value)}
                                    setMNumMinPrice={setMNumMinPrice}
                                    setMNumMaxPrice={setMNumMaxPrice}
                                    closeModal={() => {
                                        closePriceFilter()
                                    }}
                                />
                            </Modal>
                            {/* Passengers Filter */}
                            <Modal
                                center={true}
                                showCloseIcon={true}
                                open={passFilterOpen}
                                onClose={closePassFilter}
                                aria-labelledby="Number of Passengers Filter Box"
                                aria-describedby="Number of Passengers Filter Box"
                                classNames={{
                                    modal: classes.customModal
                                }}
                            >
                                <PassengerFilter
                                    numPassengers={numPassengers}
                                    setNumPassengers={(value) => setNumPassengers(value)}
                                    setNumPassengersShow={(value) => setNumPassengersShow(value)}
                                    closeModal={() => {
                                        closePassFilter()
                                    }}
                                />
                            </Modal>
                            {/*    More filter*/}
                            <Modal
                                center={true}
                                showCloseIcon={true}
                                open={moreFilterOpen}
                                onClose={closeMoreFilter}
                                aria-labelledby="More Filter Box"
                                aria-describedby="More Filter Box"
                                classNames={{
                                    modal: classes.customModal
                                }}
                            >
                                <MoreFilter
                                    // numPassengers={numPassengers}
                                    // setNumPassengers={(value) => setNumPassengers(value)}
                                    // setNumPassengersShow={(value) => setNumPassengersShow(value)}
                                    categories={categories}
                                    features={features}
                                    checkedCategories={checkedCategories}
                                    checkedFeatures={checkedFeatures}
                                    setCheckedCategories={setCheckedCategories}
                                    setCheckedFeatures={setCheckedFeatures}
                                    onSave={handleMoreFiltersSave}
                                    closeModal={() => {
                                        closeMoreFilter()
                                    }}
                                />
                            </Modal>
                            {/* Invalid Search Modal */}
                            <Modal
                                center={true}
                                showCloseIcon={true}
                                open={invalidCharterSearchOpen}
                                onClose={() => setInvalidCharterSearchOpen(false)}
                                aria-labelledby="Invalid Search Box"
                                aria-describedby="Invalid Search Box"
                                classNames={{
                                    modal: classes.customModal
                                }}
                            >
                                <ErrorMessageModal message={t.search.selectCharterError} closeModal={() => setInvalidCharterSearchOpen(false)} />
                            </Modal>

                            {/* Duration Filter */}
                            {/* <Modal
                                center={true}
                                showCloseIcon={true}
                                open={durationFilterOpen}
                                onClose={closeDurationFilter}
                                aria-labelledby="Duration Filter Box"
                                aria-describedby="Duration Filter Box"
                                classNames={{
                                    modal: classes.customModal,
                                }}
                            >
                                <DurationFilter
                                    closeModal={() => {
                                        closeDurationFilter();
                                    }}
                                />
                            </Modal> */}
                        </Grid>
                    </Grid>
                    {/* Header */}
                    <Grid xs={false} item container sm={1} />
                    <Grid item xs={12} lg={11} className={classes.header}>
                        <Typography color="textPrimary" variant="h4">
                            {globalState.addSearchTerm === "" && router.query?.vesselType === "" ? `${t.welcome}` : ``}
                            {router.query?.vesselType === 'RENTAL' ? ((!globalState.addSearchTerm ? `Top ${t.rentals}` : (`Top ${t.rentals} ${t.near}  ${globalState.addSearchTerm}`))) : ""}
                            {router.query?.vesselType === 'STAY' ? ((!globalState.addSearchTerm ? `Top ${" "} ${t.stays}` : (`Top ${t.stays} ${t.near} ${globalState.addSearchTerm}`))) : ""}
                            {router.query?.vesselType === 'CHARTER' ? ((!globalState.addCharterTo ? `Top ${t.charters}` : (`Top ${t.charters} ${t.from} ${globalState.addCharterFrom} ${t.to} ${globalState.addCharterTo}`))) : ""}
                        </Typography>
                    </Grid>
                    {/* Spacing */}
                    <Grid xs={false} item ls={1} />
                    {/* Card Grid */}
                    <Grid container item xs={12}>
                        <Grid xs={false} item ls={1} />
                        <Grid xs={false} item lg={1} />
                        <Grid container direction="row" item xs={12} sm={showMap ? 5 : 12} lg={showMap ? 4 : 10}
                            spacing={3}>
                            <div className={classes.gridListContainer}>
                                {/* Render Cards */}
                                <ImageList className={classes.gridList} gap={3} rowHeight={"auto"}>
                                    {displayCards}
                                </ImageList>
                            </div>
                        </Grid>
                        {/* Map */}
                        {showMap ? (
                            <>
                                <Grid item xs={false} sm={7} lg={6} className={classes.mapContainer}>
                                    <Map locationData={locationData} center={mapCenter} />

                                </Grid>
                                {/* Spacing */}
                                <Grid xs={false} item lg={1} />
                            </>
                        ) : null}
                    </Grid>
                </Grid>
                {/* Pagination */}
                <div style={{ marginTop: '50px' }}>
                    <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        pageCount={pageCount}
                        onPageChange={changePage}
                        containerClassName={styles.paginationBttns}
                        previousLinkClassName={"previousBttn"}
                        nextLinkClassName={"nextBttn"}
                        disabledClassName={styles.paginationDisabled}
                        activeClassName={styles.paginationActive}
                    />
                </div>
            </div>
            <Footer />
        </>
    )
}
