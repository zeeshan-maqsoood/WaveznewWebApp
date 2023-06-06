import React, { useContext, useState } from 'react'
import MapAutocomplete from './mapAutocomplete'
import { makeStyles } from "@material-ui/core/styles"
import Context from "../../store/context"
import Button from "@material-ui/core/Button"
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"

const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: 24,
        fontWeight: 500,
        paddingTop: 10,
        marginBottom: -5
    },
    addButton: {
        fontSize: 18,
        color: theme.palette.primary.main
    },
    error: {
        color: theme.palette.error.main,
        fontSize: 16,
        paddingLeft: 20
    }
}))

const mapCharterDestinations = ({ onUpdate = () => { }, updateDestination = () => { }, setMapCenter = () => { }, destination, destinationLatLng,
    destinationDisplay, destinationIsValid, inputWidth = 500 }) => {
    const { globalState, globalDispatch } = useContext(Context)
    const classes = useStyles()

    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : fr

    const onUpdateDestination = (newValue, latLng, dispValue, index) => {
        console.log("DispValue: ", dispValue)
        if (latLng !== undefined) {
            setMapCenter({ lat: latLng[0], lng: latLng[1] })
        }
        // set value at index to new value
        const destinationList = [...destination]
        destinationList[index] = newValue
        const destinationLatLngList = [...destinationLatLng]
        destinationLatLngList[index] = latLng
        const dispDestinationList = [...destinationDisplay]
        dispDestinationList[index] = dispValue
        updateDestination(destinationList, dispDestinationList, destinationLatLngList)
        // reset state if all inputs have been cleared
        if (destination.length === 0) {
            console.log("Resetting list length")
            updateDestination([undefined], [undefined], [undefined])
        }
    }

    const onDeletePress = (index) => {
        // reset state if this is last value
        if (destination.length === 1) {
            updateDestination([undefined], [undefined], [undefined])
        } else {
            const destinationList = [...destination]
            destinationList.splice(index, 1)
            const destinationLatLngList = [...destinationLatLng]
            destinationLatLngList.splice(index, 1)
            const dispDestinationList = [...destinationDisplay]
            dispDestinationList.splice(index, 1)
            updateDestination([...destinationList], [...dispDestinationList], [...destinationLatLngList])
        }
    }

    const onAddDestinationPress = () => {
        updateDestination([...destination, undefined], [...destinationDisplay, undefined], [...destinationLatLng, undefined])
    }

    return (
        <>
            <p className={classes.title}>{t.addListStep2.destinationsLabel}</p>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>{destinationDisplay?.map(function (thisDestination, index) {
                return <li key={(`${index  }_${  thisDestination}`)}><div width={"100%"}>
                    <MapAutocomplete restoreValue={thisDestination} locationIsValid={destinationIsValid} inputWidth={inputWidth} onUpdate={(newValue, latLng, dispValue) => onUpdateDestination(newValue, latLng, dispValue, index)} />
                    <Button
                        onClick={(e) => onDeletePress(index)}
                        style={{
                            textTransform: "capitalize",
                            // backgroundColor: theme.palette.background.default,
                            fontWeight: "500",
                            fontSize: "22px",
                            top: 20
                            // width: "40px",
                        }}>X</Button>
                    <br />
                </div></li>
            })
            }</ul>
            <div style={{ cursor: "pointer" }} onClick={() => onAddDestinationPress()}>
                <p className={classes.addButton}>{"+ "}{t.addListStep2.addDestination}</p>
            </div>
        </>
    )
}

export default mapCharterDestinations