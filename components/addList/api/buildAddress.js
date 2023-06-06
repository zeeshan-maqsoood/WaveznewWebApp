import React from 'react'

const buildAddress = (location, rawAddress = null) => {
    // filter each location to get the address component types needed, based on criteria from geocode api
    // if filter returns empty array, set value to null, else return value that matches parameter
    if (location === undefined) { return }
    let streetNumberObj = location.filter(comp => comp.types.includes('street_number'))
    streetNumberObj.length === 0 ? streetNumberObj = null : streetNumberObj = streetNumberObj[0].long_name
    let streetRouteObj = location.filter(comp => comp.types.includes('route'))
    streetRouteObj.length === 0 ? streetRouteObj = null : streetRouteObj = streetRouteObj[0].short_name
    let postalCodeObj = location.filter(comp => comp.types.includes('postal_code'))
    postalCodeObj.length === 0 ? postalCodeObj = null : postalCodeObj = postalCodeObj[0].long_name
    let cityObj = location.filter(comp => comp.types.includes('locality'))
    cityObj.length === 0 ? cityObj = null : cityObj = cityObj[0].short_name
    let countryObj = location.filter(comp => comp.types.includes('country'))
    const countryCodeObj = (countryObj.length === 0 ? null : countryObj[0].short_name)
    countryObj.length === 0 ? countryObj = null : countryObj = countryObj[0].long_name
    let provinceObj = location.filter(comp => comp.types.includes('administrative_area_level_1'))
    provinceObj.length === 0 ? provinceObj = null : provinceObj = provinceObj[0].long_name

    let streetObj
    streetNumberObj === null ? streetObj = streetRouteObj : streetObj = `${streetNumberObj  } ${  streetRouteObj}`
    // set object to match backend structure
    const addressObj = {
        street: streetObj,
        postalCode: postalCodeObj,
        city: cityObj,
        countryCode: countryCodeObj,
        country: countryObj,
        province: provinceObj
    }
    rawAddress ? addressObj.rawAddress = rawAddress : null // Add rawAddress for charters. Rentals and stays will have rawAddress outside of the address object

    return addressObj
}

export default buildAddress