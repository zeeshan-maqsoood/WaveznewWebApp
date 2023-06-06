import React, { useEffect, useRef, useState } from "react"
import { ChatFeed } from "react-chat-ui"
import { Avatar, Button, Chip, makeStyles, TextField, Typography } from "@material-ui/core"
import { HEIGHT, IMAGE_HEIGHT } from "../navbar/navBar"
import theme from "../../src/theme"
import SendIcon from "@material-ui/icons/Send"
import AttachFileIcon from "@material-ui/icons/AttachFile"
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon"
import PersonIcon from "@material-ui/icons/Person"
import VideocamIcon from "@material-ui/icons/Videocam"
import Message from "./message"
import Session from "../../sessionService"
import dynamic from "next/dynamic"
import { Modal } from "react-responsive-modal"
import { UpdateButtonNotice } from "../../components/calendar/updateButtonNotice"
const Picker = dynamic(() => import("emoji-picker-react"), {
	ssr: false
})
// import Picker from "emoji-picker-react";
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"

const useStyles = makeStyles((theme) => ({
	container: {
		position: "relative",
		display: "flex",
		flexDirection: "column",
		height: `calc(100vh - 80px - ${  HEIGHT  } - ${  IMAGE_HEIGHT  })`, // 100vh - banner(80) - navbar height - navbar image height
		minHeight: "400px",
		// overflowY: "scroll",
		width: "100%"
	},
	chatFeed: {
		paddingLeft: 10,
		paddingRight: 10
	},
	inputDiv: {
		display: "flex",
		height: "90px",
		margin: 10,
		border: `1px solid ${  theme.palette.background.lightGrey}`,
		borderRadius: 10,
		paddingLeft: 10,
		paddingRight: 10
	},
	inputField: {
		width: "100%",
		marginRight: 10
	},
	inputTop: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
		marginRight: 10
	},
	filesAndText: {
		display: "flex",
		flexDirection: "row"
	},
	inputBottom: {
		display: "flex",
		alignItems: "center",
		height: "100%"
	},
	contactHeader: {
		position: "relative",
		width: "100%",
		height: "80px",
		borderBottom: "2px solid lightgrey",
		display: "flex",
		alignItems: "center",
		paddingLeft: 30,
		paddingRight: 30,
		[theme.breakpoints.down("xs")]: {
			paddingLeft: 10
		}
	},
	headerText: {
		fontSize: 24,
		fontWeight: 500,
		paddingRight: 40,
		[theme.breakpoints.down("xs")]: {
			paddingRight: 15,
			fontSize: 18
		}
	},
	badge: {
		width: theme.spacing(8),
		height: theme.spacing(8),
		backgroundColor: theme.palette.background.grayish,
		color: theme.palette.background.silver,
		fontFamily: "Roboto",
		fontSize: "2.5em",
		marginRight: 10,
		marginTop: 10,
		marginBottom: 10,
		[theme.breakpoints.down("xs")]: {
			marginRight: 5,
			width: theme.spacing(5),
			height: theme.spacing(5)
		}
	},
	sendButton: {
		fontWeight: "400",
		textTransform: "capitalize",
		backgroundColor: theme.palette.buttonPrimary.main,
		color: theme.palette.background.default,
		fontSize: "18px",
		maxWidth: "150px",
		paddingLeft: 10,
		paddingRight: 10,
		marginTop: 20,
		marginBottom: 20,
		borderRadius: 5,
		[theme.breakpoints.down("xs")]: {
			fontSize: "14px"
		}
	},
	chatBox: {
		// flex: 5.5,
		height: "calc(100% - 110px - 80px)" // text input at bottom and contact header
	},
	chatBoxWrapper: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "spaceBetween"
	},
	chatBoxTop: {
		height: "100%",
		overflowY: "scroll",
		paddingRight: "10px"
	},
	chatBoxWrapper: {
		paddingLeft: "10px",
		paddingRight: "10px",
		height: "100%"
	},
	noConversationText: {
		position: "absolute",
		top: "10%",
		fontSize: "50px",
		color: "rgb(224, 220, 220)",
		cursor: "default"
	},
	hideInput: {
		width: "0.1px",
		height: "0.1px",
		opacity: 0,
		overflow: "hidden",
		position: "absolute",
		zIndex: "-1"
	},
	chip: {
		margin: theme.spacing(0.5),
		paddingLeft: "0px",
		maxWidth: "250px",
		overflow: "hidden"
	},
	camIcon: {
		position: "absolute",
		right: 20,
		cursor: "pointer",
		width: 40,
		height: 40,
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	},
	emojiPicker: {
		position: "absolute",
		bottom: 500
	},
	errorModal: {
		maxWidth: "500px",
		maxHeight: "600px",
		borderRadius: 10
	}
}))

function ChatWindow({
	contactId,
	conversationId,
	contactName,
	contactImageUrl,
	messages,
	sendMessage,
	input,
	setInput,
	callUser,
	photos,
	setPhotos,
	isDisabled
}) {
	const classes = useStyles()
	const scrollRef = useRef()
	const MAX_FILE_MB = 5
	const [error, setError] = useState(false)
	const [emojiPickerVisible, setEmojiPickerVisible] = useState(false)
	const [chosenEmoji, setChosenEmoji] = useState(null)
	const inputRef = useRef(null)
	const emojiRef = useRef(null)

	const onEmojiClick = (event, emojiObject) => {
		setInput((curr) => curr + emojiObject.emoji)
		setEmojiPickerVisible(false)
		inputRef.current.focus()
	}

	useEffect(() => {
		const handleEsc = (event) => {
			if (event.keyCode === 27) {
				console.log("inputRef: ", inputRef)
				setEmojiPickerVisible(false)
				inputRef.current.focus()
			}
		}
		const handleClickAway = (event) => {
			if (emojiRef.current && !emojiRef.current.contains(event.target)) {
				setEmojiPickerVisible(false)
			}
		}

		window.addEventListener("keydown", handleEsc)
		window.addEventListener("mousedown", handleClickAway)

		return () => {
			window.removeEventListener("keydown", handleEsc)
			window.removeEventListener("mousedown", handleClickAway)
		}
	}, [])

	const router = useRouter()
	const { locale } = router
	const t = locale === "en" ? en : fr

	useEffect(() => {
		scrollRef.current?.scrollIntoView() // pass { behavior: "smooth"} to stop scrolling instantly
	}, [messages])

	const handleFileUpload = (event) => {
		setError(false)
		const newPhoto = [event.target.files[0]]
		if (newPhoto?.[0]) {
			if (newPhoto[0].type !== "image/jpeg" && newPhoto[0].type !== "image/jpg" && newPhoto[0].type !== "image/png") {
				setError(true)
			} else {
				newPhoto.size / 1024 / 1024 > MAX_FILE_MB ? setError(true) : setPhotos([...newPhoto])
			}
		}
		inputRef.current.focus()
	}

	const handleDelete = (deletedPhoto, index) => {
		setPhotos([])
	}

	useEffect(() => {
		console.log("photos: ", photos)
	}, [photos])

	return (
		<div className={classes.container}>
			<Modal open={error} onClose={() => setError(false)} classNames={{ modal: classes.errorModal }} center>
				<UpdateButtonNotice onClose={() => setError(false)} header={t.messagePage.errorHeader} body={t.profilePage.imageSizeError} />
			</Modal>
			<div className={classes.contactHeader}>
				<Avatar alt="Remy Sharp Avatar" src={contactImageUrl?.toString()} className={classes.badge}>
					{!contactImageUrl ? <PersonIcon fontSize="large" /> : null}
				</Avatar>
				<Typography noWrap className={classes.headerText}>
					{contactName}
				</Typography>
				{/* <div className={classes.camIcon} onClick={() => callUser(contactId)}>
          <VideocamIcon
            fontSize="large"
            style={{ color: theme.palette.text.grey }}
          />
        </div> */}
			</div>
			{/* Chat content */}
			<div className={classes.chatBox}>
				<div className={classes.chatBoxWrapper}>
					<div className={classes.chatBoxTop}>
						{messages.map((m) => (
							<div ref={scrollRef}>
								<Message message={m} own={m.user?._id === Session.getUserId()} />
							</div>
						))}
					</div>
				</div>
			</div>
			{/* End chat content */}
			<div className={classes.inputDiv} style={isDisabled ? { backgroundColor: "lightGrey" } : {}}>
				<div className={classes.inputTop}>
					<div className={classes.filesAndText}>
						<TextField
							inputRef={inputRef}
							autoComplete="off"
							label={t.messagePage.inputPlaceholder}
							type="text"
							name="messageInput"
							value={input}
							onChange={(event) => setInput(event.target.value)}
							classes={{ root: classes.inputField }}
							onKeyPress={(ev) => {
								// console.log(`Pressed keyCode ${ev.key}`);
								if (ev.key === "Enter") {
									sendMessage()
									ev.preventDefault()
								}
							}}
							disabled={isDisabled}
						/>
					</div>
					<div className={classes.inputBottom}>
						<input
							type="file"
							name="file"
							id={"file"}
							className={classes.hideInput}
							accept="image/png, image/jpeg, image/jpg"
							onChange={(event) => handleFileUpload(event)}
							disabled={isDisabled}
						/>
						<label htmlFor={"file"} accept="image/png, image/jpeg, image/jpg">
							<AttachFileIcon
								style={{
									cursor: isDisabled ? "default" : "pointer",
									color: theme.palette.text.grey,
									marginRight: 10
								}}
								onClick={() => {}}
							/>
						</label>
						<InsertEmoticonIcon
							style={{
								cursor: isDisabled ? "default" : "pointer",
								color: theme.palette.text.grey,
								marginRight: 10
							}}
							onClick={() => (isDisabled ? null : setEmojiPickerVisible(true))}
						/>

						{photos.map((photo, index) => {
							return (
								<li
									key={photo.name + Math.random() * 1000 + index}
									style={{
										listStyleType: "none",
										display: "flex",
										justifyContent: "start",
										maxWidth: "100%"
										// alignItems: "center",
										// width: "100%",
									}}
								>
									<Chip
										label={photo.name}
										onDelete={() => handleDelete(photo, index)}
										className={classes.chip}
										color="primary"
										style={{ borderRadius: 5 }}
									/>
								</li>
							)
						})}
					</div>
				</div>
				<Button
					onClick={() => sendMessage()}
					className={classes.sendButton}
					disabled={isDisabled}
					style={isDisabled ? { backgroundColor: "grey" } : {}}
				>
					{t.messagePage.send}
					<SendIcon fontSize="small" style={{ marginLeft: 5 }} />
				</Button>
			</div>
			{emojiPickerVisible && (
				<div ref={emojiRef}>
					<Picker
						onEmojiClick={onEmojiClick}
						pickerStyle={{
							position: "absolute",
							bottom: 50,
							left: 10,
							borderColor: theme.palette.background.lightGrey
						}}
					/>
				</div>
			)}
		</div>
	)
}

export default ChatWindow
