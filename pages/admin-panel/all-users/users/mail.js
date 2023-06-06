import React, {useContext, useEffect, useRef, useState} from "react"
import {
    Backdrop,
    Button,
    Chip, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid, Paper,
    TextField, Typography
} from "@material-ui/core"
import {Autocomplete} from "@material-ui/lab"
import CloseIcon from "@material-ui/icons/Close"
import {useRouter} from "next/router"
import Session from "../../../../sessionService"
import theme from "../../../../src/theme"
import {makeStyles} from "@material-ui/core/styles"
import NavBar from "../../../../components/admin-panel/navBar"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import dynamic from "next/dynamic"
import {EditorState} from "draft-js"
import {convertToHTML} from "draft-convert"
import API from "../../../api/baseApiIinstance"
import {AttachFile} from "@material-ui/icons"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import Context from "../../../../store/context"
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

function Mail() {
    const htmlToDraft = null
    const classes = useStyles()
    const router = useRouter()
    const token = Session.getToken("Wavetoken")
    const [loading, setLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showCcAndBcc, setShowCcAndBcc] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [showErrorDialog, setShowErrorDialog] = useState(false)
    const [attachedFiles, setAttachedFiles] = useState([])
    const {globalState, globalDispatch} = useContext(Context)

    // form values
    const [emails, setEmails] = useState([])
    const [ccs, setCcs] = useState([])
    const [bccs, setBccs] = useState([])
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
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


    useEffect(() => {
        if (globalState.adminSelectedUserEmails) {
            const emailArray = []
            globalState?.adminSelectedUserEmails?.forEach(e => {
                emailArray.push({email: e})
            })
            setEmails(emailArray)
        }
    }, [])

    const onClickBack = () => {
        router.push("/admin-panel/all-users/users")
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
        setHtmlString()
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
                                                        fontWeight: "700"
                                                    }}
                                                    variant="h5"
                                                    gutterBottom
                                                >
                                                    Send Emails
                                                </Typography>
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
                                </Paper>
                            </Grid>
                        </div>
                    </div>
    )

}

export default Mail
