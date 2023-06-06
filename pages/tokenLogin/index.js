import React, { useContext, useEffect, useState } from 'react'
import CryptoJS from "crypto-js"
import API from "../api/baseApiIinstance"
import Session from "../../sessionService"
import router from 'next/router'
import Context from '../../store/context'
import { socket } from "../../src/socket"
import { io } from "socket.io-client"
import ClipLoader from "react-spinners/ClipLoader"
// eslint-disable-next-line no-duplicate-imports
import { SocketContext } from "../../src/socket"

const override = `
  display: block;
  margin: 0 auto;
  border-color: grey;
`

export default function LoginWithToken() {
    const [isLoading, setIsLoading] = useState(true)
	const { onlineUsers } = React.useContext(SocketContext)
    let token
    
    // useEffect(() => {
    //     socket.once("connect", () => { socket.emit("receiverConnected") })

    //     const queryString = window.location.href;
    //     console.log('queryString: ', queryString);
    //     console.log('cipher: ', queryString.split('cipher=')[1]);
    //     console.log("socket in loginWithToken: ", socket)

    //     try { // decrypt data from cipher and use token to restore 
    //         const bytes = CryptoJS.AES.decrypt(queryString.split('cipher=')[1], "myPassword");
    //         console.log('bytes: ', bytes)
    //         const parsedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            
    //         token = parsedData.token;
    //         Session.setToken(parsedData.token);
    //         Session.setOnlineUsersTemp(parsedData.onlineUsers);
    //         console.log('parsedData: ', parsedData);
    //         if (socket.auth.token) {
    //             moveToCallScreen(parsedData.receiver, parsedData.caller);
    //         }
    //         else {
    //             router.reload(); // reload page to update socket in _app.js
    //         }
    //     } catch (e) {
    //         console.log(e);
    //         setIsLoading(false);
    //         router.push("/somethingWentWrong");
    //     }
    // }, []);

    const moveToCallScreen = (receiver, caller) => {
        if (receiver) {
            Session.setMobileOutgoingCallInfo(receiver)
        } else if (caller) {
            Session.setMobileIncomingCallInfo(caller)
        }
        
        getUserInfo()
    }

    const getUserInfo = () => {
        API()
        .get("users/getUserDetailsWEBRTC", {
        headers: {
            authorization: `Bearer ${  token}`
        }
        })
        .then((response) => {
        if (response.status === 200) {
            Session.setTheme(response.data.theme)
            Session.setUserInitials(response.data.userInitials)
            response.data.notification 
            ? Session.setNotifications(response.data.notification) 
            : Session.setNotifications({user: response.data.userId, listings: 0, trips: 0, conversations: 0})
            Session.setUserLoggedInData(response.data)
            Session.setUserId(response.data.userId)
            Session.setProfileImage(response.data.profileImageUrl)
            Session.setFirstName(response.data.firstName)
            Session.setLastName(response.data.lastName)
            Session.setIsVesselOwner(response.data.isVesselOwner)
            // stop loading spinner
        }
})
        .then(() => {
            window.location.replace('messages')
        })
    }

    return (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", height: "100vh"}}>
            <ClipLoader color={"#ffffff"} loading={isLoading} css={override} size={150} />
        </div>
    )
} 