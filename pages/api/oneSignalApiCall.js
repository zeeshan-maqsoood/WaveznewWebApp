import react, { useContext } from "react"
import Context from "../../store/context"
import API from "./baseApiIinstance"
import Session from "../../sessionService"

export default function oneSignalApiCall(data) {
	const token = Session.getToken("Wavetoken")

	API()
		.post(`notifications/sendNotificationToCallUser`, data, {
			headers: {
				authorization: `Bearer ${  token}`
			}
		})
		.then((response) => {
			console.log("response from OneSignal: ", response.data)
		})
		.catch((err) => {
			console.log("ERROR from One Signal send call notification: ", err.response.status, " ", err.response.data)
		})
}
