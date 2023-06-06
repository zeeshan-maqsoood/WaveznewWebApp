import {makeStyles} from "@material-ui/core/styles"
import {useRouter} from "next/router"
import Session from "../../sessionService"
import React, {useEffect, useState} from "react"
import API from "../../pages/api/baseApiIinstance"
import NavBar from "../../components/admin-panel/navBar"
import Grid from "@material-ui/core/Grid"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import {Backdrop, CircularProgress, TableCell, TextField, Typography} from "@material-ui/core"
import Paper from "@material-ui/core/Paper"
import Button from "@material-ui/core/Button"
import TableContainer from "@material-ui/core/TableContainer"
import Table from "@material-ui/core/Table"
import GenericTableHead from "../../components/shared/genericTableSortingHeader"
import TableBody from "@material-ui/core/TableBody"
import TableRow from "@material-ui/core/TableRow"
import moment from "moment"
import TablePagination from "@material-ui/core/TablePagination"
import {OpenInNew} from "@material-ui/icons"
import TableSortLabel from "@material-ui/core/TableSortLabel"
import TableHead from "@material-ui/core/TableHead"
import SearchBar from "material-ui-search-bar"
import theme from "../../src/theme"

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
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: theme.palette.background.default
    }
    // tableCell: {
    //     textAlign: "center",
    //     fontWeight: "600",
    // }
}))

function Users(props) {
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
            id: "firstName",
            numeric: false,
            disablePadding: false,
            label: "Name"
        },
        {
            id: "email",
            numeric: false,
            disablePadding: false,
            label: "Email"
        },
        {
            id: "isVesselOwner",
            numeric: false,
            disablePadding: false,
            label: "Is Vessel Owner"
        },
        {
            id: "updatedAt",
            numeric: false,
            disablePadding: false,
            label: "Updated Date"
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
        }, 500)
        return () => clearTimeout(searchTimeoutId)
    }, [searchValue])

    const searchListings = () => {
        setLoading(true)
        API()
            .get(
                `users/list?p=${page + 1}&s=${rowsPerPage}${searchValue && searchValue !== '' ? `&f=${  searchValue}` : ''}${orderBy ? `&o=${  order !== 'asc' ? '-' : ''  }${orderBy}` : ''}`,
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
                    setListings(response.data.users)
                    setSearchedRows(response.data.users)
                    setRows(response.data.users)
                }
            })
            .catch((e) => {
                setLoading(false)
                console.log("get all users error: ", e)
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

    const onUserRowClick = (userId) => {
        props.setRefreshConversations(userId)
        // // Do the conversation creation logic
        // var body = {
        //     members: [Session.getUserId(), userId],
        //     hasMessages: [
        //         {
        //             user: Session.getUserId(),
        //             seen: true,
        //         },
        //         {
        //             user: userId,
        //             seen: true,
        //         },
        //     ],
        // };
        // API()
        //     .post("conversations/save", body, {
        //         headers: {
        //             authorization: "Bearer " + token,
        //         },
        //     })
        //     .then((response) => {
        //         if (response.status === 200) {
        //             console.log("post conversation status 200");
        //             console.log("response.data: ", response.data);
        //
        //         }
        //     })
        //     .catch((e) => {
        //         // router.push("/somethingWentWrong");
        //         console.log("error: ", e);
        //     });
    }

    return (
        <div>
            <div className={classes.root}>
                <Backdrop className={classes.backdrop} open={isLoading}>
                    <CircularProgress color="inherit"/>
                </Backdrop>
                <Grid
                    style={{
                        marginRight: "auto",
                        marginLeft: "16rem",
                        marginTop: "3%",
                        width: "76%"
                    }}
                    container
                    spacing={3}
                >
                    <Grid item xs={12}>
                        <Grid container spacing={10}>
                            <Grid style={{display: "flex"}} item xs={4}>
                                <Typography
                                    style={{fontWeight: "500"}}
                                    variant="h5"
                                    gutterBottom
                                >
                                    Users
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={10}>
                            <Grid style={{display: "flex"}} item xs={6}>
                                <SearchBar
                                    style={{
                                        width: "70%",
                                        marginBottom: "15px",
                                        backgroundColor: theme.palette.background.default
                                    }}
                                    placeholder="Search Users"
                                    size="small"
                                    onChange={(searchVal) => setSearchValue(searchVal)}
                                    onCancelSearch={(searchVal) => setSearchValue('')}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <div className={classes.root}>
                            <Paper className={classes.paper}>
                                <TableContainer>
                                    <Table className={classes.table}
                                           aria-labelledby="tableTitle"
                                           aria-label="enhanced table"
                                           stickyHeader>
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
                                                                      onUserRowClick(row?._id)
                                                                  }}>
                                                            <TableCell padding="checkbox"></TableCell>
                                                            <TableCell className={classes.tableCell}>
                                                                {row?.firstName ? row.firstName : ''} {row?.lastName ? row.lastName : ''}
                                                            </TableCell>
                                                            <TableCell className={classes.tableCell}>
                                                                {row?.email ? row?.email : ''}
                                                            </TableCell>
                                                            <TableCell className={classes.tableCell}>
                                                                {row?.isVesselOwner ? 'Yes' : 'No'}
                                                            </TableCell>
                                                            <TableCell className={classes.tableCell}>
                                                                {row?.updatedAt ? moment(row.updatedAt).format("MM/DD/YYYY") : ''}
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
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default Users
