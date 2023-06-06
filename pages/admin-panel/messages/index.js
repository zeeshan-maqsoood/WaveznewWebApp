import React, {useEffect, useState} from "react"
import NavBar from "../../../components/admin-panel/navBar"
import AdminMessages from "../../../components/admin-panel/adminMessages"
import OneSignalBroadcast from "../../../components/oneSignalBroadcast"


function messages() {


    return (
        <>
            <NavBar/>
            <OneSignalBroadcast/>
            <AdminMessages/>
        </>
    )
}

export default messages

