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
import {OpenInNew} from "@material-ui/icons"

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


const UserListingsTable = (props) => {
    const { userListingsData } = props
    const classes = useStyles()
    const [rows, setRows] = useState([])
    const [searchedRows, setSearchedRows] = useState([])
    //state for sorting header
    const [order, setOrder] = useState("asc")
    const [orderBy, setOrderBy] = useState("title")
    //state for pagination
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)

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
            id: "owner",
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
            id: "vesselPricing.perDay.amount",
            numeric: false,
            disablePadding: false,
            label: "Price per day"
        },
        {
            id: "openInNew",
            numeric: false,
            disablePadding: false,
            label: ""
        }
    ]

    useEffect(() => {
        if (userListingsData) {
            setRows(userListingsData)
            setSearchedRows(userListingsData)
        }
    }, [userListingsData])

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
                    `${row.title + row.vesselType + ((row.vesselAddress && row?.vesselAddress?.city) ? row?.vesselAddress?.city : "") + (row.updatedAt ? moment(row.updatedAt).format("MM/DD/YYYY") : "")
                + (row?.userId?.email ? row?.userId?.email : "")  }Owner${  row?.noOfBookings ? row?.noOfBookings : 0 
                    }${row?.vesselPricing?.perDay?.amount ? row?.vesselPricing?.perDay?.amount : 0}`
                return combinationTitleAndTypeAndStatus
                    .toLowerCase()
                    .includes(searchedVal.toLowerCase())
            })
            console.log("Filter Row is ", filteredRows)
            setSearchedRows(filteredRows)
        }
    }

    return (
        <>
                        <SearchBar
                            style={{ width: "30%", marginBottom: "1rem", marginTop: "1rem" }}
                            placeholder="Search Listings"
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
                                                            {searchedRows?.length !== 0 ? (
                                                                <>
                                                                    <TableCell padding="checkbox" />
                                                                    <TableCell className={classes.tableCell}>
                                                                        {row.title}
                                                                    </TableCell>
                                                                    <TableCell className={classes.tableCell}>
                                                                        {row.vesselType ? row.vesselType.toUpperCase() : ""}
                                                                    </TableCell>
                                                                    <TableCell className={classes.tableCell}>
                                                                        {"Owner"}
                                                                    </TableCell>
                                                                    <TableCell className={classes.tableCell}>
                                                                        {row?.userId?.email ? row?.userId?.email : ""}
                                                                    </TableCell>
                                                                    <TableCell className={classes.tableCell}>
                                                                        {(row.vesselAddress && row?.vesselAddress?.city) ? row?.vesselAddress?.city : ""}
                                                                    </TableCell>
                                                                    <TableCell className={classes.tableCell}>
                                                                        {row?.noOfBookings ? row?.noOfBookings : 0}
                                                                    </TableCell>
                                                                    <TableCell className={classes.tableCell}>
                                                                        {row.updatedAt ? moment(row.updatedAt).format("MM/DD/YYYY") : ''}
                                                                    </TableCell>
                                                                    <TableCell className={classes.tableCell}>
                                                                        $ {row?.vesselPricing?.perDay?.amount ? row?.vesselPricing?.perDay?.amount : 0}
                                                                    </TableCell>
                                                                    <TableCell className={classes.tableCell} style={{cursor: "pointer"}}>
                                                                        <OpenInNew />
                                                                    </TableCell>
                                                                </>
                                                            ) : (
                                                                <TableCell className={classes.tableCell} colSpan={9}>
                                                                    {'No Record Exists!'}
                                                                </TableCell>
                                                            )}
                                                        </TableRow>
                                                    )
                                                })}
                                        </>
                                        ):(
                                        <TableRow hover>
                                            <TableCell style={{textAlign: 'center'}} colSpan={10}>
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

export default UserListingsTable
