import React, { useContext, useEffect } from "react"
import API from "../../../pages/api/baseApiIinstance"
import Context from '../../../store/context'
import buildAddress from './buildAddress'
import clearForm from './clearForm'

// create array of destination objects for post submission
const buildDestinations = (globalState) => {
    const destinations = [...globalState.addListDestination]
    const result = []
    // return if array is empty
    if (destinations === [undefined]) {
        return
    }
    // add each destination to the array
    destinations.map((destination, index) => {
        // return if current destination is blank
        if (!destination) {
            return
        }

        result.push(buildAddress(destination.address_components, globalState.addListDestinationDisplay[index]))
    })
    return result
}

const buildDestinationLatLngs = (globalState) => {
    const coordinateArr = [...globalState.addListDestinationLatLng]
    const resultArr = []
    // return if array is empty
    if (coordinateArr === [undefined]) {
        return
    }
    // add each coordinate to the array
    coordinateArr.map((coordinate, index) => {
        console.log("Coordinate: ", coordinate)
        // return if current coordinate is blank
        if (coordinate !== undefined) {
            resultArr.push({ latitude: coordinate[0].toString(), longitude: coordinate[1].toString() })
        }
    })
    console.log("Coordinate array: ", resultArr)
    return resultArr
}

const createRequest = (token, globalState, responseSuccessful = () => { }, clearFormData = () => { }, setError) => {
    console.log("Token: ", token)
    console.log("Global state: ", globalState)

    console.log("Submitting listing")
    // build categoryId list
    const categoryIdList = []
    for (let i = 0; i <= globalState.addListCategories.length - 1; i++) {
        categoryIdList.push(globalState.addListCategories[i]._id)
    }
    // build address
    const addressObj = buildAddress(globalState.addListLocation.address_components)
    // build destinations
    const destinationArr = buildDestinations(globalState)
    // build destination coordinate array
    const destinationLatLngArr = buildDestinationLatLngs(globalState)
    // build listing
    const listing = {
        numberOfPassengers: globalState.addListPassengers,
        vesselLocation: {
            longitude: globalState.addListLatLng[1].toString(),
            latitude: globalState.addListLatLng[0].toString()
        },
        destinationLocation: destinationLatLngArr,
        vesselAddress: addressObj,
        rawAddress: globalState.addListLocationDisplay,
        destinationAddress: destinationArr,
        title: globalState.addListVesselMake,
        vesselYear: Number(globalState.addListVesselYear),
        vesselType: globalState.addListService.toUpperCase(),
        vesselCategory: categoryIdList,
        vesselBrand: globalState.addListVesselMake
    }
    console.log("Listing to submit: ", listing)
    // create post request
    API()
        .post("charters", listing, {
            headers: {
                authorization: `Bearer ${  token}`
            }
        })
        .then((response) => {
            console.log("response is ", response)
            //forward to user listings page
            if (response.status = 200) {
                clearForm(clearFormData)
                responseSuccessful()
            }
        })
        .catch((e) => {
            setError(e)
        })
}

export default createRequest