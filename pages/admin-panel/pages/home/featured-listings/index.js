import React, {Component, useState, useEffect, useContext} from "react"
import {makeStyles} from "@material-ui/core/styles"
import NavBar from "../../../../../components/admin-panel/navBar"
import {useRouter} from "next/router"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import Add from '@material-ui/icons/Add'
import {
    Typography,
    TextField,
    Card,
    CardActionArea,
    CardMedia,
    CardActions, withStyles, IconButton, Menu, MenuItem, Dialog, DialogTitle
} from "@material-ui/core"
import API from '../../../../api/baseApiIinstance'
import Button from "@material-ui/core/Button"
import OpenInNewIcon from "@material-ui/icons/OpenInNew"
import ImageCropDialog from "../../../../../components/imageCropDialog/imageCropDialog"
import SelectListingsDialog
    from "../../../../../components/admin-panel/pages/home/featuredListings/selectListingsDialog"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import {Delete, Edit} from "@material-ui/icons"
import Session from "../../../../../sessionService"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faUserFriends} from "@fortawesome/free-solid-svg-icons"
import GenericDialogDialog from "../../../../../components/shared/genericDeleteDialog"
import theme from "../../../../../src/theme"
import ImageCardHolder from "../../../../../components/imageCardHolder"
import CardContent from "@material-ui/core/CardContent"
import StarRateRoundedIcon from "@material-ui/icons/StarRateRounded"
import PeopleIcon from "@material-ui/icons/People"
import HeartIcon from "../../../../../components/favourite/heartIcon"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        fontFamily: "Roboto",
        color: theme.palette.title.matterhorn
    },
    hideInput: {
        width: "0.1px",
        height: "0.1px",
        opacity: 0,
        overflow: "hidden",
        position: "absolute",
        zIndex: "-1"
    },
    browseButton: {
        fontWeight: 500,
        color: theme.palette.background.default,
        padding: "10px 20px 10px 20px",
        backgroundColor: theme.palette.background.deepSkyBlue,
        display: "inline-block",
        cursor: "pointer",
        marginTop: "30px",
        borderRadius: "4px"
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
        width: "100%",
        minHeight: "400px",
        paddingBottom: "4rem"
    },
    header: {
        font: "Roboto",
        color: theme.palette.title.matterhorn,
        fontWeight: "600",
        fontSize: 30
    },
    addContainer: {
        backgroundColor: theme.palette.background.default,
        borderRadius: "10px",
        display: "grid",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "320px"
    },
    addIcon: {
        fontSize: "37px",
        color: theme.palette.background.nightRider,
        cursor: "pointer",
        margin: "38%"
    },
    imagePart: {
        position: "relative"
    },
    buttonDelete: {
        top: 5,
        right: 5,
        position: "absolute",
        zIndex: 5,
        color: theme.palette.background.nightRider
    },
    actionButton: {
        backgroundColor: theme.palette.background.default,
        boxSizing: "border-box",
        borderRadius: "5px",
        "&:hover": {
            backgroundColor: theme.palette.background.default
        },
        fontSize: "1.65rem",
        padding: "5px 5px 0 5px"
    },
    cardContainer: {
        padding: "0rem 1rem 0rem 1rem"
    },
    title: {
        color: theme.palette.text.black,
        paddingLeft: "1rem",
        fontSize: "28px",
        fontWeight: "bold"
    },
    textLeft: {
        display: "flex",
        justifyContent: "flex-start"
    },
    card_img: {
        height: "250px",
        width: "390px",
        objectFit: "cover",
        [theme.breakpoints.down("sm")]: {
            height: "200px"
        },
        [theme.breakpoints.down("xs")]: {
            height: "150px"
        }
    },
    startAlign: {
        display: "flex",
        justifyContent: "flex-start"
    },
    icons: {
        display: "inline",
        position: "absolute",
        bottom: "22%",
        left: "10px",
        color: theme.palette.border.grey
    },
    card_container: {
        borderRadius: "20px"
    },
    priceInline: {
        display: "flex",
        justifyContent: "flex-end",
        [theme.breakpoints.down("sm")]: {
            display: "none"
        }
    },
    priceBlock: {
        [theme.breakpoints.up("md")]: {
            display: "none"
        }
    },
    imageContainer: {
        position: "relative"
    },
    media: {
        height: 0,
        paddingTop: "56.25%" // 16:9
    },
    edit_Icons: {
        position: "absolute",
        top: 10,
        right: 10
    },
    peopleIcon: {
        position: "absolute",
        bottom: 5,
        left: 15,
        color: theme.palette.background.default
    },
    vesselTitle: {
        color: theme.palette.text.stormGrey,
        fontWeight: "500",
        fontSize: "20px"
    },
    vesselPrice: {
        color: theme.palette.text.stormGrey,
        fontWeight: "400",
        fontSize: "18px"
    }
}))

export default function FeaturedListings() {
    const classes = useStyles()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [openSelectListingsDialog, setOpenSelectListingsDialog] = useState(false)
    const [vesselType, setVesselType] = useState(null)
    const [currentVesselSequence, setCurrentVesselSequence] = useState(1)
    const [featuredListings, setFeaturedListings] = useState({
        rentals: [],
        stays: [],
        charters: []
    })
    const [existingListings, setExistingListings] = useState([])
    const [existingVesselId, setExistingVesselId] = useState(null)
    const token = Session.getToken("Wavetoken")
    const cardsArray = [{}, {}, {}]
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteData, setDeleteData] = useState({
        id: null,
        type: null
    })
    const [deleteDialogMessage, setDeleteDialogMessage] = useState(null)

    useEffect(() => {
        refreshVessels()
    }, [])

    const onClickBack = () => {
        router.push("/admin-panel/pages/home")
    }

    const onClickAddRental = (index, id) => {
        console.log(id)
        setExistingVesselId(id ? id : null)
        // if the user clicked on eit listing only include the other id for not
        // showing it on the select listings table
        if (id) {
            if (featuredListings?.rentals !== 0) {
                const filter = featuredListings?.rentals.filter((ves) => {
                    return ves._id !== id
                })
                console.log(filter)
                setExistingListings(filter)
            } else {
                setExistingListings([])
            }
        } else {
            setExistingListings(featuredListings?.rentals ? featuredListings?.rentals : [])
        }
        setVesselType("rentals")
        setCurrentVesselSequence(index)
        setOpenSelectListingsDialog(true)
        console.log("rental add clicked")
    }

    const onClickAddCharter = (index, id) => {
        console.log(id)
        setExistingVesselId(id ? id : null)
        // if the user clicked on eit listing only include the other id for not
        // showing it on the select listings table
        if (id) {
            if (featuredListings?.charters !== 0) {
                const filter = featuredListings?.charters.filter((ves) => {
                    return ves._id !== id
                })
                console.log(filter)
                setExistingListings(filter)
            } else {
                setExistingListings([])
            }
        } else {
            setExistingListings(featuredListings?.charters ? featuredListings?.charters : [])
        }
        setVesselType("charters")
        setCurrentVesselSequence(index)
        setOpenSelectListingsDialog(true)
        console.log("charter add clicked")
    }

    const onClickAddStay = (index, id) => {
        console.log(id)
        setExistingVesselId(id ? id : null)
        // if the user clicked on eit listing only include the other id for not
        // showing it on the select listings table
        if (id) {
            if (featuredListings?.stays !== 0) {
                const filter = featuredListings?.stays.filter((ves) => {
                    return ves._id !== id
                })
                console.log(filter)
                setExistingListings(filter)
            } else {
                setExistingListings([])
            }
        } else {
            setExistingListings(featuredListings?.stays ? featuredListings?.stays : [])
        }
        setVesselType("stays")
        setCurrentVesselSequence(index)
        setOpenSelectListingsDialog(true)
        console.log("stay add clicked")
    }

    const refreshVessels = () => {
        API().get(`vessel/getFeaturedListings`)
            .then((response) => {
                if (response.data) {
                    console.log("Response of get featured listings: ", response.data)
                    setFeaturedListings(response.data)
                }
            }).catch((e) => {
            console.log("Error from get featured listings is: ", e)
        })
    }

    const handleFeaturedListingDelete = (id, type, title) => {
        setDeleteDialogMessage(`Are you sure you want to remove ${title ? title : ''} from \n feature listings?`)
        setDeleteData({
            id,
            type
        })
        setDeleteDialogOpen(true)
    }

    const deleteFeatureListingById = () => {
        if (deleteData?.id && deleteData?.type) {
            // using sequence as -1 to delete the featured vessel from slot
            API().put(`vessel/updateVesselSequence/${deleteData?.type}`,
                {id: deleteData?.id, sequence: -1},
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
                .then((response) => {
                    if (response.status === 200) {
                        setExistingVesselId(null)
                        refreshVessels()
                    }
                    setDeleteDialogOpen(false)
                }).catch((e) => {
                console.log("Error from delete featured listings is: ", e)
                setDeleteDialogOpen(false)
            })
        }
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
                    spacing={3}>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
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
                                    Featured Listings
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            {/* Rental Section */}
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={4} className={classes.textLeft}>
                                    <h3 className={classes.title}>Rental</h3>
                                </Grid>
                            </Grid>
                            <Grid container spacing={4} alignItems="center"
                                  justifyContent="center">
                                {cardsArray.map((card, index) =>
                                    <Grid className={classes.card_container} item xs={12} sm={4} key={`${index  }rental`}>
                                        <Card style={{cursor: "pointer"}}>
                                            {(featuredListings?.rentals !== 0 && featuredListings?.rentals[index]) ? (
                                                <>
                                                    <div className={classes.imageContainer}>
                                                        <CardActionArea>
                                                            <CardMedia className={classes.media}
                                                                       image={featuredListings?.rentals[index]?.images && featuredListings?.rentals[index]?.images[0] ? (`${featuredListings?.rentals[index]?.images[0]?.imageURL  }?${  Date.now()}`) : "/assets/images/maskGroup.png"}
                                                                       alt={" rental boat image"}/>
                                                        </CardActionArea>
                                                        <span className={classes.peopleIcon}>
                                                    <PeopleIcon/>
                                                    <span>{featuredListings?.rentals[index]?.numberOfPassengers ? featuredListings?.rentals[index]?.numberOfPassengers : 0}</span>
                                                </span>
                                                        <div className={classes.edit_Icons}>
                                                    <span style={{cursor: "pointer", marginRight: "8px"}}
                                                          className={classes.actionButton} onClick={() => {
                                                        onClickAddRental(index + 1, featuredListings?.rentals[index]._id)
                                                    }}>
                                                            <Edit/>
                                                            </span>
                                                            <span className={classes.actionButton}
                                                                  style={{cursor: "pointer"}}
                                                                  onClick={() => {
                                                                      handleFeaturedListingDelete(featuredListings?.rentals[index]._id, "RENTAL", featuredListings?.rentals[index]?.title)
                                                                  }}>
                                                            <Delete/>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <CardContent>
                                                        <Grid container spacing={0}>
                                                            <Grid item xs={12}>
                                                                <Typography
                                                                    variant="body1" noWrap
                                                                    className={`${classes.startAlign} ${classes.vesselTitle}`}>
                                                                    {featuredListings?.rentals[index]?.title}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container spacing={0}>
                                                            <Grid item xs={12}>
                                                                <Typography variant="body1" noWrap
                                                                            className={`${classes.startAlign} ${classes.vesselPrice}`}>
                                                                    {featuredListings?.rentals[index]?.cost ? `$${featuredListings?.rentals[index]?.cost}/hr` : "$0/hr"}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </>
                                            ) : (
                                                <Add onClick={() => {
                                                    onClickAddRental(index + 1)
                                                }}
                                                     className={classes.addIcon}
                                                     data-testid="addRentalButton"
                                                />
                                            )}
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                            {/* Charter Section */}
                            <Grid container spacing={1} style={{paddingTop: "2rem"}}>
                                <Grid item xs={12} sm={4} className={classes.textLeft}>
                                    <h3 className={classes.title}>Charter</h3>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} alignItems="center"
                                  justifyContent="center">
                                {cardsArray.map((card, index) =>
                                    <Grid className={classes.card_container} item xs={12} sm={4}
                                          key={`${index  }charter`}>
                                        <Card style={{cursor: "pointer"}}>
                                            {(featuredListings?.charters !== 0 && featuredListings?.charters[index]) ? (
                                                <>
                                                    <div className={classes.imageContainer}>
                                                        <CardActionArea>
                                                            <CardMedia className={classes.media}
                                                                       image={featuredListings?.charters[index]?.images && featuredListings?.charters[index]?.images[0] ? (`${featuredListings?.charters[index]?.images[0]?.imageURL  }?${  Date.now()}`) : "/assets/images/maskGroup.png"}
                                                                       alt={" charter boat image"}/>
                                                        </CardActionArea>
                                                        <span className={classes.peopleIcon}>
                                                    <PeopleIcon/>
                                                    <span>{featuredListings?.charters[index]?.numberOfPassengers ? featuredListings?.charters[index]?.numberOfPassengers : 0}</span>
                                                </span>
                                                        <div className={classes.edit_Icons}>
                                                    <span style={{cursor: "pointer", marginRight: "8px"}}
                                                          className={classes.actionButton} onClick={() => {
                                                        onClickAddCharter(index + 1, featuredListings?.charters[index]._id)
                                                    }}>
                                                            <Edit/>
                                                            </span>
                                                            <span className={classes.actionButton}
                                                                  style={{cursor: "pointer"}}
                                                                  onClick={() => {
                                                                      handleFeaturedListingDelete(featuredListings?.charters[index]._id, "CHARTER", featuredListings?.charters[index]?.title)
                                                                  }}>
                                                            <Delete/>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <CardContent>
                                                        <Grid container spacing={0}>
                                                            <Grid item xs={12}>
                                                                <Typography
                                                                    variant="body1" noWrap
                                                                    className={`${classes.startAlign} ${classes.vesselTitle}`}>
                                                                    {featuredListings?.charters[index]?.title}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container spacing={0}>
                                                            <Grid item xs={12}>
                                                                <Typography variant="body1" noWrap
                                                                            className={`${classes.startAlign} ${classes.vesselPrice}`}>
                                                                    {featuredListings?.charters[index]?.cost ? `$${featuredListings?.charters[index]?.cost}/hr` : "$0/hr"}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </>
                                            ) : (
                                                <Add onClick={() => {
                                                    onClickAddCharter(index + 1)
                                                }}
                                                     className={classes.addIcon}
                                                     data-testid="addCharterButton"
                                                />
                                            )}
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                            {/* Stays Section */}
                            <Grid container spacing={1} style={{paddingTop: "2rem"}}>
                                <Grid item xs={12} sm={4} className={classes.textLeft}>
                                    <h3 className={classes.title}>Stay</h3>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} alignItems="center"
                                  justifyContent="center">
                                {cardsArray.map((card, index) =>
                                    <Grid className={classes.card_container} item xs={12} sm={4} key={`${index  }stay`}>
                                        <Card style={{cursor: "pointer"}}>
                                            {(featuredListings?.stays !== 0 && featuredListings?.stays[index]) ? (
                                                <>
                                                    <div className={classes.imageContainer}>
                                                        <CardActionArea>
                                                            <CardMedia className={classes.media}
                                                                       image={featuredListings?.stays[index]?.images && featuredListings?.stays[index]?.images[0] ? (`${featuredListings?.stays[index]?.images[0]?.imageURL  }?${  Date.now()}`) : "/assets/images/maskGroup.png"}
                                                                       alt={" charter boat image"}/>
                                                        </CardActionArea>
                                                        <span className={classes.peopleIcon}>
                                                    <PeopleIcon/>
                                                    <span>{featuredListings?.stays[index]?.numberOfPassengers ? featuredListings?.stays[index]?.numberOfPassengers : 0}</span>
                                                </span>
                                                        <div className={classes.edit_Icons}>
                                                    <span style={{cursor: "pointer", marginRight: "8px"}}
                                                          className={classes.actionButton} onClick={() => {
                                                        onClickAddStay(index + 1, featuredListings?.stays[index]._id)
                                                    }}>
                                                            <Edit/>
                                                            </span>
                                                            <span className={classes.actionButton}
                                                                  style={{cursor: "pointer"}}
                                                                  onClick={() => {
                                                                      handleFeaturedListingDelete(featuredListings?.stays[index]._id, "STAY", featuredListings?.stays[index]?.title)
                                                                  }}>
                                                            <Delete/>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <CardContent>
                                                        <Grid container spacing={0}>
                                                            <Grid item xs={12}>
                                                                <Typography
                                                                    variant="body1" noWrap
                                                                    className={`${classes.startAlign} ${classes.vesselTitle}`}>
                                                                    {featuredListings?.stays[index]?.title}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container spacing={0}>
                                                            <Grid item xs={12}>
                                                                <Typography variant="body1" noWrap
                                                                            className={`${classes.startAlign} ${classes.vesselPrice}`}>
                                                                    {featuredListings?.stays[index]?.cost ? `$${featuredListings?.stays[index]?.cost}/hr` : "$0/hr"}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </>
                                            ) : (
                                                <Add onClick={() => {
                                                    onClickAddStay(index + 1)
                                                }}
                                                     className={classes.addIcon}
                                                     data-testid="addStayButton"
                                                />
                                            )}
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                            <div>
                                <SelectListingsDialog open={openSelectListingsDialog}
                                                      setOpen={setOpenSelectListingsDialog} vesselType={vesselType}
                                                      vesselIndex={currentVesselSequence} onSave={refreshVessels}
                                                      existingVesselId={existingVesselId}
                                                      existingListings={existingListings}/>
                                <GenericDialogDialog open={deleteDialogOpen} setOpen={setDeleteDialogOpen}
                                                     title={"Delete Confirmation"} message={deleteDialogMessage}
                                                     onConfirm={deleteFeatureListingById} width={"100%"}
                                                     height={"100px"}/>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}
