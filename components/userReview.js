import {React} from "react"
import moment from "moment"
import {makeStyles} from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import Avatar from "@material-ui/core/Avatar"
import Rating from "@material-ui/lab/Rating"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
// eslint-disable-next-line no-duplicate-imports
import {withStyles} from "@material-ui/core/styles"
import StarRateRoundedIcon from "@material-ui/icons/StarRateRounded"
import ReadLess from "../components/review/readLess"
import theme from "../src/theme"
import {useRouter} from 'next/router'

const useStyles = makeStyles((theme) => ({
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

const UserReview = (props) => {
    const data = props.data
    const router = useRouter()

    const styles = useStyles()

    const handleViewVessel = (id) => {
        router.push(`/listingInfo/${id}`)
    }

    return (
        <Grid className={styles.reviews_container} container item xs={12} sm={4}>
            <Grid xs={12} item container direction='row' spacing={2}>
                <Grid item>
                    <Avatar alt='Remy Sharp' src={data?.reviewer?.profileImageUrl}/>
                </Grid>
                <Grid item xs container direction='column' spacing={4}>
                    <Grid item xs>
                        <Typography color='textSecondary' variant='subtitle1'>
                            {data?.reviewer?.firstName} {data?.reviewer?.lastName}
                        </Typography>
                        <Typography
                            variant='body2'
                            gutterBottom
                            style={{cursor: "pointer"}}
                            color='textSecondary'
                        >
                            {data?.reviewer?.rawAddress} | {moment(data?.createdAt).format("MM/DD/YYYY")}
                        </Typography>
                        <Box component='fieldset' borderColor='transparent'>
                            <StyledRating
                                name='customized-color'
                                defaultValue={data.rating}
                                getLabelText={(value) =>
                                    `${value} Heart${value !== 1 ? "s" : ""}`
                                }
                                precision={0.5}
                                icon={<StarRateRoundedIcon fontSize='medium'/>}
                                disabled
                            />
                        </Box>
                        <div style={{maxLines: 5}} id='readMoreLess'>
                            <ReadLess>{data?.description}</ReadLess>
                        </div>
                        {props.isInHomePage && <Button style={{backgroundColor: 'transparent'}}
                                                       onClick={() => handleViewVessel(data.vessel)}
                                                       className={styles.view_vessel}>View vessel</Button>}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default UserReview
