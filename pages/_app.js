import React, { useRef } from "react"
import PropTypes from "prop-types"
import Head from "next/head"
import Script from 'next/script'
import { ThemeProvider } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import theme from "../src/theme"
// eslint-disable-next-line no-duplicate-imports
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import * as gtag from "../lib/gtag"
import "./calendar/customCalendarStyles.css"
import "../components/search/paginationCustomStyles.css"
import "../components/accountInfo/addPaymentStyle.css"
import GlobalStateProvider from "../store/globalStateProvider"
import dynamic from "next/dynamic"
import { Modal } from "react-responsive-modal"
import Peer from "simple-peer"
import '../components/admin-panel/footer/Shared-HTML-Editor.module.css'
import '../styles/globals.css'

const DarkReader = dynamic(() => import("react-darkreader"), { ssr: false })
import Session from "../sessionService"
import { io } from "socket.io-client"
import { SocketContext, socket } from "../src/socket"
// import VideoCall from "../components/messages/videoCall";
// import IncomingCall from "../components/messages/incomingCall";
import NavBar from "../components/navbar/navBar"

import FlipCameraIosIcon from "@material-ui/icons/FlipCameraIos"
import VideocamIcon from "@material-ui/icons/Videocam"
import VideocamOffIcon from "@material-ui/icons/VideocamOff"
import MicOffIcon from "@material-ui/icons/MicOff"
import MicIcon from "@material-ui/icons/Mic"
import VolumeUpIcon from "@material-ui/icons/VolumeUp"
import VolumeDownIcon from "@material-ui/icons/VolumeDown"
import CallEndIcon from "@material-ui/icons/CallEnd"
import { Grid, makeStyles, Typography, Button } from "@material-ui/core"
// import oneSignalApiCall from "./api/oneSignalApiCall";

const useStyles = makeStyles(() => ({
	root: {
		display: "flex",
		height: "100vh"
	},
	filler: {
		backgroundColor: theme.palette.background.lightGrey
	},
	content: {
		backgroundColor: theme.palette.background.default,
		width: "100%",
		height: "100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		position: "relative"
	},
	contactCamera: {
		width: "100%",
		height: "100%",
		backgroundColor: "darkGrey",
		position: "relative",
		zIndex: 1
	},
	selfCamera: {
		width: "30%",
		height: "30%",
		backgroundColor: "black",
		position: "absolute",
		right: 20,
		top: 20,
		zIndex: 2,
		[theme.breakpoints.down("xs")]: {
			height: "25%"
		}
	},
	buttonDiv: {
		width: "100%",
		height: "80px",
		position: "absolute",
		bottom: 20,
		left: 0,
		zIndex: 3,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingLeft: "10%",
		paddingRight: "10%"
	},
	buttonBackground: {
		backgroundColor: theme.palette.background.lightGrey,
		color: theme.palette.text.grey,
		borderRadius: 100,
		width: theme.spacing(8),
		height: theme.spacing(8),
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		marginLeft: "50px",
		marginRight: "50px",
		cursor: "pointer",
		[theme.breakpoints.down("xs")]: {
			minWidth: "30px",
			width: theme.spacing(5),
			height: theme.spacing(5)
		},
		"&:hover": {
			backgroundColor: theme.palette.background.silver
		}
	},
	endCallDiv: {
		width: "100%",
		height: "80px",
		position: "absolute",
		bottom: 100,
		left: 0,
		zIndex: 3,
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	endCallBackground: {
		backgroundColor: theme.palette.error.main,
		color: theme.palette.background.lightGrey,
		borderRadius: 100,
		width: theme.spacing(10),
		height: theme.spacing(10),
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		cursor: "pointer",
		[theme.breakpoints.down("xs")]: {
			minWidth: "30px",
			width: theme.spacing(7),
			height: theme.spacing(7)
		},
		"&:hover": {
			backgroundColor: theme.palette.background.flamingo
		}
	},
	callModal: {
		borderRadius: "10px",
		width: "85%",
		maxWidth: "600px",
		height: "85%",
		maxHeight: "500px"
	}
}))

export default function MyApp(props) {
	const classes = useStyles()
	const { Component, pageProps } = props
	const router = useRouter()
	const [inCall, setInCall] = useState(false)
	const [receivingCall, setReceivingCall] = useState(false)
	const [callerName, setCallerName] = useState("")
	const [callerId, setCallerId] = useState("")
	const [profileImage, setProfileImage] = useState("")
	const [callerSignal, setCallerSignal] = useState()
	const [makingCallTo, setMakingCallTo] = useState(null)
	const [isMobile, setIsMobile] = useState(false)
	const [roomId, setRoomId] = useState("")
	const [callAccepted, setCallAccepted] = useState(false)
	const otherUser = useRef()
	const [mobileIncomingCallData, setMobileIncomingCallData] = useState(null)
	const [dateForRerender, rerenderPage] = useState(new Date())
	const [onlineUsers, setOnlineUsers] = useState([])
	const [ringtoneAudio] = useState(typeof Audio !== "undefined" && new Audio("https://wavezstorage.blob.core.windows.net/ringtone/Ringtone.mp3"))

	// const handleOneSignalData = (data) => {
	// 	console.log("oneSignalData: ", data);

	// 	if (data.roomId) {
	// 		var requestBody = {
	// 			receiverId: data.receiverId,
	// 			heading: "Calling",
	// 			contents: Session.getFirstName() + " is Calling",
	// 			socketId: data.senderSocketId,
	// 			userId: Session.getUserId(),
	// 			roomId: data.roomId,
	// 			additionalDataOne: {
	// 				type: "calling",
	// 				smallIcon: "ic_notification_smallicon",
	// 				iosSound: "",
	// 				androidSound: "",
	// 			},
	// 			additionalDataTwo: {
	// 				firstName: Session.getFirstName(),
	// 				lastName: Session.getLastName(),
	// 			},
	// 		};
	// 		oneSignalApiCall(requestBody);
	// 	}
	// };
	// const socketListener = () => {
	// 	socket.on("oneSignalData", (data) => handleOneSignalData(data));

	// 	socket.on("incomingCall", (data) => {
	// 		if (!inCall && !receivingCall) {
	// 			console.log("running method incomingCall");
	// 			console.log("data: ", data);
	// 			setReceivingCall(true);
	// 			setRoomId(data.roomId);
	// 			setCallerName(data.name);
	// 			otherUser.current = data.senderSocketId;
	// 			setProfileImage(data.profileImage);
	// 		}
	// 	});

	// 	socket.on("notification", (data) => {
	// 		console.log("notification data: ", data);
	// 		Session.setNotifications(data);
	// 		rerenderPage(new Date());
	// 	});

	// 	socket.on("getUsers", (users) => {
	// 		console.log("users: ", users);
	// 		setOnlineUsers([...users]);
	// 	});

	// 	socket.on("callEnded", () => setReceivingCall(false));
	// };

	useEffect(() => {
		window.OneSignal = window.OneSignal || []
		OneSignal.push(function () {
			OneSignal.init({
				appId: process.env.appId,
				safari_web_id: process.env.safariWebId,
				notifyButton: {
					enable: true
				},
				allowLocalhostAsSecureOrigin: true
			})
		})

		return () => {
			window.OneSignal = undefined
		}
	}, []) // <-- run this effect once on mount

	// useEffect(() => {
	// 	if (ringtoneAudio) {
	// 		ringtoneAudio.loop = true;
	// 	}
	// }, [ringtoneAudio]);

	// useEffect(() => {
	// 	if (receivingCall && !inCall) {
	// 		ringtoneAudio.play();
	// 	} else {
	// 		ringtoneAudio.pause();
	// 		if (!inCall) {
	// 			otherUser.current = null;
	// 		}
	// 	}
	// }, [receivingCall]);

	React.useEffect(() => {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector("#jss-server-side")
		if (jssStyles) {
			jssStyles.parentElement.removeChild(jssStyles)
		}
		// socketListener();
	}, [])

	// useEffect(() => {
	// 	console.log("_app.js listener for mobileIncomingCallData: ", mobileIncomingCallData)
	// 	if (mobileIncomingCallData) {
	// 		handleMobileCallForwarding();
	// 	}
	// }, [mobileIncomingCallData]);

	// const handleMobileCallForwarding = () => {
	// 	console.log("accepting call");
	// 	if (mobileIncomingCallData) {
	// 		console.log("mobileIncomingCallData for accepting call: ", mobileIncomingCallData);
	// 		setRoomId(mobileIncomingCallData.roomId);
	// 		setCallerName(
	// 			mobileIncomingCallData.additionalDataTwo?.firstName + " " + mobileIncomingCallData.additionalDataTwo?.lastName
	// 		);
	// 		otherUser.current = mobileIncomingCallData.socketId;
	// 		console.log("_app.js otherUser.current: ", otherUser.current);

	// 		setInCall(true);
	// 		setCallAccepted(true);
	// 		setMobileIncomingCallData(null);
	// 	}
	// };

	// const answerCall = () => {
	// 	console.log("running method answerCall");
	// 	setInCall(true);
	// 	setReceivingCall(false);
	// 	setCallAccepted(true);
	// };

	useEffect(() => {
		const handleRouteChange = (url) => {
			// gtag.pageview(url)
		}
		router.events.on("routeChangeComplete", handleRouteChange)
		return () => {
			router.events.off("routeChangeComplete", handleRouteChange)
			console.log(handleRouteChange)
		}
	}, [router.events])

	// useEffect(() => {
	// 	console.log("otherUser.current: ", otherUser.current);
	// 	if (!inCall) {
	// 		otherUser.current = null;
	// 		console.log("cleared otherUser.current");
	// 		console.log("otherUser.current: ", otherUser.current);
	// 	}
	// }, [inCall]);

	const renderContentOrVideoCall = () => {
		// switch (inCall) {
		// 	case true:
		// 		return (
		// 			<VideoCall
		// 				callerId={callerId}
		// 				setInCall={(val) => setInCall(val)}
		// 				roomId={roomId}
		// 				callAccepted={callAccepted}
		// 				setCallAccepted={(val) => setCallAccepted(val)}
		// 				contactName={callerName}
		// 			/>
		// 		);
		// 		break;
		// 	default:
		return <Component {...pageProps} key={router.asPath} />
		// 		break;
		// }
	}

	return (
		<SocketContext.Provider
			value={{
				socket,
				// userVideo,
				// connectionRef,
				// myVideo,
				// makingCallTo,
				// setMakingCallTo,
				// stream,
				roomId,
				otherUser,
				onlineUsers,
				mobileIncomingCallData,
				setMobileIncomingCallData,
				setOnlineUsers
			}}
		>
			<GlobalStateProvider>
				<React.Fragment>
					<Head>
						<title>Waterwavez Technology Corporation</title>
						<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
						<Script  type="text/javascript" src="https://www.google.com/jsapi"></Script>
						<Script 
							type="text/javascript"
							src={`https://maps.googleapis.com/maps/api/js?key=${  process.env.googleMapsApiKey  }&libraries=places`}
						></Script>
						<Script  src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async=""></Script>
					</Head>
					<ThemeProvider theme={theme}>
						<div style={{ display: "hidden", visibility: "hidden", height: 0 }}>
							<DarkReader defaultDarken={Session.getTheme() === "DARK"} />
						</div>
						{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
						<CssBaseline />
						{/* <Modal
							open={receivingCall}
							center
							closeOnOverlayClick={false}
							closeOnEsc={false}
							showCloseIcon={false}
							classNames={{
								modal: classes.callModal,
							}}
						>
							<IncomingCall
								closeModal={() => setReceivingCall(false)}
								acceptCall={() => answerCall()}
								callerName={callerName}
								profileImage={profileImage}
							/>
						</Modal> */}
						{renderContentOrVideoCall()}
					</ThemeProvider>
				</React.Fragment>
			</GlobalStateProvider>
		</SocketContext.Provider>
	)
}

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
	pageProps: PropTypes.object.isRequired
}
