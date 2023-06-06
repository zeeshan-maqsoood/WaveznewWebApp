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
import NavBar from "../../../../../../components/admin-panel/navBar"
import Grid from "@material-ui/core/Grid"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import Button from "@material-ui/core/Button"
import VisibilityIcon from "@material-ui/icons/Visibility"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import {useRouter} from "next/router"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import {TextField, Typography} from "@material-ui/core"
import CloseIcon from '@material-ui/icons/Close'
import API from "../../../../../api/baseApiIinstance"
import Session from "../../../../../../sessionService"
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import SearchBar from "material-ui-search-bar"
import ImageCropDialog from "../../../../../../components/imageCropDialog/imageCropDialog.js"
import theme from "../../../../../../src/theme"


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

const headCells = [
    {
        id: "feature",
        numeric: false,
        disablePadding: true,
        label: "Name"
    },
    {
        id: "icon",
        numeric: false,
        disablePadding: false,
        label: "Icon"
    },
    {
        id: "operations",
        numeric: false,
        disablePadding: false,
        label: "Operations"
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
    // paper: {
    //     width: "100%",
    //     marginBottom: theme.spacing(2),
    // },
    table: {
        minWidth: 750
    },
    hideInput: {
        width: "0.1px",
        height: "0.1px",
        opacity: 0,
        overflow: "hidden",
        position: "absolute",
        zIndex: "-1"
    },
    browseButton: {
        fontWeight: 500,
        color: theme.palette.background.default,
        padding: "10px 20px 10px 20px",
        backgroundColor: theme.palette.background.deepSkyBlue,
        display: "inline-block",
        cursor: "pointer",
        marginTop: "12px",
        borderRadius: "4px"
    },
    deleteButton: {
        fontWeight: 500,
        marginLeft: '1rem',
        color: theme.palette.background.default,
        padding: "10px 20px 10px 20px",
        backgroundColor: theme.palette.background.flamingo,
        display: "inline-block",
        cursor: "pointer",
        marginTop: "12px",
        borderRadius: "4px"
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
        width: "100%"
    },
    header: {
        font: "Roboto",
        color: theme.palette.title.matterhorn,
        fontWeight: "600",
        fontSize: 30
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
    },
    imageContainer: {
        width: "100%",
        minHeight: "200px",
        backgroundColor: theme.palette.addPayment.borderBottom,
        boxSizing: "borderBox",
        borderRadius: "10px",
        marginTop: "30px"
    }
}))

export default function EnhancedTable() {
    const classes = useStyles()
    const [order, setOrder] = React.useState("asc")
    const [orderBy, setOrderBy] = React.useState("serviceType")
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const router = useRouter()
    const [openAddCat, setOpenAddCat] = React.useState(false)
    const [openEditCat, setOpenEditCat] = React.useState(false)
    const [openDelete, setOpenDelete] = React.useState(false)
    const [state, setState] = React.useState({
        rentalsCb: false,
        chartersCb: false,
        staysCb: false,
        proofOfIdCb: false,
        vesselDriversLiCb: false,
        vesselLicenseCb: false,
        vesselSafetyCb: false,
        insuranceCb: false
    })
    const [tableData, setTableData] = useState([])
    const [rows, setRows] = useState([])
    const [nameText, setNameText] = useState("")
    const [initiateGet, setInitiateGet] = useState(true)
    const [row, setRow] = useState({})
    const token = Session.getToken("Wavetoken")
    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const [searchedRows, setSearchedRows] = useState([])
    const [searched, setSearched] = useState("")
    const [imageSrc, setImageSrc] = useState(null)
    const [apiValueImage, setApiValueImage] = useState({
        iconURL: "",
        file: null
    })
    const [openCropImageDialog, setOpenCropImageDialog] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    const handleImageChange = async (e) => {
        setErrorMessage("")
        const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i

        // get the first file
        if (e?.target?.files && e.target.files.length !== 0) {
            const files = Array.from(e.target.files).filter(
                (file) =>
                    file.size / 1024 / 1024 < 10 && allowedExtensions.exec(file.name)
            )
            console.log("file uploading here: ", files)

            const file = e.target.files[0]
            const imageDataUrl = await readFile(file)

            setImageSrc(imageDataUrl)
            setOpenCropImageDialog(true)
            // to clear the file input for the same image to be uploaded twice
            e.target.value = null
        }
    }

    const handleClickOpenAddCat = () => {
        setOpenAddCat(true)
        setNameText('')
    }

    const handleCloseAddCat = () => {
        setOpenAddCat(false)
        setOpenEditCat(false)
    }

    const handleClickOpenDelete = (row) => {
        setOpenDelete(true)
        setRow(row)
    }

    const handleCloseDelete = () => {
        setOpenDelete(false)
    }

    const onClickBack = () => {
        router.push("/admin-panel/pages/add-listing/vessel-description")
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc"
        setOrder(isAsc ? "desc" : "asc")
        setOrderBy(property)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleSelectRow = (row) => {
        setRow(row)
        setOpenEditCat(true)
        setNameText(row.feature)
        setApiValueImage({iconURL: row.iconURL, file: null})
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, searchedRows.length - page * rowsPerPage)

    const handleChange = (event) => {
        setState({...state, [event.target.name]: event.target.checked})
        console.log("-> state", state)
    }

    useEffect(() => {
        if (initiateGet) {
            API()
                .get(
                    `vessel/feature`,
                    {
                        headers: {
                            accept: "application/json"
                        }
                    }
                )
                .then((response) => {
                    console.log("response is ", response)
                    if ((response.status = 200)) {
                        setTableData(response.data.filter(f => f.status !== 'SOFT_DELETE'))
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
        setRows(tableData)
        setSearchedRows(tableData)
    }, [tableData])

    const handleSave = () => {
        if (apiValueImage.iconURL) {
            const formData = new FormData()
            formData.append("image", apiValueImage.file)

            API()
                .post(
                    `vessel/feature/uploadIcon`,
                    formData,
                    {
                        headers: {
                            authorization: `Bearer ${  token}`,
                            accept: "application/json",
                            "Content-Type": "multipart/form-data"
                        }
                    }
                )
                .then((response) => {
                    console.log("response is ", response)
                    if ((response.status = 200)) {
                        console.log("upload response is ", response.data)
                        API()
                            .post(
                                `vessel/feature`,
                                {
                                    feature: nameText,
                                    iconURL: response.data.url,
                                    isVisible: true
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
                                    console.log("update response is ", response.data)
                                    setInitiateGet(true)
                                    setOpenAddCat(false)
                                    setApiValueImage('')
                                }
                            })
                            .catch((e) => {
                                console.log("Error from upload image is: ", e)
                            })
                    }
                })
                .catch((e) => {
                    console.log("Error from upload image is: ", e)
                })
        } else {
            API()
                .post(
                    `vessel/feature`,
                    {
                        feature: nameText,
                        iconURL: '',
                        isVisible: true
                    }
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
                    if ((response.status = 200)) {
                        setInitiateGet(true)
                        setOpenAddCat(false)
                        console.log("response ", response.data)
                    }
                })
                .catch((e) => {
                    console.log("Configuration Not found: ", e)
                })
        }
    }
    const handleDeleteIcon = () => {
        API()
            .delete(`vessel/deleteIcon?url=${row.iconURL}`,
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                })
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    console.log("icon deleted")
                    API()
                        .put(
                            `vessel/feature/${row._id}`,
                            {
                                feature: row.feature,
                                iconURL: '',
                                isVisible: row.isVisible
                            },
                            {
                                headers: {
                                    authorization: `Bearer ${  token}`,
                                    accept: "application/json"
                                }
                            }
                        )
                        .then((response) => {
                            if ((response.status = 200)) {
                                console.log("Set Src")
                                setOpenEditCat(false)
                                setInitiateGet(true)
                            }
                        }).catch((err) => {
                        console.log("There was an error with update")
                    })
                }
            }).catch((err) => {
            console.log("There was an error deleting the old image")
        })
    }
    const handleUpdate = () => {
        if (apiValueImage.iconURL && apiValueImage.file) {
            if (row.iconURL && row.iconURL !== '') {
                const formData = new FormData()
                formData.append("image", apiValueImage.file)
                const oldUrl = `${  row.iconURL}`
                console.log(formData)
                API()
                    .put(
                        `vessel/feature/uploadIcon`,
                        formData,
                        {
                            headers: {
                                authorization: `Bearer ${  token}`,
                                accept: "application/json",
                                "Content-Type": "multipart/form-data"
                            }
                        }
                    )
                    .then((response) => {
                        console.log("response is ", response)
                        if ((response.status = 200)) {
                            console.log("upload response is ", response.data)
                            API()
                                .put(
                                    `vessel/feature/${row._id}`,
                                    {
                                        feature: nameText,
                                        iconURL: response.data.url,
                                        isVisible: row.isVisible
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
                                        console.log("update response is ", response.data)
                                        setInitiateGet(true)
                                        setOpenEditCat(false)
                                        setApiValueImage('')
                                        if (oldUrl && oldUrl !== "") {
                                            // delete the old image once the image has been updated
                                            API()
                                                .delete(`vessel/deleteIcon?url=${oldUrl}`,
                                                    {
                                                        headers: {
                                                            authorization: `Bearer ${  token}`,
                                                            accept: "application/json"
                                                        }
                                                    })
                                                .then((response) => {
                                                    console.log("response is ", response)
                                                    if ((response.status = 200)) {
                                                        console.log("old image deleted")
                                                    }
                                                }).catch((err) => {
                                                console.log("There was an error deleting the old image")
                                            })
                                        }
                                    }
                                })
                                .catch((e) => {
                                    console.log("Error from upload image is: ", e)
                                })
                        }
                    })
                    .catch((e) => {
                        console.log("Error from upload image is: ", e)
                    })
            } else {
                const formData = new FormData()
                formData.append("image", apiValueImage.file)

                API()
                    .post(
                        `vessel/feature/uploadIcon`,
                        formData,
                        {
                            headers: {
                                authorization: `Bearer ${  token}`,
                                accept: "application/json",
                                "Content-Type": "multipart/form-data"
                            }
                        }
                    )
                    .then((response) => {
                        console.log("response is ", response)
                        if ((response.status = 200)) {
                            console.log("upload response is ", response.data)
                            API()
                                .put(
                                    `vessel/feature/${row._id}`,
                                    {
                                        feature: nameText,
                                        iconURL: response.data.url,
                                        isVisible: true
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
                                        console.log("update response is ", response.data)
                                        setInitiateGet(true)
                                        setOpenEditCat(false)
                                        setApiValueImage('')
                                    }
                                })
                                .catch((e) => {
                                    console.log("Error from upload image is: ", e)
                                })
                        }
                    })
                    .catch((e) => {
                        console.log("Error from upload image is: ", e)
                    })
            }
        } else {
            API()
                .put(
                    `vessel/feature/${row._id}`,
                    {
                        feature: nameText,
                        iconURL: apiValueImage.iconURL,
                        isVisible: true
                    }
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
                    if ((response.status = 200)) {
                        setInitiateGet(true)
                        setOpenEditCat(false)
                        console.log("response ", response.data)
                    }
                })
                .catch((e) => {
                    console.log("Configuration Not found: ", e)
                })
        }
    }

    const handleDelete = () => {
        API()
            .delete(
                `vessel/feature/${row._id}`
                , {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setInitiateGet(true)
                    console.log("response ", response.data)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })
        setOpenDelete(false)
    }

    // const handleVisibility = (row) => {
    //     setRow(row);
    //     row.isVisible = !row.isVisible
    //     API()
    //         .put(
    //             `vessel/feature/${row._id}`,
    //             {
    //                 feature: row.feature,
    //                 iconURL: row.iconURL,
    //                 isVisible: row.isVisible
    //             }
    //             ,
    //             {
    //                 headers: {
    //                     authorization: "Bearer " + token,
    //                     accept: "application/json",
    //                 },
    //             }
    //         )
    //         .then((response) => {
    //             console.log("response is ", response);
    //             if ((response.status = 200)) {
    //                 setInitiateGet(true);
    //                 console.log("response ", response.data);
    //             }
    //         })
    //         .catch((e) => {
    //             console.log("Configuration Not found: ", e);
    //         });
    // };

    const requestSearch = (searchedVal) => {
        console.log("search goes here: ", searchedVal)
        if (searchedVal === "") {
            setSearchedRows(rows)
        } else {
            const filteredRows = rows.filter((row) => {
                const combinationTitleAndTypeAndStatus =
                    row.feature
                return combinationTitleAndTypeAndStatus
                    .toLowerCase()
                    .includes(searchedVal.toLowerCase())
            })
            console.log("Filter Row is ", filteredRows)
            setSearchedRows(filteredRows)
        }
    }

    const cancelSearch = () => {
        setSearched("")
        requestSearch(searched)
    }

    const uploadImage = async (croppedImageFile) => {
        console.log(croppedImageFile)
        setApiValueImage({iconURL: croppedImageFile.url, file: croppedImageFile.file})
    }

    return (
        <>
            <NavBar/>
            {(openAddCat || openEditCat) && (
                <div>
                    <form method='post'
                          className={classes.root}
                          noValidate
                          autoComplete="off"
                          data-testid="textSaveBtn"
                    >
                        <Dialog
                            open={openAddCat || openEditCat}
                            onClose={handleCloseAddCat}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <div style={{padding: '2rem'}}>
                                <CloseIcon
                                    onClick={handleCloseAddCat}
                                    style={{fontSize: "2rem", cursor: "pointer", float: 'right'}}
                                />
                                <DialogTitle hidden={!openAddCat} style={{textAlign: 'center'}}
                                             id="alert-dialog-title">{"Add New Feature"}</DialogTitle>
                                <DialogTitle hidden={!openEditCat} style={{textAlign: 'center'}}
                                             id="alert-dialog-title">{"Edit Feature"}</DialogTitle>
                                <hr
                                    style={{
                                        width: 50,
                                        backgroundColor: theme.palette.buttonPrimary.main,
                                        height: 5,
                                        marginTop: "-11px"
                                    }}
                                ></hr>
                                <DialogContent style={{width: '450px'}}>
                                    <div style={{fontSize: "18px", lineHeight: "2"}}>
                                        <p style={{fontWeight: "400"}}>
                                            <Grid container item xs={12}>
                                                <Grid style={{marginBottom: '2rem'}} container item xs={12}>
                                                    <Grid style={{textAlign: "left", alignSelf: 'center'}} item xs={2}>
                                                        <Typography
                                                            style={{
                                                                marginLeft: "auto",
                                                                fontWeight: "500",
                                                                fontSize: "1.1rem"
                                                            }}
                                                            variant="h6"
                                                            gutterBottom
                                                        >
                                                            Name
                                                        </Typography>
                                                    </Grid>
                                                    <Grid style={{textAlign: "left"}} item xs={10}>
                                                        <TextField
                                                            style={{width: "100%"}}
                                                            id="outlined-basic"
                                                            variant="outlined"
                                                            inputProps={{maxLength: 40}}
                                                            placeholder="Enter feature name"
                                                            value={nameText}
                                                            onChange={(event, value) => {
                                                                (event?.target?.value ? setNameText(event.target.value) : setNameText(""))
                                                                setUnsavedChanges(event?.target?.value !== '')
                                                            }}
                                                        />
                                                    </Grid>
                                                </Grid>

                                                <Grid style={{marginBottom: '2rem'}} container item xs={12}>
                                                    <Grid style={{textAlign: "left", alignSelf: 'center'}} item xs={2}>
                                                        <Typography
                                                            style={{
                                                                marginLeft: "auto",
                                                                fontWeight: "500",
                                                                fontSize: "1.1rem"
                                                            }}
                                                            variant="h6"
                                                            gutterBottom
                                                        >
                                                            Icon
                                                        </Typography>
                                                    </Grid>
                                                    <Grid style={{textAlign: "left"}} item xs={10}>
                                                        <Paper className={classes.paper}>
                                                            {apiValueImage?.iconURL !== "" ? (
                                                                <div>
                                                                    <Grid container spacing={2}
                                                                          direction="column"
                                                                          alignItems="center"
                                                                          justify="center">
                                                                        <Grid item xs={12}
                                                                              className={classes.imageContainer}>
                                                                            <img src={apiValueImage?.iconURL}
                                                                                 alt="Feature Icon" style={{
                                                                                width: "100%"
                                                                            }}/>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <div>
                                    <span>
                    <input
                        type="file"
                        name="file"
                        id="file"
                        accept="image/jpg, image/jpeg, image/png"
                        onChange={handleImageChange}
                        className={classes.hideInput}
                    />

                    <label htmlFor="file" className={classes.browseButton}>
                    Upload
                    </label>
                                        <label onClick={handleDeleteIcon} className={classes.deleteButton}>
                    Delete
                    </label>
                  </span></div>
                                                                </div>
                                                            ) : (
                                                                <div className={classes.root}>
                                                                    <Grid container spacing={2} style={{
                                                                        position: "relative",
                                                                        marginTop: "12%"
                                                                    }}>
                                                                        <Grid style={{
                                                                            display: "flex",
                                                                            alignItems: "center"
                                                                        }} direction="column" container item xs={7}>
                                                                            <h5 style={{
                                                                                alignSelf: "flex-end",
                                                                                marginRight: "22px",
                                                                                marginTop: "0"
                                                                            }}>Note: Supported file format: jpg, jpeg,
                                                                                png</h5>
                                                                        </Grid>
                                                                        <Grid style={{display: "flex"}} item xs={5}>
                                        <span>
                                            <input
                                                type="file"
                                                name="file"
                                                id="file"
                                                accept="image/jpg, image/jpeg, image/png"
                                                onChange={handleImageChange}
                                                className={classes.hideInput}
                                            />
                                         </span>
                                                                            <label style={{alignSelf: "flex-start"}}
                                                                                   htmlFor="file"
                                                                                   className={classes.browseButton}>
                                                                                Browse
                                                                            </label>
                                                                        </Grid>
                                                                    </Grid>
                                                                </div>
                                                            )}
                                                            <div>
                                                                <ImageCropDialog open={openCropImageDialog}
                                                                                 setOpen={setOpenCropImageDialog}
                                                                                 imageSrc={imageSrc}
                                                                                 setImageSrc={setImageSrc}
                                                                                 saveImage={uploadImage}
                                                                                 getBlobUrl={true}/>
                                                            </div>
                                                        </Paper>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </p>
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
                                            if (openAddCat) {
                                                handleSave()
                                            } else if (openEditCat) {
                                                handleUpdate()
                                            }
                                        }}
                                        style={{marginRight: "1rem"}}
                                        variant="contained"
                                        color="primary"
                                        data-testid="textSaveBtn"
                                        disabled={!unsavedChanges || nameText.length === 0 && (state.rentalsCb === false || state.staysCb === false || state.chartersCb === false) && (state.proofOfIdCb === false || state.insuranceCb === false || state.vesselSafetyCb === false || state.vesselLicenseCb === false || state.vesselDriversLiCb === false)}
                                    >
                                        Save
                                    </Button>

                                    <Button onClick={handleCloseAddCat} variant="outlined"
                                            style={{
                                                color: theme.palette.button.red,
                                                borderColor: theme.palette.button.red
                                            }}>Cancel</Button>
                                </DialogActions>
                            </div>
                        </Dialog>
                    </form>
                </div>
            )}
            {openDelete && (
                <div>
                    <Dialog
                        open={openDelete}
                        onClose={handleCloseDelete}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <div style={{padding: '2rem'}}>
                            <CloseIcon
                                onClick={handleCloseDelete}
                                style={{fontSize: "2rem", cursor: "pointer", float: 'right'}}
                            />
                            <DialogTitle style={{textAlign: 'center'}}
                                         id="alert-dialog-title">{"Delete Confirmation"}</DialogTitle>
                            <hr
                                style={{
                                    width: 50,
                                    backgroundColor: theme.palette.button.red,
                                    height: 5,
                                    marginTop: "-11px"
                                }}
                            ></hr>
                            <DialogContent style={{width: '450px'}}>
                                <div style={{fontSize: "18px", lineHeight: "2"}}>
                                    <Typography
                                        style={{
                                            marginLeft: "auto",
                                            fontWeight: "500",
                                            fontSize: "1.1rem",
                                            textAlign: "center"
                                        }}
                                        variant="h6"
                                        gutterBottom
                                    >
                                        Are you sure you want to delete {row.feature} feature?
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
                                        handleDelete(true)
                                    }}
                                    style={{
                                        marginRight: "1rem",
                                        backgroundColor: theme.palette.background.flamingo,
                                        color: theme.palette.background.default
                                    }}
                                    variant="contained"
                                >
                                    Delete
                                </Button>
                                <Button onClick={handleCloseDelete}
                                        style={{color: theme.palette.buttonPrimary.main}}>Cancel</Button>
                            </DialogActions>
                        </div>
                    </Dialog>
                </div>
            )}
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
                            <ArrowBackIcon
                                onClick={onClickBack}
                                style={{fontSize: "2rem", cursor: "pointer"}}
                            />
                            <Typography
                                style={{marginLeft: "15px", fontWeight: "500"}}
                                variant="h5"
                                gutterBottom
                            >
                                Features
                            </Typography>
                        </Grid>
                        <Grid style={{textAlign: "right"}} item xs={9}>
                            <Button
                                style={{marginLeft: "auto"}}
                                variant="contained"
                                color="primary"
                                onClick={handleClickOpenAddCat}
                                data-testid="textSaveBtn"
                            >
                                Add New Feature
                            </Button>
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
                            placeholder={'Search Feature'}
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
                                                        key={row.name}
                                                    >
                                                        <TableCell padding="checkbox"></TableCell>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            padding="none"
                                                        >
                                                            {row.feature}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            padding="none"
                                                        >
                                                            <img
                                                                src={row.iconURL}
                                                                alt="No Icon"
                                                                width={40}
                                                                height={40}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            {/*{row.isVisible && <VisibilityIcon*/}
                                                            {/*    onClick={() => {*/}
                                                            {/*        handleVisibility(row)*/}
                                                            {/*    }}*/}
                                                            {/*    style={{*/}
                                                            {/*        marginRight: "1rem",*/}
                                                            {/*        cursor: "pointer",*/}
                                                            {/*    }}*/}
                                                            {/*/>}*/}
                                                            {/*{!row.isVisible && <VisibilityOffIcon*/}
                                                            {/*    onClick={() => {*/}
                                                            {/*        handleVisibility(row)*/}
                                                            {/*    }}*/}
                                                            {/*    style={{*/}
                                                            {/*        marginRight: "1rem",*/}
                                                            {/*        cursor: "pointer",*/}
                                                            {/*    }}*/}
                                                            {/*/>}*/}
                                                            {/*<EditIcon*/}
                                                            {/*    onClick={() => handleSelectRow(row)}*/}
                                                            {/*    style={{*/}
                                                            {/*        marginRight: "1rem",*/}
                                                            {/*        cursor: "pointer",*/}
                                                            {/*    }}*/}
                                                            {/*/>*/}
                                                            <DeleteIcon onClick={() => {
                                                                handleClickOpenDelete(row)
                                                            }}
                                                                        style={{
                                                                            cursor: "pointer",
                                                                            color: theme.palette.button.red
                                                                        }}/>
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

function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.addEventListener('load', () => resolve(reader.result), false)
        reader.readAsDataURL(file)
    })
}
