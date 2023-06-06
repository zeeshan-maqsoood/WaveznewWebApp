import React, { useContext, useEffect, useState, useRef } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Paper, Typography, Grid } from "@material-ui/core"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemText from "@material-ui/core/ListItemText"
import Avatar from "@material-ui/core/Avatar"
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount"
import DirectionsBoatIcon from "@material-ui/icons/DirectionsBoat"

// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  contentTitle: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: "24px",
    color: theme.palette.title.matterhorn,
    marginLeft: "5%",
    marginTop: "30px"
  },
  hostDetailsPaper: {
    radius: "10px",
    marginLeft: "5%",
    border: `1px solid${  theme.darkerGrey}`,
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0
    }
  },
  inline: {
    display: "flex"
  },
  inlineGuestCat: {
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      display: "inline"
    }
  },
  icons: {
    display: "flex",
    width: "20px",
    height: "20px",
    color: theme.palette.title.matterhorn,
    [theme.breakpoints.down("xs")]: {
      width: "15px",
      height: "15px"
    }
  }
}))

export default function HostDetails({ numberOfGuest, hostInfo, categories }) {
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  const displayCategories = () => {
    const cats = categories?.map(item => item?.name)
    return cats?.join(", ")
  }

  return (
    <>
      {/* Host details */}
      <Paper className={classes.hostDetailsPaper}>
        <Grid item xs={12}>
          <List>
            <ListItem>
              <ListItemAvatar style={{ marginTop: "0px" }}>
                {hostInfo?.profileImageUrl ? (
                  <Avatar src={hostInfo?.profileImageUrl} />
                ) : (
                  <Avatar>
                    {hostInfo?.firstName.charAt(0)}
                    {hostInfo?.lastName.charAt(0)}
                  </Avatar>
                )}
              </ListItemAvatar>
              <ListItemText
               style={{ margin: 10 }}
                primary={`${t.listingInfo.boatHostedBy} ${hostInfo?.firstName} ${hostInfo?.lastName}`}
                secondary={
                  <span className={classes.inlineGuestCat}>
                    <Typography
                      component='span'
                      variant='body2'
                      className={classes.inline}
                      style={{marginRight: 10}}
                      color='textPrimary'
                    >
                      <SupervisorAccountIcon
                        className={classes.icons}
                        data-testid='peopleIcon'
                      />
                      {numberOfGuest} {t.listingInfo.guest}s
                    </Typography>

                    <Typography
                      component='span'
                      variant='body2'
                      className={classes.inline}
                      color='textPrimary'
                    >
                      <DirectionsBoatIcon
                        className={classes.icons}
                        data-testid='boatIcon'
                      />
                      {displayCategories()}
                    </Typography>
                  </span>
                }
              />
            </ListItem>
          </List>
        </Grid>
      </Paper>
    </>
  )
}
