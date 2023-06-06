import {makeStyles} from "@material-ui/core/styles"
import {useRouter} from "next/router"
import Session from "../../../sessionService"
import React, {useEffect, useState} from "react"
import API from "../../../pages/api/baseApiIinstance"
import NavBar from "../../../components/admin-panel/navBar"
import Grid from "@material-ui/core/Grid"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import {
    Backdrop,
    Checkbox,
    CircularProgress,
    DialogContent,
    TableCell,
    TextField,
    Tooltip,
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
import MessageIcon from "@material-ui/icons/Message"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
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

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1
    }
    if (b[orderBy] > a[orderBy]) {
        return 1
    }
    return 0
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) return order
        return a[1] - b[1]
    })
    return stabilizedThis.map((el) => el[0])
}

function boatLicense() {
    const classes = useStyles()
    const router = useRouter()
    const token = Session.getToken("Wavetoken")
    const [loading, setLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [order, setOrder] = useState("desc")
    const [orderBy, setOrderBy] = useState("updatedAt")
    //state for pagination
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [rows, setRows] = useState([])
    const [searchedRows, setSearchedRows] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [totalCount, setTotalCount] = useState(0)

    const headCells = [

        {
            id: "name",
            numeric: false,
            disablePadding: true,
            label: "Name"
        },
        {
            id: "email",
            numeric: false,
            disablePadding: true,
            label: "Email"
        },
        {
            id: "idType",
            numeric: false,
            disablePadding: true,
            label: "Document Type"
        },
        {
            id: "status",
            numeric: false,
            disablePadding: true,
            label: "Document Status"
        },
        {
            id: "reason",
            numeric: false,
            disablePadding: true,
            label: "Reason"
        },
        {
            id: "updatedAt",
            numeric: false,
            disablePadding: true,
            label: "Updated Date"
        }
    ]
    const convertFromCamelCaseWithSpace = (str) => {
        return str?.replace(/([a-z])([A-Z])/g, '$1 $2')
    }
    useEffect(() => {
        API()
            .get(
                `/users/getAllUsersThatHasDocs`,
                {
                    headers: {
                        authorization: `Bearer ${  token}`
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    console.log(response.data)
                    setLoading(false)
                    setRows(response.data)
                    setSearchedRows(response.data)
                    setTotalCount(response.data.length)
                }
            })
            .catch((e) => {
                console.log("Not found: ", e)
            })

    }, [])

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

    const onRowClick = (id) => {
        router.push(`/admin-panel/verification/boatLicense/${id}`)
    }

    const requestSearch = (searchedVal) => {
        console.log("search goes here: ", searchedVal)
        if (searchedVal === "") {
            setSearchedRows(rows)
        } else {
            const filteredRows = rows.filter((row) => {
                const combinationTitleAndTypeAndStatus =
                    row.firstName
                return combinationTitleAndTypeAndStatus
                    ?.toLowerCase()
                    .includes(searchedVal.toLowerCase())
            })
            console.log("Filter Row is ", filteredRows)
            setSearchedRows(filteredRows)
        }
    }

    return (
        <div>
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
                                    onChange={(searchVal) => requestSearch(searchVal)}
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
                                        {stableSort(searchedRows, getComparator(order, orderBy))
                                            .slice(
                                                page * rowsPerPage,
                                                page * rowsPerPage + rowsPerPage
                                            )
                                            .map((row, index) => {
                                                return (
                                                    <TableRow hover key={row._id} style={{cursor: 'pointer'}}
                                                              onClick={() => {
                                                                  onRowClick(row?._id)
                                                              }}>
                                                        <TableCell padding="checkbox"/>
                                                        <TableCell className={classes.tableCell}>
                                                            {row.firstName ? `${row?.firstName  } ${  row.lastName}` : ''}
                                                        </TableCell>
                                                        <TableCell className={classes.tableCell}>
                                                            {row.email ? row.email : ""}
                                                        </TableCell>
                                                        <TableCell className={classes.tableCell}>
                                                            Boat License
                                                        </TableCell>
                                                        <TableCell className={classes.tableCell}>
                                                            {row.documents[0].isVerified ? 'Approved' : (row.documents[0].isRejected ? 'Rejected' : 'Pending')}
                                                        </TableCell>
                                                        <TableCell className={classes.tableCell}>
                                                            {row.documents[0].rejectionReason &&
                                                                <Tooltip
                                                                    title={row.documents[0].rejectionReason}
                                                                    aria-label={row.documents[0].rejectionReason}><MessageIcon
                                                                    style={{
                                                                        cursor: "pointer",
                                                                        fontSize: "2rem"
                                                                    }}/></Tooltip>
                                                            }</TableCell>
                                                        <TableCell className={classes.tableCell}>
                                                            {row.documents[0].updatedAt ? moment(row.documents[0].updatedAt).format("DD/MM/YYYY") : ''}
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
        </div>
    )
}

export default boatLicense
