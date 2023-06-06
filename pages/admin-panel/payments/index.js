import React from "react"
import {makeStyles} from "@material-ui/core/styles"
import NavBar from "../../../components/admin-panel/navBar"
import {useRouter} from "next/router"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import OpenInNewIcon from "@material-ui/icons/OpenInNew"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import {Typography} from "@material-ui/core"
import theme from "../../../src/theme"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        fontFamily: "Roboto",
        color: theme.palette.title.matterhorn
    }
}))

export default function Payments() {
    const classes = useStyles()
    const router = useRouter()

    const onClickBack = () => {
        router.push('/admin-panel')
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
                    <Grid item xs={12} style={{paddingLeft: '4em'}}>
                        <Grid container spacing={10}>
                            <Grid style={{display: "flex"}} item xs={4}>
                                {/*<ArrowBackIcon*/}
                                {/*    onClick={onClickBack}*/}
                                {/*    style={{ fontSize: "2rem", cursor: "pointer" }}*/}
                                {/*/>*/}
                                <Typography
                                    style={{fontWeight: "500"}}
                                    variant="h5"
                                    gutterBottom
                                >
                                    Payments
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} style={{paddingLeft: '4em', paddingTop: '3em'}}>
                        <Button variant="contained" style={{
                            color: theme.palette.background.default,
                            backgroundColor: theme.palette.border.dodgerBlue,
                            padding: '0.6em 0.9em'
                        }}
                                target="_blank" href="https://dashboard.stripe.com/dashboard" rel="noopener noreferrer">
                            Stripe Dashboard <OpenInNewIcon style={{marginLeft: '0.5em'}}/>
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}
