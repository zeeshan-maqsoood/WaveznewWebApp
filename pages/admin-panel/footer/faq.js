import {makeStyles} from "@material-ui/core/styles"
import {useRouter} from "next/router"
import Session from "../../../sessionService"
import React, {useEffect, useState} from "react"
import API from "../../api/baseApiIinstance"
import NavBar from "../../../components/admin-panel/navBar"
import Grid from "@material-ui/core/Grid"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import {Backdrop, CircularProgress, TableCell, TextField, Typography} from "@material-ui/core"
import Paper from "@material-ui/core/Paper"
import Button from "@material-ui/core/Button"
import TableContainer from "@material-ui/core/TableContainer"
import Table from "@material-ui/core/Table"
import GenericTableHead from "../../../components/shared/genericTableSortingHeader"
import TableBody from "@material-ui/core/TableBody"
import TableRow from "@material-ui/core/TableRow"
import moment from "moment"
import TablePagination from "@material-ui/core/TablePagination"
import SearchBar from "material-ui-search-bar"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import {RemoveRedEye} from "@material-ui/icons"
import Dialog from "@material-ui/core/Dialog"
import CloseIcon from "@material-ui/icons/Close"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"

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
    }
}))

function Faq() {
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
    const [openAddFaq, setOpenAddFaq] = useState(false)
    const [openEditFaq, setOpenEditFaq] = useState(false)
    const [questionText, setQuestionText] = useState("")
    const [answerText, setAnswerText] = useState("")
    const [apiQuestionText, setApiQuestionText] = useState("")
    const [apiAnswerText, setApiAnswerText] = useState("")
    const [selectedRow, setSelectedRow] = useState({})
    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const [openDeleteFaq, setOpenDeleteFaq] = useState(false)

    const headCells = [
        {
            id: "question",
            numeric: false,
            disablePadding: false,
            label: "Question"
        },
        {
            id: "answer",
            numeric: false,
            disablePadding: false,
            label: "Answer"
        },
        {
            id: "action",
            numeric: false,
            disablePadding: false,
            label: "Action",
            align: 'center'
        }
    ]

    const onClickBack = () => {
        router.push("/admin-panel/footer")
    }

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
        getAllFaqs()
    }, [])

    const getAllFaqs = () => {
        API()
            .get(
                `faq`,
                {
                    headers: {
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
                console.log("faqs Not found: ", e)
            })
    }

    const onUserRowClick = (userId) => {
        router.push(`/admin-panel/all-users/users/${userId}`)
    }

    const handleCloseAddFaq = () => {
        setOpenAddFaq(false)
        setOpenEditFaq(false)
        setUnsavedChanges(false)
    }

    const handleSelectRow = (row) => {
        setQuestionText(row?.question ? row?.question : '')
        setAnswerText(row?.answer ? row?.answer : '')
        setApiQuestionText(row?.question ? row?.question : '')
        setApiAnswerText(row?.answer ? row?.answer : '')
        setSelectedRow(row)
        setOpenEditFaq(true)
    }

    const handleDeleteRow = (row) => {
        setSelectedRow(row)
        setOpenDeleteFaq(true)
    }

    const openAddNewFaq = () => {
        setQuestionText('')
        setAnswerText('')
        setApiQuestionText('')
        setApiAnswerText('')
        setOpenAddFaq(true)
    }

    const changeFaqVisibility = (row) => {
        if (row?._id) {
            API()
                .put(
                    `faq/${row?._id}`,
                    {
                        question: row?.question ? row?.question : '',
                        answer: row?.answer ? row?.answer : '',
                        visible: !row?.visible
                    },
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
                        getAllFaqs()
                    }
                })
                .catch((e) => {
                    console.log("faqs Not found: ", e)
                })
        }
    }

    const handleFaqSave = () => {
        API()
            .post(
                `faq`,
                {
                    question: questionText,
                    answer: answerText
                },
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
                    console.log("response ", response.data)
                    getAllFaqs()
                }
            })
            .catch((e) => {
                console.log("Faq Not found: ", e)
            })
        setOpenAddFaq(false)
    }

    const handleFaqEdit = () => {
        if (selectedRow?._id) {
            API()
                .put(
                    `faq/${selectedRow._id}`,
                    {
                        question: questionText,
                        answer: answerText
                    },
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
                        console.log("response ", response.data)
                        getAllFaqs()
                    }
                })
                .catch((e) => {
                    console.log("Faq Not found: ", e)
                })
        }
        setOpenEditFaq(false)
    }

    const onFaqDelete = () => {
        if (selectedRow?._id) {
            API()
                .delete(
                    `faq/${selectedRow._id}`,
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
                        console.log("response ", response.data)
                        getAllFaqs()
                    }
                })
                .catch((e) => {
                    console.log("Faq Not found: ", e)
                })
        }
        setOpenDeleteFaq(false)
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
                                <ArrowBackIcon
                                    onClick={onClickBack}
                                    style={{fontSize: "2rem", cursor: "pointer"}}
                                />
                                <Typography
                                    style={{marginLeft: "3%", fontWeight: "500"}}
                                    variant="h5"
                                    gutterBottom
                                >
                                    FAQ
                                </Typography>
                            </Grid>
                            <Grid style={{display: "flex", flexDirection: 'row-reverse'}} item xs={6}>
                                <Button style={{
                                    color: "#FFFFFF",
                                    backgroundColor: "#4D96FB",
                                    padding: '0.7rem 3rem'
                                }}
                                        onClick={() => openAddNewFaq()}
                                >
                                    Add new
                                </Button>
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
                                                        <TableRow hover key={row._id}>
                                                            <TableCell padding="checkbox"/>
                                                            <TableCell className={classes.tableCell}>
                                                                {row?.question ? row.question : ''}
                                                            </TableCell>
                                                            <TableCell className={classes.tableCell}>
                                                                {row?.answer ? row?.answer : ''}
                                                            </TableCell>
                                                            <TableCell align='center'>
                                                                {/*{row?.visible ?*/}
                                                                {/*    <Visibility*/}
                                                                {/*        style={{*/}
                                                                {/*            marginRight: "1.2rem",*/}
                                                                {/*            cursor: "pointer",*/}
                                                                {/*        }}*/}
                                                                {/*        onClick={() => changeFaqVisibility(row)}*/}
                                                                {/*    /> :*/}
                                                                {/*    <VisibilityOff*/}
                                                                {/*        style={{*/}
                                                                {/*            marginRight: "1.2rem",*/}
                                                                {/*            cursor: "pointer",*/}
                                                                {/*        }}*/}
                                                                {/*        onClick={() => changeFaqVisibility(row)}*/}
                                                                {/*    />*/}
                                                                {/*}*/}
                                                                <EditIcon
                                                                    style={{
                                                                        marginRight: "1.2rem",
                                                                        cursor: "pointer"
                                                                    }}
                                                                    onClick={() => handleSelectRow(row)}
                                                                />
                                                                <DeleteIcon
                                                                    onClick={() => handleDeleteRow(row)}
                                                                    style={{cursor: "pointer", color: "#FF0000"}}/>
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
                {(openAddFaq || openEditFaq) && (
                    <form method='post'
                          className={classes.root}
                          noValidate
                          autoComplete="off"
                    >
                        <Dialog
                            open={openAddFaq || openEditFaq}
                            onClose={handleCloseAddFaq}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                            fullWidth
                            maxWidth="sm"
                        >
                            <div style={{padding: '2rem'}}>
                                <CloseIcon
                                    onClick={handleCloseAddFaq}
                                    style={{fontSize: "2rem", cursor: "pointer", float: 'right'}}
                                />
                                <DialogTitle hidden={!openAddFaq} style={{textAlign: 'center'}}
                                             id="alert-dialog-title">{"Add new Faq"}</DialogTitle>
                                <DialogTitle hidden={!openEditFaq} style={{textAlign: 'center'}}
                                             id="alert-dialog-title">{"Edit Faq"}</DialogTitle>
                                <hr
                                    style={{
                                        width: 50,
                                        backgroundColor: "#4D96FB",
                                        height: 5,
                                        marginTop: "-11px"
                                    }}
                                />
                                <DialogContent style={{width: '550px'}}>
                                    <div style={{fontSize: "18px", lineHeight: "2"}}>
                                        <Grid container item xs={12}>

                                            <Grid style={{marginBottom: '2rem'}} container item xs={12}>
                                                <Grid style={{textAlign: "left", alignSelf: 'start'}} item xs={3}>
                                                    <Typography
                                                        component={'span'}
                                                        style={{
                                                            marginLeft: "auto",
                                                            fontWeight: "500",
                                                            fontSize: "1.1rem"
                                                        }}
                                                        variant="h6"
                                                        gutterBottom
                                                    >
                                                        Question
                                                    </Typography>
                                                </Grid>
                                                <Grid style={{textAlign: "left"}} item xs={9}>
                                                    <TextField
                                                        style={{width: "100%"}}
                                                        multiline
                                                        rows={4}
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        value={questionText}
                                                        onChange={(event, value) => {
                                                            (event?.target?.value ? setQuestionText(event.target.value) : setQuestionText(""))
                                                            setUnsavedChanges(apiQuestionText !== event?.target?.value)
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>

                                            <Grid style={{marginBottom: '2rem'}} container item xs={12}>
                                                <Grid style={{textAlign: "left", alignSelf: 'start'}} item xs={3}>
                                                    <Typography
                                                        component={'span'}
                                                        style={{
                                                            marginLeft: "auto",
                                                            fontWeight: "500",
                                                            fontSize: "1.1rem"
                                                        }}
                                                        variant="h6"
                                                        gutterBottom
                                                    >
                                                        Answer
                                                    </Typography>
                                                </Grid>
                                                <Grid style={{textAlign: "left"}} item xs={9}>
                                                    <TextField
                                                        style={{width: "100%"}}
                                                        multiline
                                                        rows={4}
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        value={answerText}
                                                        onChange={(event, value) => {
                                                            (event?.target?.value ? setAnswerText(event.target.value) : setAnswerText(""))
                                                            setUnsavedChanges(apiAnswerText !== event?.target?.value)
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <div
                                            style={{
                                                marginTop: "2.6em",
                                                width: "100%",
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "space-evenly"
                                            }}
                                        ></div>
                                    </div>
                                </DialogContent>
                                <DialogActions style={{justifyContent: 'center'}}>
                                    <Button
                                        onClick={() => {
                                            if (openAddFaq) {
                                                handleFaqSave()
                                            } else if (openEditFaq) {
                                                handleFaqEdit()
                                            }
                                        }}
                                        style={{marginRight: "1rem"}}
                                        variant="contained"
                                        color="primary"
                                        disabled={unsavedChanges ? (questionText?.length === 0 || answerText?.length === 0) : true}
                                    >
                                        Save
                                    </Button>
                                    <Button onClick={handleCloseAddFaq} variant="outlined"
                                            style={{color: "#FF0000", borderColor: "#FF0000"}}>Cancel</Button>
                                </DialogActions>
                            </div>
                        </Dialog>
                    </form>
                )}
                {openDeleteFaq && (
                    <Dialog
                        open={openDeleteFaq}
                        onClose={() => {
                            setOpenDeleteFaq(false)
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <div style={{padding: '2rem'}}>
                            <CloseIcon
                                onClick={() => {
                                    setOpenDeleteFaq(false)
                                }}
                                style={{fontSize: "2rem", cursor: "pointer", float: 'right'}}
                            />
                            <DialogTitle style={{textAlign: 'center'}}
                                         id="alert-dialog-title">{"Delete Confirmation"}</DialogTitle>
                            <hr
                                style={{
                                    width: 50,
                                    backgroundColor: "#FF0000",
                                    height: 5,
                                    marginTop: "-11px"
                                }}
                            />
                            <DialogContent style={{width: '450px'}}>
                                <div style={{fontSize: "18px", lineHeight: "2"}}>
                                    <Typography
                                        component={'span'}
                                        style={{
                                            marginLeft: "auto",
                                            fontWeight: "500",
                                            fontSize: "1.1rem",
                                            textAlign: "center"
                                        }}
                                        variant="h6"
                                        gutterBottom
                                    >
                                        Are you sure you want to delete the selected faq?
                                    </Typography>

                                    <div
                                        style={{
                                            marginTop: "2.6em",
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-evenly"
                                        }}
                                    ></div>
                                </div>
                            </DialogContent>
                            <DialogActions style={{justifyContent: 'center'}}>
                                <Button
                                    onClick={() => {
                                        onFaqDelete()
                                    }}
                                    style={{marginRight: "1rem", backgroundColor: "#EB5757", color: "#ffffff"}}
                                    variant="contained"
                                >
                                    Delete
                                </Button>
                                <Button onClick={() => {
                                    setOpenDeleteFaq(false)
                                }} style={{color: "#4D96FB"}}>Cancel</Button>
                            </DialogActions>
                        </div>
                    </Dialog>
                )}
            </div>
        </div>
    )
}

export default Faq
