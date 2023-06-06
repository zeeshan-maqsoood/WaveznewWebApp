import React, {useState, useEffect, useRef} from "react"
import {makeStyles} from "@material-ui/core/styles"
import NavBar from "../../../components/admin-panel/navBar"
import {useRouter} from "next/router"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import {
    Typography,
    TextField, withStyles, Dialog, DialogTitle, DialogContent, DialogActions
} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import API from "../../../pages/api/baseApiIinstance"
import Session from "../../../sessionService"
import {EditorState, ContentState} from 'draft-js'
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import dynamic from "next/dynamic";
import {convertToHTML} from 'draft-convert'
import Switch from '@material-ui/core/Switch'
import {grey, lightBlue} from "@material-ui/core/colors"
import PropTypes from "prop-types"
import CloseIcon from "@material-ui/icons/Close"
import { Editor } from "@tinymce/tinymce-react"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        fontFamily: "Roboto",
        color: "#4F4F4F"
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary
    },
    charCounter: {
        marginTop: "-37px",
        marginRight: "10px",
        fontWeight: "bold",
        fontSize: "15px"
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

const BlueSwitch = withStyles({
    switchBase: {
        color: grey[300],
        '&$checked': {
            color: lightBlue[500]
        },
        '&$checked + $track': {
            backgroundColor: lightBlue[500]
        }
    },
    checked: {},
    track: {}
})(Switch)

export default function SharedHtmlEditorLayout(props) {
    const {type} = props
    const [titleEnum, setTitleEnum] = useState(null)
    const [contentEnum, setContentEnum] = useState(null)
    const [pageTitle, setPageTitle] = useState(null)
    const [unsavedDialogOpen, setUnsavedDialogOpen] = useState(false)
    const htmlToDraft = null
    const classes = useStyles()
    const router = useRouter()
    const token = Session.getToken("Wavetoken")
    const [loading, setLoading] = useState(false)
    const [apiTitleValue, setApiTitleValue] = useState("")
    const [titleText, setTitleText] = useState("")
    const [titleUnsavedChanges, setTitleUnsavedChanges] = useState(false)
    const [showBanner, setShowBanner] = useState(false)
    const [showBannerUnsavedChanges, setShowBannerUnsavedChanges] = useState(false)
    const [showBannerApiValue, setShowBannerApiValue] = useState(false)
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty()
    )
    const [apiEditorContent, setApiEditorContent] = useState(null)
    const [editorUnsavedChanges, setEditorUnsavedChanges] = useState(false)
    // const Editor = dynamic(
    //     () => {
    //         return import("react-draft-wysiwyg").then(mod => mod.Editor);
    //     },
    //     {ssr: false}
    // );
    const editorRef = useRef(null)
    const [htmlString, setHtmlString] = useState("")

    const samplePayload = {
        key: "",
        stringValue: "",
        booleanValue: false,
        numberValue: 0
    }

    const sampleContentPayload = {
        key: "",
        stringValue: "",
        booleanValue: false,
        numberValue: 0
    }

    const onClickBack = () => {
        if (titleUnsavedChanges || editorUnsavedChanges) {
            setUnsavedDialogOpen(true)
        } else {
            router.push("/admin-panel/footer")
        }
    }

    const onTextEditorValueChanged = (val, editorState) => {
        setHtmlString(val)
        setEditorUnsavedChanges(JSON.stringify(val) !== JSON.stringify(apiEditorContent))
    }

    useEffect(() => {
        // htmlToDraft = require('html-to-draftjs').default;
        if (type) {
            const typeObj = getEnumType(type)
            if (typeObj) {
                setPageTitle(typeObj.title)
                setTitleEnum(typeObj.titleEnum)
                setContentEnum(typeObj.contentEnum)
                API()
                    .get(
                        `configuration/${typeObj.titleEnum}`,
                        {
                            headers: {
                                accept: "application/json"
                            }
                        }
                    )
                    .then((response) => {
                        console.log("response is ", response)
                        if ((response.status = 200)) {
                            setApiTitleValue(response.data.stringValue)
                            setShowBannerApiValue(response.data.booleanValue)
                        }
                    })
                    .catch((e) => {
                        console.log("Configuration Not found: ", e)
                    })

                API()
                    .get(
                        `configuration/${typeObj.contentEnum}`,
                        {
                            headers: {
                                accept: "application/json"
                            }
                        }
                    )
                    .then((response) => {
                        console.log("response is ", response)
                        if ((response.status = 200)) {
                            // const {contentBlocks, entityMap} = htmlToDraft(response.data.stringValue);

                            // console.log(contentBlocks);
                            // const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
                            setApiEditorContent(response.data.stringValue)
                            setHtmlString(response.data.stringValue)
                            setEditorUnsavedChanges(false)
                        }
                    })
                    .catch((e) => {
                        const {contentBlocks, entityMap} = htmlToDraft("")
                        console.log(contentBlocks)
                        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
                        setApiEditorContent(contentState)
                        console.log("Configuration Not found: ", e)
                    })
            }
        }
    }, [])

    useEffect(() => {
        if (type) {

        }
    }, [type])

    useEffect(() => {
        setTitleText(apiTitleValue)
        setTitleUnsavedChanges(false)
    }, [apiTitleValue])

    useEffect(() => {
        setShowBanner(showBannerApiValue)
        setShowBannerUnsavedChanges(false)
    }, [showBannerApiValue])

    useEffect(() => {
        if (apiEditorContent) {
            // setEditorState(EditorState.createWithContent(apiEditorContent));
            setEditorUnsavedChanges(false)
        }
    }, [apiEditorContent])

    const onSaveButtonClicked = () => {
        // htmlToDraft = require('html-to-draftjs').default;
        if (titleUnsavedChanges || showBannerUnsavedChanges) {
            samplePayload.key = titleEnum
            samplePayload.stringValue = titleText
            samplePayload.booleanValue = showBanner
            API()
                .put(
                    `configuration/${titleEnum}`,
                    samplePayload
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
                    if ((response.status = 200)) {
                        setApiTitleValue(response.data.stringValue)
                        setShowBanner(response.data.booleanValue)
                        setShowBannerApiValue(response.data.booleanValue)
                        console.log("response ", response.data)
                    }
                })
                .catch((e) => {
                    console.log("Configuration Not found: ", e)
                })
        }
        console.log(convertToHTML(editorState.getCurrentContent()))
        if (editorRef.current) {
            console.log(editorRef.current.getContent())
            setHtmlString(editorRef.current.getContent())
        }
        sampleContentPayload.key = contentEnum
        sampleContentPayload.stringValue = editorRef.current.getContent()
        // sampleContentPayload.stringValue = convertToHTML({
        //     styleToHTML: (style) => {
        //         console.log('style', style);
        //     },
        //     blockToHTML: (block) => {
        //         if (block?.data['text-align'] && block?.data['text-align'] === 'right') {
        //             return <p style={{textAlign: "right"}}/>;
        //         } else if (block?.data['text-align'] && block?.data['text-align'] === 'center') {
        //             return <p style={{textAlign: "center"}}/>;
        //         } else if (block?.data['text-align'] && block?.data['text-align'] === 'justify') {
        //             return <p style={{textAlign: "justify"}}/>;
        //         }
        //         console.log('blobk test', block);
        //     },
        //     entityToHTML: (entity, originalText) => {
        //         console.log('entty original text', entity, originalText);
        //         return originalText;
        //     }
        // })(editorState.getCurrentContent());
        API()
            .put(
                `configuration/${contentEnum}`,
                sampleContentPayload
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
                if ((response.status = 200)) {
                    // setApiTitleValue(response.data.stringValue);
                    console.log("response ", response.data)
                    setApiEditorContent(response.data.value)
                    setHtmlString(response.data.value)
                    setEditorUnsavedChanges(false)
                    // const {contentBlocks, entityMap} = htmlToDraft(response.data.stringValue);
                    // console.log(contentBlocks);
                    // const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
                    // setApiEditorContent(contentState);
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })
    }

    const onResetClick = () => {
        setTitleText(apiTitleValue)
        setTitleUnsavedChanges(false)
        setShowBannerUnsavedChanges(false)
        setEditorUnsavedChanges(false)
        // setEditorState(EditorState.createWithContent(apiEditorContent));
        setShowBanner(showBannerApiValue)
        setHtmlString(apiEditorContent)
    }

    return (
        <div>
            <NavBar/>
            <div className={classes.root}>
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
                    <Grid item xs={12}>
                        <Grid container spacing={10}>
                            <Grid style={{display: "flex"}} item xs={6}>
                                <ArrowBackIcon
                                    onClick={onClickBack}
                                    style={{fontSize: "2rem", cursor: "pointer"}}
                                />
                                <Typography
                                    style={{marginLeft: "3%", fontWeight: "500"}}
                                    variant="h5"
                                    gutterBottom
                                >
                                    {pageTitle}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid style={{padding: "2rem"}} container spacing={3}>
                                <Grid style={{textAlign: "left"}} item xs={12}>
                                    <Typography
                                        style={{
                                            marginLeft: "auto",
                                            fontWeight: "500",
                                            fontSize: "1.1rem"
                                        }}
                                        variant="h6"
                                        gutterBottom
                                    >
                                        Title
                                    </Typography>
                                    <form className={classes.root} noValidate autoComplete="off">
                                        <TextField
                                            style={{width: "100%"}}
                                            id="outlined-basic"
                                            variant="outlined"
                                            placeholder="Enter your title"
                                            inputProps={{maxLength: 60, "data-testid": "titleTestBox"}}
                                            value={titleText}
                                            onChange={(event, value) => {
                                                (event?.target?.value ? setTitleText(event.target.value) : setTitleText(""))
                                                setTitleUnsavedChanges(apiTitleValue !== event?.target?.value)
                                            }}
                                        />
                                    </form>
                                </Grid>
                                <Grid style={{textAlign: "left"}} item xs={12}>
                                    <Typography
                                        style={{
                                            marginLeft: "auto",
                                            fontWeight: "500",
                                            fontSize: "1.1rem"
                                        }}
                                        variant="h6"
                                        gutterBottom
                                    >
                                        Page Content
                                    </Typography>
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
                                    {/*<Editor editorState={editorState}*/}
                                    {/*        editorClassName={classes.editorClass}*/}
                                    {/*        wrapperClassName={classes.wrapperClass}*/}
                                    {/*        toolbarClassName={classes.toolbarClass}*/}
                                    {/*        onEditorStateChange={onTextEditorValueChanged}*/}
                                    {/*        placeholder={"Placeholder"}*/}
                                    {/*        toolbar={{*/}
                                    {/*            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'remove', 'history']*/}
                                    {/*        }}/>*/}
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        style={{marginRight: "3rem", padding: "8px 30px 8px 30px"}}
                                        variant="contained"
                                        color="primary"
                                        disabled={!showBannerUnsavedChanges && !titleUnsavedChanges && titleText.length !== 0 && !editorUnsavedChanges}
                                        onClick={onSaveButtonClicked}
                                        data-testid="saveBtn"
                                    >
                                        Save
                                    </Button>
                                    <Button style={{color: "#FF0000", padding: "8px 30px 8px 30px"}}
                                            data-testid="resetBtn" onClick={onResetClick}>Reset</Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
                {unsavedDialogOpen &&
                <Dialog
                    open={unsavedDialogOpen}
                    onClose={(event, reason) => {
                        if (reason !== 'backdropClick') {
                            setUnsavedDialogOpen(false)
                        }
                    }}
                    fullWidth
                    maxWidth="sm"
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <div style={{padding: '2rem'}}>
                        <CloseIcon
                            onClick={() => setUnsavedDialogOpen(false)}
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
                                You will loose the changes if not saved. <br/>
                                Do you wish to proceed?
                            </div>
                        </DialogTitle>
                        <DialogContent style={{height: "10px"}}>
                            <div style={{textAlign: "center"}}>
                            </div>
                        </DialogContent>
                        <DialogActions style={{justifyContent: 'center'}}>
                            <Button
                                style={{marginRight: "1rem", color: "#FFFFFF", backgroundColor: "#FF0000"}}
                                variant="contained"
                                onClick={() => {
                                    router.push("/admin-panel/footer")
                                }}
                            >
                                Ok
                            </Button>
                            <Button onClick={() => setUnsavedDialogOpen(false)} variant="outlined" style={{
                                color: "#4D96FB",
                                border: "1px solid #4D96FB"
                            }}>Cancel</Button>
                        </DialogActions>
                    </div>
                </Dialog>}
            </div>
        </div>
    )
}

export function getEnumType(en) {
    switch (en) {
        case "ABOUT_WAVEZ":
            return {
                titleEnum: 'ABOUT_WAVEZ_TITLE',
                contentEnum: 'ABOUT_WAVEZ_PAGE_CONTENT',
                title: 'About Wavez'
            }
        case "HOW_IT_WORKS":
            return {
                titleEnum: 'HOW_IT_WORKS_TITLE',
                contentEnum: 'HOW_IT_WORKS_PAGE_CONTENT',
                title: 'How It Works'
            }
        case "PARTNERS":
            return {
                titleEnum: 'PARTNERS_TITLE',
                contentEnum: 'PARTNERS_PAGE_CONTENT',
                title: 'Partners'
            }
        case "CONTACT_US":
            return {
                titleEnum: 'CONTACT_US_TITLE',
                contentEnum: 'CONTACT_US_PAGE_CONTENT',
                title: 'Contact Us'
            }
        case "PRIVACY_POLICY":
            return {
                titleEnum: 'PRIVACY_POLICY_TITLE',
                contentEnum: 'PRIVACY_POLICY_PAGE_CONTENT',
                title: 'Privacy Policy'
            }
        case "TERMS_OF_SERVICE":
            return {
                titleEnum: 'TERMS_OF_SERVICE_TITLE',
                contentEnum: 'TERMS_OF_SERVICE_PAGE_CONTENT',
                title: 'Terms Of Service'
            }
        default:
            return null
    }
}

SharedHtmlEditorLayout.propTypes = {
    type: PropTypes.string.isRequired
}

