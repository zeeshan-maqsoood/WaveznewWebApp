import React, {useState, useCallback, useEffect} from "react"
import Router from "next/router"
import Button from "@material-ui/core/Button"
// i18n
// eslint-disable-next-line no-duplicate-imports
import {useRouter} from "next/router"
import {
    Backdrop, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputBase,
    Radio,
    TableCell, TextField,
    withStyles
} from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"
import Cropper from "react-easy-crop"
import Slider from "@material-ui/core/Slider"
import {fade, makeStyles} from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import API from "../../../../../pages/api/baseApiIinstance"
import Session from "../../../../../sessionService"
import TableContainer from "@material-ui/core/TableContainer"
import Table from "@material-ui/core/Table"
import GenericTableHead from "../../../../shared/genericTableSortingHeader"
import TableBody from "@material-ui/core/TableBody"
import TableRow from "@material-ui/core/TableRow"
import moment from "moment"
import TablePagination from "@material-ui/core/TablePagination"
import {grey, lightBlue} from "@material-ui/core/colors"
import Divider from "@material-ui/core/Divider"
import theme from "../../../../../src/theme"

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper
    },
    table: {
        minWidth: 750
    },
    tableCell: {
        fontWeight: "500"
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

const BlueRadio = withStyles({
    root: {
        color: grey[400],
        '&$checked': {
            color: lightBlue[600]
        }
    },
    checked: {}
})((props) => <Radio color="default" {...props} />)


const SelectListingsDialog = (props) => {
    const { open, setOpen, vesselType, vesselIndex, onSave, existingVesselId, existingListings } = props
    const router = useRouter()
    const classes = useStyles()
    const token = Session.getToken("Wavetoken")
    const [selectedVesselId, setSelectedVesselId] = useState(null)
    const [rows, setRows] = useState([])
    const [apiData, setApiData] = useState([])
    const [searchedRows, setSearchedRows] = useState([])
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    //state for sorting header
    const [order, setOrder] = useState("asc")
    const [orderBy, setOrderBy] = useState("title")
    //state for pagination
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

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
            id: "email",
            numeric: false,
            disablePadding: false,
            label: "Email"
        },
        {
            id: "location",
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
            id: "price",
            numeric: false,
            disablePadding: false,
            label: "Price"
        }
    ]

    useEffect(() => {
        console.log(vesselType)
        if (vesselType && vesselType !== "") {
            setIsLoading(true)
            API().get(`${vesselType}`)
                .then((response) => {
                    if (response.data) {
                        console.log("Response of get listings: ", response)
                        setApiData(response.data)
                        setIsLoading(false)
                        if (existingVesselId) {
                            setSelectedVesselId(existingVesselId)
                        }
                        if (existingListings?.length !== 0) {
                            const updatedListings = response.data.filter((listing) => {
                                return !existingListings.some(list => list._id === listing._id)
                            })
                            setRows(updatedListings)
                            setSearchedRows(updatedListings)
                        } else {
                            setRows(response.data)
                            setSearchedRows(response.data)
                        }
                        setIsLoading(false)
                    }
                }).catch((e) => {
                setRows([])
                setSearchedRows([])
                setIsLoading(false)
                console.log("Error from get listings is: ", e)
            })
        }
    }, [vesselType])

    useEffect(() => {
        console.log(existingVesselId)
        setSelectedVesselId(existingVesselId)
    }, [existingVesselId])

    useEffect(() => {
        if (existingListings?.length !== 0) {
            const updatedListings = apiData.filter((listing) => {
                return !existingListings.some(list => list._id === listing._id)
            })
            setRows(updatedListings)
            setSearchedRows(updatedListings)
        }
    }, [existingListings])

    const handleClose = () => {
        requestSearch("")
        setOpen(false)
    }

    const saveFeaturedListing = () => {
        console.log(vesselIndex)
        console.log(vesselType)
        console.log(selectedVesselId)
        let vesselEnum = null
        switch (vesselType) {
            case "rentals":
                vesselEnum = "RENTAL"
                break
            case "stays":
                vesselEnum = "STAY"
                break
            case "charters":
                vesselEnum = "CHARTER"
                break
            default:
                vesselEnum = null
                break
        }
        if (vesselIndex && selectedVesselId && vesselEnum) {
            setIsLoading(true)
            API().put(`vessel/updateVesselSequence/${vesselEnum}`,
                {id: selectedVesselId, sequence: vesselIndex}
                ,
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
                .then((response) => {
                    console.log("response is ", response)
                    setIsLoading(false)
                    if ((response.status = 200)) {
                        console.log("response ", response.data)
                        requestSearch("")
                        onSave()
                        setOpen(false)
                    }
                })
                .catch((e) => {
                    setIsLoading(false)
                    console.log("erro when updating sequence: ", e)
                })
        } else {
            console.log("VesselIndex or selected vessel not set")
        }
    }

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
                    row.title + row.vesselType + ((row.vesselAddress && row?.vesselAddress?.city) ? row?.vesselAddress?.city : "") + (row.updatedAt ? moment(row.updatedAt).format("MM/DD/YYYY") : "")
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
            <Dialog
                open={open}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        handleClose()
                    }
                }}
                fullWidth
                maxWidth="lg"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Backdrop className={classes.backdrop} open={isLoading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <div style={{padding: '2rem'}}>
                    <CloseIcon
                        onClick={handleClose}
                        style={{fontSize: "2rem", cursor: "pointer", float: 'right'}}
                    />
                    <DialogTitle style={{textAlign: 'center'}} id="alert-dialog-title">
                        Select Listings
                        <Divider/>
                    </DialogTitle>
                    <DialogContent>
                            <TextField
                                style={{ width: "30%", marginBottom: "50px", marginLeft: "60px", marginTop: "10px" }}
                                id="outlined-basic"
                                variant="outlined"
                                placeholder="Search Text"
                                label="Search"
                                size="small"
                                onChange={(searchVal) => requestSearch(searchVal.target.value)}
                            />
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
                                    {stableSort(searchedRows, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            return (
                                                <TableRow hover key={row._id}>
                                                    <TableCell
                                                        align='center'
                                                    >
                                                        <BlueRadio
                                                            checked={selectedVesselId === row._id}
                                                            onChange={() => {
                                                                setSelectedVesselId(row._id)
                                                            }}
                                                            value={row._id}
                                                            name="radio-button-demo"
                                                            inputProps={{'aria-label': 'A'}}
                                                        />
                                                    </TableCell>
                                                    <TableCell className={classes.tableCell}>
                                                        {row.title}
                                                    </TableCell>
                                                    <TableCell className={classes.tableCell}>
                                                        {vesselType ? vesselType.toUpperCase() : ""}
                                                    </TableCell>
                                                    <TableCell className={classes.tableCell}>
                                                        {"Owner"}
                                                    </TableCell>
                                                    <TableCell className={classes.tableCell}>
                                                        {"exam@wavez.ca"}
                                                    </TableCell>
                                                    <TableCell className={classes.tableCell}>
                                                        {(row.vesselAddress && row?.vesselAddress?.city) ? row?.vesselAddress?.city : ""}
                                                    </TableCell>
                                                    <TableCell className={classes.tableCell}>
                                                        {"0"}
                                                    </TableCell>
                                                    <TableCell className={classes.tableCell}>
                                                        {moment(row.updatedAt).format("MM/DD/YYYY")}
                                                    </TableCell>
                                                    <TableCell className={classes.tableCell}>
                                                        {"$0"}
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
                    </DialogContent>
                    <DialogActions style={{justifyContent: 'center'}}>
                        <Button
                            style={{marginRight: "1rem"}}
                            variant="contained"
                            color="primary"
                            onClick={saveFeaturedListing}
                        >
                            Save
                        </Button>
                        <Button onClick={handleClose} variant="outlined" style={{
                            color: theme.palette.button.red,
                            borderColor: theme.palette.button.red
                        }}>Cancel</Button>
                    </DialogActions>
                </div>
            </Dialog>
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

export default SelectListingsDialog
