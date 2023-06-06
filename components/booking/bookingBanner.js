import React from 'react'
import { Grid, makeStyles, Typography } from '@material-ui/core'
import Image from "next/image"
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent:"center",
        height: 70,
        borderBottom: `${theme.palette.addPayment.borderBottom} solid`,
        padding: 5
    },
    text: {
        fontSize: 24,
        fontWeight: 600
    }
}))

const ProofFormBanner = () => {
    const classes = useStyles()
    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : fr
    return (
        <Grid className={classes.container} container>
            <Grid>
                <Typography className={classes.text}>
                    {t.listingInfo.bookingHeader}
                </Typography>
            </Grid>
        </Grid>
    )
}

export default ProofFormBanner