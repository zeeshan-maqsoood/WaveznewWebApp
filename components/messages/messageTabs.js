import {
    Avatar,
    Button,
    Grid,
    makeStyles,
    Typography,
    useState
} from "@material-ui/core"
import React, {useEffect} from "react"
import {HEIGHT, IMAGE_HEIGHT} from "../navbar/navBar"
import {highlightColor, primaryColor} from "../../config/colors"
import CloseIcon from '@material-ui/icons/Close'
import Link from "next/link"
import PersonIcon from "@material-ui/icons/Person"
import HighlightOffIcon from "@material-ui/icons/HighlightOff"
import theme from "../../src/theme"
import Session from "../../sessionService"
import AnnouncementIcon from "@material-ui/icons/Announcement"
// i18n
import {useRouter} from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import API from "../../pages/api/baseApiIinstance"

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        height: `calc(100vh - 80px - ${  HEIGHT  } - ${  IMAGE_HEIGHT  })`, // 100vh - banner(80) - navbar height - navbar image height
        minHeight: "400px",
        overflowY: "scroll"
    },
    tab: {
        height: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
        fontWeight: 500,
        fontSize: 16,
        // paddingLeft: 30,s
        // paddingRight: 40,
        width: "100%",
        overflow: "hidden",
        cursor: "pointer",
        [theme.breakpoints.down("xs")]: {
            paddingLeft: 5
        }
    },
    badge: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        backgroundColor: theme.palette.background.grayish,
        color: theme.palette.background.silver,
        fontFamily: "Roboto",
        fontSize: "1.5em",
        marginRight: 10,
        [theme.breakpoints.down("xs")]: {
            width: theme.spacing(0),
            marginRight: 5,
            display: "hidden",
            visibility: "hidden"
        }
    },
    profilePhotoContainer: {
        width: "18%",
        marginLeft: "44px",
        paddingTop: "5%",
        paddingBottom: "1em",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        [theme.breakpoints.down("xs")]: {
            width: "100%",
            marginLeft: "0px"
        },
        position: "relative"
    },
    personIcon: {
        colorPrimary: theme.palette.text.grey
    },
    deleteIcon: {
        position: "absolute",
        right: 0,
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 40
    },
    unreadMessageIcon: {
        marginLeft: 10,
        color: theme.palette.buttonPrimary.main
    },
    onlineIcon: {
        borderRadius: 50,
        height: "10px",
        width: "10px",
        minWidth: "10px",
        backgroundColor: theme.palette.background.green,
        marginLeft: 10,
        [theme.breakpoints.down("xs")]: {
            marginLeft: 2
        }
    },
    hideButton: {
        width: "10px",
        height: "10px",
        marginLeft: "0px",
        paddingLeft: "0px",
        paddingRight: "0px",
        paddingTop: "20px",
        paddingBottom: "20px",
        [theme.breakpoints.down("xs")]: {
            position: "absolute",
            width: "0px",
            display: "hidden",
            visibility: "hidden"
        }
    },
    closeIcon: {
        fontSize: "medium"
    }
}))
const token = Session.getToken("Wavetoken")
const Tab = ({
                 label,
                 highlighted = false,
                 updateSelectedConversation,
                 imageUrl,
                 selectedConversation,
                 seen,
                 isOnline,
                 clearConversation
             }) => {
    const classes = useStyles()
    const hideConversation = (id) => {
        API()
            .put(`conversations/hide/${id}`, null, {
                headers: {
                    authorization: `Bearer ${  token}`
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log("response.data: ", response.data)
                    updateSelectedConversation()
                    clearConversation()
                }
            })
            .catch((e) => {
                // router.push("/somethingWentWrong");
                console.log("error: ", e)
            })
    }
    useEffect(() => {
      console.log('selectedConversation: ', selectedConversation)
    }, [selectedConversation])

    return (
        <div style={{display:'flex'}}>
            <Button className={classes.hideButton} onClick={() => {
                hideConversation(selectedConversation)
            }}>
                <CloseIcon className={classes.closeIcon}/>
            </Button>
            <Button
                onClick={() => {
                    updateSelectedConversation()
                }}
                className={classes.tab}
                style={
                    highlighted
                        ? {
                            backgroundColor: highlightColor,
                            color: primaryColor,
                            position: "relative"
                        }
                        : {position: "relative"}
                }
            >
                <Avatar
                    alt="Remy Sharp Avatar"
                    src={imageUrl?.toString()}
                    className={classes.badge}
                >
                    {!imageUrl ? <PersonIcon fontSize="medium"/> : null}
                </Avatar>
                <Typography
                    noWrap
                    style={{fontSize: "18px", textTransform: "Capitalize"}}
                >
                    {label}
                </Typography>
                {isOnline && <div className={classes.onlineIcon}/>}
                {seen === false && (
                    <AnnouncementIcon
                        fontSize="medium"
                        className={classes.unreadMessageIcon}
                    />
                )}
                {/* <div className={classes.deleteIcon} onClick={() => { }}>
                    <HighlightOffIcon fontSize="medium" />
                </div> */}
            </Button>
        </div>
    )
}

const MessageTabs = ({
                         selectedConversation,
                         setSelectedConversation,
                         conversations,
                         onlineUsers
                     }) => {
    const classes = useStyles()
    const router = useRouter()
    const {locale} = router
    const t = locale === "en" ? en : fr

    const updateSelectedConversation = (conversation) => {
        setSelectedConversation(conversation)
    }

    return (
        <div className={classes.container}>
            <ul
                style={{listStyleType: "none", padding: 0, margin: 0, width: "100%"}}
            >
                {conversations.map((conversation, index) => {
                    const otherMember = conversation.members.find(
                        (member) => member._id !== Session.getUserId()
                    )
                    const seen = conversation.hasMessages?.find(
                        (messageLog) => messageLog.user === Session.getUserId()
                    )?.seen
                    return (
                        <li key={`${  index  }${conversation.label}`}>
                            <div styl={{width: "100%"}}>
                                <Tab
                                    key={otherMember?._id}
                                    label={`${otherMember?.firstName  } ${  otherMember?.lastName}`}
                                    highlighted={selectedConversation?._id === conversation._id}
                                    selectedConversation={conversation._id}
                                    updateSelectedConversation={() => {
                                        updateSelectedConversation(conversation)
                                    }}
                                    clearConversation={() => updateSelectedConversation(false)}
                                    imageUrl={otherMember?.profileImageUrl}
                                    userInitials={otherMember?.userInitials}
                                    seen={seen}
                                    isOnline={onlineUsers.some(
                                        (user) => user.userId === otherMember._id
                                    )}
                                />
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default MessageTabs
