import { Grid, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { HEIGHT, IMAGE_HEIGHT } from '../../components/navbar/navBar'
import { highlightColor, primaryColor } from '../../config/colors'
import Link from "next/link"
// i18n
import { useRouter } from 'next/router'
import en from '../../locales/en.js'
import fr from '../../locales/fr.js'

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        minHeight: `calc(100vh - 80px - ${  HEIGHT  } - ${  IMAGE_HEIGHT  })` // 100vh - banner(80) - navbar height - navbar image height
    },
    tab: {
        height: 50,
        display: "flex",
        alignItems: "center",
        fontWeight: 500,
        fontSize: 16,
        paddingLeft: 30,
        width: "100%",
        overflow: "hidden",
        cursor: "pointer",
        [theme.breakpoints.down("xs")]: {
            paddingLeft: 10
        }
    }
}))

const Tab = ({ label, highlighted = false, route }) => {
    const classes = useStyles()
    return (
      <div>
        <Link legacyBehavior href={`/accountInfo/${route}`}>
          {highlighted ? (
            <Typography
              className={classes.tab}
              style={{ backgroundColor: highlightColor, color: primaryColor }}
            >
              {label}
            </Typography>
          ) : (
            <Typography className={classes.tab}>{label}</Typography>
          )}
        </Link>
      </div>
    )
}

const AccountInfoTabs = ({ currentTab }) => {
    const classes = useStyles()
    const router = useRouter()
    const { locale } = router
    const t = locale === 'en' ? en : fr
    const tabNames = [{ label: t.accountInfo.tab1, route: "profile" }, { label: t.accountInfo.tab2, route: "verification" }, { label: t.accountInfo.tab3, route: "payments" }, { label: t.accountInfo.tab4, route: "themes" }]

    return (
        <div className={classes.container}>
            <ul style={{ listStyleType: "none", padding: 0, margin: 0, width: "100%" }}>
                {tabNames.map((tab, index) => {
                    return (
                        <li key={tab.label}>
                            <div styl={{ width: "100%" }}>
                                <Tab key={tab.label} label={tab.label} highlighted={currentTab === index} route={tab.route} />
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default AccountInfoTabs
