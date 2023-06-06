import React, {useEffect, useState} from "react"
import PropTypes from "prop-types"
import {makeStyles} from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TablePagination from "@material-ui/core/TablePagination"
import TableRow from "@material-ui/core/TableRow"
import TableSortLabel from "@material-ui/core/TableSortLabel"
import Paper from "@material-ui/core/Paper"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"
import NavBar from "../../../components/admin-panel/navBar"
import Grid from "@material-ui/core/Grid"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import Button from "@material-ui/core/Button"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import {useRouter} from "next/router"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import {Checkbox, TextField, Tooltip, Typography} from "@material-ui/core"
import CloseIcon from '@material-ui/icons/Close'
import API from "../../api/baseApiIinstance"
import Session from "../../../sessionService"
import SearchBar from "material-ui-search-bar"
import theme from "../../../src/theme"
import moment from "moment"
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes'
import {forEach} from "react-bootstrap/ElementChildren"


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
    if (orderBy.includes("!")) {
        const obj = orderBy.split("!")
        const key = obj[1]
        return order === "desc"
            ? (a, b) => descendingComparator(a[obj[0]], b[obj[0]], key)
            : (a, b) => -descendingComparator(a[obj[0]], b[obj[0]], key)
    } else {
        return order === "desc"
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy)
    }
}

function stableSort(array, comparator) {
    console.log("stable array", array)
    const stabilizedThis = array.map((el, index) => [el, index])
    console.log("stabilizedThis: ", stabilizedThis)
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) return order
        return a[1] - b[1]
    })
    return stabilizedThis.map((el) => el[0])
}

const headCells = [
    {
        id: "_id",
        numeric: false,
        disablePadding: true,
        label: "Trip ID"
    },
    {
        id: "renter!email",
        numeric: false,
        disablePadding: true,
        label: "Email of Renter"
    },
    {
        id: "vesselOwner!email",
        numeric: false,
        disablePadding: true,
        label: "Email of Vessel Owner"
    },
    {
        id: "canceledByVesselOwner",
        numeric: false,
        disablePadding: true,
        label: "Canceled by Vessel Owner"
    },
    {
        id: "canceledByRenter",
        numeric: false,
        disablePadding: true,
        label: "Canceled by Renter"
    },
    {
        id: "cancelReason",
        numeric: false,
        disablePadding: true,
        label: "Reason"
    },
    {
        id: "bookingStartDate",
        numeric: false,
        disablePadding: true,
        label: "Updated Date"
    },
    {
        id: "resolved",
        numeric: false,
        disablePadding: false,
        label: "Resolved"
    }
]

function EnhancedTableHead(props) {
    const {classes, order, orderBy, onRequestSort} = props

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property)
    }


    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox"></TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        style={{width: headCell.id === 'operations' ? '9rem' : 'auto'}}
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "default"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
}

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
    MuiDialogPaperWidthSm: {
        width: '40%'
    }
}))

export default function EnhancedTable() {
    const classes = useStyles()
    const [order, setOrder] = React.useState("asc")
    const [orderBy, setOrderBy] = React.useState("serviceType")
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const router = useRouter()
    const [tableData, setTableData] = useState([])
    const [rows, setRows] = useState([])
    const [initiateGet, setInitiateGet] = useState(true)
    const token = Session.getToken("Wavetoken")
    const [searchedRows, setSearchedRows] = useState([])
    const [searched, setSearched] = useState("")

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc"
        setOrder(isAsc ? "desc" : "asc")
        setOrderBy(property)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }
    const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, searchedRows.length - page * rowsPerPage)


    useEffect(() => {
        if (initiateGet) {
            API()
                .get(
                    `trip/canceledTripsAdmin`,
                    {
                        headers: {
                            authorization: `Bearer ${  token}`,
                            accept: "application/json"
                        }
                    }
                )
                .then((response) => {
                    console.log("response is ", response)
                    if ((response.status = 200)) {
                        setTableData(response.data)
                        setInitiateGet(false)
                    }
                })
                .catch((e) => {
                    console.log("Configuration Not found: ", e)
                    setInitiateGet(false)
                })
        }
    }, [initiateGet])

    useEffect(() => {
        // tableData.forEach((x, i) => {
        //     tableData[i].updatedAt = x.updatedAt.split("T")[0];
        // });
        setRows(tableData)
        setSearchedRows(tableData)
    }, [tableData])


    const requestSearch = (searchedVal) => {
        console.log("search goes here: ", searchedVal)
        if (searchedVal === "") {
            setSearchedRows(rows)
        } else {
            const filteredRows = rows.filter((row) => {
                const combinationTitleAndTypeAndStatus =
                    row._id + row.renter.email + row.vesselOwner.email
                return combinationTitleAndTypeAndStatus
                    .toLowerCase()
                    .includes(searchedVal.toLowerCase())
            })
            console.log("Filter Row is ", filteredRows)
            setSearchedRows(filteredRows)
            setPage(0)
        }
    }

    const cancelSearch = () => {
        setSearched("")
        requestSearch(searched)
    }
    const goToUserPage = (id) => {
        router.push(`/admin-panel/all-users/users/${id}`)
    }


    const handleChangeResolve = (id, event) => {
        console.log(id)
        console.log(event)
        API()
            .put(
                `trip/resolveCanceledTripsAdmin/${id}`,
                {resolved: event},
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    console.log(response.data)
                    setTableData(response.data)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
                setInitiateGet(false)
            })
    }
    return (
        <>
            <NavBar/>

            <Grid
                style={{
                    marginRight: "auto",
                    marginLeft: "16rem",
                    marginTop: "8%",
                    width: "73%"
                }}
                container
                spacing={3}
            >
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid style={{display: "flex"}} item xs={3}>
                            <Typography
                                component={'span'}
                                style={{fontWeight: "500"}}
                                variant="h5"
                                gutterBottom
                            >
                                Canceled Trips
                            </Typography>
                        </Grid>
                        <Grid style={{textAlign: "right"}} item xs={9}>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <div style={{display: "flex"}}>
                        <SearchBar
                            inputProps={{"data-testid": "searchValue"}}
                            className={classes.search}
                            style={{width: "500px"}}
                            value={searched}
                            placeholder={'Search Trip'}
                            onChange={(searchVal) => requestSearch(searchVal)}
                            onCancelSearch={cancelSearch}
                        />
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.root}>
                        <Paper className={classes.paper}>
                            <TableContainer>
                                <Table
                                    style={{width: "200%"}}
                                    className={classes.table}
                                    aria-labelledby="tableTitle"
                                    aria-label="enhanced table"
                                >
                                    <EnhancedTableHead
                                        classes={classes}
                                        order={order}
                                        orderBy={orderBy}
                                        onRequestSort={handleRequestSort}
                                        rowCount={searchedRows.length}
                                    />
                                    <TableBody>
                                        {stableSort(searchedRows, getComparator(order, orderBy))
                                            .slice(
                                                page * rowsPerPage,
                                                page * rowsPerPage + rowsPerPage
                                            )
                                            .map((row, index) => {
                                                const labelId = `enhanced-table-checkbox-${index}`

                                                return (
                                                    <TableRow
                                                        hover
                                                        role="checkbox"
                                                        tabIndex={-1}
                                                        key={row._id}
                                                    >
                                                        <TableCell padding="checkbox"></TableCell>
                                                        <TableCell
                                                            component="th"
                                                            id={labelId}
                                                            scope="row"
                                                            padding="none"
                                                            style={{cursor: "pointer"}}
                                                            onClick={() => {
                                                                goToUserPage(row.canceledByVesselOwner ? row.vesselOwner._id : (row.canceledByRenter ? row.renter._id : ''))
                                                            }}
                                                        >
                                                            {row._id}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            id={labelId}
                                                            scope="row"
                                                            padding="none"
                                                        >
                                                            {row.renter.email}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            id={labelId}
                                                            scope="row"
                                                            padding="none"
                                                        >
                                                            {row.vesselOwner.email}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            id={labelId}
                                                            scope="row"
                                                            padding="none"
                                                        >
                                                            {row.canceledByVesselOwner ? 'True' : 'False'}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            id={labelId}
                                                            scope="row"
                                                            padding="none"
                                                        >
                                                            {row.canceledByRenter ? 'True' : 'False'}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            id={labelId}
                                                            scope="row"
                                                            padding="none"
                                                        >
                                                            {row.cancelReason ? <Tooltip
                                                                title={row.cancelReason}
                                                                aria-label={row.cancelReason}><SpeakerNotesIcon
                                                                style={{
                                                                    fontSize: "2rem",
                                                                    color: theme.palette.error.main
                                                                }}
                                                            /></Tooltip> : 'No Reason Submitted'}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            id={labelId}
                                                            scope="row"
                                                            padding="none"
                                                        >
                                                            {row?.bookingStartDate ? moment(row.bookingStartDate).format("DD/MM/YYYY") : ''}
                                                        </TableCell>
                                                        <TableCell>
                                                            {/*<input*/}
                                                            {/*    style={{ width: 16, height: 16 }}*/}
                                                            {/*    checked={row.resolved}*/}
                                                            {/*    type='checkbox'*/}
                                                            {/*    name={name}*/}
                                                            {/*    onClick={this.handleChangeResolve}*/}
                                                            {/*/>*/}
                                                            <Checkbox
                                                                checked={row.resolved}
                                                                onChange={() => {
                                                                    handleChangeResolve(row._id, event.target.checked)
                                                                }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        {emptyRows > 0 && (
                                            <TableRow
                                                style={{height: 53 * emptyRows}}
                                            >
                                                <TableCell colSpan={6}/>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={searchedRows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </div>
                </Grid>
            </Grid>
        </>
    )

}
