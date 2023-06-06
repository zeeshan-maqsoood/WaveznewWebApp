import {makeStyles} from "@material-ui/core/styles"
import {useRouter} from "next/router"
import Session from "../../../../sessionService"
import React, {useEffect, useRef, useState} from "react"
import API from "../../../api/baseApiIinstance"
import NavBar from "../../../../components/admin-panel/navBar"
import Grid from "@material-ui/core/Grid"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import {
    Backdrop, Chip,
    CircularProgress, Dialog, DialogActions,
    DialogContent,
    DialogTitle, Snackbar,
    Tab,
    Tabs, TextField,
    Typography,
    withStyles
} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import moment from "moment"
import {grey, lightBlue} from "@material-ui/core/colors"
import Switch from "@material-ui/core/Switch"
import GenericDialogDialog from "../../../../components/shared/genericDeleteDialog"
import CloseIcon from "@material-ui/icons/Close"
import UserListingsTable from "../../../../components/admin-panel/all-users/users/userListingsTable"
import UserHistoryTable from "../../../../components/admin-panel/all-users/users/userHistoryTable"
import {AttachFile, EmailOutlined, MailOutline} from "@material-ui/icons"
import {Alert, AlertTitle, Autocomplete} from "@material-ui/lab"
import Paper from "@material-ui/core/Paper"
import theme from "../../../../src/theme"
import dynamic from "next/dynamic"
import {EditorState} from "draft-js"
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import {convertToHTML} from 'draft-convert'
import Counter from "../../../addList/counter"
import {Editor} from "@tinymce/tinymce-react"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        fontFamily: "Roboto",
        color: theme.palette.title.matterhorn
    },
    paper: {
        padding: theme.spacing(4),
        color: theme.palette.text.secondary,
        width: "100%"
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: theme.palette.background.default
    },
    profileInitials: {
        fontSize: "40px",
        border: "1px none red",
        borderRadius: "50%",
        width: "6rem",
        height: "6rem",
        textAlign: "center",
        textTransform: "capitalize",
        paddingTop: "1.4rem",
        backgroundColor: theme.palette.wavezHome.backgroundColorSearch,
        color: theme.palette.text.darkCerulean,
        fontWeight: "100"
    },
    detailsWeight: {
        fontWeight: "500",
        color: theme.palette.title.matterhorn,
        paddingLeft: '4em !important'
    },
    profileImage: {
        borderRadius: "50%",
        height: "7rem",
        width: "7rem"
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
        margin: theme.spacing(0.5)
    },
    inputRoot: {
        backgroundColor: `${theme.palette.background.default  } !important`
    },
    wrapperClass: {
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
        border: "1px solid #ccc"
    },
    editorClass: {
        order: 1,
        padding: "1rem",
        minHeight: '250px'
        // border: "1px solid #ccc"
    },
    toolbarClass: {
        order: 2,
        border: "1px solid #ccc"
    }
}))

const GreenSwitch = withStyles({
    switchBase: {
        color: theme.palette.background.flamingo,
        '&$checked': {
            color: theme.palette.background.seaGreen
        },
        '&$checked + $track': {
            backgroundColor: theme.palette.background.seaGreen
        },
        '& + $track': {
            backgroundColor: theme.palette.background.flamingo
        }
    },
    checked: {},
    track: {}
})(Switch)

function UserById() {
    const htmlToDraft = null
    const classes = useStyles()
    const router = useRouter()
    const token = Session.getToken("Wavetoken")
    const [loading, setLoading] = useState(false)
    const [userDetails, setUserDetails] = useState({
        disabled: false
    })
    const [deleteBy, setDeleteBy] = useState(null)
    const [userListings, setUserListings] = useState([])
    const [userHistory, setUserHistory] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [disableDialogOpen, setDisableDialogOpen] = useState(false)
    const [enableDialogOpen, setEnableDialogOpen] = useState(false)
    const [openEmailPage, setOpenEmailPage] = useState(false)
    const [showCcAndBcc, setShowCcAndBcc] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [showErrorDialog, setShowErrorDialog] = useState(false)
    const [attachedFiles, setAttachedFiles] = useState([])

    // form values
    const [emails, setEmails] = useState([])
    const [ccs, setCcs] = useState([])
    const [bccs, setBccs] = useState([])
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')

    // form validators
    const [emailIsValid, setEmailIsValid] = useState(true)
    const [ccIsValid, setCcIsValid] = useState(true)
    const [bccIsValid, setBccIsValid] = useState(true)
    const [subjectIsValid, setSubjectIsValid] = useState(true)
    const [bodyIsValid, setBodyIsValid] = useState(true)

    // autocomplete values
    const [emailOptions, setEmailOptions] = useState([])

    const [emailSentDialogOpen, setEmailSentDialogOpen] = useState(false)
    const [emailDialogMessage, setEmailDialogMessage] = useState('')
    const [emailError, setEmailError] = useState(false)

    const [totalFileSize, setTotalFileSize] = useState(0)

    const inputRef = useRef()

    const [tabValue, setTabValue] = useState(0)
    const [strikeCount, setStrikeCount] = useState(0)
    const [paymentDue, setPaymentDue] = useState(0)
    const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)

    const [deleteDialogMessage, setDeleteDialogMessage] = useState("")
    const [canDelete, setCanDelete] = useState(false)

    const [disableWarningDialogOpn, setDisableWarningDialogOpen] = useState(false)
    const [disableDialogMessage, setDisableDialogMessage] = useState("")

    const [openErrorSnackBar, setOpenErrorSnackBar] = useState(false)
    const [errorSnackbarMessage, setErrorSnackbarMessage] = useState("")
    const [openSuccessSnackBar, setOpenSuccessSnackBar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")

    // const Editor = dynamic(
    //     () => {
    //         return import("react-draft-wysiwyg").then(mod => mod.Editor);
    //     },
    //     {ssr: false}
    // );
    // const [editorState, setEditorState] = useState(
    //     () => EditorState.createEmpty(),
    // );
    const editorRef = useRef(null)
    const [htmlString, setHtmlString] = useState("")
    const tabStyles = {
        normalTab: {
            color: theme.palette.background.scampi,
            fontSize: 15,
            textTransform: "none",
            flexDirection: "unset",
            justifyContent: "unset"
        },
        activeTab: {
            color: theme.palette.buttonPrimary.main,
            fontSize: 15,
            textTransform: "none",
            flexDirection: "unset",
            justifyContent: "unset"
        }
    }
    const {id} = router.query

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    const onClickBack = () => {
        if (openEmailPage) {
            setOpenEmailPage(false)
            resetState()
        } else {
            router.push("/admin-panel/all-users/users")
        }
    }

    const changeUserStatus = (event) => {
        console.log(event.target.checked)
        if (event.target.checked) {
            setEnableDialogOpen(true)
        } else {
            checkIfAdminCanDisableAccount()
        }
        // event.target.checked ? setEnableDialogOpen(true) : setDisableDialogOpen(true);
    }

    const deleteUserById = () => {
        const {id} = router.query
        if (id) {
            setLoading(true)
            API()
                .put(
                    `users/requestUserAccountDeletion/${id}`,
                    {disabled: true}
                    ,
                    {
                        headers: {
                            authorization: `Bearer ${  token}`,
                            accept: "application/json"
                        }
                    }
                )
                .then((response) => {
                    console.log("response is ", response)
                    setLoading(false)
                    setDeleteDialogMessage("")
                    setCanDelete(false)
                    setDeleteDialogOpen(false)
                    if ((response.status = 200)) {
                        getUserDetailsById()
                    }
                })
                .catch((e) => {
                    setLoading(false)
                    setDeleteDialogMessage("")
                    setCanDelete(false)
                    setDeleteDialogOpen(false)
                    console.log("delete user error: ", e)
                })
        }
    }

    const changeUserStatusById = (isDisabled) => {
        const {id} = router.query
        if (id) {
            setLoading(true)
            API()
                .put(
                    `users/changeUserStatus/${id}`,
                    {disabled: isDisabled}
                    ,
                    {
                        headers: {
                            authorization: `Bearer ${  token}`,
                            accept: "application/json"
                        }
                    }
                )
                .then((response) => {
                    console.log("response is ", response)
                    setLoading(false)
                    isDisabled ? setDisableDialogOpen(false) : setEnableDialogOpen(false)
                    setDisableWarningDialogOpen(false)
                    if ((response.status = 200)) {
                        getUserDetailsById()
                    }
                })
                .catch((e) => {
                    setLoading(false)
                    isDisabled ? setDisableDialogOpen(false) : setEnableDialogOpen(false)
                    console.log("delete user error: ", e)
                })
        }
    }

    useEffect(() => {
        console.log(id)
        if (id) {
            getUserDetailsById()
            // also get the user listings and history with user details
            getUserListingsByUserId()
            getUserHistoryByUserId()
        }
    }, [id])

    const getUserDetailsById = () => {
        if (id) {
            setLoading(true)
            API()
                .get(
                    `users/${id}`,
                    {
                        headers: {
                            authorization: `Bearer ${  token}`,
                            accept: "application/json"
                        }
                    }
                )
                .then((response) => {
                    console.log("response is ", response)
                    setLoading(false)
                    if ((response.status = 200)) {
                        setUserDetails(response.data)
                        setStrikeCount(response.data?.strikeCount ? response.data?.strikeCount : 0)
                        setPaymentDue(response.data?.paymentDue ? response.data?.paymentDue : 0)
                        setEmails([{email: response.data?.email}])
                        setDeleteBy(response.data?.deleteBy)
                    }
                })
                .catch((e) => {
                    setLoading(false)
                    console.log("get user by id error: ", e)
                })
        }
    }

    const getUserListingsByUserId = () => {
        if (id) {
            API()
                .get(
                    `users/getListings/guest/${id}`,
                    {
                        headers: {
                            authorization: `Bearer ${  token}`,
                            accept: "application/json"
                        }
                    }
                )
                .then((response) => {
                    console.log("response is ", response)
                    if ((response.status = 200)) {
                        setUserListings(response.data.listings)
                    }
                })
                .catch((e) => {
                    console.log("get user listings error: ", e)
                })
        }
    }

    const getUserHistoryByUserId = () => {
        if (id) {
            API()
                .get(
                    `users/history/${id}`,
                    {
                        headers: {
                            authorization: `Bearer ${  token}`,
                            accept: "application/json"
                        }
                    }
                )
                .then((response) => {
                    console.log("response is ", response)
                    if ((response.status = 200)) {
                        setUserHistory(response.data)
                    }
                })
                .catch((e) => {
                    console.log("get user history error: ", e)
                })
        }
    }

    const getTabStyle = (isActive) => {
        return isActive ? tabStyles.activeTab : tabStyles.normalTab
    }

    const sendEmail = () => {
        console.log('send email')
        if (validateForm()) {
            // htmlToDraft = require('html-to-draftjs').default;
            const formData = new FormData()
            emails.forEach(e => {
                formData.append('emails', e.email)
            })
            if (ccs && ccs?.length !== 0) {
                ccs.forEach(c => {
                    formData.append('cc', c.email)
                })
            } else {
                formData.append('cc', '')
            }
            if (bccs && bccs?.length !== 0) {
                bccs.forEach(b => {
                    formData.append('bcc', b.email)
                })
            } else {
                formData.append('bcc', '')
            }
            formData.append('subject', subject)
            // formData.append('body', convertToHTML({
            //     blockToHTML: (block) => {
            //         if (block?.data['text-align'] && block?.data['text-align'] === 'right') {
            //             return <p style={{textAlign: "right"}}/>;
            //         } else if (block?.data['text-align'] && block?.data['text-align'] === 'center') {
            //             return <p style={{textAlign: "center"}}/>;
            //         } else if (block?.data['text-align'] && block?.data['text-align'] === 'justify') {
            //             return <p style={{textAlign: "justify"}}/>;
            //         }
            //         console.log('blobk test', block);
            //     }
            // })(editorState.getCurrentContent()));
            formData.append('body', htmlString)
            attachedFiles.forEach((item) => {
                formData.append('attachments', item.file)
            })
            API()
                .post(
                    `users/sendEmail`,
                    formData,
                    {
                        headers: {
                            authorization: `Bearer ${  token}`,
                            accept: "application/json",
                            "Content-Type": "multipart/form-data"
                        }
                    }
                )
                .then((response) => {
                    console.log("response is ", response)
                    if ((response.status = 200)) {
                        resetState()
                        setEmailError(false)
                        setOpenEmailPage(false)
                        setEmailDialogMessage('Email Sent Successfully.')
                        setEmailSentDialogOpen(true)
                        setHtmlString("")
                    }
                })
                .catch((e) => {
                    setEmailError(true)
                    setEmailDialogMessage('There was an error sending the email.')
                    setEmailSentDialogOpen(true)
                    console.log("error in send email: ", e)
                })
        }
    }

    const resetState = () => {
        inputRef.current.value = ''
        setEmails([])
        setCcs([])
        setBccs([])
        setSubject('')
        setBody('')
        setErrorMessage(null)
        setShowErrorDialog(false)
        setEmailIsValid(true)
        setCcIsValid(true)
        setBccIsValid(true)
        setSubjectIsValid(true)
        setBodyIsValid(true)
        setAttachedFiles([])
        setShowCcAndBcc(false)
        setEmailSentDialogOpen(false)
        setEmailDialogMessage('')
        setEmailError(false)
        setTotalFileSize(0)
        setHtmlString("")
        // setEditorState(EditorState.createEmpty());
    }

    const validateForm = () => {
        let formIsValid = true;

        (!emails || emails?.length === 0) ? (setEmailIsValid(false), formIsValid = false) : null
        if (showCcAndBcc) {
            (!ccs || ccs?.length === 0) ? (setCcIsValid(false)) : null;
            (!bccs || bccs?.length === 0) ? (setBccIsValid(false)) : null;
            ((!ccs || ccs?.length === 0) && (!bccs || bccs?.length === 0)) ? (formIsValid = false) : null
        }
        !subject ? (setSubjectIsValid(false), formIsValid = false) : null
        !htmlString ? (setBodyIsValid(false), formIsValid = false) : null
        return formIsValid
    }

    const handleAttachFileChange = async (e) => {
        setErrorMessage("")
        const existingFiles = attachedFiles.slice()
        const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf|\.docx|\.doc)$/i

        // get the first file
        if (e?.target?.files && e.target.files.length !== 0) {
            let totalSize = 0
            existingFiles.map(f => {
                totalSize += f.file.size
            })
            let isInvalidExtension = false
            const files = Array.from(e.target.files).map(
                (file) => {
                    totalSize += file.size
                    if (!allowedExtensions.exec(file.name)) {
                        isInvalidExtension = true
                    }
                })
            console.log(totalSize / 1024 / 1024)
            if (totalSize / 1024 / 1024 < 5) {
                if (!isInvalidExtension) {
                    setErrorMessage(null)
                    if (files && files?.length) {
                        Array.from(e.target.files).map((tempFile) => {
                            console.log(tempFile.name)
                            existingFiles.push({key: uuidv4(), file: tempFile})
                        })
                        setAttachedFiles(existingFiles)
                    }
                } else {
                    setErrorMessage("Selected File Type not allowed.")
                }
            } else {
                setErrorMessage("Combined File Size is greater than 5 MB.")
            }


            // to clear the file input for the same image to be uploaded twice
            e.target.value = null
        }
    }

    const handleFileDelete = (itemToDelete) => {
        setAttachedFiles((files) => files.filter((file) => file.key !== itemToDelete.key))
    }

    useEffect(() => {
        if (attachedFiles && attachedFiles?.length !== 0) {
            let totalSize = 0
            attachedFiles.map(f => {
                if (f.file?.size) {
                    totalSize += Number(f.file?.size)
                }
            })
            // round file size to 2 decimal places
            setTotalFileSize(Math.round((totalSize / 1024 / 1024) * 100) / 100)
        } else {
            setTotalFileSize(0)
        }
    }, [attachedFiles])

    useEffect(() => {
        errorMessage ? setShowErrorDialog(true) : setShowErrorDialog(false)
    }, [errorMessage])

    const onEmailInputChange = (event, emailValue) => {
        API()
            .get(
                `users/emailSearch?searchText=${emailValue}`,
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    let selectedEmails = emails
                    if (ccs && bccs) {
                        selectedEmails = emails.concat(ccs, bccs)
                    }
                    const emailOptions = response.data.filter(val => {
                        return !selectedEmails.some(e => e.email === val.email)
                    })
                    setEmailOptions(emailOptions)
                }
            })
            .catch((e) => {
                console.log("get user emails error: ", e)
            })
        console.log(emailValue)
    }

    const checkEmailIsUnique = (option, value) => {
        return option.email === value.email
    }

    const addStrikeCount = () => {
        if (strikeCount === 0 || strikeCount === 1) {
            API()
                .put(`users/updateUserStrikes/${id}`, {strikeCount: strikeCount + 1}, {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                })
                .then((response) => {
                    setStrikeCount(strikeCount + 1)
                    console.log(response)
                })
                .catch((e) => {
                    console.log("adding strike count error: ", e)
                })
        }
    }

    const decreaseStrikeCount = () => {
        if (strikeCount === 1 || strikeCount === 2) {
            API()
                .put(`users/updateUserStrikes/${id}`, {strikeCount: strikeCount - 1}, {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                })
                .then((response) => {
                    console.log(response)
                    setStrikeCount(strikeCount - 1)
                })
                .catch((e) => {
                    console.log("adding strike count error: ", e)
                })
        }
    }

    const updatePaymentDue = () => {
        console.log(paymentDue)
        if (!Number.isNaN(Number(paymentDue))) {
            API()
                .put(`users/updateUserPaymentDue/${id}`, {paymentDue: Number(paymentDue) }, {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                })
                .then((response) => {
                    console.log(response)
                    setSnackbarMessage("Payment Due Saved.")
                    setOpenSuccessSnackBar(true)
                })
                .catch((e) => {
                    console.log("adding payment due error: ", e)
                })
        }
    }

    const revokeAccountDeletion = () => {
        API()
            .put(`users/revokeAccountDeletion/${id}`, {disabled: false}, {
                headers: {
                    authorization: `Bearer ${  token}`,
                    accept: "application/json"
                }
            })
            .then((response) => {
                getUserDetailsById()
                setRevokeDialogOpen(false)
                console.log(response)
            })
            .catch((e) => {
                setRevokeDialogOpen(false)
                console.log("revoke account deletion error: ", e)
            })
    }

    const checkUserDeleteStatus = () => {
        const {id} = router.query
        if (id) {
            setLoading(true)
            API()
                .get(
                    `users/checkUserStatusForDeleting/${id}`,
                    {
                        headers: {
                            authorization: `Bearer ${  token}`,
                            accept: "application/json"
                        }
                    }
                )
                .then((response) => {
                    if (response.status === 200) {
                        console.log("response is ", response)
                        setLoading(false)
                        setCanDelete(true)
                        setDeleteDialogOpen(true)
                        setDeleteDialogMessage("Please note that, once your account is deleted you will no longer be able to access \n" +
                            "your account information such as your past trips, messages, payment history etc. \n" +
                            "Also, kindly be aware that all your account related data will be retained for next 30 \n" +
                            "days and during this period you cannot register back with us. Are you sure you want\n" +
                            "to delete your account?")
                    }
                })
                .catch((e) => {
                    setLoading(false)
                    setCanDelete(false)
                    setDeleteDialogOpen(true)
                    setDeleteDialogMessage("An account cannot be deleted if there are any upcoming/ on-going trips or \n" +
                        "payment dues. Please cancel/ complete your upcoming/on-going trips or clear the \n" +
                        "dues to delete your account.")
                    console.log("delete user error: ", e)
                })
        }
    }

    const handleSuccessClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenSuccessSnackBar(false)
    }

    const handleErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenErrorSnackBar(false)
    }

    const checkIfAdminCanDisableAccount = () => {
        const {id} = router.query
        if (id) {
            setLoading(true)
            API()
                .get(
                    `users/checkUserStatusForDeleting/${id}`,
                    {
                        headers: {
                            authorization: `Bearer ${  token}`,
                            accept: "application/json"
                        }
                    }
                )
                .then((response) => {
                    if (response.status === 200) {
                        console.log("response is ", response)
                        setLoading(false)
                        setDisableDialogOpen(true)
                    }
                })
                .catch((e) => {
                    setLoading(false)
                    if (e?.response?.data?.message === "User has payment due's.") {
                        setDisableDialogOpen(true)
                    } else {
                        setCanDelete(false)
                        setDisableWarningDialogOpen(true)
                        setDisableDialogMessage("This account has upcoming/on-going trips. Do you still want to continue with this action")
                    }
                    console.log("delete user error: ", e)
                })
        }
    }

    useEffect(() => {
        if (!showCcAndBcc) {
            setCcs([])
            setBccs([])
        }
    }, [showCcAndBcc])

    const onTextEditorValueChanged = (val, editoor) => {
        setHtmlString(val)
    }

    return (
        <div>
            <NavBar/>
            <div className={classes.root}>
                <Backdrop className={classes.backdrop} open={isLoading}>
                    <CircularProgress color="inherit"/>
                </Backdrop>
                <Grid
                    style={{
                        marginRight: "auto",
                        marginLeft: "16rem",
                        marginTop: "6%",
                        width: "73%"
                    }}
                    container
                    spacing={3}
                >
                    <Paper elevation={0} className={classes.paper}>
                        <Grid item xs={12}>
                            <Grid container spacing={10}>
                                <Grid style={{display: "flex"}} item xs={4}>
                                    <ArrowBackIcon
                                        onClick={onClickBack}
                                        style={{fontSize: "2rem", cursor: "pointer"}}
                                    />
                                    <Typography
                                        style={{
                                            marginLeft: "3%",
                                            fontWeight: "700",
                                            color: userDetails?.disabled ? theme.palette.background.flamingo : theme.palette.title.matterhorn
                                        }}
                                        variant="h5"
                                        gutterBottom
                                    >
                                        {userDetails?.firstName ? userDetails?.firstName : ''} {userDetails?.lastName ? userDetails?.lastName : ''} {userDetails?.disabled && '(Disabled)'}
                                    </Typography>
                                </Grid>


                                <Grid style={{display: "flex", alignItems: "center"}} item xs={6}>
                                    <Typography
                                        style={{
                                            marginLeft: "3%",
                                            fontWeight: "700",
                                            color: userDetails?.disabled ? theme.palette.background.flamingo : theme.palette.title.matterhorn
                                        }}
                                        gutterBottom
                                    >
                                        Strike
                                    </Typography>
                                    <Counter
                                        onMinus={() => decreaseStrikeCount()}
                                        onPlus={() => addStrikeCount()}
                                        displayValue={strikeCount}
                                    />

                                    <Typography
                                        style={{
                                            marginLeft: "3%",
                                            marginRight: "3%",
                                            fontWeight: "700",
                                            color: userDetails?.disabled ? theme.palette.background.flamingo : theme.palette.title.matterhorn
                                        }}
                                        gutterBottom
                                    >
                                        Payment Due
                                    </Typography>
                                    <TextField
                                        style={{width:100}}
                                        className={classes.nameTextField}
                                        variant="outlined"
                                        onChange={(event) => { !Number.isNaN((Number(event.target?.value))) && setPaymentDue(Number(event.target?.value)) }}
                                        value={paymentDue}
                                        size={"small"}
                                    />
                                    <Button variant={"contained"} color={"primary"} style={{marginLeft: "2%", backgroundColor: theme.palette.buttonPrimary.main}} size={"medium"}
                                            onClick={() => updatePaymentDue()}>
                                        Save
                                    </Button>
                                </Grid>


                                <Grid style={{display: "flex", justifyContent: "flex-end", alignItems: "center"}} item
                                      xs={2}>
                                    {!openEmailPage &&
                                    <>
                                        <span style={{
                                            fontSize: "20px",
                                            color: theme.palette.title.matterhorn,
                                            fontWeight: '700'
                                        }}>{!userDetails?.disabled ? 'Enabled' : 'Disabled'}</span>
                                        <GreenSwitch
                                            checked={typeof userDetails?.disabled === 'boolean' ? !userDetails?.disabled : true}
                                            onChange={changeUserStatus}
                                            name="checkedB"
                                            disabled={!!deleteBy}
                                            inputProps={{'aria-label': 'primary checkbox'}}
                                        />
                                    </>
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                        {openEmailPage ? (
                            <>
                                <Grid item xs={12} style={{paddingBottom: 0}}>
                                    <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                        <Grid style={{
                                            display: "flex",
                                            alignItems: "center",
                                            fontSize: "1.2rem",
                                            color: theme.palette.text.cello
                                        }} item xs={4}>
                                            To
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} style={{paddingTop: '5px'}}>
                                    <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                        <Grid style={{display: "flex", alignItems: "center"}} item xs={8}>
                                            <Autocomplete
                                                multiple
                                                id="email-options"
                                                options={emailOptions}
                                                onInputChange={onEmailInputChange}
                                                onChange={(event, value) => {
                                                    setEmails(value)
                                                }}
                                                value={emails}
                                                getOptionLabel={(option) => option.email}
                                                getOptionSelected={checkEmailIsUnique}
                                                filterSelectedOptions={true}
                                                style={{width: '100%'}}
                                                renderInput={(params) => (
                                                    <TextField
                                                        style={{
                                                            width: '100%',
                                                            backgroundColor: theme.palette.background.default
                                                        }}
                                                        {...params}
                                                        variant="outlined"
                                                        label=""
                                                        error={!emailIsValid}
                                                        helperText={!emailIsValid ? 'Invalid Email(s).' : null}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {!showCcAndBcc && <Grid item xs={12} style={{paddingTop: 0}}>
                                    <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                        <Grid style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: '1em 1em 1.5em 3em'
                                        }} item xs={4}>
                                            <Button style={{
                                                color: theme.palette.buttonPrimary.main,
                                                padding: 0,
                                                textTransform: 'none',
                                                fontSize: "1.1rem"
                                            }}
                                                    onClick={() => setShowCcAndBcc(true)}
                                            >Add CC or BCC</Button>
                                        </Grid>
                                    </Grid>
                                </Grid>}
                                {showCcAndBcc &&
                                <>
                                    <Grid item xs={12} style={{paddingTop: 0}}>
                                        <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                            <Grid style={{
                                                display: "flex",
                                                alignItems: "center",
                                                padding: '1em 1em 1.5em 3em'
                                            }} item xs={4}>
                                                <Button style={{
                                                    color: theme.palette.buttonPrimary.main,
                                                    padding: 0,
                                                    textTransform: 'none',
                                                    fontSize: "1.1rem"
                                                }}
                                                        onClick={() => setShowCcAndBcc(false)}
                                                >Remove CC or BCC</Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} style={{paddingBottom: 0}}>
                                        <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                            <Grid style={{
                                                display: "flex",
                                                alignItems: "center",
                                                fontSize: "1.2rem",
                                                color: theme.palette.text.cello
                                            }} item xs={4}>
                                                CC
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} style={{paddingTop: '5px'}}>
                                        <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                            <Grid style={{display: "flex", alignItems: "center"}} item xs={8}>
                                                <Autocomplete
                                                    multiple
                                                    id="cc-email-options"
                                                    options={emailOptions}
                                                    onInputChange={onEmailInputChange}
                                                    onChange={(event, value) => {
                                                        setCcs(value)
                                                    }}
                                                    value={ccs}
                                                    getOptionLabel={(option) => option.email}
                                                    getOptionSelected={checkEmailIsUnique}
                                                    filterSelectedOptions={true}
                                                    style={{width: '100%'}}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            style={{
                                                                width: '100%',
                                                                backgroundColor: theme.palette.background.default
                                                            }}
                                                            {...params}
                                                            variant="outlined"
                                                            label=""
                                                            error={!ccIsValid}
                                                            helperText={!ccIsValid ? 'Invalid CC Email(s).' : null}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} style={{paddingBottom: 0}}>
                                        <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                            <Grid style={{
                                                display: "flex",
                                                alignItems: "center",
                                                fontSize: "1.2rem",
                                                color: theme.palette.text.cello
                                            }} item xs={4}>
                                                BCC
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} style={{paddingTop: '5px'}}>
                                        <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                            <Grid style={{display: "flex", alignItems: "center"}} item xs={8}>
                                                <Autocomplete
                                                    multiple
                                                    id="bcc-email-options"
                                                    options={emailOptions}
                                                    onInputChange={onEmailInputChange}
                                                    onChange={(event, value) => {
                                                        setBccs(value)
                                                    }}
                                                    value={bccs}
                                                    getOptionLabel={(option) => option.email}
                                                    getOptionSelected={checkEmailIsUnique}
                                                    filterSelectedOptions={true}
                                                    style={{width: '100%'}}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            style={{
                                                                width: '100%',
                                                                backgroundColor: theme.palette.background.default
                                                            }}
                                                            {...params}
                                                            variant="outlined"
                                                            label=""
                                                            error={!bccIsValid}
                                                            helperText={!bccIsValid ? 'Invalid BCC Email(s).' : null}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>}
                                <Grid item xs={12} style={{paddingBottom: 0}}>
                                    <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                        <Grid style={{
                                            display: "flex",
                                            alignItems: "center",
                                            fontSize: "1.2rem",
                                            color: theme.palette.text.cello
                                        }} item xs={4}>
                                            Subject
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} style={{paddingTop: '5px'}}>
                                    <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                        <Grid style={{display: "flex", alignItems: "center"}} item xs={8}>
                                            <TextField style={{
                                                width: '100%',
                                                backgroundColor: theme.palette.background.default
                                            }} onChange={(event) => {
                                                setSubject(event?.target?.value)
                                            }}
                                                       error={!subjectIsValid}
                                                       helperText={!subjectIsValid ? 'Subject Not Provided.' : null}
                                                       value={subject} label="" variant="outlined"/>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} style={{paddingBottom: 0}}>
                                    <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                        <Grid style={{
                                            display: "flex",
                                            alignItems: "center",
                                            fontSize: "1.2rem",
                                            color: theme.palette.text.cello
                                        }} item xs={4}>
                                            Body
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} style={{paddingTop: '5px'}}>
                                    <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                        <Grid style={{display: "flex", alignItems: "center"}} item xs={8}>
                                            {/*<TextField multiline*/}
                                            {/*           rows={12}*/}
                                            {/*           style={{width: '100%', backgroundColor: '#ffffff'}} onChange={(event) => {setBody(event?.target?.value)}}*/}
                                            {/*           error={!bodyIsValid} helperText={!bodyIsValid ? 'Body Not Provided.' : null}*/}
                                            {/*           value={body} label="" variant="outlined" />*/}
                                            {/*<Editor editorState={editorState}*/}
                                            {/*        editorClassName={classes.editorClass}*/}
                                            {/*        wrapperClassName={classes.wrapperClass}*/}
                                            {/*        toolbarClassName={classes.toolbarClass}*/}
                                            {/*        onEditorStateChange={onTextEditorValueChanged}*/}
                                            {/*        placeholder={"Placeholder"}*/}
                                            {/*        toolbar={{*/}
                                            {/*            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'remove', 'history']*/}
                                            {/*        }}/>*/}
                                            <>
                                                <Editor
                                                    apiKey="6wzln6fm66sqb4cow9ngl2hogt7yqyq4ep8gq6k9azztjd2j"
                                                    onInit={(evt, editor) => (editorRef.current = editor)}
                                                    value={htmlString}
                                                    onEditorChange={onTextEditorValueChanged}
                                                    init={{
                                                        height: 500,
                                                        menubar: false,
                                                        plugins: [
                                                            "advlist autolink lists link image charmap print preview anchor",
                                                            "searchreplace visualblocks code fullscreen",
                                                            "insertdatetime media table paste code help wordcount"
                                                        ],
                                                        toolbar:
                                                            "undo redo | fontselect fontsizeselect formatselect  | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor  | fullscreen | link",
                                                        // "removeformat | help",
                                                        content_style:
                                                            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
                                                    }}
                                                />
                                            </>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {(attachedFiles && attachedFiles?.length !== 0) &&
                                <Grid item xs={12} style={{padding: '1em 0 1em 0.8em'}}>
                                    {attachedFiles.map((item, ind) =>
                                        <Chip
                                            key={item.key}
                                            label={item.file.name}
                                            onDelete={() => handleFileDelete(item)}
                                            className={classes.chip}
                                        />
                                    )}
                                </Grid>
                                }
                                <Grid item xs={12} style={{paddingTop: 0, paddingBottom: '1rem'}}>
                                    <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                        <Grid style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: '2.5em 1em 4em 2.5em'
                                        }} item xs={4}>
                                            <Button component="label" style={{
                                                color: theme.palette.title.matterhorn,
                                                padding: 0,
                                                textTransform: 'none',
                                                fontSize: "1.1rem"
                                            }}>
                                                <input
                                                    type="file"
                                                    name="file"
                                                    id="file"
                                                    hidden
                                                    multiple
                                                    ref={inputRef}
                                                    accept="image/jpg, image/jpeg, image/png, image/png, application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                    onChange={handleAttachFileChange}
                                                    className={classes.hideInput}
                                                    data-testid="attachFileBtn"
                                                />
                                                <AttachFile/> Attach</Button> <span style={{
                                            color: theme.palette.title.matterhorn,
                                            fontSize: "0.96rem",
                                            marginLeft: '1em'
                                        }}>{totalFileSize} MB of 5 MB used</span>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                        <Grid style={{display: "flex", alignItems: "center"}} item xs={5}>
                                            <Button style={{
                                                color: theme.palette.background.default,
                                                backgroundColor: theme.palette.buttonPrimary.main,
                                                border: `1px solid${  theme.palette.buttonPrimary.main}`,
                                                padding: '0.7rem 2.8rem',
                                                textTransform: 'none',
                                                fontSize: '1rem'
                                            }}
                                                    onClick={() => sendEmail()}>
                                                Send
                                            </Button>
                                            <Button variant="outlined" style={{
                                                color: theme.palette.buttonPrimary.main,
                                                border: `1px solid${  theme.palette.buttonPrimary.main}`,
                                                padding: '0.7rem 2.5rem',
                                                textTransform: 'none',
                                                marginLeft: '2rem',
                                                fontSize: '1rem'
                                            }}
                                                    onClick={() => {
                                                        setOpenEmailPage(false)
                                                        resetState()
                                                    }}>
                                                Discard
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {showErrorDialog &&
                                <Dialog
                                    open={showErrorDialog}
                                    onClose={(event, reason) => {
                                        if (reason !== 'backdropClick') {
                                            setErrorMessage(null)
                                            setShowErrorDialog(false)
                                        }
                                    }}
                                    fullWidth
                                    maxWidth="sm"
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <div style={{padding: '2rem'}}>
                                        <CloseIcon
                                            onClick={() => {
                                                setErrorMessage(null)
                                                setShowErrorDialog(false)
                                            }}
                                            style={{
                                                fontSize: "2rem",
                                                cursor: "pointer",
                                                float: 'right',
                                                top: "5%",
                                                position: "relative"
                                            }}
                                        />
                                        <DialogTitle style={{textAlign: 'center'}} id="alert-dialog-title">
                                            <div style={{display: "inline-grid"}}>
                                                ERROR <br/> <br/>
                                                {errorMessage}
                                            </div>
                                        </DialogTitle>
                                        <DialogContent style={{height: "25px"}}>
                                            <div style={{textAlign: "center"}}>
                                            </div>
                                        </DialogContent>
                                        <DialogActions style={{justifyContent: 'center'}}>
                                            <Button
                                                style={{
                                                    marginRight: "1rem",
                                                    color: theme.palette.background.default,
                                                    backgroundColor: theme.palette.background.flamingo
                                                }}
                                                variant="contained"
                                                onClick={() => {
                                                    setErrorMessage(null)
                                                    setShowErrorDialog(false)
                                                }}
                                            >
                                                OK
                                            </Button>
                                        </DialogActions>
                                    </div>
                                </Dialog>}
                            </>) : (
                            <>
                                <Grid item xs={12}>
                                    <Tabs
                                        value={tabValue}
                                        textColor="primary"
                                        TabIndicatorProps={{style: {display: "none"}}}
                                        onChange={handleTabChange}
                                    >
                                        <Tab style={getTabStyle(tabValue === 0)} label="User Info"/>
                                        <Tab style={getTabStyle(tabValue === 1)} label="Listings"/>
                                        <Tab style={getTabStyle(tabValue === 2)} label="History"/>
                                        <Tab style={getTabStyle(tabValue === 3)} label="Messages"/>
                                    </Tabs>
                                    <Divider/>
                                </Grid>
                                {tabValue === 0 &&
                                <div style={{fontSize: "1rem"}}>
                                    <Grid item xs={12}>
                                        <Grid container spacing={10} style={{paddingLeft: "1rem", paddingTop: '1.8em'}}>
                                            <Grid style={{display: "flex", alignItems: "center"}} item xs={1}>
                                                Profile Picture
                                            </Grid>
                                            <Grid style={{display: "flex", paddingLeft: '4em'}} item xs={5}>
                                                {userDetails?.profileImageUrl && userDetails?.profileImageUrl !== '' ?
                                                    (
                                                        <img className={classes.profileImage}
                                                             src={userDetails?.profileImageUrl}
                                                             alt="User Profile Image"/>
                                                    ) : (
                                                        <div className={classes.profileInitials}>
                                                            {userDetails?.firstName ? userDetails?.firstName?.split('')[0] : ''} {userDetails?.lastName ? userDetails?.lastName?.split('')[0] : ''}
                                                        </div>
                                                    )}
                                            </Grid>
                                            {deleteBy && (
                                                <Grid style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} item xs={5}>
                                                    <span style={{fontWeight: 600, fontSize: "1.3em"}}>This account will be deleted in {deleteBy && (Math.round((new Date(deleteBy).getTime() - new Date()) / 86400000))} day(s).</span>
                                                    <Button onClick={() => (setRevokeDialogOpen(true))} style={{color: "white", backgroundColor: "green", marginTop: "2em", width: "12em"}}>Revoke Account</Button>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                            <Grid style={{display: "flex"}} item xs={1}>
                                                Name
                                            </Grid>
                                            <Grid style={{display: "flex"}} item xs={6}
                                                  className={classes.detailsWeight}>
                                                {userDetails?.firstName ? userDetails?.firstName : ''} {userDetails?.lastName ? userDetails?.lastName : ''}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                            <Grid style={{display: "flex"}} item xs={1}>
                                                Email
                                            </Grid>
                                            <Grid style={{display: "flex"}} item xs={6}
                                                  className={classes.detailsWeight}>
                                                {userDetails?.email ? userDetails?.email : ''} <MailOutline
                                                onClick={() => {
                                                    setOpenEmailPage(true)
                                                    setEmails([{email: userDetails ? userDetails?.email : ''}])
                                                }} style={{
                                                color: theme.palette.text.cello,
                                                marginLeft: '1rem',
                                                cursor: 'pointer'
                                            }}/>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                            <Grid style={{display: "flex"}} item xs={1}>
                                                Phone
                                            </Grid>
                                            <Grid style={{display: "flex"}} item xs={6}
                                                  className={classes.detailsWeight}>
                                                {userDetails?.phoneNumber ? userDetails?.phoneNumber : ''}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                            <Grid style={{display: "flex"}} item xs={1}>
                                                DOB
                                            </Grid>
                                            <Grid style={{display: "flex"}} item xs={6}
                                                  className={classes.detailsWeight}>
                                                {userDetails?.dateOfBirth ? moment(userDetails?.dateOfBirth).format("MM/DD/YYYY") : ''}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                            <Grid style={{display: "flex"}} item xs={1}>
                                                Address
                                            </Grid>
                                            <Grid style={{display: "flex"}} item xs={6}
                                                  className={classes.detailsWeight}>
                                                {userDetails?.userAddress ? ((userDetails?.userAddress?.street ? `${userDetails?.userAddress?.street}, ` : '') +
                                                    (userDetails?.userAddress?.city ? `${userDetails?.userAddress?.city}, ` : '')) : ''}
                                                <br/>
                                                {userDetails?.userAddress ? ((userDetails?.userAddress?.province ? `${userDetails?.userAddress?.province}, ` : '') +
                                                    (userDetails?.userAddress?.postalCode ? `${userDetails?.userAddress?.postalCode}, ` : '')) : ''}
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    {/*<Grid item xs={12}>*/}
                                    {/*    <Grid container spacing={10} style={{paddingLeft: "1rem"}}>*/}
                                    {/*        <Grid style={{display: "flex"}} item xs={1}>*/}
                                    {/*            Strike*/}
                                    {/*        </Grid>*/}
                                    {/*        <Grid style={{display: "flex"}} item xs={6}*/}
                                    {/*              className={classes.detailsWeight}>*/}
                                    {/*            {userDetails?.strikeCount ? userDetails?.strikeCount  : ''}*/}
                                    {/*           </Grid>*/}
                                    {/*    </Grid>*/}
                                    {/*</Grid>*/}
                                    {/*<Grid item xs={12}>*/}
                                    {/*    <Grid container spacing={10} style={{paddingLeft: "1rem"}}>*/}
                                    {/*        <Grid style={{display: "flex"}} item xs={1}>*/}
                                    {/*            Payment Due*/}
                                    {/*        </Grid>*/}
                                    {/*        <Grid style={{display: "flex"}} item xs={6}*/}
                                    {/*              className={classes.detailsWeight}>*/}
                                    {/*            {userDetails?.paymentDue ?userDetails?.paymentDue : ''}*/}
                                    {/*             </Grid>*/}
                                    {/*    </Grid>*/}
                                    {/*</Grid>*/}

                                    {!deleteBy && (
                                        <Grid item xs={12}>
                                            <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                                <Grid style={{display: "flex"}} item xs={10}>
                                                    <Button style={{
                                                        color: theme.palette.background.default,
                                                        backgroundColor: theme.palette.background.flamingo,
                                                        textTransform: "none",
                                                        padding: "0.5rem 1.5rem"
                                                    }} onClick={() => { checkUserDeleteStatus() }}>Delete Account</Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    )}
                                </div>}
                                {tabValue === 1 && <UserListingsTable userListingsData={userListings}/>}
                                {tabValue === 2 && <UserHistoryTable userHistoryData={userHistory} userId={id}/>}
                                {deleteDialogOpen &&
                                <Dialog
                                    open={deleteDialogOpen}
                                    onClose={(event, reason) => {
                                        if (reason !== 'backdropClick') {
                                            setDeleteDialogOpen(false)
                                            setCanDelete(false)
                                        }
                                    }}
                                    fullWidth
                                    maxWidth="sm"
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <div style={{padding: '2rem'}}>
                                        <CloseIcon
                                            onClick={() => { setDeleteDialogOpen(false); setCanDelete(false) }}
                                            style={{
                                                fontSize: "2rem",
                                                cursor: "pointer",
                                                float: 'right',
                                                top: "5%",
                                                position: "relative"
                                            }}
                                        />
                                        <DialogTitle style={{textAlign: 'center'}} id="alert-dialog-title">
                                            <div style={{display: "inline-grid"}}>
                                                {canDelete ? (
                                                    <>
                                                        Are you sure you want to delete this <br/>
                                                        user account?
                                                    </>
                                                ) : (
                                                    <>
                                                        Error Deleting this account!
                                                    </>
                                                )}
                                            </div>
                                        </DialogTitle>
                                        <DialogContent>
                                            <div style={{
                                                textAlign: "center",
                                                color: theme.palette.background.flamingo,
                                                fontSize: "1rem"
                                            }}>
                                                {deleteDialogMessage}
                                            </div>
                                        </DialogContent>
                                        <DialogActions style={{justifyContent: 'center'}}>
                                            {canDelete ? (
                                                <>
                                                    <Button
                                                        style={{
                                                            marginRight: "1rem",
                                                            color: theme.palette.background.default,
                                                            backgroundColor: theme.palette.background.flamingo
                                                        }}
                                                        variant="contained"
                                                        onClick={deleteUserById}
                                                    >
                                                        Delete
                                                    </Button>
                                                    <Button onClick={() => { setDeleteDialogOpen(false); setCanDelete(false) }} variant="outlined"
                                                            style={{
                                                                color: theme.palette.buttonPrimary.main,
                                                                border: `1px solid ${  theme.palette.buttonPrimary.main}`
                                                            }}>Cancel</Button>
                                                </>
                                            ) : (
                                                <Button onClick={() => { setDeleteDialogOpen(false); setCanDelete(false) }} variant="outlined"
                                                        style={{
                                                            color: theme.palette.buttonPrimary.main,
                                                            border: `1px solid ${  theme.palette.buttonPrimary.main}`
                                                        }}>Close</Button>
                                            )}
                                        </DialogActions>
                                    </div>
                                </Dialog>}
                                {revokeDialogOpen &&
                                <Dialog
                                    open={revokeDialogOpen}
                                    onClose={(event, reason) => {
                                        if (reason !== 'backdropClick') {
                                            setRevokeDialogOpen(false)
                                        }
                                    }}
                                    fullWidth
                                    maxWidth="sm"
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <div style={{padding: '2rem'}}>
                                        <CloseIcon
                                            onClick={() => setRevokeDialogOpen(false)}
                                            style={{
                                                fontSize: "2rem",
                                                cursor: "pointer",
                                                float: 'right',
                                                top: "5%",
                                                position: "relative"
                                            }}
                                        />
                                        <DialogTitle style={{textAlign: 'center'}} id="alert-dialog-title">
                                            <div style={{display: "inline-grid"}}>
                                                Are you sure you want to revoke this <br/>
                                                user account?
                                            </div>
                                        </DialogTitle>
                                        <DialogContent style={{height: "10px"}}>
                                            <div style={{
                                                textAlign: "center",
                                                color: theme.palette.background.flamingo,
                                                fontSize: "1rem"
                                            }}>
                                            </div>
                                        </DialogContent>
                                        <DialogActions style={{justifyContent: 'center'}}>
                                            <Button
                                                style={{
                                                    marginRight: "1rem",
                                                    color: theme.palette.background.default,
                                                    backgroundColor: "green"
                                                }}
                                                variant="contained"
                                                onClick={revokeAccountDeletion}
                                            >
                                                Revoke
                                            </Button>
                                            <Button onClick={() => setRevokeDialogOpen(false)} variant="outlined"
                                                    style={{
                                                        color: theme.palette.buttonPrimary.main,
                                                        border: `1px solid ${  theme.palette.buttonPrimary.main}`
                                                    }}>Cancel</Button>
                                        </DialogActions>
                                    </div>
                                </Dialog>}
                                {disableDialogOpen &&
                                <Dialog
                                    open={disableDialogOpen}
                                    onClose={(event, reason) => {
                                        if (reason !== 'backdropClick') {
                                            setDisableDialogOpen(false)
                                        }
                                    }}
                                    fullWidth
                                    maxWidth="sm"
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <div style={{padding: '2rem'}}>
                                        <CloseIcon
                                            onClick={() => setDisableDialogOpen(false)}
                                            style={{
                                                fontSize: "2rem",
                                                cursor: "pointer",
                                                float: 'right',
                                                top: "5%",
                                                position: "relative"
                                            }}
                                        />
                                        <DialogTitle style={{textAlign: 'center'}} id="alert-dialog-title">
                                            <div style={{display: "inline-grid"}}>
                                                This account will be temporarily <br/>
                                                blocked. <br/>
                                                Are you sure you want to proceed?
                                            </div>
                                        </DialogTitle>
                                        <DialogContent style={{height: "10px"}}>
                                            <div style={{textAlign: "center"}}>
                                            </div>
                                        </DialogContent>
                                        <DialogActions style={{justifyContent: 'center'}}>
                                            <Button
                                                style={{
                                                    marginRight: "1rem",
                                                    color: theme.palette.background.default,
                                                    backgroundColor: theme.palette.background.flamingo
                                                }}
                                                variant="contained"
                                                onClick={() => changeUserStatusById(true)}
                                            >
                                                Disable Account
                                            </Button>
                                            <Button onClick={() => setDisableDialogOpen(false)} variant="outlined"
                                                    style={{
                                                        color: theme.palette.buttonPrimary.main,
                                                        border: `1px solid ${  theme.palette.buttonPrimary.main}`
                                                    }}>Cancel</Button>
                                        </DialogActions>
                                    </div>
                                </Dialog>}
                                {enableDialogOpen &&
                                <Dialog
                                    open={enableDialogOpen}
                                    onClose={(event, reason) => {
                                        if (reason !== 'backdropClick') {
                                            setEnableDialogOpen(false)
                                        }
                                    }}
                                    fullWidth
                                    maxWidth="sm"
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <div style={{padding: '2rem'}}>
                                        <CloseIcon
                                            onClick={() => setEnableDialogOpen(false)}
                                            style={{
                                                fontSize: "2rem",
                                                cursor: "pointer",
                                                float: 'right',
                                                top: "5%",
                                                position: "relative"
                                            }}
                                        />
                                        <DialogTitle style={{textAlign: 'center'}} id="alert-dialog-title">
                                            <div style={{display: "inline-grid"}}>
                                                This account will be enabled. <br/>
                                                Are you sure you want to proceed?
                                            </div>
                                        </DialogTitle>
                                        <DialogContent style={{height: "10px"}}>
                                            <div style={{textAlign: "center"}}>
                                            </div>
                                        </DialogContent>
                                        <DialogActions style={{justifyContent: 'center'}}>
                                            <Button
                                                style={{
                                                    marginRight: "1rem",
                                                    color: theme.palette.background.default,
                                                    backgroundColor: theme.palette.background.seaGreen
                                                }}
                                                variant="contained"
                                                onClick={() => changeUserStatusById(false)}
                                            >
                                                Enable Account
                                            </Button>
                                            <Button onClick={() => setEnableDialogOpen(false)} variant="outlined"
                                                    style={{
                                                        color: theme.palette.buttonPrimary.main,
                                                        border: `1px solid ${  theme.palette.buttonPrimary.main}`
                                                    }}>Cancel</Button>
                                        </DialogActions>
                                    </div>
                                </Dialog>}
                                {disableWarningDialogOpn &&
                                <Dialog
                                    open={disableWarningDialogOpn}
                                    onClose={(event, reason) => {
                                        if (reason !== 'backdropClick') {
                                            setDisableWarningDialogOpen(false)
                                        }
                                    }}
                                    fullWidth
                                    maxWidth="sm"
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <div style={{padding: '2rem'}}>
                                        <CloseIcon
                                            onClick={() => setDisableWarningDialogOpen(false)}
                                            style={{
                                                fontSize: "2rem",
                                                cursor: "pointer",
                                                float: 'right',
                                                top: "5%",
                                                position: "relative"
                                            }}
                                        />
                                        <DialogTitle style={{textAlign: 'center'}} id="alert-dialog-title">
                                            <div style={{display: "inline-grid"}}>
                                                Warning
                                            </div>
                                        </DialogTitle>
                                        <DialogContent>
                                            <div style={{fontSize: "14px", fontWeight: 500}}>
                                                {disableDialogMessage}
                                            </div>
                                        </DialogContent>
                                        <DialogActions style={{justifyContent: 'center'}}>
                                            <Button
                                                style={{
                                                    marginRight: "1rem",
                                                    color: theme.palette.background.default,
                                                    backgroundColor: theme.palette.background.seaGreen
                                                }}
                                                variant="contained"
                                                onClick={() => changeUserStatusById(true)}
                                            >
                                                Yes
                                            </Button>
                                            <Button onClick={() => setDisableWarningDialogOpen(false)} variant="outlined"
                                                    style={{
                                                        color: theme.palette.buttonPrimary.main,
                                                        border: `1px solid ${  theme.palette.buttonPrimary.main}`
                                                    }}>Cancel</Button>
                                        </DialogActions>
                                    </div>
                                </Dialog>}
                            </>
                        )}
                    </Paper>
                </Grid>
                {emailSentDialogOpen &&
                <Dialog
                    open={emailSentDialogOpen}
                    onClose={(event, reason) => {
                        if (reason !== 'backdropClick') {
                            setEmailSentDialogOpen(false)
                        }
                    }}
                    fullWidth
                    maxWidth="sm"
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <div style={{padding: '2rem'}}>
                        <CloseIcon
                            onClick={() => setEmailSentDialogOpen(false)}
                            style={{
                                fontSize: "2rem",
                                cursor: "pointer",
                                float: 'right',
                                top: "5%",
                                position: "relative"
                            }}
                        />
                        <DialogTitle style={{textAlign: 'center'}} id="alert-dialog-title">
                            <div style={{display: "inline-grid"}}>
                                {emailDialogMessage}
                            </div>
                        </DialogTitle>
                        <DialogContent style={{height: "10px"}}>
                            <div style={{textAlign: "center"}}>
                            </div>
                        </DialogContent>
                        <DialogActions style={{justifyContent: 'center'}}>
                            <Button
                                style={{
                                    marginRight: "1rem",
                                    color: theme.palette.background.default,
                                    backgroundColor: `${emailError ? theme.palette.background.flamingo : '#219653'}`
                                }}
                                variant="contained"
                                onClick={() => setEmailSentDialogOpen(false)}
                            >
                                OK
                            </Button>
                        </DialogActions>
                    </div>
                </Dialog>}
                <Snackbar autoHideDuration={2000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} open={openErrorSnackBar} onClose={handleErrorClose} >
                    <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
                        {errorSnackbarMessage}
                    </Alert>
                </Snackbar>
                <Snackbar autoHideDuration={2000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} open={openSuccessSnackBar} onClose={handleSuccessClose} >
                    <Alert onClose={handleSuccessClose} severity="success" sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </div>
        </div>
    )
}

export default UserById

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

