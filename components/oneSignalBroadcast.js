import {makeStyles} from "@material-ui/core/styles"
import React, {useEffect, useState} from "react"
import Grid from "@material-ui/core/Grid"
import {Backdrop, CircularProgress, Snackbar, TableCell, TextField, Typography} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import API from "../pages/api/baseApiIinstance"
import clearForm from "./addList/api/clearForm"
import Session from "../sessionService"
import {Alert} from "@material-ui/lab"

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%"
    },
    paper: {
        width: "100%",
        marginBottom: theme.spacing(2)
    },
    textField: {
        width: "100%"
    },
    captionInput: {
        marginTop: 20,
        width: "100%",
        height: "100%",
        border: 0,
        outline: "none",
        fontSize: "18px",
        [theme.breakpoints.down("xs")]: {
            marginTop: 0,
            marginBottom: 0,
            fontSize: "10px"
        }
    }
}))

function Users() {
    const classes = useStyles()
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [sent, setSent] = useState(false)
    const token = Session.getToken("Wavetoken")

    const onSendButtonClicked = () => {
        API()
            .post("notifications/sendNotificationToAllUsers", {
                headings: title,
                contents: content
            }, {
                headers: {
                    authorization: `Bearer ${  token}`
                }
            })
            .then((response) => {
                console.log("response is ", response)
                //forward to user listings page
                if (response.status === 200) {
                    setTitle("")
                    setContent("")
                    setSent(true)
                }
            })
            .catch((e) => {
            })
    }

    return (
        <>
        {sent &&
        <Snackbar open={sent} autoHideDuration={6000} onClose={setSent(false)}>
            <Alert onClose={setSent(false)} severity="success">
                The Notification Has Been Sent To All Users!
            </Alert>
        </Snackbar>}
        <div>
            <div className={classes.root}>
                <Grid
                    style={{
                        marginRight: "auto",
                        marginLeft: "16rem",
                        marginTop: "6%",
                        width: "76%"
                    }}
                    container
                    spacing={3}
                >
                    <Grid item xs={12}>
                        <Grid container spacing={10}>
                            <Grid style={{display: "flex"}} item xs={4}>
                                <Typography
                                    style={{fontWeight: "500"}}
                                    variant="h5"
                                    gutterBottom
                                >
                                    Notification To All Users
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={10}>
                            <Grid style={{display: "flex"}} item xs={6}>
                                <TextField
                                    style={{width: "100%", backgroundColor: "white"}}
                                    id="outlined-basic"
                                    variant="outlined"
                                    label="Title"
                                    value={title}
                                    onChange={(event, value) => {
                                        setTitle(event.target.value)
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={10}>
                            <Grid style={{display: "flex"}} item xs={6}>
                                <TextField
                                    style={{width: "100%", backgroundColor: "white"}}
                                    multiline
                                    rows={4}
                                    value={content}
                                    onChange={(event) => {
                                        setContent(event.target.value)
                                    }}
                                    variant="outlined"
                                    label="Content"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={10}>
                            <Grid style={{display: "flex"}} item xs={6}>
                                <Button
                                    data-testid="heroTextSaveBtn"
                                    style={{padding: "8px 30px 8px 30px", width: "100%"}}
                                    variant="contained"
                                    color="primary"
                                    onClick={onSendButtonClicked}
                                    disabled={title === "" || content === ""}
                                >
                                    Send
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </div>
        </>
    )
}

export default Users
