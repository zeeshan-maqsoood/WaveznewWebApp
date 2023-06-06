import React, {Component, useState, useEffect, useContext, useRef} from "react"
import {makeStyles} from "@material-ui/core/styles"
import NavBar from "../../../../../components/admin-panel/navBar"
import {useRouter} from "next/router"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import {
    Typography,
    TextField,
    Card,
    CardActionArea,
    CardMedia,
    CardActions, withStyles
} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import OpenInNewIcon from "@material-ui/icons/OpenInNew"
import API from "../../../../api/baseApiIinstance"
import Session from "../../../../../sessionService"
import {EditorState, ContentState} from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import dynamic from "next/dynamic"
import {convertToHTML} from 'draft-convert'
import Switch from '@material-ui/core/Switch'
import {grey, lightBlue} from "@material-ui/core/colors"
import theme from "../../../../../src/theme"
import {Editor} from "@tinymce/tinymce-react"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        fontFamily: "Roboto",
        color: theme.palette.title.matterhorn
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
        padding: "1rem"
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

export default function InformationBanner() {
    const classes = useStyles()
    const router = useRouter()
    const token = Session.getToken("Wavetoken")
    const [loading, setLoading] = useState(false)
    const [apiTitleValue, setApiTitleValue] = useState("")
    const [titleText, setTitleText] = useState("")
    const [charsLeft, setCharsLeft] = useState(60)
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
        router.push("/admin-panel/pages/home")
    }

    const onTextEditorValueChanged = (val, editorState) => {
        setHtmlString(val)
        setEditorUnsavedChanges(JSON.stringify(val) !== JSON.stringify(apiEditorContent))
    }

    useEffect(() => {
        // htmlToDraft = require('html-to-draftjs').default;
        API()
            .get(
                `configuration/HOME_INFORMATION_BANNER_TITLE`,
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
                `configuration/HOME_INFORMATION_BANNER_PAGE_CONTENT`,
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
                    // setApiEditorContent(contentState);
                    // setEditorUnsavedChanges(false);
                    setApiEditorContent(response.data.stringValue)
                    setHtmlString(response.data.stringValue)
                    setEditorUnsavedChanges(false)
                }
            })
            .catch((e) => {
                // const {contentBlocks, entityMap} = htmlToDraft("");
                // console.log(contentBlocks);
                // const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
                setApiEditorContent("")
                console.log("Configuration Not found: ", e)
            })

    }, [])

    useEffect(() => {
        setTitleText(apiTitleValue)
        // setCharsLeft(apiTitleValue.length);
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
            samplePayload.key = "HOME_INFORMATION_BANNER_TITLE"
            samplePayload.stringValue = titleText
            samplePayload.booleanValue = showBanner
            API()
                .put(
                    `configuration/HOME_INFORMATION_BANNER_TITLE`,
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
        sampleContentPayload.key = "HOME_INFORMATION_BANNER_PAGE_CONTENT"
        if (editorRef.current) {
            console.log(editorRef.current.getContent())
            setHtmlString(editorRef.current.getContent())
        }
        sampleContentPayload.stringValue = editorRef.current.getContent()
        // sampleContentPayload.stringValue = convertToHTML({
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
        // })(editorState.getCurrentContent());
        API()
            .put(
                `configuration/HOME_INFORMATION_BANNER_PAGE_CONTENT`,
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
                    // const {contentBlocks, entityMap} = htmlToDraft(response.data.stringValue);
                    // console.log(contentBlocks);
                    // const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
                    setApiEditorContent(response.data.value)
                    setHtmlString(response.data.value)
                    setEditorUnsavedChanges(false)
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
        // setCharsLeft(apiTitleValue.length);
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
                            <Grid style={{display: "flex"}} item xs={4}>
                                <ArrowBackIcon
                                    onClick={onClickBack}
                                    style={{fontSize: "2rem", cursor: "pointer"}}
                                />
                                <Typography
                                    style={{marginLeft: "3%", fontWeight: "500"}}
                                    variant="h5"
                                    gutterBottom
                                >
                                    Information Banner
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid style={{padding: "2rem 0 0 2rem"}} container spacing={3}>
                                <Grid item style={{textAlign: "left"}}>
                                    <Typography
                                        style={{
                                            marginLeft: "auto",
                                            fontWeight: "500",
                                            fontSize: "1.1rem"
                                        }}
                                        variant="h6"
                                        gutterBottom
                                    >
                                        Show Information Banner
                                    </Typography>
                                </Grid>
                                <Grid item style={{textAlign: "left"}}>
                                    <div style={{marginTop: "-5px"}}>
                                        <BlueSwitch
                                            checked={showBanner}
                                            onChange={(event) => {
                                                setShowBanner(event.target.checked)
                                                console.log(event.target.checked !== showBannerApiValue)
                                                setShowBannerUnsavedChanges(event.target.checked !== showBannerApiValue)
                                            }}
                                            color="primary"
                                            name="checkedB"
                                            inputProps={{'aria-label': 'primary checkbox'}}
                                        />
                                    </div>
                                </Grid>
                            </Grid>
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
                                                // setCharsLeft(event?.target?.value?.length ? event.target.value.length : 0);
                                            }}
                                        />
                                        {/*<div style={{float: "right"}} className={`mdc-text-field-character-counter ${classes.charCounter}`}>{charsLeft} / 60</div>*/}
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
                                    {/*<form className={classes.root} noValidate autoComplete="off">*/}
                                    {/*<TextField*/}
                                    {/*    style={{ width: "100%" }}*/}
                                    {/*    id="outlined-basic"*/}
                                    {/*    variant="outlined"*/}
                                    {/*    inputProps={{ maxLength: 300 }}*/}
                                    {/*/>*/}
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
                                    {/*<SlateEditor />*/}
                                    {/*</form>*/}
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
                                    <Button style={{color: theme.palette.button.red, padding: "8px 30px 8px 30px"}}
                                            data-testid="resetBtn" onClick={onResetClick}>Reset</Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

// TODO to use the dom purify for showing the saved html in database using this tutorial
// https://blog.logrocket.com/building-rich-text-editors-in-react-using-draft-js-and-react-draft-wysiwyg/
