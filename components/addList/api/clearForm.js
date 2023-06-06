import React from 'react'

const clearForm = (clearFormData = () => { }) => {
    clearFormData("SET_MAKE", "")
    clearFormData("SET_YEAR", "")
    clearFormData("SET_ADDLIST_SERVICE", "")
    clearFormData("SET_ADDLIST_CATEGORIES", [])
    clearFormData("SET_ADDLIST_PASSENGERS", 1)
    clearFormData("SET_ADDLIST_LOCATION", undefined, undefined)
    clearFormData("SET_ADDLIST_DESTINATION", [undefined], [undefined])
    clearFormData("SET_ADDLIST_LATLNG", undefined)
    clearFormData("SET_ADDLIST_DESTINATION_LATLNG", [undefined])
    clearFormData("SET_ADDLIST_WASHROOMS", 0)
    clearFormData("SET_ADDLIST_BEDS", 0)
    clearFormData("SET_ADDLIST_KITCHENETTES", 0)
}

export default clearForm