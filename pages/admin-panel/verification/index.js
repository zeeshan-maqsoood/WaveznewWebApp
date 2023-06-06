import {makeStyles, useTheme} from "@material-ui/core/styles"
import {useRouter} from "next/router"
import Session from "../../../sessionService"
import React, {useEffect, useState} from "react"
import API from "../../api/baseApiIinstance"
import NavBar from "../../../components/admin-panel/navBar"
import Grid from "@material-ui/core/Grid"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import {
    AppBar,
    Backdrop,
    Checkbox,
    CircularProgress,
    DialogContent,
    TableCell, Tabs,
    TextField,
    Typography
} from "@material-ui/core"
import Paper from "@material-ui/core/Paper"
import Button from "@material-ui/core/Button"
import TableContainer from "@material-ui/core/TableContainer"
import Table from "@material-ui/core/Table"
import GenericTableHead from "../../../components/shared/genericTableSortingHeader"
import TableBody from "@material-ui/core/TableBody"
import TableRow from "@material-ui/core/TableRow"
import moment from "moment"
import TablePagination from "@material-ui/core/TablePagination"
import {OpenInNew} from "@material-ui/icons"
import TableSortLabel from "@material-ui/core/TableSortLabel"
import TableHead from "@material-ui/core/TableHead"
import SearchBar from "material-ui-search-bar"
import PropTypes from 'prop-types'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import IdentityTab from '../../../components/admin-panel/verfication/identityTab'
import BoatLicenseTab from '../../../components/admin-panel/verfication/boatLicenseTab'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: 0,
        fontFamily: "Roboto",
        color: theme.palette.title.matterhorn
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: theme.palette.background.default
    },
    table: {
        // marginBottom: "50px"
    },
    tableCell: {
        paddingLeft: 0
    },
    visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        top: 20,
        width: 1
    }
}))

function TabPanel(props) {
    const {children, value, index, ...other} = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
}

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`
    }
}

function verification() {
    const classes = useStyles()
    const theme = useTheme()
    const router = useRouter()
    const token = Session.getToken("Wavetoken")
    const [loading, setLoading] = useState(false)
    const [listings, setListings] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [order, setOrder] = useState("desc")
    const [orderBy, setOrderBy] = useState("updatedAt")
    //state for pagination
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [rows, setRows] = useState([])
    const [apiData, setApiData] = useState([])
    const [searchedRows, setSearchedRows] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [totalCount, setTotalCount] = useState(0)
    const [firstTimeSearch, setFirstTimeSearch] = useState(true)

    const headCells = [
        {
            id: "title",
            numeric: false,
            disablePadding: true,
            label: "Listing Title"
        },
        {
            id: "vesselType",
            numeric: false,
            disablePadding: true,
            label: "Service"
        },
        {
            id: "userId.firstName",
            numeric: false,
            disablePadding: true,
            label: "Owner"
        },
        {
            id: "userId.email",
            numeric: false,
            disablePadding: true,
            label: "Email"
        },
        {
            id: "vesselAddress.city",
            numeric: false,
            disablePadding: true,
            label: "Location"
        },
        {
            id: "noOfBookings",
            numeric: false,
            disablePadding: true,
            label: "# of Bookings"
        },
        {
            id: "updatedAt",
            numeric: false,
            disablePadding: true,
            label: "Updated Date"
        },
        {
            id: "vesselPricing.perDay.amount",
            numeric: false,
            disablePadding: true,
            label: "Price per day"
        }
    ]

    useEffect(() => {
        setFirstTimeSearch(false)
    }, [])

    useEffect(() => {
        console.log('router.query', router.query)
        if (router.query?.document === 1) {
            setValue(1)
        } else if (router.query?.document === 2) {
            setValue(2)
        }

    }, [router])

    useEffect(() => {
        // only execute search when the user stops typing
        const searchTimeoutId = setTimeout(() => {
            searchListings()
        }, 1000)
        return () => clearTimeout(searchTimeoutId)
    }, [searchValue])

    const searchListings = () => {
        setLoading(true)
        API()
            .get(
                `vessel/getAllListings?p=${page + 1}&s=${rowsPerPage}${searchValue && searchValue !== '' ? `&f=${  searchValue}` : ''}${orderBy ? `&o=${  order !== 'asc' ? '-' : ''  }${orderBy}` : ''}`,
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                setLoading(false)
                if ((response.status = 200)) {
                    setTotalCount(response.data.totalCount)
                    setListings(response.data.vesselsList)
                    setSearchedRows(response.data.vesselsList)
                    setRows(response.data.vesselsList)
                }
            })
            .catch((e) => {
                setLoading(false)
                console.log("get all Listings error: ", e)
            })
    }

    useEffect(() => {
        if (!firstTimeSearch) {
            searchListings()
        }
    }, [page, orderBy, order, rowsPerPage])

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleRequestSort = (event, property) => {
        console.log(event, property)
        const isAsc = orderBy === property && order === "asc"
        setOrder(isAsc ? "desc" : "asc")
        setOrderBy(property)
    }

    const onVesselRowClick = (vesselId) => {
        router.push(`/admin-panel/verification/${vesselId}`)
    }

    const [value, setValue] = React.useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    return (
        <div  style={{
            marginRight: "auto",
            marginLeft: "16rem",
            marginTop: "6%",
            width: "73%"
        }}>
            <Grid item xs={12}>
                <Grid container spacing={10}>
                    <Grid style={{display: "flex"}} item xs={4}>
                        <Typography
                            style={{marginLeft: "3%", fontWeight: "500"}}
                            variant="h5"
                            gutterBottom
                        >
                            Verification
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <NavBar/>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab label="Vessel Verification" {...a11yProps(0)} />
                    <Tab label="Document Verification" {...a11yProps(1)} />
                    <Tab label="Boating License" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0} dir={theme.direction}>
                <div className={classes.root}>
                    <Backdrop className={classes.backdrop} open={isLoading}>
                        <CircularProgress color="inherit"/>
                    </Backdrop>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid item xs={12}>
                            <Grid container spacing={3}>
                                <Grid style={{display: "flex"}} item xs={8}>
                                    <SearchBar
                                        style={{width: "100%", marginBottom: "15px", marginTop: "10px"}}
                                        placeholder="Search Text"
                                        onChange={(searchVal) => setSearchValue(searchVal)}
                                        value={searchValue}
                                        onCancelSearch={(searchVal) => setSearchValue('')}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <TableContainer>
                                    <Table className={classes.table} size={"medium"}>
                                        <GenericTableHead
                                            classes={classes}
                                            order={order}
                                            orderBy={orderBy}
                                            onRequestSort={handleRequestSort}
                                            rowCount={searchedRows.length}
                                            headCells={headCells}
                                        />
                                        <TableBody data-testid='list'>
                                            {listings
                                                .map((row, index) => {
                                                    return (
                                                        <TableRow hover key={row._id} style={{cursor: 'pointer'}}
                                                                  onClick={() => {
                                                                      onVesselRowClick(row?._id)
                                                                  }}>
                                                            <TableCell padding="checkbox"/>
                                                            <TableCell className={classes.tableCell}>
                                                                {row?.title ? row?.title : ''}
                                                            </TableCell>
                                                            <TableCell className={classes.tableCell}>
                                                                {row?.vesselType ? row?.vesselType.toUpperCase() : ""}
                                                            </TableCell>
                                                            <TableCell className={classes.tableCell}>
                                                                {row?.userId?.firstName} {row?.userId?.lastName}
                                                            </TableCell>
                                                            <TableCell className={classes.tableCell}>
                                                                {row?.userId?.email}
                                                            </TableCell>
                                                            <TableCell className={classes.tableCell}>
                                                                {(row?.vesselAddress && row?.vesselAddress?.city) ? row?.vesselAddress?.city : ""}
                                                            </TableCell>
                                                            <TableCell className={classes.tableCell}>
                                                                {row?.noOfBookings ? row?.noOfBookings : '0'}
                                                            </TableCell>
                                                            <TableCell className={classes.tableCell}>
                                                                {row?.updatedAt ? moment(row?.updatedAt).format("DD/MM/YYYY") : ''}
                                                            </TableCell>
                                                            <TableCell className={classes.tableCell}>
                                                                {row?.vesselPricing?.perDay ? (`$${  row?.vesselPricing?.perDay?.amount ? row?.vesselPricing?.perDay?.amount : 0}`) : '$0'}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component='div'
                                    count={totalCount}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
                <IdentityTab/>
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
                <BoatLicenseTab/>
            </TabPanel>
        </div>
    )
}

export default verification
