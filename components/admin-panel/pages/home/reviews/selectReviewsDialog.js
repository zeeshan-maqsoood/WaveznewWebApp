import React, {useState, useCallback, useEffect} from "react"
import Button from "@material-ui/core/Button"
// i18n
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
import {fade, makeStyles} from "@material-ui/core/styles"
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

const BlueRadio = withStyles({
    root: {
        color: grey[400],
        '&$checked': {
            color: lightBlue[600]
        }
    },
    checked: {}
})((props) => <Radio color="default" {...props} />)


const SelectReviewsDialog = (props) => {
    const { open, setOpen, reviewIndex, onSave, existingReviewId, existingReviews } = props
    const classes = useStyles()
    const token = Session.getToken("Wavetoken")
    const [selectedReviewId, setSelectedReviewId] = useState(null)
    const [rows, setRows] = useState([])
    const [searchedRows, setSearchedRows] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    //state for sorting header
    const [order, setOrder] = useState("desc")
    const [orderBy, setOrderBy] = useState("createdAt")
    //state for pagination
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [firstTimeSearch, setFirstTimeSearch] = useState(true)
    const [searchValue, setSearchValue] = useState('')
    const [totalCount, setTotalCount] = useState(0)
    const [reviews, setReviews] = useState([])

    const headCells = [
        {
            id: "reviewer.firstName",
            numeric: false,
            disablePadding: false,
            label: "User Name"
        },
        {
            id: "reviewer.rawAddress",
            numeric: false,
            disablePadding: false,
            label: "Location"
        },
        {
            id: "createdAt",
            numeric: false,
            disablePadding: false,
            label: "Date"
        },
        {
            id: "rating",
            numeric: false,
            disablePadding: false,
            label: "Rating"
        },
        {
            id: "description",
            numeric: false,
            disablePadding: false,
            label: "Description"
        }
    ]

    useEffect(() => {
        console.log(existingReviewId)
        setSelectedReviewId(existingReviewId)
    }, [existingReviewId])

    useEffect(() => {
    }, [existingReviews])

    const handleClose = () => {
        searchListings("")
        setOpen(false)
    }

    const saveFeaturedReview = () => {
        console.log(reviewIndex)
        console.log(selectedReviewId)
        if (reviewIndex && selectedReviewId) {
            setIsLoading(true)
            API().put(`reviews/updateReviewsSequence`,
                {id: selectedReviewId, sequence: reviewIndex}
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
                        searchListings("")
                        onSave()
                        setOpen(false)
                    }
                })
                .catch((e) => {
                    setIsLoading(false)
                    console.log("erro when updating sequence: ", e)
                })
        } else {
            console.log("reviewIndex or selected vessel not set")
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

    useEffect(() => {
        if (!firstTimeSearch) {
            searchListings()
        }
    }, [page, orderBy, order, rowsPerPage])

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

    const searchListings = (searchVal) => {
        console.log(searchVal)
        setIsLoading(true)
        API()
            .get(
                `reviews/list?p=${page + 1}&s=${rowsPerPage}${(searchValue && searchValue !== '') ? `&f=${  searchValue}` : ''}${orderBy ? `&o=${  order !== 'asc' ? '-' : ''  }${orderBy}` : ''}`,
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
                    if (response.data?.reviews) {
                        let updatedReviews = []
                        if (existingReviews && existingReviews?.length !== 0) {
                            updatedReviews = response.data.reviews.filter((review) => {
                                return !existingReviews.some(rev => rev._id === review._id)
                            })
                        } else {
                            updatedReviews = response.data.reviews
                        }
                        console.log(updatedReviews)
                        setTotalCount(response.data.totalCount)
                        setReviews(updatedReviews)
                        setRows(updatedReviews)
                        setSearchedRows(updatedReviews)
                    }
                }
            })
            .catch((e) => {
                setIsLoading(false)
                console.log("get all reviews error: ", e)
            })
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
                        Select Reviews
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
                            onChange={(searchVal) => setSearchValue(searchVal.target.value)}
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
                                    {reviews
                                        .map((row, index) => {
                                            return (
                                                <TableRow hover key={row._id}>
                                                    <TableCell
                                                        align='center'
                                                        width="10%"
                                                    >
                                                        <BlueRadio
                                                            checked={selectedReviewId === row._id}
                                                            onChange={() => {
                                                                setSelectedReviewId(row._id)
                                                            }}
                                                            value={row._id}
                                                            name="radio-button-demo"
                                                            inputProps={{'aria-label': 'A'}}
                                                        />
                                                    </TableCell>
                                                    <TableCell className={classes.tableCell} width="15%">
                                                        {(row?.reviewer?.firstName ? row?.reviewer?.firstName : '')}{ (row?.reviewer?.lastName ? row?.reviewer?.lastName : '')}
                                                    </TableCell>
                                                    <TableCell className={classes.tableCell} width="25%">
                                                        {row?.reviewer?.rawAddress ? row?.reviewer?.rawAddress : ""}
                                                    </TableCell>
                                                    <TableCell className={classes.tableCell} width="10%">
                                                        {row?.createdAt ? moment(row?.createdAt).format("MM/DD/YYYY") : ""}
                                                    </TableCell>
                                                    <TableCell className={classes.tableCell} width="10%">
                                                        {row?.rating}
                                                    </TableCell>
                                                    <TableCell className={classes.tableCell} width="30%">
                                                        <p className={classes.description}>
                                                            {row?.description ? row?.description : ""}
                                                        </p>
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
                            count={totalCount}
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
                            onClick={saveFeaturedReview}
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

export default SelectReviewsDialog
