import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import NavBar from "../../../components/admin-panel/navBar"
import Divider from '@material-ui/core/Divider'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import {useRouter} from "next/router"
import { Shadows } from '@material-ui/core/styles/shadows'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from "@material-ui/core/Typography"


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper
    }
}))

export default function Footer() {
    const classes = useStyles()
    const router = useRouter()

    const onClickWaveShare = () => {
        router.push("/admin-panel/footer/aboutWavez")
    }

    const onClickHowItWorks = () => {
        router.push("/admin-panel/footer/howItWorks")
    }

    const onClickPartners = () => {
        router.push("/admin-panel/footer/partners")
    }

    const onClickContactUs = () => {
        router.push("/admin-panel/footer/contactUs")
    }

    const onClickPrivacyPolicy = () => {
        router.push("/admin-panel/footer/privacyPolicy")
    }

    const onClickTermsOfService = () => {
        router.push("/admin-panel/footer/termsOfService")
    }

    const onClickFAQ = () => {
        router.push("/admin-panel/footer/faq")
    }

    const onClickCommunityGuidelines = () => {
        router.push("/admin-panel/footer/communityGuidelines")
    }

    return (
        <div>
            <NavBar/>
            <Grid container spacing={2}
                  style={{marginRight: 'auto', marginLeft: '16rem', marginTop: '7%', width: '73%'}}>
                <Grid item xs={4} style={{padding: "8px 0"}}>
                    <Typography style={{fontWeight: "500", fontSize: "24px"}}>Footer</Typography>
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
                    <ListItem onClick={onClickWaveShare} button>
                        <ListItemText primary="About Wavez"/>
                        <NavigateNextIcon/>
                    </ListItem>
                    <Divider/>
                    <ListItem onClick={onClickHowItWorks} button>
                        <ListItemText primary="How It Works"/>
                        <NavigateNextIcon/>
                    </ListItem>
                    <Divider/>
                    <ListItem onClick={onClickPartners} button>
                        <ListItemText primary="Partners"/>
                        <NavigateNextIcon/>
                    </ListItem>
                    <Divider/>
                    <ListItem onClick={onClickCommunityGuidelines} button>
                        <ListItemText primary="Community Guidelines"/>
                        <NavigateNextIcon/>
                    </ListItem>
                    <Divider/>
                    <ListItem onClick={onClickFAQ} button>
                        <ListItemText primary="FAQ"/>
                        <NavigateNextIcon/>
                    </ListItem>
                    <Divider/>
                    {/*<ListItem onClick={onClickContactUs} button>*/}
                    {/*    <ListItemText primary="Contact Us"/>*/}
                    {/*    <NavigateNextIcon/>*/}
                    {/*</ListItem>*/}
                    <Divider/>
                    <ListItem onClick={onClickPrivacyPolicy} button>
                        <ListItemText primary="Privacy Policy"/>
                        <NavigateNextIcon/>
                    </ListItem>
                    <Divider/>
                    <ListItem onClick={onClickTermsOfService} button>
                        <ListItemText primary="Terms Of Service"/>
                        <NavigateNextIcon/>
                    </ListItem>
                </List>
            </Box>
        </div>
    )
}
