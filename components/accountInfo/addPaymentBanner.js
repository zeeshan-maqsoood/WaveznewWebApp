import React from 'react'
import {Grid, Link, makeStyles, Typography} from '@material-ui/core'
import Image from "next/image"

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent:"center",
        height: 70,
        borderBottom: `${theme.palette.addPayment.borderBottom
            } solid`,
        padding: 5

    },
    text: {
        fontSize: 24,
        fontWeight: 600,
        [theme.breakpoints.down("sm")]: {
            fontSize: '18px',
            margin:"auto",
            display: "flex"
        },
        [theme.breakpoints.down("xs")]: {
            fontSize: '12px',
            margin:"auto",
            display: "flex"
        }
    }
}))
// i18n
import {useRouter} from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import theme from "../../src/theme"

const AddPaymentBanner = () => {
    const classes = useStyles()
    const router = useRouter()
    const {locale} = router
    const t = locale === 'en' ? en : fr
    return (
      <Grid className={classes.container} container>
        <Grid item xs={5}>
          <Link
            legacyBehavior
            href="/accountInfo/profile"
            style={{
              textDecoration: 'none',
              color: theme.palette.background.default
            }}
          >
            <Image
              src="/assets/images/zlogo2.png"
              alt="logo"
              width={90}
              height={60}
            />
          </Link>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.text}>
            {t.payment.addPaymentInfo}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Link
            legacyBehavior
            href="/accountInfo/payments"
            style={{
              textDecoration: 'none',
              color: theme.palette.wavezHome.reviewsText
            }}
          >
            <Typography className={classes.text}>x</Typography>
          </Link>
        </Grid>
      </Grid>
    )
}

export default AddPaymentBanner

