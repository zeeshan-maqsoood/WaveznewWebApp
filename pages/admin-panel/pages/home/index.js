import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import NavBar from "../../../../components/admin-panel/navBar"
import Divider from '@material-ui/core/Divider'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import {useRouter} from "next/router"
import {shadows} from '@material-ui/system'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from "@material-ui/core/Typography"

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper
    }
}))

export default function Home() {
    const classes = useStyles()
    const router = useRouter()

    const onClickInformationBanner = () => {
        router.push("/admin-panel/pages/home/information-banner")
    }

    const onClickHeroText = () => {
        router.push("/admin-panel/pages/home/hero-text")
    }

    const onClickHeroImage = () => {
        router.push("/admin-panel/pages/home/hero-image")
    }

    const onClickFeaturedListings = () => {
        router.push("/admin-panel/pages/home/featured-listings")
    }

    const onClickReviews = () => {
        router.push("/admin-panel/pages/home/reviews")
    }

    return (
        <div>
            <NavBar/>
            <Grid container spacing={2}
                  style={{marginRight: 'auto', marginLeft: '16rem', marginTop: '7%', width: '73%'}}>
                <Grid item xs={4} style={{padding: "8px 0"}}>
                    <Typography style={{fontWeight: "400", fontSize: "24px"}}>Home</Typography>
                </Grid>
            </Grid>
            <Box
                boxShadow={3}
                bgcolor="background.paper"
                m={1}
                p={1}
                style={{marginRight: 'auto', marginLeft: '16rem', width: '73%', marginTop: "1%"}}>
                <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    className={classes.root}>
                    <ListItem onClick={onClickInformationBanner} button>
                        <ListItemText primary="Information Banner"/>
                        <NavigateNextIcon/>
                    </ListItem>
                    <Divider/>
                    <ListItem onClick={onClickHeroText} button>
                        <ListItemText primary="Hero Text"/>
                        <NavigateNextIcon/>
                    </ListItem>
                    <Divider/>
                    <ListItem onClick={onClickHeroImage} button>
                        <ListItemText primary="Hero Image"/>
                        <NavigateNextIcon/>
                    </ListItem>
                    <Divider/>
                    <ListItem onClick={onClickFeaturedListings} button>
                        <ListItemText primary="Featured Listings"/>
                        <NavigateNextIcon/>
                    </ListItem>
                    <Divider/>
                    <ListItem onClick={onClickReviews} button>
                        <ListItemText primary="Reviews"/>
                        <NavigateNextIcon/>
                    </ListItem>
                </List>
            </Box>
        </div>
    )
}
