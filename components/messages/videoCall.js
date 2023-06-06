import React, { useEffect, useRef, useState } from "react"
import { Grid, makeStyles, Typography, Button } from "@material-ui/core"
import NavBar, { HEIGHT, IMAGE_HEIGHT } from "../navbar/navBar"
import FlipCameraIosIcon from "@material-ui/icons/FlipCameraIos"
import VideocamIcon from "@material-ui/icons/Videocam"
import VideocamOffIcon from "@material-ui/icons/VideocamOff"
import MicOffIcon from "@material-ui/icons/MicOff"
import MicIcon from "@material-ui/icons/Mic"
import VolumeUpIcon from "@material-ui/icons/VolumeUp"
import VolumeDownIcon from "@material-ui/icons/VolumeDown"
import CallEndIcon from "@material-ui/icons/CallEnd"
import { SocketContext } from "../../src/socket"
import Peer from "simple-peer"
import Session from "../../sessionService"
import API from "../../pages/api/baseApiIinstance"
import oneSignalApiCall from "../../pages/api/oneSignalApiCall"

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		// height: "calc(100vh - " + HEIGHT + " - " + IMAGE_HEIGHT + ")", // 100vh - navbar height - navbar image height
		height: "100vh"
		// minHeight: "500px",
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
		justifyContent: "space-between",
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
		cursor: "pointer",
		[theme.breakpoints.down("xs")]: {
			minWidth: "30px",
			width: theme.spacing(5),
			height: theme.spacing(5)
		},
		"&:hover": {
			backgroundColor: theme.palette.background.default
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
	contactName: {
		fontSize: 30,
		textAlign: "center",
		width: "100%",
		fontWeight: "500",
		position: "absolute",
		zindex: 15,
		top: "20px",
		color: "white",
		[theme.breakpoints.down("xs")]: {
			fontSize: 20
		}
	}
}))

function videoCall({
	inCall,
	setInCall,
	makingCallTo = null,
	callerId = null,
	roomId,
	callAccepted,
	setCallAccepted,
	selectedConversation,
	getMessages,
	emitMissedCall,
	contactName,
	setAppModalOpen
}) {
	const classes = useStyles()
	const [isFrontCamera, setIsFrontCamera] = useState(false)
	const [isSpeakerPhone, setIsSpeakerPhone] = useState(false)
	const [isMuted, setIsMuted] = useState(false)
	const [camIsOn, setCamIsOn] = useState(true)
	const [isMobile, setIsMobile] = useState(false)
	const { socket, otherUser, onlineUsers } = React.useContext(SocketContext)
	const stream = useRef()
	const userVideo = useRef({ srcObject: null })
	const partnerVideo = useRef()
	const backupRef = useRef()
	const peerRef = useRef()
	const [outgoingCallStarted, setOutgoingCallStarted] = useState(false)
	const [ringtoneAudio] = useState(typeof Audio !== "undefined" && new Audio("https://wavezstorage.blob.core.windows.net/ringtone/Ringtone.mp3"))
	const [endCallAudio] = useState(typeof Audio !== "undefined" && new Audio("https://wavezstorage.blob.core.windows.net/ringtone/Hangup.mp3"))
	const [incPartnerStream, setIncPartnerStream] = useState(null)
	const [isMounted, setIsMounted] = useState(false)
	const token = Session.getToken("Wavetoken")
	let ringTimer

	useEffect(() => {
		// console.log("otherUser.current value: ", otherUser.current);
		if (!peerRef.current) peerRef.current = createPeer()
		setIsMounted(true)
		endCallAudio.addEventListener("ended", () => endCallAudio.pause())
		return () => {
			stream.current?.getTracks().forEach((track) => {
				track.stop()
			})
			partnerVideo.current = partnerVideo.current
			peerRef.current = null
			endCallAudio.removeEventListener("ended", () => endCallAudio.pause())
			clearTimeout(ringTimer)
			otherUser.current = null
		}
	}, [])

	useEffect(() => {
		console.log("socket: ", socket)
		console.log("otherUser.current value on mount: ", otherUser?.current)
	}, [])

	useEffect(() => {
		if (isMounted) {
			setListeners()
		}
	}, [isMounted])

	const setListeners = async () => {
		await navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mediaStream) => {
			stream.current = mediaStream

			userVideo.current.srcObject = mediaStream
		})

		await socket.once("offer", handleReceiveCall)

		await socket.on("answer", handleAnswer)

		await socket.on("ice-candidate", handleNewICECandidateMsg)

		await socket.once("callStarted", onRecipientAcceptCall)

		await socket.once("callEnded", endCall)

		if (callAccepted) {
			const data = {
				roomId,
				receiverId: Session.getUserId(),
				senderSocketId: otherUser.current
			}
			socket.emit("callAccepted", data)
			setCallAccepted(false)
		}
	}

	const postMissedCall = () => {
		if (selectedConversation?._id && makingCallTo) {
			const body = {
				conversationId: selectedConversation._id,
				text: "Missed Call",
				imageUrl: "",
				receiverId: makingCallTo
			}
			API()
				.post("messages/save", body, {
					headers: {
						authorization: `Bearer ${  token}`
					}
				})
				.then(() => {
					getMessages()
					emitMissedCall()
				})
				.catch((e) => {
					console.log("somethingWentWrong: ", e)
				})
		}
	}

	useEffect(() => {
		if (ringtoneAudio) {
			ringtoneAudio.loop = true
		}
	}, [ringtoneAudio])

	const onRecipientAcceptCall = (receiverSocketId) => {
		otherUser.current = receiverSocketId
		setOutgoingCallStarted(true)
	}

	useEffect(() => {
		if (makingCallTo) {
			ringtoneAudio.play()
			createCall()
		}
	}, [makingCallTo])

	function createCall() {
		// tell socket server to forward call to socketId belonging to receiverId, passing personal info to display on "answer call" prompt
		console.log("otherUser.current value in createCall: ", otherUser?.current)

		let profileImage = ""
		try {
			profileImage = Session.getProfileImage()
		} catch (err) {}
		const data = {
			senderId: Session.getUserId(),
			receiverId: makingCallTo,
			name: `${Session.getFirstName()  } ${  Session.getLastName()}`,
			profileImage
		}

		socket.emit("callUser", data)
		ringTimer = setTimeout(callTimeout, 45000)
	}

	const callTimeout = () => {
		if (!otherUser.current) {
			endCall()
		}
	}

	async function callUser() {
		// peerRef.current.addStream(stream.current);
		console.log("otherUser.current value in callUser: ", otherUser?.current)
		console.log("callUser running")
		stream.current.getTracks().forEach((track) => peerRef.current.addTrack(track, stream.current))
		peerRef.current
			.createOffer()
			.then((offer) => {
				return peerRef.current.setLocalDescription(offer)
			})
			.then(() => {
				const payload = {
					target: otherUser.current,
					caller: socket.id,
					sdp: peerRef.current.localDescription
				}
				socket.emit("offer", payload)
				console.log("emitting offer: ", payload)
			})
			.catch((e) => console.log(e))
		console.log("peerRef value in call user: ", peerRef?.current)
	}

	useEffect(() => {
		if (outgoingCallStarted) {
			setOutgoingCallStarted(false)
			callUser()
		}
	}, [outgoingCallStarted])

	async function handleReceiveCall(incoming) {
		console.log("otherUser.current value in receive offer: ", otherUser.current)

		console.log("incoming offer: ", incoming)
		// peerRef.current?.addStream(stream.current);
		const desc = new RTCSessionDescription(incoming.sdp)
		peerRef.current
			?.setRemoteDescription(desc)
			.then(() => {
				console.log("peerRef in handleReceiveCall: ", peerRef)
				if (stream.current) {
					stream.current.getTracks().forEach((track) => peerRef.current.addTrack(track, stream.current))
				}
			})
			.then(() => {
				return peerRef.current.createAnswer()
			})
			.then((answer) => {
				return peerRef.current.setLocalDescription(answer)
			})
			.then(() => {
				const payload = {
					target: otherUser.current,
					caller: socket.id,
					sdp: peerRef.current.localDescription
				}
				socket.emit("answer", payload)
				console.log("emitting answer: ", payload)
			})
		console.log("peerRef value in handleReceiveCall: ", peerRef?.current)
	}

	function createPeer() {
		const peer = new RTCPeerConnection({
			// iceServers: [
			// 	{ urls: ["stun:us-turn10.xirsys.com"] }, // Free
			// 	{
			// 		// Interdev
			// 		urls: "turn:numb.viagenie.ca",
			// 		credential: "simplify",
			// 		username: "superstar41668087@gmail.com",
			// 	},
			// 	{
			// 		// Testing
			// 		username: "MPnVuoEWypmHaiSfGOV_KTmP_ktXfURwP5i1-sTdSe4FqVVZOPf_Z7cd-aE2yrBcAAAAAGFctGZtaWtlcGhzZQ==",
			// 		credential: "30948e4c-261a-11ec-be24-0242ac140004",
			// 		urls: [
			// 			"turn:us-turn10.xirsys.com:80?transport=udp",
			// 			"turn:us-turn10.xirsys.com:3478?transport=udp",
			// 			"turn:us-turn10.xirsys.com:80?transport=tcp",
			// 			"turn:us-turn10.xirsys.com:3478?transport=tcp",
			// 			"turns:us-turn10.xirsys.com:443?transport=tcp",
			// 			"turns:us-turn10.xirsys.com:5349?transport=tcp",
			// 		],
			// 	},
			// 	// {
			// 	//   urls: "turn:20.151.0.119:3478",
			// 	//   // urls: ‘stun:stun.l.google.com:19302’,
			// 	//   username: "dummy",
			// 	//   credential: "dummy",
			// 	// },
			// ],
		})
		peer.onicecandidate = handleICECandidateEvent
		peer.ontrack = handleTrackEvent
		peer.onconnectionstatechange = manageConnectionState

		return peer
	}

	const manageConnectionState = (data) => {
		if (data.target.iceConnectionState === "disconnected") {
			// endCall();
			endCallAudio.play()
			stream.current?.getTracks().forEach((track) => {
				track.stop()
			})
			setAppModalOpen()
			setInCall(false)
		}
	}

	function handleAnswer(message) {
		console.log("incoming answer: ", message)
		ringtoneAudio.pause()
		clearTimeout(ringTimer)
		const desc = new RTCSessionDescription(message.sdp)
		if (peerRef.current) {
			peerRef.current.setRemoteDescription(desc).catch((e) => console.log(e))
		}
		console.log("peerRef value in handle Answer: ", peerRef?.current)
	}

	function handleICECandidateEvent(e) {
		if (e.candidate) {
			const payload = {
				target: otherUser.current,
				candidate: e.candidate
			}
			socket.emit("ice-candidate", payload)
			console.log("ice-candidate payload: ", payload)
		}
	}

	function handleNewICECandidateMsg(incoming) {
		console.log("handleNewICECandidateMsg incoming: ", incoming)
		const candidate = new RTCIceCandidate(incoming)
		console.log("handleNewICECandidateMsg candidate: ", candidate)

		peerRef.current?.addIceCandidate(candidate).catch((e) => console.log(e))
		console.log("handleNewICECandidateMsg peerRef.current: ", peerRef.current)
	}

	async function handleTrackEvent(e) {
		setPartnerSource(e)
	}

	const setPartnerSource = (e) => {
		if (partnerVideo.current) {
			partnerVideo.current.srcObject = e.streams[0]
		}
	}

	useEffect(() => {
		if (incPartnerStream) {
			partnerVideo.current.srcObject = incPartnerStream
		}
	}, [incPartnerStream])

	useEffect(() => {
		if (stream.current) {
			stream.current.getAudioTracks().forEach((track) => (track.enabled = !isMuted))
		}
	}, [isMuted])

	useEffect(() => {
		if (stream.current) {
			stream.current.getVideoTracks().forEach((track) => (track.enabled = camIsOn))
		}
	}, [camIsOn])

	const emitEndCall = async () => {
		let otherSocketId = otherUser.current
		if (!otherUser.current) {
			otherSocketId = await onlineUsers.find((user) => user.userId === makingCallTo)?.socketId
		}
		console.log("otherUser.current: ", otherUser.current)
		const data = {
			otherSocketId,
			roomId
		}
		socket.emit("endCall", data)
	}

	const endCall = () => {
		console.log("otherUser.current value in endCall: ", otherUser?.current)

		if (!otherUser.current) {
			postMissedCall()
			sendOneSignalMissedCall()
		}
		clearTimeout(ringTimer)
		ringtoneAudio.pause()
		endCallAudio.play()
		stream.current?.getTracks().forEach((track) => {
			track.stop()
		})

		if (peerRef.current) {
			emitEndCall()
		}
		setAppModalOpen()
		setInCall(false)
	}

	// const sendOneSignalMissedCall = () => {
	// 	var requestBody = {
	// 		receiverId: makingCallTo,
	// 		heading: "Test DOB",
	// 		contents: "Missed call from " + Session.getFirstName() + " " + Session.getLastName(),
	// 		socketId: "",
	// 		userId: "",
	// 		roomId: "",
	// 		additionalDataOne: {
	// 			type: "calling",
	// 			// buttons: [
	// 			// 	{ id: "accept", text: "Accept", icon: "ic_menu_share" },
	// 			// 	{ id: "reject", text: "Reject", icon: "ic_menu_send" },
	// 			// ],
	// 			smallIcon: "ic_notification_smallicon",
	// 			iosSound: "",
	// 			androidSound: "",
	// 		},
	// 		additionalDataTwo: {},
	// 	};
	// 	oneSignalApiCall(requestBody);
	// };

	return (
		<>
			<Grid container className={classes.root}>
				<Grid item xs={false} lg={2} className={classes.filler} />
				{/* Main Content */}
				<Grid item xs={12} lg={8} className={classes.content}>
					{/* Contact Camera */}
					<div className={classes.contactCamera}>
						<video playsInline ref={partnerVideo} autoPlay style={{ width: "100%", height: "100%", zIndex: 10 }} />
						{/* Self Camera */}
						<video playsInline muted ref={userVideo} autoPlay className={classes.selfCamera} />
						<Typography className={classes.contactName}>{contactName}</Typography>
					</div>
					{/* Buttons */}
					<div className={classes.endCallDiv}>
						<Button className={classes.endCallBackground} onClick={() => endCall()}>
							<CallEndIcon fontSize={isMobile ? "medium" : "large"} />
						</Button>
					</div>
					<div className={classes.buttonDiv}>
						<Button
							className={classes.buttonBackground}
							onClick={() => setIsFrontCamera((curr) => !curr)}
							style={isMobile ? {} : { display: "hidden", visibility: "hidden" }}
						>
							<FlipCameraIosIcon fontSize={isMobile ? "medium" : "large"} />
						</Button>
						<Button className={classes.buttonBackground} onClick={() => setCamIsOn((curr) => !curr)}>
							{camIsOn ? (
								<VideocamIcon fontSize={isMobile ? "medium" : "large"} />
							) : (
								<VideocamOffIcon fontSize={isMobile ? "medium" : "large"} />
							)}
						</Button>
						<Button className={classes.buttonBackground} onClick={() => setIsMuted((curr) => !curr)}>
							{isMuted ? <MicOffIcon fontSize={isMobile ? "medium" : "large"} /> : <MicIcon fontSize={isMobile ? "medium" : "large"} />}
						</Button>
						<Button
							className={classes.buttonBackground}
							onClick={() => setIsSpeakerPhone((curr) => !curr)}
							style={isMobile ? {} : { display: "hidden", visibility: "hidden" }}
						>
							{isSpeakerPhone ? (
								<VolumeDownIcon fontSize={isMobile ? "medium" : "large"} />
							) : (
								<VolumeUpIcon fontSize={isMobile ? "medium" : "large"} />
							)}
						</Button>
					</div>
				</Grid>
				<Grid item xs={false} lg={2} className={classes.filler} />
			</Grid>
		</>
	)
}

export default videoCall
