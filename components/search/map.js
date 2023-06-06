import React, {useEffect, useState} from "react"
import GoogleMapReact from "google-map-react"
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react'
import {isEmptyArray} from "formik"

export default function GoogleMap({locationData, center, individualLocation}) {
    // default center is used if props.center doesn't hold a different value. currently set to "Toronto"
    const defaultCenter = {
        lat: 43.653226,
        lng: -79.3831843
    }

    const [windowGoogle, setWindowGoogle] = useState(null)
    //const [locationDataList, locationDataList]=useState(null)
    useEffect(() => {
        setWindowGoogle(window.google)
    }, [])

    const renderMarkers = () => {
        return locationData?.map((location, index) => {
            if (location && windowGoogle !== null) {
                if (Array.isArray(location)) { // array will come from front-end data
                    return <Marker
                        icon={{
                            url: "/assets/images/mapLogo.png",
                            anchor: new google.maps.Point(32, 32),
                            scaledSize: new google.maps.Size(32, 32)
                        }}
                        key={(`${index  }_${  location[0]  }_${  location[1]}`)}
                        position={{lat: location[0], lng: location[1]}
                        }/>
                } else { // object will come from back-end data
                    return <Marker
                        icon={{
                            url: "/assets/images/mapLogo.png",
                            anchor: new google.maps.Point(32, 32),
                            scaledSize: new google.maps.Size(32, 32)
                        }}
                        key={(`${index  }_${  location.vesselLocation?.longitude  }_${  location.vesselLocation?.longitude}`)}
                        position={{lat: location.vesselLocation?.latitude, lng: location.vesselLocation?.longitude}
                        }/>
                }
            }
        })
    }

    const renderIndMarker = () => {
        if (individualLocation && windowGoogle !== null) {
            if (Array.isArray(individualLocation)) { // array will come from front-end data
                return <Marker
                    icon={{
                        url: "/assets/images/mapLogo.png",
                        anchor: new google.maps.Point(32, 32),
                        scaledSize: new google.maps.Size(32, 32)
                    }}
                    key={(`${individualLocation?.[0]  }_${  individualLocation?.[1]}`)}
                    position={{lat: individualLocation?.[0], lng: individualLocation?.[1]}
                    }/>
            } else { // object will come from back-end data
                return <Marker
                    icon={{
                        url: "/assets/images/mapLogo.png",
                        anchor: new google.maps.Point(32, 32),
                        scaledSize: new google.maps.Size(32, 32)
                    }}
                    key={(`${individualLocation.longitude  }_${  individualLocation.longitude}`)}
                    position={{lat: individualLocation.latitude, lng: individualLocation.longitude}
                    }/>
            }
        }
    }

    return (
        <Map
            google={windowGoogle}
            zoom={9}
            initialCenter={defaultCenter}
            center={center}
            streetViewControl={false}
            mapTypeControl={false}
            scaleControl={false}
            panControl={false}
            fullscreenControl={false}
            containerStyle={{position: "relative"}}
            style={{width: "100%", height: "100%", position: "relative"}}
        >
            {/* Marker for individual location */}
            {renderIndMarker()}
            {/* Markers for locations */}
            {renderMarkers()}
        </Map>
    )
}
