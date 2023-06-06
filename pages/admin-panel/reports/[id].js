import {makeStyles} from "@material-ui/core/styles"
import {useRouter} from "next/router"
import Session from "../../../sessionService"
import React, {useEffect, useState} from "react"
import API from "../../api/baseApiIinstance"
import NavBar from "../../../components/admin-panel/navBar"
import Grid from "@material-ui/core/Grid"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import {
    Backdrop,
    CircularProgress,
    Typography
} from "@material-ui/core"
import Paper from "@material-ui/core/Paper"
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import moment from "moment"
import Button from "@material-ui/core/Button"
import {jsPDF} from "jspdf"
import Carousel from "react-material-ui-carousel"
import Image from 'next/image'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        fontFamily: "Roboto",
        color: "#4F4F4F",
        fontWeight: 500
    },
    paper: {
        padding: theme.spacing(4),
        color: theme.palette.text.secondary,
        width: "100%"
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff'
    },
    detailsWeight: {
        fontWeight: 800
    }
}))

function ReportById() {
    const classes = useStyles()
    const router = useRouter()
    const token = Session.getToken("Wavetoken")
    const [loading, setLoading] = useState(false)
    const [reportDetails, setReportsDetails] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const userLoggedData = Session.getUserLoggedInData("UserLoggedData")
    const {id} = router.query

    const onClickBack = () => {
        router.push("/admin-panel/reports")
    }

    const onClickMessages = () => {
        router.push("/admin-panel/messages")
    }

    useEffect(() => {
        console.log(id)
        if (id) {
            getUserDetailsById()
        }
    }, [id])

    const getUserDetailsById = () => {
        if (id) {
            // setReportsDetails(tempReportDetails);
            // setLoading(true);
            API()
                .get(
                    `reports/${id}`,
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
                        setReportsDetails(response.data)
                    }
                })
                .catch((e) => {
                    setLoading(false)
                    console.log("get report by id error: ", e)
                })
        }
    }

    const onGeneratePdfClicked = () => {
        console.log('generate pdf clicked')
        const doc = new jsPDF()
        doc.setDocumentProperties({
            format: 'a4',
            orientation: 'p',
            unit: 'mm'
        })
        doc.setProperties({
            title: `Report-${moment(new Date()).format('YYYY-MM-DD')}-TransactionId-${reportDetails?.stripeTransactionId ? reportDetails?.stripeTransactionId : ''}`
        })
        // let img = new Image();
        // img.src = '../../../public/assets/images/titlelogo.png';
        // console.log(img);
        const pageHeight = doc.internal.pageSize.height
        doc.addImage('/assets/images/footerlogo.png', 'PNG', 70, 5, 75, 15)
        doc.setFontSize(20)
        doc.text('Report', 90, 30)
        doc.setFontSize(15)
        doc.text('Reported By:', 15, 60)
        doc.text((reportDetails?.reportedBy ? ((reportDetails?.reportedBy?.firstName ? `${reportDetails?.reportedBy?.firstName} ` : '') + (reportDetails?.reportedBy?.lastName ? `${reportDetails?.reportedBy?.lastName}` : '')) : ''), 85, 60)
        doc.text('Date:', 15, 80)
        doc.text(((reportDetails?.reportedDate && reportDetails?.reportedDate !== '') ? moment(reportDetails?.reportedDate).format("MM/DD/YYYY") : ''), 85, 80)
        doc.text('Transaction Id:', 15, 100)
        doc.text((reportDetails?.transactionId ? reportDetails?.transactionId : ''), 85, 100)
        doc.text('Stripe Customer Id:', 15, 120)
        doc.text((reportDetails?.trip?.vesselOwner?.stripeCustomerId), 85, 120)
        doc.text('Vessel Owner:', 15, 140)
        doc.text((reportDetails?.trip?.vesselOwner?.firstName) + (reportDetails?.trip?.vesselOwner?.lastName), 85, 140)
        doc.text('Vessel Name:', 15, 160)
        doc.text((reportDetails?.trip?.vessel ? reportDetails?.trip?.vessel?.title : ''), 85, 160)
        doc.text('Description:', 15, 180)
        const splitDescription = doc.splitTextToSize((reportDetails?.description ? reportDetails?.description : ''), 100)
        doc.text(splitDescription, 85, 180)
        const photosHeight = doc.getTextDimensions(splitDescription).h
        // if (reportDetails?.photos && reportDetails?.photos?.length !== 0) {
        //     if ((210 + +photosHeight) >= pageHeight) {
        //         doc.addPage('a4', 'portrait');
        //         doc.text('Photos:', 15, 25);
        //         reportDetails?.photos?.forEach((url, index) => {
        //             // const imageData = getImageFromUrl(url);
        //             console.log(imageData);
        //             // doc.addImage(imageData, 'JPEG', 85, 25 + index * 80, 75, 50);
        //             // doc.addImage(url, 'JPEG', 85, 190 + +photosHeight);
        //         });
        //     } else {
        //         doc.addPage('a4', 'portrait');
        //         doc.text('Photos:', 15, 190 + +photosHeight);
        //         reportDetails?.photos?.forEach((url, index) => {
        //             // const imageData = getImageFromUrl(url);
        //             console.log(imageData);
        //             // doc.addImage(imageData, 'JPEG', 85, 190 + +photosHeight + index * 80, 75, 50);
        //         });
        //     }
        // }
        doc.output("dataurlnewwindow")
    }

    const getImageFromUrl = (url) => {
        const image = new Image()

        image.crossOrigin = "Anonymous"

        image.onError = function () {
            console.log(`Cannot load image: "${  url  }"`)
        }

        image.onload = function () {
            console.log("image is loaded")
        }

        // image.src = url;
        return image
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
                                    Reports
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Paper elevation={0} className={classes.paper}>
                        <div style={{fontSize: "1rem"}}>
                            <Grid item xs={12}>
                                <Grid container spacing={10} style={{paddingLeft: "1rem", paddingTop: '1.8em'}}>
                                    <Grid style={{display: "flex", alignItems: "center"}} item xs={3}
                                          className={classes.detailsWeight}>
                                        Reported By
                                    </Grid>
                                    <Grid style={{display: "flex", alignItems: "center"}} item xs={5}>
                                        {reportDetails?.reportedBy ? (`${reportDetails?.reportedBy?.firstName  } ${  reportDetails?.reportedBy?.lastName}`) : ''}
                                    </Grid>
                                    <Grid style={{display: "flex", flexDirection: 'row-reverse'}} item xs={4}>
                                        <Button style={{
                                            color: "#FFFFFF",
                                            backgroundColor: "#4D96FB",
                                            border: "1px solid #4D96FB",
                                            padding: '0.3rem 2.5rem',
                                            textTransform: 'none',
                                            fontSize: '1rem'
                                        }}
                                                onClick={() => onGeneratePdfClicked()}>
                                            Download as PDF
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                    <Grid style={{display: "flex"}} item xs={3} className={classes.detailsWeight}>
                                        Date
                                    </Grid>
                                    <Grid style={{display: "flex"}} item xs={7}>
                                        {(reportDetails?.reportedDate && reportDetails?.reportedDate !== '') ? moment(reportDetails?.reportedDate).format("MM/DD/YYYY") : ''}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                    <Grid style={{display: "flex"}} item xs={3} className={classes.detailsWeight}>
                                        Transaction Id
                                    </Grid>
                                    <Grid style={{display: "flex"}} item xs={7}>
                                        {reportDetails?.transactionId ? reportDetails?.transactionId : ''}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                    <Grid style={{display: "flex"}} item xs={3} className={classes.detailsWeight}>
                                        Stripe Customer Id
                                    </Grid>
                                    <Grid style={{display: "flex"}} item xs={7}>
                                        {reportDetails?.trip?.vesselOwner?.stripeCustomerId}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                    <Grid style={{display: "flex"}} item xs={3} className={classes.detailsWeight}>
                                        Vessel Owner
                                    </Grid>
                                    <Grid style={{display: "flex"}} item xs={7}>
                                        {reportDetails?.trip?.vesselOwner?.firstName} {reportDetails?.trip?.vesselOwner?.lastName}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                    <Grid style={{display: "flex"}} item xs={3} className={classes.detailsWeight}>
                                        Vessel Name
                                    </Grid>
                                    <Grid style={{display: "flex"}} item xs={7}>
                                        {reportDetails?.trip?.vessel ? reportDetails?.trip?.vessel?.title : ''}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                    <Grid style={{display: "flex"}} item xs={3} className={classes.detailsWeight}>
                                        Description
                                    </Grid>
                                    <Grid style={{display: "flex"}} item xs={7}>
                                        {reportDetails?.description ? reportDetails?.description : ''}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                    <Grid style={{display: "flex"}} item xs={3} className={classes.detailsWeight}>
                                        Photo
                                    </Grid>
                                    <Grid style={{display: "flex"}} item xs={5}>
                                        <div style={{
                                            border: "1px solid #ccc",
                                            width: "100%",
                                            height: "15em",
                                            borderRadius: "0.5em"
                                        }}>
                                            <Carousel
                                                next={(next, active) => console.log(`we left ${active}, and are now at ${next}`)}
                                                prev={(prev, active) => console.log(`we left ${active}, and are now at ${prev}`)}
                                            >
                                                {reportDetails?.photos?.map((picUrl, index) => (
                                                    <div style={{
                                                        width: "100%",
                                                        height: "15em"
                                                    }}>
                                                    <img src={picUrl} style={{objectFit: "contain"}} key={`img${  index}`} alt=""/>
                                                    </div>
                                                ))}
                                            </Carousel>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={10} style={{paddingLeft: "1rem"}}>
                                    <Grid style={{display: "flex", alignItems: "center"}} item xs={12}>
                                        { userLoggedData.userType === 'PSEUDO_ADMIN' &&
                                        (<Button style={{
                                            color: "#FFFFFF",
                                            backgroundColor: "#4D96FB",
                                            border: "1px solid #4D96FB",
                                            padding: '0.5rem 2.8rem',
                                            textTransform: 'none',
                                            fontSize: '1rem'
                                        }} onClick={onClickMessages}>
                                            Message User
                                        </Button>)
                                        }
                                        <Button variant="outlined" style={{
                                            color: "#4D96FB",
                                            border: "1px solid #4D96FB",
                                            padding: '0.5rem 2.5rem',
                                            textTransform: 'none',
                                            marginLeft: '2rem',
                                            fontSize: '1rem'
                                        }}
                                                target="_blank" href="https://dashboard.stripe.com/dashboard"
                                                rel="noopener noreferrer">
                                            Open Stripe Dashboard
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </Paper>
                </Grid>
            </div>
        </div>
    )
}

export default ReportById

const tempReportDetails = {
    _id: "ahsbabsabhs",
    reportedBy: "Jim Gordan",
    date: new Date(),
    transactionId: "343453",
    vesselOwner: "Barbara Wayne",
    vesselName: "Vessel full name",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
    photos: ""
}
