import React, {useState} from "react"
import clsx from 'clsx'
import {alpha, makeStyles, useTheme} from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import CssBaseline from '@material-ui/core/CssBaseline'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import SearchIcon from '@material-ui/icons/Search'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Collapse from '@material-ui/core/Collapse'
import Menu from '@material-ui/core/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import {red} from "@material-ui/core/colors"
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined'
import ChatBubbleOutlineOutlinedIcon from '@material-ui/icons/ChatBubbleOutlineOutlined'
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined'
import ViewAgendaOutlinedIcon from '@material-ui/icons/ViewAgendaOutlined'
import ViewWeekOutlinedIcon from '@material-ui/icons/ViewWeekOutlined'
import {useRouter} from "next/router"
import {Autocomplete} from "@material-ui/lab"
import {TextField} from "@material-ui/core"
import Session from "../../sessionService"
import {CallToActionOutlined, HelpOutline} from "@material-ui/icons"
import theme from "../../src/theme"
import ForumIcon from '@material-ui/icons/Forum'
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import ReportIcon from '@material-ui/icons/Report'
import NotificationsIcon from '@material-ui/icons/Notifications'
import Badge from "@material-ui/core/Badge"
import {socket} from "../../src/socket"
import API from "../../pages/api/baseApiIinstance"
const drawerWidth = 240
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    nested: {
        paddingLeft: theme.spacing(4)
    },
    appBar: {
        color: red,
        background: theme.palette.background.default,
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
        marginRight: 36
    },
    hide: {
        display: 'none'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap'
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1
        }
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25)
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto'
        }
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '-3rem'
    },
    inputRoot: {
        color: 'inherit'
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch'
        }
    }
}))

export default function Navbar() {
    const classes = useStyles()
    // const theme = useTheme();
    const adminNavBarStatus = Session.getAdminNavBarStatus("AdminNavBarStatus")
    console.log(adminNavBarStatus)
    const [open, setOpen] = useState(adminNavBarStatus ? adminNavBarStatus : false)
    const [openListPages, setOpenListPages] = useState(false)
    const [openListUsers, setOpenListUsers] = useState(false)
    const [notifications, setNotifications] = useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null)
    const openMenu = Boolean(anchorEl)
    const userLoggedData = Session.getUserLoggedInData("UserLoggedData")
    const router = useRouter()

    const handleClick = () => {
        setOpenListPages(!openListPages)
    }

    const handleClickUsers = () => {
        setOpenListUsers(!openListUsers)
    }

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const onClickShowAddListing = () => {
        router.push("/admin-panel/pages/add-listing")
    }

    const onClickShowVerification = () => {
        router.push("/admin-panel/verification")
    }

    const onClickShowDashboard = () => {
        router.push("/admin-panel")
    }

    const onClickShowPseudoAdmin = () => {
        router.push("/admin-panel/all-users/pseudo-admin")
    }

    const onClickAllUsers = () => {
        router.push("/admin-panel/all-users/users")
    }

    const onClickHome = () => {
        router.push("/admin-panel/pages/home")
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleLogout = () => {
        socket.disconnect()
        router.push("/")
        Session.clear()
    }

    const handleDrawerOpen = () => {
        setOpen(!open)
        setAdminStatus(!open)
    }

    const handleClickNotifications = () => {
        setNotifications(!notifications)
    }

    const handleDrawerClose = () => {
        setOpen(!open)
        setAdminStatus(!open)
    }

    const setAdminStatus = (val) => {
        Session.setAdminNavBarStatus(val)
        console.log(Session.getAdminNavBarStatus("AdminNavBarStatus"))

    }
    const onClickShowAllListing = () => {
        router.push("/admin-panel/allListings")
    }

    const onClickPayments = () => {
        router.push("/admin-panel/payments")
    }

    const onClickFooter = () => {
        router.push("/admin-panel/footer")
    }

    const onClickReports = () => {
        router.push("/admin-panel/reports")
    }
    const onClickShowCanceledTrips = () => {
        router.push("/admin-panel/canceled-trips")
    }
    const onClickMessages = () => {
        router.push("/admin-panel/messages")
    }
    const onClickAdminHelp = () => {
        if (userLoggedData.isAdmin) {
            router.push("/admin-panel/howItWorks")
        } else {
            openConfigurationInPdfNewTab("HOW_IT_WORKS_ADMIN_PANEL")
        }
    }

    const openConfigurationInPdfNewTab = (key) => {
        API()
            .get(`configuration/${key}`)
            .then((response) => {
                console.log("response is ", response)
                if (response?.data?.stringValue && response?.data?.stringValue !== "") {
                    const win = window.open(response?.data?.stringValue, "_blank")
                    win.focus()
                }
            })
            .catch((e) => {
                console.log("Error: ", e.response)
            })
    }

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <style>{`body { background-color: ${  theme.palette.background.whisper  }; }`}</style>
            <AppBar
                style={{color: theme.palette.navBar.darkerGrey, background: theme.palette.background.default}}
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open
                        })}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <div className={classes.search} style={{width: '100%'}}>
                        <div className={classes.searchIcon}>
                            <SearchIcon/>
                        </div>
                        <Autocomplete
                            freeSolo
                            onChange={(event, value) => {
                                if (value) {
                                    console.log(value)
                                    const url = pagesFeatures.find(obj => obj.title === value).page
                                    router.push(`/admin-panel${url}`)
                                }
                            }}
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput
                            }}
                            options={pagesFeatures.map((option) =>
                                option.title
                            )}
                            getOptionDisabled={option => {
                                return userLoggedData.isPseudoAdmin && option === 'Pseudo Admin'
                            }}
                            renderInput={(params) => (
                                <TextField {...params} InputProps={{...params.InputProps, disableUnderline: true}}
                                           placeholder="Global Search"/>
                            )}
                        />
                    </div>
                    <div>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            open={openMenu}
                            onClose={handleClose}
                        >
                            {/*<MenuItem onClick={handleClose}>Profile</MenuItem>*/}
                            {/*<MenuItem onClick={handleClose}>My account</MenuItem>*/}
                            <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer

                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open
                    })
                }}>
                <div className={classes.toolbar}>
                    <img style={{width: 140, height:100}} src={'/assets/images/footerlogo.png'} alt="Logo"/>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                    </IconButton>
                </div>
                {/* <Divider/> */}
                <List style={{display: 'block'}}
                      component="nav"
                      aria-labelledby="nested-list-subheader"
                      className={classes.root}>
                    <ListItem onClick={onClickShowDashboard} button>
                        <ListItemIcon>
                            <DashboardOutlinedIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Dashboard"/>
                    </ListItem>
                    <ListItem button onClick={handleClick}>
                        <ListItemIcon>
                            <ViewAgendaOutlinedIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Pages"/>
                        {openListPages ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={openListPages} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button onClick={onClickHome} className={classes.nested}>
                                <ListItemIcon>
                                    <ViewAgendaOutlinedIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Home"/>
                            </ListItem>
                            <ListItem button onClick={onClickShowAddListing} className={classes.nested}>
                                <ListItemIcon>
                                    <ViewAgendaOutlinedIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Add Listing"/>
                            </ListItem>
                        </List>
                    </Collapse>
                    <ListItem button onClick={onClickShowAllListing}>
                        <ListItemIcon>
                            <ChatBubbleOutlineOutlinedIcon/>
                        </ListItemIcon>
                        <ListItemText primary="All Listings"/>
                    </ListItem>
                    <ListItem button onClick={handleClickUsers}>
                        <ListItemIcon>
                            <PersonOutlineOutlinedIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Users"/>
                        {openListUsers ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={openListUsers} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {userLoggedData.isAdmin &&
                            <ListItem button onClick={onClickShowPseudoAdmin} className={classes.nested}>
                                <ListItemIcon>
                                    <PersonOutlineOutlinedIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Pseudo Admin"/>
                            </ListItem>}
                            <ListItem button onClick={onClickAllUsers} className={classes.nested}>
                                <ListItemIcon>
                                    <PersonOutlineOutlinedIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Users"/>
                            </ListItem>
                        </List>
                    </Collapse>
                    <ListItem button onClick={onClickShowCanceledTrips}>
                        <ListItemIcon>
                            <ViewWeekOutlinedIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Canceled Trips"/>
                    </ListItem>
                    <ListItem button onClick={onClickPayments}>
                        <ListItemIcon>
                            <ViewWeekOutlinedIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Payments"/>
                    </ListItem>
                    <ListItem button onClick={handleClickNotifications}>
                        <ListItemIcon>
                            {/*<Badge color="error" overlap="circular" badgeContent="1" >*/}
                            <NotificationsIcon/>
                            {/*</Badge>*/}
                        </ListItemIcon>
                        <ListItemText primary="Notifications"/>
                        {notifications ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={notifications} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            { userLoggedData.userType === 'PSEUDO_ADMIN' &&
                            <ListItem button className={classes.nested} onClick={onClickMessages}>
                                <ListItemIcon>
                                    {/*<Badge color="error" overlap="circular" badgeContent="2" >*/}
                                        <ForumIcon/>
                                    {/*</Badge>*/}
                                </ListItemIcon>
                                <ListItemText primary="Messages"/>
                            </ListItem>}
                            <ListItem button className={classes.nested} onClick={onClickReports}>
                                <ListItemIcon>
                                    {/*<Badge color="error" overlap="circular" badgeContent="1" >*/}
                                    <ReportIcon/>
                                    {/*</Badge>*/}
                                </ListItemIcon>
                                <ListItemText primary="Reports"/>
                            </ListItem>
                            <ListItem button className={classes.nested} onClick={onClickShowVerification}>
                                <ListItemIcon>
                                    {/*<Badge color="error" overlap="circular" badgeContent="1" >*/}
                                    <VerifiedUserIcon/>
                                    {/*</Badge>*/}
                                </ListItemIcon>
                                <ListItemText primary="Verifications"/>
                            </ListItem>
                        </List>
                    </Collapse>
                    <ListItem button onClick={onClickFooter}>
                        <ListItemIcon>
                            <CallToActionOutlined/>
                        </ListItemIcon>
                        <ListItemText primary="Footer"/>
                    </ListItem>
                    <ListItem button onClick={onClickAdminHelp}>
                        <ListItemIcon>
                            <HelpOutline/>
                        </ListItemIcon>
                        <ListItemText primary="How It Works"/>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    )
}
const pagesFeatures = [
    {title: 'Dashboard', page: '/'},
    {title: 'Get Started Page', page: '/pages/add-listing/get-started'},
    {title: 'Listing Category', page: '/pages/add-listing/listing-category'},
    {title: 'Photos', page: '/pages/add-listing/photos'},
    {title: 'Vessel Description', page: '/pages/add-listing/vessel-description'},
    {title: 'Features', page: '/pages/add-listing/vessel-description/features'},
    {title: 'Types of Fuel', page: '/pages/add-listing/vessel-description/type-of-fuel'},
    {title: 'Home Page', page: '/pages/home'},
    {title: 'Information Banner', page: '/pages/home/information-banner'},
    {title: 'Hero Text', page: '/pages/home/hero-text'},
    {title: 'Pseudo Admin', page: '/all-users/pseudo-admin'},
    {title: 'Hero Image', page: '/pages/home/hero-image'}
]
