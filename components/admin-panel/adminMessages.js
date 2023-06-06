import { Grid, makeStyles, Button, Typography } from "@material-ui/core"
import React, { useEffect, useState, useContext, useRef } from "react"
import AccountInfoBanner from "../../components/accountInfo/accountInfoBanner"
import MessageTabs from "../../components/messages/messageTabs"
import NavBar from "../../components/navbar/navBar"
import Image from "next/image"
import Session from "../../sessionService"
import API from "../../pages/api/baseApiIinstance"
import ChatWindow from "../../components/messages/chatWindow"
// import VideoCall from "../../components/messages/videoCall";
import Context from "../../store/context"
import NoContactSelected from "../../components/messages/noContactSelected"
import UsersToMessage from "../../components/admin-panel/usersToMessage"
import { Message } from "react-chat-ui"
import moment from "moment"
import { io } from "socket.io-client"
import { SocketContext } from "../../src/socket"
import Peer from "simple-peer"
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import Modal from "react-responsive-modal"
import CallingOfflineUser from "../messages/callingOfflineUser"

const useStyles = makeStyles((theme) => ({
	filler: {
		backgroundColor: "#E5E5E5"
	},
	content: {
		backgroundColor: "white",
		borderLeft: "2px solid lightgrey",
		width: "100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
	},
	theme: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		marginTop: "10px",
		border: "2px solid lightgrey",
		borderRadius: 10
	},
	divider: {
		marginTop: "30px",
		width: "90%"
	},
	imageContainer: {
		borderRadius: 10,
		marginBottom: "20px"
	},
	button: {
		fontWeight: "400",
		textTransform: "capitalize",
		backgroundColor: "#4d96fb",
		color: "white",
		fontSize: "18px",
		maxHeight: "70px",
		maxWidth: "150px",
		marginBottom: "20px"
	},
	banner: {
		display: "flex",
		alignItems: "center",
		height: 80
	},
	bannerText: {
		fontSize: 24,
		fontWeight: 500
	},
	customModal: {
		margin: "0",
		padding: "0",
		marginTop: "4rem",
		maxWidth: "100%"
	}
}))

function Messages(props) {
	const { globalState, globalDispatch } = useContext(Context)
	const token = Session.getToken("Wavetoken")
	const classes = useStyles()
	const router = useRouter()
	const { locale } = router
	const t = locale === "en" ? en : fr
	const [selectedConversation, setSelectedConversation] = useState(null)
	const [selectedContactImg, setSelectedContactImg] = useState("")
	const [selectedContactName, setSelectedContactName] = useState("")
	const [selectedContactId, setSelectedContactId] = useState("")
	const [inCall, setInCall] = useState(false)
	const [conversations, setConversations] = useState([])
	const [input, setInput] = useState("")
	const [photos, setPhotos] = useState([])
	const [messages, setMessages] = useState([])
	const [arrivalMessage, setArrivalMessage] = useState(null)
	const { socket, onlineUsers, otherUser } = React.useContext(SocketContext)
	const [dateForRerender, rerenderPage] = useState(new Date())
	const [makingCallTo, setMakingCallTo] = useState(null)
	const [isMounted, setIsMounted] = useState(false)
	const [callingOfflineUser, setCallingOfflineUser] = useState(false)

	// create listeners for messages and online users, then call API to display conversations
	useEffect(() => {
		socket.on("getUsers", (users) => {
			console.log("users: ", users)
		})
		if (!onlineUsers && Session.getToken()) {
			rerenderPage()
		}
		updateConversations()
		// socket.on("connect", () => {
		//   console.log("socket: ", socket);
		// });
		socket.on("getMessage", (data) => {
			console.log("getMessages data: ", data)
			setArrivalMessage({
				sender: data.senderId,
				text: data.text,
				createdAt: Date.now(),
				imageUrl: data.imageUrl
			})
			updateConversations()
		})
		console.log("globalState.contactSelectedId: ", globalState.contactSelectedId)
		setIsMounted(true)
	}, [])

	// when a new message arrives for the selected convo, display it and mark it as seen
	useEffect(() => {
		console.log("arrivalMessage: ", arrivalMessage)
		if (arrivalMessage && selectedContactId === arrivalMessage.sender) {
			setMessages((prev) => [...prev, arrivalMessage])
			setConversationSeen()
		}
	}, [arrivalMessage])

	// update page every 1 minute for timestamps
	useEffect(() => {
		setTimeout(() => rerenderPage(new Date()), 60000)
	}, [dateForRerender])

	const getMessages = () => {
		selectedConversation?._id
			? API()
					.get(`messages/${  selectedConversation._id}`, {
						headers: {
							authorization: `Bearer ${  token}`
						}
					})
					.then((response) => {
						if (response.status === 200) {
							setMessages(response.data)
						}
					})
					.catch((e) => {
						// router.push("/somethingWentWrong");
						console.log("somethingWentWrong: ", e)
					})
			: null
	}

	// useEffect(() => {
	//     if (!inCall) {
	//         otherUser.current = null;
	//     }
	// }, [inCall])

	// update selected conversation header, messages, and seen status
	useEffect(() => {
		if (selectedConversation) {
			const otherMember = selectedConversation.members.find((member) => member._id !== Session.getUserId())
			setSelectedContactImg(otherMember?.profileImageUrl)
			setSelectedContactName(`${otherMember?.firstName  } ${  otherMember?.lastName}`)
			setSelectedContactId(otherMember?._id)
			getMessages()
			setConversationSeen()
		}
	}, [selectedConversation])

	// emit message through socket, then post to database
	const onSendMessageClick = () => {
		handleEmitting(photos[0], input)
		handlePosting(photos[0], input)
	}

	const handleEmitting = (photo, input) => {
		console.log("handleEmitting photo: ", photo)
		console.log("!photo: ", !photo)
		if (!photo) {
			console.log("no photo attached")
			socket.emit("sendMessage", {
				senderId: Session.getUserId(),
				receiverId: selectedContactId,
				text: input,
				imageUrl: ""
			})
		} else {
			getBase64(photo, (imageInBase64) => {
				console.log("imageInBase64: ", imageInBase64)
				socket.emit("sendMessage", {
					senderId: Session.getUserId(),
					receiverId: selectedContactId,
					text: input,
					imageUrl: imageInBase64
				})
			})
		}
	}

	function getBase64(photo, cb) {
		const reader = new FileReader()
		reader.readAsDataURL(photo)
		reader.onload = function () {
			cb(reader.result)
		}
		reader.onerror = function (error) {
			console.log("Error: ", error)
		}
	}

	const handlePosting = (photo, input) => {
		if (photo) {
			uploadImage(photo, input)
			getBase64(photo, (imageInBase64) => {
				setMessages((curr) => [
					...curr,
					{
						user: { _id: Session.getUserId() },
						text: input,
						conversationId: selectedConversation._id,
						imageUrl: imageInBase64,
						createdAt: new Date()
					}
				])
			})
		} else {
			if (!(!input || input.match(/^ *$/) !== null)) {
				setMessages((curr) => [
					...curr,
					{
						user: { _id: Session.getUserId() },
						text: input,
						conversationId: selectedConversation._id,
						imageUrl: "",
						createdAt: new Date()
					}
				])
				postMessage("", input)
			}
		}
	}

	const uploadImage = (photo, input) => {
		const body = new FormData()
		body.append("image", photo)
		body.append("conversationId", selectedConversation._id)
		API()
			.post("messages/uploadImage/", body, {
				headers: {
					authorization: `Bearer ${  token}`,
					accept: "application/json",
					"Content-Type": "multipart/form-data"
				}
			})
			.then((response) => {
				console.log("response is ", response)
				if ((response.status = 200)) {
					console.log("uploadImage response.data: ", response.data)
					postMessage(response.data, input)
					setPhotos([])
				}
			})
			.catch((e) => {
				// router.push("/somethingWentWrong");
				console.log("somethingWentWrong: ", e)
			})
	}

	const postMessage = (imageUrl = "", input) => {
		const body = {
			conversationId: selectedConversation._id,
			text: input,
			imageUrl,
			receiverId: selectedContactId
		}
		API()
			.post("messages/save", body, {
				headers: {
					authorization: `Bearer ${  token}`
				}
			})
			.then((response) => {
				if (response.status === 200) {
					setInput("")
				}
			})
			.catch((e) => {
				// router.push("/somethingWentWrong");
				console.log("somethingWentWrong: ", e)
			})
	}

	// fetch conversation list. If a conversation is selected and unseen, set it to seen
	const updateConversations = () => {
		console.log("running updateConversations")
		API()
			.get("conversations/getConversationByUserId", {
				headers: {
					authorization: `Bearer ${  token}`
				}
			})
			.then((response) => {
				if (response.status === 200) {
					let seenStatusCorrect = true
					console.log("conversation response.data: ", response.data)
					const newConversations = response.data
					if (selectedConversation) {
						console.log("selectedConversation: ", selectedConversation)
						const currentConv = newConversations.find((conversation) => conversation._id === selectedConversation)
						if (currentConv) {
							console.log("currentConv: ", currentConv)
							const isSeen = currentConv.hasMessages.find((item) => item.user === Session.getUserId()).seen
							if (!isSeen) {
								console.log("isSeen: ", isSeen)
								seenStatusCorrect = false
								setConversationSeen()
							}
						}
					}
					if (seenStatusCorrect) {
						console.log("setConverstations to: ", newConversations)
						setConversations([...newConversations])
					}
				}
			})
			.catch((e) => {
				// router.push("/somethingWentWrong");
				console.log("somethingWentWrong: ", e)
			})
	}

	// set a conversation to seen, then fetch the updated list
	const setConversationSeen = () => {
		const body = {
			conversationId: selectedConversation
		}
		API()
			.put("conversations/seenChange", body, {
				headers: {
					authorization: `Bearer ${  token}`
				}
			})
			.then((response) => {
				if (response.status === 200) {
					updateConversations()
				}
			})
			.catch((e) => {
				// router.push("/somethingWentWrong");
				console.log("error: ", e)
			})
	}

	// set initial contact selected on page load and clear global state so the conversation is not reselected after leaving and returning. If needed, create new conversation
	useEffect(() => {
		console.log("useEffect[conversations] running")
		if (isMounted) {
			if (globalState.contactSelectedId) {
				const conversationOnLoad = conversations.find((conversation) =>
					conversation.members.some((member) => member._id === globalState.contactSelectedId)
				)
				conversationOnLoad
					? (globalDispatch({ type: "SET_CONTACT_SELECTED", payload: "" }), setSelectedConversation(conversationOnLoad))
					: startNewConversation()
			}
		}
	}, [conversations])

	const startNewConversation = (userId) => {
		console.log("startNewConversation running")
		const body = {
			members: [Session.getUserId(), userId],
			hasMessages: [
				{
					user: Session.getUserId(),
					seen: true
				},
				{
					user: userId,
					seen: true
				}
			]
		}
		API()
			.post("conversations/save", body, {
				headers: {
					authorization: `Bearer ${  token}`
				}
			})
			.then((response) => {
				if (response.status === 200) {
					console.log("post conversation status 200")
					console.log("response.data: ", response.data)
					updateConversations()
				}
			})
			.catch((e) => {
				// router.push("/somethingWentWrong");
				console.log("error: ", e)
			})
	}

	//   const callUser = (id) => {
	//     if (onlineUsers.some(user => user.userId === id)) {
	//         console.log("running callUser with id: ", id);
	//         setMakingCallTo(id);
	//         setInCall(true);
	//     }
	//     else {
	//         setCallingOfflineUser(true);
	//     }
	//   };

	// set initial contact selected on page load and clear global state so the conversation is not reselected after leaving and returning. If needed, create new conversation
	useEffect(() => {
		console.log("useEffect[conversations] running")
		if (isMounted) {
			console.log("isMounted in useEffect")
			if (globalState.contactSelectedId) {
				console.log("globalState.contactSelectedId")
				const conversationOnLoad = conversations.find((conversation) =>
					conversation.members.some((member) => member._id === globalState.contactSelectedId)
				)
				conversationOnLoad
					? (globalDispatch({ type: "SET_CONTACT_SELECTED", payload: "" }), setSelectedConversation(conversationOnLoad))
					: startNewConversation()
			}
		}
	}, [conversations])

	const refreshConversations = (userId) => {
		console.log("Called")
		startNewConversation(userId)
	}

	return (
		<>
			{/* {inCall ? (
                <Modal
                    open={inCall}
                    onClose={() => !inCall}
                    classNames={{
                        modal: classes.customModal,
                    }}
                    center
                >
                <VideoCall
                    makingCallTo={makingCallTo}
                    setInCall={(val) => setInCall(val)}
					selectedConversation={selectedConversation} 
					emitMissedCall={() => handleEmitting(null, "Missed Call")} 
					getMessages={() => getMessages()} 
					contactName={selectedContactName}
                />
                </Modal>
            ) : ( */}
			<>
				<Modal
					open={callingOfflineUser}
					onClose={() => setCallingOfflineUser(false)}
					classNames={{
						modal: classes.customModal
					}}
					center
				>
					<CallingOfflineUser closeModal={() => setCallingOfflineUser(false)} />
				</Modal>
				<UsersToMessage setRefreshConversations={refreshConversations} />
				{/* Banner */}
				<Grid
					style={{
						marginRight: "auto",
						marginLeft: "17rem"
					}}
					item
					xs={12}
				>
					<Grid container spacing={10}>
						<Grid style={{ display: "flex" }} item xs={4}>
							<Typography style={{ fontWeight: "500" }} variant="h5" gutterBottom>
								{t.profileMenu.messages}
							</Typography>
						</Grid>
					</Grid>
				</Grid>
				{/* End Banner */}
				<Grid
					style={{
						marginRight: "auto",
						marginLeft: "16rem"
					}}
					container
				>
					{/* Conversation Tabs */}
					<Grid item xs={2} lg={2}>
						<MessageTabs
							selectedConversation={selectedConversation}
							setSelectedConversation={(newConversation) => setSelectedConversation(newConversation)}
							conversations={conversations}
							onlineUsers={onlineUsers}
						/>
					</Grid>
					{/* End Conversation Tabs */}
					{/* Main Content */}
					<Grid item xs={7} lg={7} className={classes.content}>
						{selectedConversation?._id ? (
							<ChatWindow
								contactId={selectedContactId}
								conversationId={selectedConversation?._id}
								contactName={selectedContactName}
								contactImageUrl={selectedContactImg}
								messages={messages}
								callUser={(id) => callUser(id)}
								sendMessage={onSendMessageClick}
								input={input}
								setInput={setInput}
								photos={photos}
								setPhotos={(newPhotos) => setPhotos(newPhotos)}
							/>
						) : (
							<NoContactSelected />
						)}
					</Grid>
					{/* End Main Content */}
				</Grid>
			</>
			{/* )} */}
		</>
	)
}

export default Messages
