import { Grid, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
// i18n
import { useRouter } from 'next/router'
import en from '../../locales/en.js'
import fr from '../../locales/fr.js'

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        alignItems: "center",
        height: 80,
        border: `2px solid ${theme.palette.search.outline}`
    },
    text: {
        fontSize: 24,
        fontWeight: 500
    }
}))

const AccountInfoBanner = () => {
    const classes = useStyles()
    const router = useRouter()
    const { locale } = router
    const t = locale === 'en' ? en : fr

    return (
        <Grid className={classes.container} container>
            <Grid item xs={2} />
            <Grid>
                <Typography className={classes.text}>
                    {t.accountInfo.header}
                </Typography>
            </Grid>
        </Grid>
    )
}

export default AccountInfoBanner