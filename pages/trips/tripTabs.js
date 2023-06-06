import React, { Component, useState, useEffect, useContext } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Session from "../../sessionService"
import { AppBar, Paper, Tabs, Tab, Grid } from "@material-ui/core"
import ToggleButton from "@material-ui/lab/ToggleButton"
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup"

import Upcoming from "../../components/trips/upcoming"
import Ongoing from "../../components/trips/ongoing"
import Past from "../../components/trips/past"
import Offers from "../../components/trips/offers"
import Button from "@material-ui/core/Button"
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import NavBar from "../../components/navbar/navBar.js"

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345
  },
  media: {
    height: 140
  },
  topHeader: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "inline"
    }
  },
  search: {
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "530px",
    boxRadius: "8px",
    border: "1px solid #BDBDBD",
    marginTop: "12px"
  },
  searchBarRoot: {
    marginLeft: "auto",
    marginRight: "auto",
    width: "500px",
    [theme.breakpoints.down("xs")]: {
      maxWidth: "300px"
    }
  },
  tabBar: {
    position: "fixed",
    backgroundColor: "white",
    width: "100%",
    zIndex: 9
  },
  boat_name: {
    fontSize: 24,
    fontWeight: 500,
    font: "Roboto",
    margin: 1,
    padding: 10,
    display: "flex",
    alignItems: "center"
  },
  tab_style: {
    textTransform: "capitalize",
    display: "flex",
    fontSize: 18
  },
  tab_title: {
    paddingLeft: 10
  },
  see_listing: {
    float: "right",
    fontSize: 18,
    color: "black",
    "&:hover": {
      color: "black"
    }
  },
  toggleRoot: {
    textTransform: "none",
    "& .Mui-selected": {
      '&:hover': {
        background: theme.palette.background.bookingBackground,
        color: theme.palette.text.grey
     },
      backgroundColor: theme.palette.buttonPrimary.main,
      color: "white"
    }
  },
  toggleText: {
    textTransform: "none"
  },
  switchButton: {
    float: "right",
    textTransform: "none",
    color: theme.palette.buttonPrimary.main
  }
}))

export default function TripTabs() {
  const token = Session.getToken("Wavetoken")
  const classes = useStyles()
  const [value, setValue] = useState(0)
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr
  const [selectedTab, setSelectedTab] = useState(0)
  const [isOwner, setIsOwner] = useState(Session.getRole() === "owner" ? true : false)
  const [role, setRole] = useState()

  const handleRole = (event, newRole) => {
    Session.setRole(newRole)
    setRole(newRole)
  }

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue)
    updateTab(newValue)
  }

  const updateTab = (newTab = selectedTab) => {
    setValue(newTab)
  }

  const renderTab = () => {
    if (value === 0) {
      return <Upcoming isOwner={isOwner} />
    } else if (value === 1) {
      return <Ongoing isOwner={isOwner} />
    } else if (value === 2) {
      return <Past isOwner={isOwner} />
    } else if (value === 3) {
      return <Offers isOwner={isOwner} />
    }
  }

  const handleSwitchRole = () => {
    if (role === "renter") {
      Session.setRole("owner")
      setRole("owner")
    } else {
      Session.setRole("renter")
      setRole("renter")
    }    
  }

  useEffect(() => {
    setRole(Session.getRole())
  }, [])

  useEffect(() => {
    role === "owner" ? setIsOwner(true) : setIsOwner(false)
  }, [role])

  return (
    <>
      <NavBar />
      <div className={classes.tabBar}>
        <Paper className={classes.boat_name}>
          <Grid container>
            <Grid item xs={10} sm={8}>
              <div className={classes.topHeader}>
                {t.tripsPage.header}
              </div>
            </Grid>
            <Grid item xs={2} sm={4}> {Session.getUserDetail().isVesselOwner && <Button onClick={handleSwitchRole} className={classes.switchButton}>{t.tripsPage.switchTo} {role === "owner"? t.tripsPage.renter : t.tripsPage.owner}</Button>}</Grid>     
          </Grid>
        </Paper>

        {/* tap bar */}
        <Paper>
          <AppBar position='static' color='default'>
            <Tabs
              value={value}
              onChange={handleChange}
              variant='scrollable'
              scrollButtons='on'
              indicatorColor='primary'
              textColor='primary'
            >
              <Tab
                label={
                  <>
                    <div className={classes.tab_style}>
                      <span className={classes.tab_title}>
                        {t.tripsPage.upcoming.header}
                      </span>
                    </div>
                  </>
                }
                {...a11yProps(0)}
              />
              <Tab
                label={
                  <>
                    <div className={classes.tab_style}>
                      <span className={classes.tab_title}>
                        {t.tripsPage.ongoing.header}
                      </span>
                    </div>
                  </>
                }
                {...a11yProps(1)}
              />
              <Tab
                label={
                  <>
                    <div className={classes.tab_style}>
                      <span className={classes.tab_title}>
                        {t.tripsPage.past.header}
                      </span>
                    </div>
                  </>
                }
                {...a11yProps(2)}
              />
              <Tab
                label={
                  <>
                    <div className={classes.tab_style}>
                      <span className={classes.tab_title}>Offers</span>
                    </div>
                  </>
                }
                {...a11yProps(3)}
              />
            </Tabs>
          </AppBar>
        </Paper>
      </div>
      <div style={{ paddingTop: 70 }} />
      <Grid item xs={12}>
        {renderTab()}
      </Grid>
    </>
  )
}
