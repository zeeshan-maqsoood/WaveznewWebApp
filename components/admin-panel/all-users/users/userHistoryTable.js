import React, {useState, useCallback, useEffect} from "react"
import {
    Radio,
    TableCell,
    withStyles
} from "@material-ui/core"
import {fade, makeStyles} from "@material-ui/core/styles"
import TableContainer from "@material-ui/core/TableContainer"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableRow from "@material-ui/core/TableRow"
import moment from "moment"
import TablePagination from "@material-ui/core/TablePagination"
import {grey, lightBlue} from "@material-ui/core/colors"
import GenericTableHead from "../../../shared/genericTableSortingHeader"
import SearchBar from "material-ui-search-bar"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import {useRouter} from "next/router"

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
    tableCell: {
        fontWeight: "400"
    }
}))


const UserHistoryTable = (props) => {
    const { userHistoryData } = props
    const classes = useStyles()
    const [rows, setRows] = useState([])
    const [searchedRows, setSearchedRows] = useState([])
    //state for sorting header
    const [order, setOrder] = useState("desc")
    const [orderBy, setOrderBy] = useState("start")
    //state for pagination
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const router = useRouter()
    let id = router.query?.id

    useEffect(() => {
        id = router.query?.id
    }, [router])

    const headCells = [
        {
            id: "vessel.title",
            numeric: false,
            disablePadding: false,
            label: "Listing Title"
        },
        {
            id: "vessel.vesselType",
            numeric: false,
            disablePadding: false,
            label: "Service"
        },
        {
            id: "vessel.vesselAddress.city",
            numeric: false,
            disablePadding: false,
            label: "Location"
        },
        {
            id: "role",
            numeric: false,
            disablePadding: false,
            label: "Role"
        },
        {
            id: "status",
            numeric: false,
            disablePadding: false,
            label: "Status"
        },
        {
            id: "bookingStartDate",
            numeric: false,
            disablePadding: false,
            label: "Date"
        },
        {
            id: "displayAmount",
            numeric: false,
            disablePadding: false,
            label: "Trip Price"
        }
    ]

    useEffect(() => {
        if (userHistoryData) {
            setRows(userHistoryData)
            setSearchedRows(userHistoryData)
        }
    }, [userHistoryData])

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc"
        setOrder(isAsc ? "desc" : "asc")
        setOrderBy(property)
    }

    const requestSearch = (searchedVal) => {
        console.log("search goes here: ", searchedVal)
        if (searchedVal === "") {
            setSearchedRows(rows)
        } else {
            const filteredRows = rows.filter((row) => {
                const combinationTitleAndTypeAndStatus =
                    (row?.vessel ? (row?.vessel?.title ? row?.vessel?.title : '') : '') +
                    (row.vessel ? row.vessel?.vesselType : '') +
                    (row.vessel ? ((row.vessel?.vesselAddress && row?.vessel.vesselAddress?.city) ? row?.vessel?.vesselAddress?.city : "") : '') +
                    (id === row?.renter?._id ? "Renter" : "Owner") +
                    (row?.userDetails ? (row?.userDetails?.firstName ? `${row?.userDetails?.firstName} ${row?.userDetails?.lastName}` : '') : '') +
                    (row?.status ? capitalize(row?.status) : '') + (row?.tripStatus ? capitalize(row?.tripStatus) : '') +
                    (row.bookingStartDate ? moment(row.bookingStartDate).format("MM/DD/YYYY") : "") +
                    (row?.displayAmount ? row?.displayAmount : 0)
                return combinationTitleAndTypeAndStatus
                    .toLowerCase()
                    .includes(searchedVal.toLowerCase())
            })
            console.log("Filter Row is ", filteredRows)
            setSearchedRows(filteredRows)
        }
    }

    const capitalize = (str) => {
        const lower = str.toLowerCase()
        return str.charAt(0).toUpperCase() + lower.slice(1)
    }

    return (
        <>
            <SearchBar
                style={{ width: "30%", marginBottom: "1rem", marginTop: "1rem" }}
                placeholder="Search History"
                label="Search"
                onChange={(searchVal) => requestSearch(searchVal)}
            />
            <Grid item xs={12}>
                <Paper elevation={3} className={classes.paper}>
                    <TableContainer style={{maxHeight: 500}}>
                        <Table className={classes.table} stickyHeader>
                            <GenericTableHead
                                classes={classes}
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={searchedRows.length}
                                headCells={headCells}
                            />
                            <TableBody data-testid='list'>
                                {searchedRows.length !== 0 ? (
                                    <>
                                        {stableSort(searchedRows, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                                return (
                                                    <TableRow hover key={row._id}>
                                                        <TableCell padding="checkbox" />
                                                        <TableCell className={classes.tableCell}>
                                                            {row?.vessel ? (row?.vessel?.title ? row?.vessel?.title : '') : ''}
                                                        </TableCell>
                                                        <TableCell className={classes.tableCell}>
                                                            {row?.vessel?.vesselType ? row?.vessel?.vesselType.toUpperCase() : ""}
                                                        </TableCell>
                                                        <TableCell className={classes.tableCell}>
                                                            {row?.vessel ? (row?.vessel?.vesselAddress ? row?.vessel?.vesselAddress?.city : '') : ''}
                                                        </TableCell>
                                                        <TableCell className={classes.tableCell}>
                                                            {id === row?.renter?._id ? "Renter" : "Owner"}
                                                        </TableCell>
                                                        <TableCell className={classes.tableCell}>
                                                            {row?.status ? capitalize(row?.status) : ''} ({row?.tripStatus ? capitalize(row?.tripStatus) : ''})
                                                        </TableCell>
                                                        <TableCell className={classes.tableCell}>
                                                            {row.bookingStartDate ? moment(row.bookingStartDate).format("MM/DD/YYYY") : ''}
                                                        </TableCell>
                                                        <TableCell className={classes.tableCell}>
                                                            $ {row?.displayAmount ? row?.displayAmount : 0}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                    </>
                                ) : (
                                    <TableRow hover>
                                        <TableCell style={{textAlign: 'center'}} colSpan={7}>
                                            No Records Available!
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component='div'
                        count={searchedRows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Grid>
        </>
    )
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

function descendingComparator(a, b, orderBy) {
    const propPath = orderBy.split('.')
    const aValue = propPath
        .reduce((curObj, property) => (curObj[property] || ""), a)
    const bValue = propPath
        .reduce((curObj, property) => (curObj[property] || ""), b)
    if (bValue < aValue) {
        return -1
    }
    if (bValue > aValue) {
        return 1
    }
    return 0
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
}

export default UserHistoryTable
