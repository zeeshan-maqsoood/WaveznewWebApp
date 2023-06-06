import {makeStyles} from "@material-ui/core/styles"
import {useRouter} from "next/router"
import Session from "../../../sessionService"
import React, {useEffect, useState} from "react"
import API from "../../api/baseApiIinstance"
import NavBar from "../../../components/admin-panel/navBar"
import Grid from "@material-ui/core/Grid"
import {Backdrop, CircularProgress, TableCell, TextField, Typography} from "@material-ui/core"
import Paper from "@material-ui/core/Paper"
import TableContainer from "@material-ui/core/TableContainer"
import Table from "@material-ui/core/Table"
import GenericTableHead from "../../../components/shared/genericTableSortingHeader"
import TableBody from "@material-ui/core/TableBody"
import TableRow from "@material-ui/core/TableRow"
import moment from "moment"
import TablePagination from "@material-ui/core/TablePagination"

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
        color: '#fff'
    },
    tableCell: {
        fontWeight: 400
    },
    description: {
        fontWeight: 400,
        overflow: "hidden",
        textOverflow: "ellipsis",
        "-webkit-line-clamp": 1,
        "-webkit-box-orient": "vertical",
        height: "auto",
        display: "-webkit-box"
    }
}))

function Reports() {
    const classes = useStyles()
    const router = useRouter()
    const token = Session.getToken("Wavetoken")
    const [loading, setLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [order, setOrder] = useState("desc")
    const [orderBy, setOrderBy] = useState("reportedDate")
    //state for pagination
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [rows, setRows] = useState([])
    const [searchedRows, setSearchedRows] = useState([])

    const headCells = [
        {
            id: "transactionId",
            numeric: false,
            disablePadding: false,
            label: "Transaction ID"
        },
        {
            id: "description",
            numeric: false,
            disablePadding: false,
            label: "Description"
        },
        {
            id: "userName",
            numeric: false,
            disablePadding: false,
            label: "User Name"
        },
        {
            id: "userType",
            numeric: false,
            disablePadding: false,
            label: "User Type"
        },
        {
            id: "reportedDate",
            numeric: false,
            disablePadding: false,
            label: "Date"
        }
    ]

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

    useEffect(() => {
        getAllReports()
    }, [])

    const getAllReports = () => {
        //TODO temp list until api is ready
        // setSearchedRows(tempReports);
        // setRows(tempReports);
        API()
            .get(
                `reports`,
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
                    setSearchedRows(response.data)
                    setRows(response.data)
                }
            })
            .catch((e) => {
                console.log("reports Not found: ", e)
            })
    }

    const onReportRowClick = (row) => {
        console.log('user clicked on', row?._id)
        if (row?._id) {
            router.push(`/admin-panel/reports/${row?._id}`)
        }
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
                            <Grid style={{display: "flex"}} item xs={6}>
                                <Typography
                                    style={{fontWeight: "500"}}
                                    variant="h5"
                                    gutterBottom
                                >
                                    Reports
                                </Typography>
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
                                            {stableSort(searchedRows, getComparator(order, orderBy))
                                                .slice(
                                                    page * rowsPerPage,
                                                    page * rowsPerPage + rowsPerPage
                                                )
                                                .map((row, index) => {
                                                    return (
                                                        <TableRow hover key={row._id} style={{cursor: 'pointer'}}
                                                                  onClick={() => onReportRowClick(row)}>
                                                            <TableCell padding="checkbox"/>
                                                            <TableCell className={classes.tableCell}>
                                                                {row?.transactionId ? row.transactionId : ''}
                                                            </TableCell>
                                                            <TableCell className={classes.tableCell}
                                                                       style={{width: "40%"}}>
                                                                <p className={classes.description}>
                                                                    {row?.description ? row.description : ''}
                                                                </p>
                                                            </TableCell>
                                                            <TableCell className={classes.tableCell}>
                                                                {row?.reportedBy ? (`${row?.reportedBy?.firstName  } ${  row?.reportedBy?.lastName}`) : ''}
                                                            </TableCell>
                                                            <TableCell className={classes.tableCell}
                                                                       style={{textTransform: "capitalize"}}>
                                                                {row?.userType ? row?.userType : ''}
                                                            </TableCell>
                                                            <TableCell className={classes.tableCell}>
                                                                {(row?.reportedDate && row?.reportedDate !== '') ? moment(row?.reportedDate).format("MM/DD/YYYY") : ''}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 20]}
                                    component='div'
                                    count={searchedRows.length}
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

export default Reports

const tempReports = [
    {
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
        userName: "Jim Jordan",
userType: "Guest",
reportedDate: new Date(),
_id: "hsbdshbdsbd"
    },
    {
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
        userName: "Jim Jordan",
userType: "Guest",
reportedDate: new Date(),
_id: "hsbdsasas"
    },
    {
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
        userName: "Jim Jordan",
userType: "Guest",
reportedDate: new Date(),
_id: "hsbdsasde"
    },
    {
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
        userName: "Jim Jordan",
userType: "Guest",
reportedDate: new Date(),
_id: "hsbdssdffr"
    },
    {
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
        userName: "Jim Jordan",
userType: "Guest",
reportedDate: new Date(),
_id: "hsbdsasfes"
    }
]
