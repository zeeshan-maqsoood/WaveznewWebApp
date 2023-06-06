import React from 'react'
import { Grid, makeStyles, Typography } from '@material-ui/core'
import Image from "next/image"
const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        alignItems: "center",
        height: 70,
        borderBottom: `${theme.palette.addPayment.borderBottom} solid`,
        padding: 5
    },
    text: {
        fontSize: 24,
        fontWeight: 600,
        textAlign: "center"
    }
}))

const ProofFormBanner = () => {
    const classes = useStyles()

    return (
        <Grid className={classes.container} container>
            <Grid item xs={2}>
            <Image src="/assets/images/zlogo2.png" alt="logo" width={90} height={90} />
            </Grid>
            <Grid item xs={8}>
                <Typography className={classes.text}>
                    GET APPROVED
                </Typography>
            </Grid>
            <Grid item xs={2} />
        </Grid>
    )
}

export default ProofFormBanner