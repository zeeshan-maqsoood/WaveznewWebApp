import {makeStyles} from "@material-ui/core/styles"
import {useRouter} from "next/router"
import Session from "../../../sessionService"
import React, {useEffect, useState} from "react"
import API from "../../api/baseApiIinstance"
import NavBar from "../../../components/admin-panel/navBar"
import Grid from "@material-ui/core/Grid"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import {Backdrop, Checkbox, CircularProgress, DialogContent, TableCell, TextField, Typography} from "@material-ui/core"
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
import Link from "next/link"

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%"
    },
    paper: {
        width: "100%",
        marginBottom: theme.spacing(2)
    },
    table: {
        minWidth: 750
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: theme.palette.background.default
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

function AllListings() {
    const classes = useStyles()
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
            disablePadding: false,
            label: "Listing Title"
        },
        {
            id: "vesselType",
            numeric: false,
            disablePadding: false,
            label: "Service"
        },
        {
            id: "userId.firstName",
            numeric: false,
            disablePadding: false,
            label: "Owner"
        },
        {
            id: "userId.email",
            numeric: false,
            disablePadding: false,
            label: "Email"
        },
        {
            id: "vesselAddress.city",
            numeric: false,
            disablePadding: false,
            label: "Location"
        },
        {
            id: "noOfBookings",
            numeric: false,
            disablePadding: false,
            label: "# of Bookings"
        },
        {
            id: "updatedAt",
            numeric: false,
            disablePadding: false,
            label: "Updated Date"
        },
        {
            id: "vesselPricing.perDay",
            numeric: false,
            disablePadding: false,
            label: "Price per day"
        },
        {
            id: "redirect",
            numeric: false,
            disablePadding: false,
            label: ""
        }
    ]

    const onClickBack = () => {
        router.push("/admin-panel")
    }

    useEffect(() => {
        setFirstTimeSearch(false)
    }, [])

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

    return (
        <div>
            <NavBar/>
            <div className={classes.root}>
                <Backdrop className={classes.backdrop} open={isLoading}>
                    <CircularProgress color="inherit"/>
                </Backdrop>
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
                    <Grid item xs={12}>
                        <Grid container spacing={10}>
                            <Grid style={{display: "flex"}} item xs={4}>
                                {/*<ArrowBackIcon*/}
                                {/*    onClick={onClickBack}*/}
                                {/*    style={{fontSize: "2rem", cursor: "pointer"}}*/}
                                {/*/>*/}
                                <Typography
                                    style={{fontWeight: "500"}}
                                    variant="h5"
                                    gutterBottom
                                >
                                    All Listings
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={10}>
                            <Grid style={{display: "flex"}} item xs={6}>
                                <SearchBar
                                    style={{width: "70%", marginBottom: "15px", marginTop: "10px"}}
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
                                                  <TableRow hover key={row._id}>
                                                    <TableCell padding="checkbox" />
                                                    <TableCell
                                                      className={
                                                        classes.tableCell
                                                      }
                                                    >
                                                      {row?.title
                                                        ? row?.title
                                                        : ''}
                                                    </TableCell>
                                                    <TableCell
                                                      className={
                                                        classes.tableCell
                                                      }
                                                    >
                                                      {row?.vesselType
                                                        ? row?.vesselType.toUpperCase()
                                                        : ''}
                                                    </TableCell>
                                                    <TableCell
                                                      className={
                                                        classes.tableCell
                                                      }
                                                      style={{
                                                        cursor: 'pointer'
                                                      }}
                                                      onClick={() => {
                                                        row?.userId?._id &&
                                                          router.push(
                                                            `/admin-panel/all-users/users/${row?.userId?._id}`
                                                          )
                                                      }}
                                                    >
                                                      {row?.userId?.firstName}{' '}
                                                      {row?.userId?.lastName}
                                                    </TableCell>
                                                    <TableCell
                                                      className={
                                                        classes.tableCell
                                                      }
                                                    >
                                                      {row?.userId?.email}
                                                    </TableCell>
                                                    <TableCell
                                                      className={
                                                        classes.tableCell
                                                      }
                                                    >
                                                      {row?.vesselAddress &&
                                                      row?.vesselAddress?.city
                                                        ? row?.vesselAddress
                                                            ?.city
                                                        : ''}
                                                    </TableCell>
                                                    <TableCell
                                                      className={
                                                        classes.tableCell
                                                      }
                                                    >
                                                      {row?.noOfBookings
                                                        ? row?.noOfBookings
                                                        : '0'}
                                                    </TableCell>
                                                    <TableCell
                                                      className={
                                                        classes.tableCell
                                                      }
                                                    >
                                                      {row?.updatedAt
                                                        ? moment(
                                                            row?.updatedAt
                                                          ).format('MM/DD/YYYY')
                                                        : ''}
                                                    </TableCell>
                                                    <TableCell
                                                      className={
                                                        classes.tableCell
                                                      }
                                                    >
                                                      {row?.vesselPricing
                                                        ?.perDay
                                                        ? `$${
                                                            row?.vesselPricing
                                                              ?.perDay?.amount
                                                              ? row
                                                                  ?.vesselPricing
                                                                  ?.perDay
                                                                  ?.amount
                                                              : 0
                                                          }`
                                                        : '$0'}
                                                    </TableCell>
                                                    <TableCell
                                                      className={
                                                        classes.tableCell
                                                      }
                                                      style={{
                                                        cursor: 'pointer'
                                                      }}
                                                    >
                                                      <Link
                                                        legacyBehavior
                                                        href={`/listingInfo/${row._id}`}
                                                      >
                                                        <a
                                                          target="_blank"
                                                          style={{
                                                            color: '#000000'
                                                          }}
                                                        >
                                                          <OpenInNew
                                                            style={{
                                                              cursor: 'pointer'
                                                            }}
                                                          />
                                                        </a>
                                                      </Link>
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
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default AllListings
