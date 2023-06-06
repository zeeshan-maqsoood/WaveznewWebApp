import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import NavBar from "../../../../components/admin-panel/navBar"
import Divider from '@material-ui/core/Divider'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import {useRouter} from "next/router"
import Box from '@material-ui/core/Box'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper
    }
}))

export default function AddListing() {
    const classes = useStyles()
    const router = useRouter()

    const onClickGetStartedPage = () => {
        router.push("/admin-panel/pages/add-listing/get-started")
    }

    const onClickListingCategoryPage = () => {
        router.push("/admin-panel/pages/add-listing/listing-category")
    }

    const onClickPhotosPage = () => {
        router.push("/admin-panel/pages/add-listing/photos")
    }

    const onClickVesselDescriptionPage = () => {
        router.push("/admin-panel/pages/add-listing/vessel-description")
    }
    return (
        <>
            <NavBar/>
            <div style={{
                width: '73%',
                marginLeft: '16rem',
                marginRight: 'auto',
                marginTop: '7%'
            }}>
                <h2 style={{fontWeight: "400"}}>Add Listing</h2>
            </div>
            <Box
                boxShadow={3}
                bgcolor="background.paper"
                m={1}
                p={1}
                style={{marginRight: 'auto', marginLeft: '16rem', width: '73%'}}>
                <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    className={classes.root}>
                    <ListItem onClick={onClickGetStartedPage} button>
                        <ListItemText primary="Get Started Page"/>
                        <ArrowRightIcon/>
                    </ListItem>
                    <Divider/>

                    <ListItem onClick={onClickListingCategoryPage} button>
                        <ListItemText primary="Listing Category"/>
                        <ArrowRightIcon/>
                    </ListItem>
                    <Divider/>

                    <ListItem onClick={onClickPhotosPage} button>
                        <ListItemText primary="Photos"/>
                        <ArrowRightIcon/>
                    </ListItem>
                    <Divider/>

                    <ListItem onClick={onClickVesselDescriptionPage} button>
                        <ListItemText primary="Vessel Description"/>
                        <ArrowRightIcon/>
                    </ListItem>

                </List>
            </Box>
        </>
    )
}
