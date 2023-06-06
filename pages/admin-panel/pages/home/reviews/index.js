import React, {Component, useState, useEffect, useContext} from "react"
import {makeStyles, withStyles} from "@material-ui/core/styles"
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
    CardActions
} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import OpenInNewIcon from "@material-ui/icons/OpenInNew"
import theme from "../../../../../src/theme"
import PeopleIcon from "@material-ui/icons/People"
import {Delete, Edit} from "@material-ui/icons"
import CardContent from "@material-ui/core/CardContent"
import Add from "@material-ui/icons/Add"
import UserReview from "../../../../../components/userReview"
import API from "../../../../api/baseApiIinstance"
import Session from "../../../../../sessionService"
import SelectListingsDialog
    from "../../../../../components/admin-panel/pages/home/featuredListings/selectListingsDialog"
import GenericDialogDialog from "../../../../../components/shared/genericDeleteDialog"
import SelectReviewsDialog from "../../../../../components/admin-panel/pages/home/reviews/selectReviewsDialog"
import Avatar from "@material-ui/core/Avatar"
import moment from "moment"
import Box from "@material-ui/core/Box"
import StarRateRoundedIcon from "@material-ui/icons/StarRateRounded"
import ReadLess from "../../../../../components/review/readLess"
import * as PropTypes from "prop-types"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import Rating from "@material-ui/lab/Rating"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        fontFamily: "Roboto",
        color: theme.palette.title.matterhorn
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary
    },
    card_container: {
        borderRadius: "20px"
    },
    addIcon: {
        fontSize: "37px",
        color: theme.palette.background.nightRider,
        cursor: "pointer"
    },
    reviews_container: {
        display: "inline-block",

        [theme.breakpoints.down("md")]: {
            height: "200px",
            paddingBottom: "70px"
        },

        [theme.breakpoints.down("sm")]: {
            height: "200px",
            marginBottom: "250px"
        },
        [theme.breakpoints.down("xs")]: {
            height: "250px",
            marginBottom: "30px"
        }
    },
    view_vessel: {
        textTransform: "none",
        color: theme.palette.buttonPrimary.main
    },
    actionButton: {
        backgroundColor: theme.palette.background.default,
        boxSizing: "border-box",
        borderRadius: "5px",
        "&:hover": {
            backgroundColor: theme.palette.background.default
        },
        fontSize: "1.65rem",
        padding: "5px 5px 0 5px",
        boxShadow: "0 4px 8px 0 rgb(0 0 0 / 20%)"
    }
}))

const StyledRating = withStyles({
    iconFilled: {
        color: theme.palette.userReview.iconFilled
    },
    iconHover: {
        color: theme.palette.userReview.iconHover
    }
})(Rating)

StyledRating.propTypes = {
    disabled: PropTypes.bool,
    precision: PropTypes.number,
    icon: PropTypes.element,
    getLabelText: PropTypes.func,
    defaultValue: PropTypes.any,
    name: PropTypes.string
}
export default function Reviews() {
    const classes = useStyles()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [openSelectReviewsDialog, setOpenSelectReviewsDialog] = useState(false)
    const [currentReviewsSequence, setCurrentReviewsSequence] = useState(1)
    const [featuredReviews, setFeaturedReviews] = useState(
        []
    )
    const [existingReviews, setExistingReviews] = useState([])
    const [existingReviewId, setExistingReviewId] = useState(null)
    const token = Session.getToken("Wavetoken")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteData, setDeleteData] = useState({
        id: null
    })
    const [deleteDialogMessage, setDeleteDialogMessage] = useState(null)
    const cardsArray = [{}, {}, {}]

    const onClickBack = () => {
        router.push("/admin-panel/pages/home")
    }

    useEffect(() => {
        getFeaturedReviews()
    }, [])

    const getFeaturedReviews = () => {
        API().get(`reviews/featuredReviews`,
            {
                headers: {
                    authorization: `Bearer ${  token}`,
                    accept: "application/json"
                }
            })
            .then((response) => {
                if (response.data) {
                    console.log("Response of get featured reviews: ", response.data)
                    setFeaturedReviews(response.data)
                }
            }).catch((e) => {
            console.log("Error from get featured listings is: ", e)
        })
    }

    const openReviewDialog = (index, id) => {
        console.log(id)
        setExistingReviewId(id ? id : null)
        if (id) {
            if (featuredReviews.length !== 0) {
                const filter = featuredReviews?.filter((ves) => {
                    return ves._id !== id
                })
                console.log(filter)
                setExistingReviews(filter)
            } else {
                setExistingReviews([])
            }
        } else {
            setExistingReviews(featuredReviews ? featuredReviews : [])
        }
        setCurrentReviewsSequence(index)
        setOpenSelectReviewsDialog(true)
    }

    const handleFeaturedReviewsDelete = (id, name) => {
        console.log(id)
        setDeleteDialogMessage(`Are you sure you want to remove the review by ${name ? name : ''}`)
        setDeleteData({
            id
        })
        setDeleteDialogOpen(true)
    }

    const deleteFeatureReviewById = () => {
        if (deleteData?.id) {
            // using sequence as -1 to delete the featured vessel from slot
            API().put(`reviews/updateReviewsSequence`,
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
                        setExistingReviewId(null)
                        getFeaturedReviews()
                    }
                    setDeleteDialogOpen(false)
                }).catch((e) => {
                console.log("Error from delete featured reviews is: ", e)
                setDeleteDialogOpen(false)
            })
        }
    }

    const onClickAddReview = (index, id) => {
        console.log(id)
        setExistingReviewId(id ? id : null)
        // if the user clicked on eit listing only include the other id for not
        // showing it on the select listings table
        if (id) {
            if (featuredReviews.length !== 0) {
                const filter = featuredReviews?.filter((ves) => {
                    return ves._id !== id
                })
                console.log(filter)
                setExistingReviews(filter)
            } else {
                setExistingReviews([])
            }
        } else {
            setExistingReviews(featuredReviews?.length !== 0 ? featuredReviews : [])
        }
        setCurrentReviewsSequence(index)
        setOpenSelectReviewsDialog(true)
        console.log("stay add clicked")
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
                                    Reviews
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid container spacing={4} style={{padding: "2em"}} alignItems="center"
                                  justifyContent="center">
                                {cardsArray.map((cardData, index) =>
                                    <Grid className={classes.card_container} item xs={12} sm={4} key={`${index  }stay`}>
                                        {(featuredReviews[index]) ? (
                                            <Card style={{cursor: "pointer"}}>
                                                <CardContent>
                                                    <Grid className={classes.reviews_container} container item xs={12}>
                                                        <Grid xs={12} item container direction='row' spacing={2}>
                                                            <Grid item>
                                                                <Avatar alt='Remy Sharp'
                                                                        src={featuredReviews[index]?.reviewer?.profileImageUrl}/>
                                                            </Grid>
                                                            <Grid item xs container direction='column' spacing={4}>
                                                                <Grid item xs>
                                                                    <Typography color='textSecondary'
                                                                                variant='subtitle1'>
                                                                        {featuredReviews[index]?.reviewer?.firstName} {featuredReviews[index]?.reviewer?.lastName}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant='body2'
                                                                        gutterBottom
                                                                        style={{cursor: "pointer"}}
                                                                        color='textSecondary'
                                                                    >
                                                                        {featuredReviews[index]?.reviewer?.rawAddress} | {moment(featuredReviews[index]?.createdAt).format("MM/DD/YYYY")}
                                                                    </Typography>
                                                                    <Box component='fieldset' borderColor='transparent'>
                                                                        <StyledRating
                                                                            name='customized-color'
                                                                            defaultValue={featuredReviews[index]?.rating}
                                                                            getLabelText={(value) =>
                                                                                `${value} Heart${value !== 1 ? "s" : ""}`
                                                                            }
                                                                            precision={0.5}
                                                                            icon={<StarRateRoundedIcon
                                                                                fontSize='medium'/>}
                                                                            disabled
                                                                        />
                                                                    </Box>
                                                                    <div style={{maxLines: 5}} id='readMoreLess'>
                                                                        <ReadLess>{featuredReviews[index]?.description}</ReadLess>
                                                                    </div>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        ) : (
                                            <Card style={{cursor: "pointer",
minHeight: "17em",
alignItems: "center",
                                                display: "flex",
                                                justifyContent: "center"}}>
                                                <CardContent style={{
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    display: "flex"
                                                }}>
                                                    <Add onClick={() => {
                                                        openReviewDialog(index + 1)
                                                    }}
                                                         className={classes.addIcon}
                                                         data-testid="addStayButton"
                                                    />
                                                </CardContent>
                                            </Card>
                                        )}
                                        {/*<Card style={{cursor: "pointer"}}>*/}
                                        {/*    <CardContent>*/}
                                        {/*        <Add onClick={() => {*/}
                                        {/*            openReviewDialog(index + 1)}}*/}
                                        {/*             className={classes.addIcon}*/}
                                        {/*             data-testid= "addStayButton"*/}
                                        {/*        />*/}
                                        {/*    </CardContent>*/}
                                        {/*</Card>*/}
                                        {featuredReviews[index] && (
                                            <div style={{display: "flex", justifyContent: "flex-end"}}>
                                            <span style={{cursor: "pointer", marginRight: "8px"}}
                                                  className={classes.actionButton} onClick={() => {
                                                onClickAddReview(index + 1, featuredReviews[index]?._id)
                                            }}>
                                                            <Edit/>
                                                            </span>
                                                <span style={{cursor: "pointer", marginRight: "8px"}}
                                                      className={classes.actionButton} onClick={() => {
                                                    handleFeaturedReviewsDelete(featuredReviews[index]?._id, featuredReviews[index]?.reviewer?.firstName)
                                                }}>
                                            <DeleteIcon/>
                                        </span>
                                            </div>
                                        )}
                                    </Grid>
                                )}
                            </Grid>
                            <div>
                                <SelectReviewsDialog open={openSelectReviewsDialog}
                                                     setOpen={setOpenSelectReviewsDialog}
                                                     reviewIndex={currentReviewsSequence} onSave={getFeaturedReviews}
                                                     existingReviewId={existingReviewId}
                                                     existingReviews={existingReviews}/>
                                <GenericDialogDialog open={deleteDialogOpen} setOpen={setDeleteDialogOpen}
                                                     title={"Delete Confirmation"} message={deleteDialogMessage}
                                                     onConfirm={deleteFeatureReviewById} width={"100%"}
                                                     height={"100px"}/>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}
