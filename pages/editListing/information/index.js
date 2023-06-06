import React, { Component, useState, useEffect, useContext } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Autocomplete from "@material-ui/lab/Autocomplete"
import CategoryCheckbox from "../../../components/editListing/categoryCheckbox"
import NavBar from "../../../components/navbar/navBar"
import {
  Grid,
  Container,
  Typography,
  TextField,
  TextareaAutosize,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button
} from "@material-ui/core"
import FormHelperText from '@material-ui/core/FormHelperText'
import Hint from "../../addList/hint"
import MapAutocomplete from "../../../components/editListing/mapAutocomplete"
import MapCharterDestinations from "../../../components/editListing/mapCharterDestinations"
import Map from "../../../components/search/map"
import Counter from '../../../pages/addList/counter'
import API from '../../../pages/api/baseApiIinstance'
import Session from "../../../sessionService"
import buildAddress from "../../../components/addList/api/buildAddress"
import MobileHint from "../../../components/addList/mobileHint"
import { Modal } from "react-responsive-modal"
// i18n
import { useRouter } from "next/router"
import en from "../../../locales/en.js"
import fr from "../../../locales/fr.js"
import theme from "../../../src/theme"

const useStyles = makeStyles((theme) => ({
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
      width: "40vw",
      top: 160
    }
  },
  input: {
    width: "100%"
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    paddingTop: 10
  },
  textArea: {
    width: "100%"
  },
  trailerOrWater: {
    width: "100%"
  },
  botPadding: {
    paddingBottom: 120
  },
  topPadding: {
    paddingTop: 110
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
  text: {
    font: "Roboto",
    color: theme.palette.title.matterhorn,
    fontSize: 24,
    fontWeight: 500,
    paddingTop: 20
  },
  counterText: {
    font: "Roboto",
    color: theme.palette.text.grey,
    fontSize: 24
  },
  hintModal: {
    width: "90vw",
    borderRadius: 10,
    position: "fixed",
    left: 0
  }
}))

const ListingInformation = ({ listingStartValue, getListingInfo, nextPage, setUnsavedChanges, onSubmit, hintIsOpen, setHintIsOpen }) => {
  const token = Session.getToken("Wavetoken")
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  const [listing, setListing] = useState(listingStartValue) // full listing object
  const [title, setTitle] = useState("") // data for all listings
  const [description, setDescription] = useState("")
  const [placement, setPlacement] = useState("")
  const [trailerPlateNumber, setTrailerPlateNumber] = useState("")
  const [categories, setCategories] = useState([])
  const [categoryIds, setCategoryIds] = useState("")
  const [location, setLocation] = useState(undefined)
  const [locationLatLng, setLocationLatLng] = useState(undefined)
  const [locationDisplay, setLocationDisplay] = useState(undefined)
  const [destinationErrors, setDestinationErrors] = useState("") // unique to charters
  const [destination, setDestination] = useState([undefined])
  const [destinationLatLng, setDestinationLatLng] = useState([undefined])
  const [destinationDisplay, setDestinationDisplay] = useState([undefined])
  const [numBathrooms, setNumBathrooms] = useState(1) // unique to stays
  const [numBeds, setNumBeds] = useState(1)
  const [numKitchens, setNumKitchens] = useState(1)
  const defaultCenter = { lat: 43.653226, lng: -79.3831843 } // map center and markers - must be after destination and location
  const [mapCenter, setMapCenter] = useState(defaultCenter)
  const [allMarkers, setAllMarkers] = useState([...destinationLatLng, locationLatLng])
  const [titleIsValid, setTitleIsValid] = useState(true) // validation
  const [descriptionIsValid, setDescriptionIsValid] = useState(true)
  const [placementIsValid, setPlacementIsValid] = useState(true)
  const [categoriesIsValid, setCategoriesIsValid] = useState(true)
  const [locationIsValid, setLocationIsValid] = useState(true)
  const [destinationIsValid, setDestinationIsValid] = useState(true)
  const [trailerPlateIsValid, setTrailerPlateIsValid] = useState(true)

  const updateCategories = (newValue) => {
    console.log("New value for categories: ", newValue)
    setCategories(newValue)
    setCategoriesIsValid(true)
  }

  const onUpdateLocation = (newValue, latLng, dispValue) => {
    setLocationIsValid(true)
    if (newValue !== undefined && latLng !== undefined) {
      setMapCenter({ lat: latLng[0], lng: latLng[1] })
    }
    console.log("New rawaddress: ", dispValue)
    console.log("New location: ", newValue)
    console.log("New latLng: ", latLng)
    setLocation(newValue)
    setLocationLatLng(latLng)
    setLocationDisplay(dispValue)
    setUnsavedChanges(true)
  }

  const onUpdateDestination = (newDestination, newDestinationDisp, newDestinationLatLng) => {
    setDestinationIsValid(true)
    console.log("New rawaddress: ", newDestinationDisp)
    console.log("New destination: ", newDestination)
    console.log("New destinationLatLng: ", newDestinationLatLng)
    setDestination(newDestination)
    setDestinationLatLng(newDestinationLatLng)
    setDestinationDisplay(newDestinationDisp)
    setUnsavedChanges(true)
  }

  useEffect(() => { // set marker locations when location or destination changes
    if (locationLatLng) {
      console.log("Updating all markers to: ", [...destinationLatLng, locationLatLng])
      setAllMarkers([...destinationLatLng, locationLatLng])
    } else {
      console.log("Updating all markers to: ", [...destinationLatLng])
      setAllMarkers([...destinationLatLng])
    }
  }, [locationLatLng, destinationLatLng])

  useEffect(() => {
    getListingInfo() // call for updated information
  }, [])

  const setAllValid = () => {
    setTitleIsValid(true)
    setDescriptionIsValid(true)
    setPlacementIsValid(true)
    setCategoriesIsValid(true)
    setLocationIsValid(true)
    setDestinationIsValid(true)
    setTrailerPlateIsValid(true)
  }

  useEffect(() => { // Update listing values after API GET finishes updating
    setUnsavedChanges(false)
    console.log("Listingstartvalue: ", listingStartValue)
    setListing(listingStartValue)
    setTitle(listingStartValue?.title)
    setDescription(listingStartValue?.description)
    setPlacement(listingStartValue?.vesselPlacement)
    mapCategoryIds(listingStartValue?.vesselCategory)
    setLocation(listingStartValue?.vesselAddress)
    listingStartValue?.vesselLocation ? setLocationLatLng([listingStartValue?.vesselLocation?.latitude, listingStartValue?.vesselLocation?.longitude]) : setLocationLatLng(undefined)
    setLocationDisplay(listingStartValue?.rawAddress)
    setTrailerPlateNumber(listingStartValue?.trailerPlateNumber)

    setDestination(listingStartValue?.destinationAddress || [undefined])
    setDestinationLatLng(listingStartValue?.destinationLocation || [undefined])
    setDestinationDisplay(listingStartValue?.destinationAddress?.map((dest, index) => {
      return (dest?.rawAddress)
    }))

    setNumBathrooms(listingStartValue?.numberOfBathrooms)
    setNumBeds(listingStartValue?.numberOfBeds)
    setNumKitchens(listingStartValue?.numberOfKitchens)

    setAllMarkers([...destinationLatLng, locationLatLng])
  }, [listingStartValue])

  const mapCategoryIds = (categoryList) => {
    const categoryIdList = []
    categoryList?.map((category) => {
      categoryIdList.push(category?._id)
    })
    setCategoryIds(categoryIdList)
  }

  const saveChanges = () => {
    const updatedListing = buildListing()
    validateChanges(updatedListing) && submitChanges(updatedListing)
  }

  const buildDestinations = () => {  // format destinations
    if (destination === [undefined]) { return }
    const resultArr = []
    destination?.map((dest, index) => {
      if (dest === undefined) { return } // return if current destination is blank
      console.log("dest: ", dest)
      if (dest?.address_components) { // format from front-end
        resultArr.push(buildAddress(dest.address_components, destinationDisplay[index]))
      } else { // already formatted for back-end
        resultArr.push(dest)
      }
    })
    return resultArr
  }
  const buildDestinationLatLngs = () => {
    const resultArr = []
    if (destinationLatLng === [undefined]) { return }
    destinationLatLng.map((coordinate, index) => {
      if (coordinate && Array.isArray(coordinate)) { // array will come from front-end
        resultArr.push({ latitude: coordinate[0].toString(), longitude: coordinate[1].toString() })
      } else if (coordinate) { // object will come from back-end
        resultArr.push({ latitude: coordinate.latitude, longitude: coordinate.longitude })
      }
    })
    console.log("Coordinate array: ", resultArr)
    return resultArr
  }

  const buildListing = () => {
    let result
    const vesselCategory = [] // grab array of ids from array of category objects
    for (let i = 0; i <= categories.length - 1; i++) {
      vesselCategory.push(categories[i]?._id)
    }
    // eslint-disable-next-line prefer-const
    result = {
      vesselLocation: {
        longitude: locationLatLng?.[1]?.toString(),
        latitude: locationLatLng?.[0]?.toString()
      },
      vesselAddress: (location?.address_components ? buildAddress(location.address_components) : location),
      rawAddress: locationDisplay,
      title,
      description,
      vesselCategory,
      vesselPlacement: placement
    }
    if (listing?.vesselType === "CHARTER") {
      result.destinationLocation = buildDestinationLatLngs()
      result.destinationAddress = buildDestinations()
    } else if (listing?.vesselType === "STAY") {
      result.numberOfBathrooms = numBathrooms
      result.numberOfBeds = numBeds
      result.numberOfKitchens = numKitchens
    }
    { placement === "Trailer" ? result.trailerPlateNumber = trailerPlateNumber : result.trailerPlateNumber = "" }
    console.log("Updated listing to verify: ", result)
    return result
  }

  const validateChanges = (updatedListing) => {
    let formIsValid = true

    { !updatedListing?.title ? (formIsValid = false, setTitleIsValid(false)) : null }
    { !updatedListing?.description ? (formIsValid = false, setDescriptionIsValid(false)) : null }
    if (listing?.vesselType === "RENTAL") {
      { !updatedListing?.vesselPlacement ? (formIsValid = false, setPlacementIsValid(false)) : null }
    }
    { (!updatedListing?.vesselCategory || updatedListing.vesselCategory.length === 0) ? (formIsValid = false, setCategoriesIsValid(false)) : null }
    { !updatedListing?.vesselLocation?.longitude ? (formIsValid = false, setLocationIsValid(false)) : null }
    { !updatedListing?.vesselLocation?.latitude ? (formIsValid = false, setLocationIsValid(false)) : null }
    { !updatedListing?.vesselAddress ? (formIsValid = false, setLocationIsValid(false)) : null }
    { !updatedListing?.rawAddress ? (formIsValid = false, setLocationIsValid(false)) : null }
    {
      (listing?.vesselType === "CHARTER" && (!updatedListing?.destinationAddress?.some(destination => destination !== undefined) || updatedListing?.destinationAddress?.length === 0 || updatedListing?.destinationAddress === [undefined]))
        ? (formIsValid = false, setDestinationIsValid(false)) : null
    }
    { (updatedListing?.vesselPlacement === "Trailer" && !updatedListing?.trailerPlateNumber) ? (formIsValid = false, setTrailerPlateIsValid(false)) : null }
    return formIsValid
  }

  const submitChanges = (updatedListing) => {
    API()
      .put(`${listing.vesselType.toLowerCase()  }s/${  listing._id}`, updatedListing, {
        headers: {
          authorization: `Bearer ${  token}`
        }
      })
      .then((response) => {
        if (response.status = 200) {
          onSubmit(true)
          setUnsavedChanges(false)
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
            title: t.editListing.vesselInformation.title,
            hint:
              <div>
                <ul>
                  <li>{t.editListing.vesselInformation.hint1p1}</li>
                  <li>{t.editListing.vesselInformation.hint1p2}</li>
                </ul>
              </div>
          },
          {
            title: t.editListing.vesselInformation.description,
            hint:
              <div>
                <ul>
                  <li>{t.editListing.vesselInformation.hint2p1}</li>
                  <li>{t.editListing.vesselInformation.hint2p2}</li>
                  <li>{t.editListing.vesselInformation.hint2p3}</li>
                </ul>
              </div>
          }
          ]}
            closeHint={() => setHintIsOpen(false)} />
          {/* <MobileHint content={[{ hint: t.editListing.vesselInformation.hint1, title: t.editListing.vesselInformation.title }, { hint: t.editListing.vesselInformation.hint2, title: t.editListing.vesselInformation.description }]} closeHint={() => setHintIsOpen(false)} /> */}
        </Modal>
        <Grid container className={classes.root}>
          <Grid container item xs={12} sm={6}>
            <Grid item xs={1} md={4} />
            <Grid item xs={10} sm={11} md={8} >
              <div className={classes.topPadding} />
              {/* Title */}
              <p className={classes.title}>{t.editListing.vesselInformation.title}</p>
              <TextField
                inputProps={{ "data-testid": "title" }}
                className={classes.input}
                value={title || ""}
                onChange={(event) => { setTitle(event.target.value), setUnsavedChanges(true), setTitleIsValid(true) }}
                size='small'
                variant='outlined'
                placeholder={t.addListStep3.makePlaceholder}
                error={!titleIsValid}
              />
              <FormHelperText error> {!titleIsValid ? t.editListing.vesselInformation.errorTitle : null} </FormHelperText>
              {/* Description */}
              <p className={classes.title}>{t.editListing.vesselInformation.description}</p>
              <TextField
                inputProps={{ "data-testid": "description", maxLength: 1000 }}
                className={classes.textArea}
                multiline
                rows={4}
                value={description || ""}
                onChange={(event) => { setDescription(event.target.value), setUnsavedChanges(true), setDescriptionIsValid(true) }}
                variant='outlined'
                placeholder={t.editListing.vesselInformation.description}
                error={!descriptionIsValid}
              />
              <FormHelperText error> {!descriptionIsValid ? t.editListing.vesselInformation.errorDescription : null} </FormHelperText>
              {/* Placement */}
              {listing?.vesselType === "RENTAL" &&
                <>
                  <p className={classes.title}>
                    {t.editListing.vesselInformation.placement}
                  </p>
                  <FormControl className={classes.trailerOrWater} error={!placementIsValid}>
                    <Select
                      inputProps={{ "data-testid": "placement" }}
                      variant="outlined"
                      value={placement || ""}
                      onChange={(event) => { setPlacement(event.target.value), setUnsavedChanges(true), setPlacementIsValid(true) }}
                    >
                      <MenuItem value={"Trailer"}>{t.editListing.vesselInformation.trailer}</MenuItem>
                      <MenuItem value={"Water"}>{t.editListing.vesselInformation.water}</MenuItem>
                    </Select>
                    <FormHelperText>{!placementIsValid ? t.editListing.vesselInformation.errorPlacement : null}</FormHelperText>
                  </FormControl>
                  {placement === "Trailer" &&
                    <>
                      <p className={classes.title}>{t.editListing.vesselInformation.trailerPlate}</p>
                      <TextField
                        inputProps={{ "data-testid": "trailerPlateNumber" }}
                        className={classes.input}
                        value={trailerPlateNumber || ""}
                        onChange={(event) => { setTrailerPlateNumber(event.target.value), setUnsavedChanges(true), setTrailerPlateIsValid(true) }}
                        variant='outlined'
                        placeholder={t.editListing.vesselInformation.trailerPlate}
                        error={!trailerPlateIsValid}
                      />
                      <FormHelperText error> {!trailerPlateIsValid ? t.editListing.vesselInformation.errorTrailerPlate : null} </FormHelperText>
                    </>
                    }
                </>
                }
              {/* Categories */}
              <p className={classes.title}>
                {/* Please choose a category for your listing */}
                {t.addListStep1.chooseCategory}
              </p>
              <CategoryCheckbox service={listingStartValue?.vesselType} startingIds={categoryIds} categoriesIsValid={categoriesIsValid} categories={categories} updateCategories={updateCategories} setUnsavedChanges={() => setUnsavedChanges(true)} />
              {/* Location */}
              <p className={classes.title}>{t.addListStep2.locationLabel}</p>
              <MapAutocomplete inputWidth={"100%"} locationIsValid={locationIsValid} onUpdate={onUpdateLocation} restoreValue={locationDisplay} />
              {/* Charter Destinations */}
              {listing !== undefined && listing.vesselType === "CHARTER" &&
                <MapCharterDestinations
                  destinationIsValid={destinationIsValid}
                  destination={destination}
                  destinationLatLng={destinationLatLng}
                  destinationDisplay={destinationDisplay}
                  setMapCenter={setMapCenter}
                  updateDestination={onUpdateDestination}
                  inputWidth={"calc(100% - 70px"}
                />
              }
              <br />
              <br />
              {/* Map */}
              <div style={{ width: "100%", height: "40vh" }}>
                <Map locationData={allMarkers} center={mapCenter} />
              </div>
              {/* Charter Counters */}
              {listing?.vesselType === "STAY" ?
                (<>
                  <p className={classes.text}>{t.addListStep1.washLabel}</p>
                  <div className={classes.counterText}>
                    {t.addListStep1.numWashrooms}
                    <span style={{ float: "right" }}>
                      <Counter
                        onMinus={() => { setNumBathrooms((current) => Math.max(current - 1, 1)), setUnsavedChanges(true) }}
                        onPlus={() => { setNumBathrooms((current) => Math.min(current + 1, 20)), setUnsavedChanges(true) }}
                        displayValue={numBathrooms} />
                    </span>
                  </div>

                  <p className={classes.text}>{t.addListStep1.bedLabel}</p>
                  <div className={classes.counterText}>
                    {t.addListStep1.numBeds}
                    <span style={{ float: "right" }}>
                      <Counter
                        onMinus={() => { setNumBeds((current) => Math.max(current - 1, 1)), setUnsavedChanges(true) }}
                        onPlus={() => { setNumBeds((current) => Math.min(current + 1, 20)), setUnsavedChanges(true) }}
                        displayValue={numBeds} />
                    </span>
                  </div>

                  <p className={classes.text}>{t.addListStep1.kitchLabel}</p>
                  <div className={classes.counterText}>
                    {t.addListStep1.numKitchenettes}
                    <span style={{ float: "right", marginBottom: 100 }}>
                      <Counter
                        onMinus={() => { setNumKitchens((current) => Math.max(current - 1, 1)), setUnsavedChanges(true) }}
                        onPlus={() => { setNumKitchens((current) => Math.min(current + 1, 20)), setUnsavedChanges(true) }}
                        displayValue={numKitchens} />
                    </span>
                  </div>
                </>)
                : (null)}
              <div className={classes.botPadding} />
              <Grid item xs={1} sm={false} />
            </Grid>
          </Grid>

          {/* Hints */}
          <Grid container item xs={false} sm={6} className={classes.hintContainer}>
            <Grid item xs={false} sm={1} md={2} />
            <Grid item xs={false} sm={10} md={8} className={classes.hintBlue}>
              <div className={classes.hint}>
                <Hint
                  title={t.editListing.vesselInformation.title}
                  content={
                    <div>
                      <ul>
                        <li>{t.editListing.vesselInformation.hint1p1}</li>
                        <li>{t.editListing.vesselInformation.hint1p2}</li>
                      </ul>
                    </div>
                  }
                />
                <Hint
                  title={t.editListing.vesselInformation.description}
                  content={
                    <div>
                      <ul>
                        <li>{t.editListing.vesselInformation.hint2p1}</li>
                        <li>{t.editListing.vesselInformation.hint2p2}</li>
                        <li>{t.editListing.vesselInformation.hint2p3}</li>
                      </ul>
                    </div>
                  }
                />
              </div>
            </Grid>
            <Grid item xs={false} sm={1} md={2} />
          </Grid>
        </Grid >
        {/* Bottom Div Buttons */}
        <Grid container item xs={12} className={classes.bottomDiv} >
          <Grid item xs={1} sm={false} md={2} />
          <Grid item xs={10} sm={6} md={4} className={classes.saveDiv}>
            <Button
              onClick={() => { getListingInfo(), setAllValid() }}
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
              onClick={() => saveChanges()}
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

export default ListingInformation
