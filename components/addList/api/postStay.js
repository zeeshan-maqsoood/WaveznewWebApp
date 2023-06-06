import React, { useContext, useEffect } from "react"
import API from "../../../pages/api/baseApiIinstance"
import Context from '../../../store/context'
import buildAddress from './buildAddress'
import clearForm from './clearForm'

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
    // build listing
    const listing = {
        numberOfPassengers: globalState.addListPassengers,
        vesselYear: Number(globalState.addListVesselYear),
        vesselLocation: {
            longitude: globalState.addListLatLng[1].toString(),
            latitude: globalState.addListLatLng[0].toString()
        },
        vesselAddress: addressObj,
        rawAddress: globalState.addListLocationDisplay,
        title: globalState.addListVesselMake,
        vesselType: globalState.addListService.toUpperCase(),
        vesselCategory: categoryIdList,
        numberOfBathrooms: globalState.addListWashrooms,
        numberOfKitchens: globalState.addListKitchenettes,
        numberOfBeds: globalState.addListBeds,
        vesselBrand: globalState.addListVesselMake
    }
    console.log("Listing to submit: ", listing)
    // create post request
    API()
        .post("stays", listing, {
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