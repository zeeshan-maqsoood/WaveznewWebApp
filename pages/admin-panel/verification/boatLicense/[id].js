import {makeStyles} from "@material-ui/core/styles"
import {useRouter} from "next/router"
import Session from "../../../../sessionService"
import React, {useEffect, useState} from "react"
import API from "../../../../pages/api/baseApiIinstance"
import NavBar from "../../../../components/admin-panel/navBar"
import Grid from "@material-ui/core/Grid"
import {Backdrop, CircularProgress, Paper, TextField, Tooltip, Typography} from "@material-ui/core"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import moment from "moment"
import Divider from "@material-ui/core/Divider"
import Dialog from "@material-ui/core/Dialog"
import CloseIcon from "@material-ui/icons/Close"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import ClearIcon from '@material-ui/icons/Clear'
import MaximizeIcon from '@material-ui/icons/Maximize'
import CheckIcon from "@material-ui/icons/Check"
import theme from "../../../../src/theme"
import MessageIcon from "@material-ui/icons/Message"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        fontFamily: "Roboto",
        color: theme.palette.title.matterhorn
    },
    paper: {
        padding: theme.spacing(4),
        color: theme.palette.text.secondary,
        width: 'inherit'
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
    documentName: {
        fontWeight: 500,
        fontSize: 18,
        width: 400,
        padding: 0,
        [theme.breakpoints.down("xs")]: {
            paddingTop: 15,
            width: "80%",
            paddingRight: "5%"
        }
    },
    detailsWeight: {
        fontWeight: "500",
        color: theme.palette.title.matterhorn,
        paddingLeft: '4em !important'
    },
    profileImage: {
        borderRadius: "50%",
        height: "6rem",
        width: "6rem"
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
    }
}))

function IdentityById() {
    const classes = useStyles()
    const router = useRouter()
    const token = Session.getToken("Wavetoken")
    const [loading, setLoading] = useState(false)
    const [rejectionDialog, setRejectionDialog] = useState(false)
    const [confirmationDialog, setConfirmationDialog] = useState(false)
    const [rejReason, setRejectionReason] = useState('')
    const [details, setDetails] = useState({})
    const [currDoc, setCurrDoc] = useState({})
    const [vesselDocuments, setVesselDocuments] = useState([])

    const {id} = router.query

    const onClickBack = () => {
        router.push("/admin-panel/verification?document=2")
    }

    const getData = () => {
        setLoading(true)
        API()
            .get(
                `vessel/admin/document/boatLicense/${id}`,
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
                    console.log(response.data)
                    setDetails(response.data)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("get user listings error: ", e)
            })
    }

    useEffect(() => {
        console.log('id?.toString()', id?.toString())
        if (id) {
            getData()
        }
    }, [id])

    const convertFromCamelCaseWithSpace = (str) => {
        return str?.replace(/([a-z])([A-Z])/g, '$1 $2')
    }
    const onClickApprove = () => {
        setConfirmationDialog(false)
        setLoading(true)
        API()
            .put(
                `/vessel/admin/document/${details.documents[0]._id}`,
                {
                    isVerified: true,
                    isRejected: false,
                    rejectionReason: '',
                    status: 'APPROVED'
                },
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
                    getData()
                    if (details.documents[1]) {
                        API()
                            .put(
                                `/vessel/admin/document/${details.documents[1]._id}`,
                                {
                                    isVerified: true,
                                    isRejected: false,
                                    rejectionReason: '',
                                    status: 'APPROVED'
                                },
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
                                    setLoading(false)
                                }
                            })
                            .catch((e) => {
                                console.log("get user listings error: ", e)
                            })
                    } else {
                        setLoading(false)
                    }
                }
            })
            .catch((e) => {
                console.log("get user listings error: ", e)
            })
    }

    const onClickReject = (doc) => {
        setLoading(true)
        API()
            .put(
                `/vessel/admin/document/${details.documents[0]._id}`,
                {
                    isVerified: false,
                    isRejected: true,
                    rejectionReason: rejReason,
                    status: 'REJECTION'
                },
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
                    getData()
                    if (details.documents[1]) {
                        API()
                            .put(
                                `/vessel/admin/document/${details.documents[1]._id}`,
                                {
                                    isVerified: false,
                                    isRejected: true,
                                    rejectionReason: rejReason,
                                    status: 'REJECTION'
                                },
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
                                    onClickRejectionDialog(false)
                                    setLoading(false)
                                }
                            })
                            .catch((e) => {
                                console.log("get user listings error: ", e)
                            })
                    } else {
                        onClickRejectionDialog(false)
                        setLoading(false)
                    }
                }
            })
            .catch((e) => {
                console.log("get user listings error: ", e)
            })
    }

    const onClickRejectionDialog = (bool) => {
        setRejectionDialog(bool)
        if (!bool) {
            setRejectionDialog(false)
            setRejectionReason('')
            setCurrDoc({})
        }
    }

    const onClickConfirmationDialog = (bool) => {
        setConfirmationDialog(bool)
        if (!bool) {
            setConfirmationDialog(false)
            setCurrDoc({})
        }
    }

    const handleCloseRej = (doc) => {
        setRejectionDialog(false)
        setRejectionReason('')
        setCurrDoc({})
    }
    return (
        <>
            <NavBar/>
            <div className={classes.root}>
                <Grid
                    style={{
                        marginRight: "auto",
                        marginLeft: "16rem",
                        marginTop: "8%",
                        width: "90%",
                        justifyContent: 'center'
                    }}
                    container
                    spacing={3}
                >
                    <Paper className={classes.paper}>
                        <Grid item xs={12}>
                            <Grid container spacing={3}>
                                <Grid style={{display: "flex"}} item xs={3}>
                                    <ArrowBackIcon
                                        onClick={onClickBack}
                                        style={{fontSize: "2rem", cursor: "pointer"}}
                                    />
                                    <Typography
                                        style={{marginLeft: "15px", fontWeight: "500"}}
                                        variant="h5"
                                        gutterBottom
                                    >
                                        {`${details.firstName ? details.firstName : ''} ${details.lastName ? details.lastName : ''}`}
                                    </Typography>
                                </Grid>
                                <Grid style={{textAlign: "right"}} item xs={9}>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={3}>
                                <Grid style={{display: "flex"}} item xs={2}>
                                    <Typography
                                        gutterBottom
                                    >
                                        Name
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography
                                        gutterBottom
                                    >
                                        Email
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography
                                        gutterBottom
                                    >
                                        Document Type
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography
                                        gutterBottom
                                    >
                                        Document Status
                                    </Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    <Typography
                                        gutterBottom
                                    >
                                        Reason
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography
                                        gutterBottom
                                    >
                                        Updated Date
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid style={{display: "flex"}} item xs={2}>
                                    <Typography
                                        style={{fontWeight: "500"}}
                                        gutterBottom
                                    >
                                        {`${details.firstName ? details.firstName : ''} ${details.lastName ? details.lastName : ''}`}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography
                                        style={{fontWeight: "500"}}
                                        gutterBottom
                                    >
                                        {`${details.email ? details.email : ''}`}
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography
                                        style={{fontWeight: "500"}}
                                        gutterBottom
                                    >
                                        Boat License
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography
                                        style={{fontWeight: "500"}}
                                        gutterBottom
                                    >
                                        {details?.documents ? details?.documents[0].isVerified && details?.documents[1].isVerified ? 'Approved' : (details?.documents[0].isRejected && details?.documents[1].isRejected ? 'Rejected' : 'Pending') : ''}
                                    </Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    {details?.documents && details?.documents[0].rejectionReason &&
                                        <Tooltip
                                            title={details?.documents[0].rejectionReason}
                                            aria-label={details?.documents[0].rejectionReason}><MessageIcon
                                            style={{
                                                cursor: "pointer",
                                                fontSize: "2rem"
                                            }}/></Tooltip>
                                    }
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography
                                        style={{fontWeight: "500"}}
                                        gutterBottom
                                    >
                                        {details?.documents ? moment(details?.documents[0].updatedAt).format("DD/MM/YYYY") : ''}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider/>
                        </Grid>
                        <Grid item xs={12} style={{
                            placeContent: 'center',
                            marginTop: '2rem',
                            marginBottom: '2rem',
                            textAlign: 'center'
                        }}>
                            {details.documents?.find(d => d.fileType === 'VesselLicenseFront')?.fileURL !== '' &&
                                <div style={{marginBottom: '1rem'}}>
                                    <img style={{height: '400px'}}
                                         src={details.documents?.find(d => d.fileType === 'VesselLicenseFront')?.fileURL}
                                         alt='Imag Document'/>
                                    <Typography style={{textAlign: 'center'}}>
                                        Front Image
                                    </Typography>
                                </div>}
                            {details.documents?.find(d => d.fileType === 'VesselLicenseBack')?.fileURL &&
                                <div>
                                    <img style={{height: '400px'}}
                                         src={details.documents?.find(d => d.fileType === 'VesselLicenseBack')?.fileURL}
                                         alt='Imag Document'/>
                                    <Typography style={{textAlign: 'center'}}>
                                        Back Image
                                    </Typography>
                                </div>}
                        </Grid>
                        <Grid item xs={12} style={{
                            placeContent: 'center',
                            display: 'flex',
                            marginTop: '2rem',
                            marginBottom: '2rem'
                        }}>
                            {details?.documents && !details?.documents[0].isVerified && !details?.documents[0].isRejected &&
                                <Button style={{
                                    backgroundColor: theme.palette.background.eucalyptus,
                                    alignSelf: 'center',
                                    height: 36,
                                    marginRight: '2rem'
                                }} variant="contained" color="primary" onClick={() => {
                                    onClickConfirmationDialog(true)
                                }}>Approve
                                </Button>}
                            {details?.documents && !details?.documents[0].isVerified && !details?.documents[0].isRejected &&
                                <Button style={{
                                    alignSelf: 'center',
                                    color: theme.palette.background.roman,
                                    height: 36,
                                    borderColor: theme.palette.background.roman
                                }} variant="outlined" color="primary" onClick={() => {
                                    onClickRejectionDialog(true)
                                }}>Reject
                                </Button>
                            }
                        </Grid>
                        {rejectionDialog && (
                            <div>
                                <form method='post'
                                      className={classes.root}
                                      noValidate
                                      autoComplete="off"
                                >
                                    <Dialog
                                        open={rejectionDialog}
                                        onClose={() => {
                                            onClickRejectionDialog(false)
                                        }}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <div style={{padding: '2rem'}}>
                                            <CloseIcon
                                                onClick={() => {
                                                    onClickRejectionDialog(false)
                                                }}
                                                style={{fontSize: "2rem", cursor: "pointer", float: 'right'}}
                                            />
                                            <DialogTitle style={{textAlign: 'center'}}
                                                         id="alert-dialog-title">{"Document Rejection Reason"}</DialogTitle>
                                            <hr
                                                style={{
                                                    width: 50,
                                                    backgroundColor: theme.palette.buttonPrimary.main,
                                                    height: 5,
                                                    marginTop: "-11px"
                                                }}
                                            ></hr>
                                            <DialogContent style={{width: '450px'}}>
                                                <div style={{fontSize: "18px", lineHeight: "2"}}>
                                                    <p style={{fontWeight: "400"}}>
                                                        <Grid container item xs={12}>

                                                            <Grid style={{marginBottom: '2rem'}} container item
                                                                  xs={12}>
                                                                <Grid
                                                                    style={{textAlign: "left", alignSelf: 'center'}}
                                                                    item xs={2}>
                                                                    <Typography
                                                                        component={'span'}
                                                                        style={{
                                                                            marginLeft: "auto",
                                                                            fontWeight: "500",
                                                                            fontSize: "1.1rem"
                                                                        }}
                                                                        variant="h6"
                                                                        gutterBottom
                                                                    >
                                                                        Reason
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid style={{textAlign: "left"}} item xs={10}>
                                                                    <TextField
                                                                        style={{
                                                                            width: "100%",
                                                                            maxWidth: "100%",
                                                                            minWidth: "100%",
                                                                            maxHeight: "300px",
                                                                            overflow: 'auto'
                                                                        }}
                                                                        id="outlined-basic"
                                                                        multiline
                                                                        inputProps={{
                                                                            maxLength: 500,
                                                                            "data-testid": "descriptionTextField"
                                                                        }}
                                                                        variant="outlined"
                                                                        value={rejReason}
                                                                        onChange={(event, value) => {
                                                                            (event?.target?.value ? setRejectionReason(event.target.value) : setRejectionReason(""))
                                                                        }}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </p>
                                                    <div
                                                        style={{
                                                            marginTop: "2.6em",
                                                            width: "100%",
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            justifyContent: "space-evenly"
                                                        }}
                                                    ></div>
                                                </div>
                                            </DialogContent>
                                            <DialogActions style={{justifyContent: 'center'}}>
                                                <Button
                                                    onClick={() => {
                                                        onClickReject()
                                                    }}
                                                    style={{
                                                        color: theme.palette.background.default,
                                                        backgroundColor: theme.palette.background.roman,
                                                        alignSelf: 'center',
                                                        height: 36,
                                                        marginRight: '2rem'
                                                    }}
                                                    variant="contained"
                                                >
                                                    Reject
                                                </Button>
                                                <Button onClick={() => {
                                                    onClickRejectionDialog(false)
                                                }} style={{color: '#99BAFA', height: 36, borderColor: '#99BAFA'}}>Cancel</Button>
                                            </DialogActions>
                                        </div>
                                    </Dialog>
                                </form>
                            </div>
                        )}
                        {confirmationDialog && (
                            <div>
                                <form method='post'
                                      className={classes.root}
                                      noValidate
                                      autoComplete="off"
                                >
                                    <Dialog
                                        open={confirmationDialog}
                                        onClose={() => {
                                            onClickConfirmationDialog(false)
                                        }}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <div style={{padding: '2rem'}}>
                                            <CloseIcon
                                                onClick={() => {
                                                    onClickConfirmationDialog(false)
                                                }}
                                                style={{fontSize: "2rem", cursor: "pointer", float: 'right'}}
                                            />
                                            <DialogTitle style={{textAlign: 'center'}}
                                                         id="alert-dialog-title">{"Approve Document?"}</DialogTitle>
                                            <hr
                                                style={{
                                                    width: 50,
                                                    backgroundColor: theme.palette.buttonPrimary.main,
                                                    height: 5,
                                                    marginTop: "-11px"
                                                }}
                                            />
                                            <DialogContent style={{width: '450px'}}>
                                                <div style={{fontSize: "18px", lineHeight: "2"}}>
                                                    <div
                                                        style={{
                                                            marginTop: "2.6em",
                                                            width: "100%",
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            justifyContent: "space-evenly"
                                                        }}
                                                    />
                                                </div>
                                            </DialogContent>
                                            <DialogActions style={{justifyContent: 'center'}}>
                                                <Button
                                                    onClick={() => {
                                                        onClickApprove()
                                                    }}
                                                    style={{
                                                        backgroundColor: theme.palette.background.eucalyptus,
                                                        alignSelf: 'center',
                                                        height: 36,
                                                        marginRight: '2rem'
                                                    }}
                                                    color="primary"
                                                    variant="contained"
                                                >
                                                    Confirm
                                                </Button>
                                                <Button onClick={() => {
                                                    onClickConfirmationDialog(false)
                                                }} style={{color: '#99BAFA', height: 36, borderColor: '#99BAFA'}}
                                                        variant="outlined"
                                                        color="primary">Cancel</Button>
                                            </DialogActions>
                                        </div>
                                    </Dialog>
                                </form>
                            </div>
                        )}
                    </Paper>
                </Grid>
            </div>
            <div className={classes.root}>
                <Backdrop className={classes.backdrop} open={loading}>
                    <CircularProgress color="inherit"/>
                </Backdrop>
            </div>
        </>
    )
}

export default IdentityById

