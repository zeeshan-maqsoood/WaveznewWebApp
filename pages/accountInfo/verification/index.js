import React, {useEffect, useState} from "react"
import {
    Grid,
    makeStyles,
    TableContainer,
    Table,
    Paper,
    TableBody,
    TableRow,
    TableCell,
    Button, Backdrop, CircularProgress, Typography, Tooltip
} from "@material-ui/core"
import AccountInfoBanner from "../../../components/accountInfo/accountInfoBanner"
import AccountInfoTabs from "../../../components/accountInfo/accountInfoTabs"
import NavBar from "../../../components/navbar/navBar"
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import {Modal} from "react-responsive-modal"
import ProofForm from "../../../components/accountInfo/proofForm"
import TruliooStatus from "../../../components/accountInfo/truliooStatus"
import API from "../../api/baseApiIinstance"
import BoatLicenseUpload from "../../../components/accountInfo/boatLicenseUpload"
import Session from "../../../sessionService"
import MessageIcon from '@material-ui/icons/Message'
import ClearIcon from "@material-ui/icons/Clear"
import theme from "../../../src/theme"

const useStyles = makeStyles((theme) => ({
    filler: {
        backgroundColor: theme.palette.background.lightGrey
    },
    root: {
        flexGrow: 1,
        fontFamily: "Roboto",
        color: "#4F4F4F"
    },
    content: {
        backgroundColor: theme.palette.background.default,
        borderLeft: `2px solid ${  theme.palette.border.dimGray}`
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff'
    },
    customModal: {
        maxWidth: "100%",
        margin: 0,
        padding: 0
    }
}))

export default function IdentityVerification() {
    const classes = useStyles()
    const [serverAuth, setServerAuth] = useState(false)
    const [loading, setLoading] = useState(false)
    const [identityProofModal, setIdentityProofModal] = useState(false)
    const [boatLicenseModal, setBoatLicenseModal] = useState(false)
    const [openStatusModal, setOpenStatusModal] = useState(false)
    const [boatLicenseStatus, setBoatLicenseStatus] = useState(false)
    const [boatLicenseRejectionReason, setBoatLicenseRejectionReason] = useState('')
    const token = Session.getToken("Wavetoken")
    const [recordData, setRecordData] = useState({verifiedRecord: []})
    const [transactionsData, setTransactionsData] = useState(undefined)
    const [userDetails, setUserDetails] = useState(undefined)
    const [flag, setFlag] = useState(false)
    const [documentData, setDocumentData] = useState([
        {name: "Boating Licence", shortForm: "boat-license", status: ""},
        {name: "Identity Proof", shortForm: "identity-proof", status: ""}
    ])


    const handleOpenFormModal = (documentType) => {
        if (documentType === "identity-proof" && serverAuth) {
            setIdentityProofModal(true)
        } else if (documentType === "boat-license") {
            setBoatLicenseModal(true)
        } else {
            window.alert('Invalid Auth')
        }
    }

    const boatLicenseApi = () => {
        API()
            .get(
                `/users/vesselLicense`,
                {
                    headers: {
                        authorization: `Bearer ${  token}`
                    }
                }
            )
            .then((response) => {
                console.log("response boat license is ", response.data)
                const front = response.data.documents.filter(item => item.fileType === "VesselLicenseFront").length > 0
                const back = response.data.documents.filter(item => item.fileType === "VesselLicenseBack").length > 0
                const updateStatus = documentData.map(item => {
                    return item.shortForm === "boat-license" ? {
                        ...item,
                        status: front && back ? "Provided" : "Not Provided"
                    } : item
                })
                setFlag(true)
                setDocumentData(updateStatus)
                console.log("STATUSSSSS, ", response.data.documents)
                const frontLiSt = response.data.documents.find(item => item.fileType === "VesselLicenseFront")?.status
                const backLiSt = response.data.documents.find(item => item.fileType === "VesselLicenseBack")?.status
                if (frontLiSt && backLiSt && (frontLiSt === backLiSt)) {
                    setBoatLicenseStatus(frontLiSt)
                } else {
                    setBoatLicenseStatus("Pending")
                }
                setBoatLicenseRejectionReason(response.data.documents.find(item => item.fileType === "VesselLicenseFront")?.rejectionReason)
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })
    }

    const callApi = () => {
        setLoading(true)
        API()
            .get(
                `/docv/testauthentication`,
                {
                    headers: {
                        authorization: `Bearer ${  token}`
                    }
                }
            )
            .then((response) => {
                console.log("response test authentication is ", response)
                if ((response.status = 200)) {
                    setServerAuth(true)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })
    }
    const getTransactionStatus = (check) => {
        setLoading(true)
        API()
            .get(
                `/docv/transaction`,
                {
                    headers: {
                        authorization: `Bearer ${  token}`
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setTransactionsData(response.data)
                    if (response.data) {
                        if (response.data.success === false) {
                            // setTransactionsData(null);
                            const updateStatus = documentData.map(item => {
                                return item.shortForm === "identity-proof" ? {...item, status: "Not Provided"} : item
                            })
                            setDocumentData(updateStatus)
                            setLoading(false)
                        } else {
                            const updateStatus = documentData.map(item => {
                                return item.shortForm === "identity-proof" ? {...item, status: "Provided"} : item
                            })
                            setDocumentData(updateStatus)
                            if (check) {
                                getRecord(check)
                            }
                        }
                    }
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })
    }
    const getRecord = (check) => {
        setLoading(true)
        API()
            .get(
                `/docv/getVRecordByUserId`,
                {
                    headers: {
                        authorization: `Bearer ${  token}`
                    }
                }
            )
            .then((response) => {
                console.log("response get transactaion is ", response)
                if ((response.status = 200)) {
                    setRecordData(response.data)
                    if (check) {
                        setOpenStatusModal(true)
                    }
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })
    }

    useEffect(() => {
        let isMounted = true
        if (documentData[0].status !== "") {
            getTransactionStatus()
            callApi()
            getRecord()
        }

        return () => {
            isMounted = false
        }
    }, [identityProofModal, documentData[0].status])

    useEffect(() => {
        boatLicenseApi()
    }, [boatLicenseModal])

    useEffect(() => {
        const getUserDetails = () => {
            setLoading(true)
            API()
                .get(
                    "users/getUserDetails", {
                        headers: {
                            authorization: `Bearer ${  token}`
                        }
                    }
                )
                .then((response) => {
                    console.log("response get user  is ", response)
                    if ((response.status = 200)) {
                        console.log(response.data)
                        setLoading(false)
                        setUserDetails(response.data)
                    }
                })
                .catch((e) => {
                    console.log("Configuration Not found: ", e)
                })
        }
        boatLicenseApi()
        getUserDetails()
    }, [])

    return (
        <>
            <Modal
                open={identityProofModal}
                onClose={() => setIdentityProofModal(false)}
                center
                styles={{modal: {width: "100%", height: "100%"}}}
                classNames={{modal: classes.customModal}}
            >
                <ProofForm isOwner={userDetails?.isVesselOwner} close={() => {
                    setIdentityProofModal(false)
                    getTransactionStatus()
                }}/>
            </Modal>
            <Modal
                open={openStatusModal}
                onClose={() => setOpenStatusModal(false)}
                center
            >
                <TruliooStatus record={recordData} transaction={transactionsData}/>
            </Modal>
            <Modal
                open={boatLicenseModal}
                onClose={() => setBoatLicenseModal(false)}
                center
                styles={{modal: {width: "100%", height: "100%"}}}
                classNames={{modal: classes.customModal}}
            >
                <BoatLicenseUpload close={() => setBoatLicenseModal(false)}/>
            </Modal>
            <NavBar/>
            <AccountInfoBanner/>
            <Grid container>
                <Grid item xs={false} lg={2} className={classes.filler}/>
                <Grid item xs={3} lg={2}>
                    <AccountInfoTabs currentTab={1}/>
                </Grid>
                <Grid item xs={9} lg={6} className={classes.content}>
                    <TableContainer component={Paper}>
                        <Table
                            className={classes.table}
                            aria-label='custom pagination table'
                        >
                            <TableBody>
                                {documentData.map((row) => (
                                    <TableRow key={row.name}>
                                        <TableCell component='th' scope='row'>
                                            {row.name}
                                        </TableCell>
                                        <TableCell style={{width: 160}} align='right'>
                                            {row.status}
                                        </TableCell>

                                        <TableCell style={{width: 160}} align='right'>
                                            {row.shortForm === "boat-license" && row.status === "Provided" &&
                                                <Typography
                                                    style={{fontWeight: "500"}}
                                                    gutterBottom
                                                >
                                                    {boatLicenseStatus}
                                                </Typography>
                                            }
                                            {row.shortForm !== "boat-license" && transactionsData?.Status &&
                                                <Button style={{textTransform: 'none'}} onClick={() => {
                                                    getTransactionStatus(true)
                                                }}>Check Status</Button>}
                                        </TableCell>
                                        <TableCell style={{width: 160}} align='right'>
                                            {row.shortForm === "boat-license" && boatLicenseStatus === 'REJECTION' &&
                                                <Tooltip
                                                    title={boatLicenseRejectionReason}
                                                    aria-label={boatLicenseRejectionReason}><MessageIcon
                                                    style={{cursor: "pointer", fontSize: "2rem"}}/></Tooltip>
                                            }</TableCell>
                                        <TableCell style={{width: 160}} align='right'>
                                            <ControlPointIcon onClick={() => handleOpenFormModal(row.shortForm)}
                                                              style={{cursor: "pointer"}}/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className={classes.root}>
                        <Backdrop className={classes.backdrop} open={loading}>
                            <CircularProgress color="inherit"/>
                        </Backdrop>
                    </div>
                </Grid>
                <Grid item xs={false} lg={2} className={classes.filler}/>
            </Grid>
        </>
    )
}
