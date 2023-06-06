import React, {forwardRef, Ref, useEffect, useState} from "react"
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
import FormGroup from '@material-ui/core/FormGroup'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"
import NavBar from "../../../../../components/admin-panel/navBar"
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
import API from "../../../../api/baseApiIinstance"
import Session from "../../../../../sessionService"
import SearchBar from "material-ui-search-bar"
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff"
import Accordion from "@material-ui/core/Accordion"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import theme from "../../../../../src/theme"
import ThreeStateCheckbox from "../../../../../components/admin-panel/pages/add-listing/category.js"
import {is} from "date-fns/locale"

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
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "Name"
    },
    {
        id: "serviceType",
        numeric: false,
        disablePadding: false,
        label: "Service Type"
    },
    {
        id: "verificationFiles",
        numeric: false,
        disablePadding: false,
        label: "Verification Files"
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
        serialNumberCb: false
    })
    const [tableData, setTableData] = useState([])
    const [rows, setRows] = useState([])
    const [nameText, setNameText] = useState("")
    const [initiateGet, setInitiateGet] = useState(true)
    const [openError, setOpenError] = useState(false)
    const [row, setRow] = useState({})
    const token = Session.getToken("Wavetoken")
    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const [searchedRows, setSearchedRows] = useState([])
    const [searched, setSearched] = useState("")
    const files = []
    const labels = ["Proof Of Id", "Vessel Driver's License", "Vessel License", "Vessel Safety", "Serial Number"]
    labels.map(item => files.push({
        label: item,
        required: false,
        optional: false,
        name: item.replace(/[^A-Z0-9]+/ig, '')
    }))

    const [rentalState, setRentalState] = useState()
    const [stayState, setStayState] = useState()
    const [charterState, setCharterState] = useState()

    const handleClickOpenAddCat = () => {
        setOpenAddCat(true)
        setNameText("")
        const files = []
        const labels = ["Proof Of Id", "Vessel Driver's License", "Vessel License", "Vessel Safety", "Serial Number"]
        labels.map(item => files.push({
            label: item,
            required: false,
            optional: false,
            name: item.replace(/[^A-Z0-9]+/ig, '')
        }))

        setRentalState({isSelected: false, files})
        setCharterState({isSelected: false, files})
        setStayState({isSelected: false, files})
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
        router.push("/admin-panel/pages/add-listing")
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
        console.log("-> row", row)
        setRow(row)
        setOpenEditCat(true)
        setNameText(row.category.name)
        const files = []
        const labels = ["Proof Of Id", "Vessel Driver's License", "Vessel License", "Vessel Safety", "Serial Number"]
        labels.map(item => files.push({
            label: item,
            required: false,
            optional: false,
            name: item.replace(/[^A-Z0-9]+/ig, '')
        }))

        let allFiles
        if (row.category.isRental) {
            allFiles = []
            allFiles.push({
                label: "Proof Of Id",
                name: "ProofOfId",
                required: row.category.rental.proofOfId.required,
                optional: row.category.rental.proofOfId.optional
            })
            allFiles.push({
                label: "Vessel Driver's License",
                name: "VesselDriversLicense",
                required: row.category.rental.vesselDriversLicense.required,
                optional: row.category.rental.vesselDriversLicense.optional
            })
            allFiles.push({
                label: "Vessel License",
                name: "VesselLicense",
                required: row.category.rental.vesselLicense.required,
                optional: row.category.rental.vesselLicense.optional
            })
            allFiles.push({
                label: "Vessel Safety",
                name: "VesselSafety",
                required: row.category.rental.vesselSafety.required,
                optional: row.category.rental.vesselSafety.optional
            })
            allFiles.push({
                label: "Serial Number",
                name: "SerialNumber",
                required: row.category.rental.serialNumber.required,
                optional: row.category.rental.serialNumber.optional
            })
            setRentalState({isSelected: row.category.isRental, files: allFiles})
        } else if (!row.category.isRental) {
            setRentalState({isSelected: row.category.isRental, files})
        }
        if (row.category.isCharter) {
            allFiles = []
            allFiles.push({
                label: "Proof Of Id",
                name: "ProofOfId",
                required: row.category.charter.proofOfId.required,
                optional: row.category.charter.proofOfId.optional
            })
            allFiles.push({
                label: "Vessel Driver's License",
                name: "VesselDriversLicense",
                required: row.category.charter.vesselDriversLicense.required,
                optional: row.category.charter.vesselDriversLicense.optional
            })
            allFiles.push({
                label: "Vessel License",
                name: "VesselLicense",
                required: row.category.charter.vesselLicense.required,
                optional: row.category.charter.vesselLicense.optional
            })
            allFiles.push({
                label: "Vessel Safety",
                name: "VesselSafety",
                required: row.category.charter.vesselSafety.required,
                optional: row.category.charter.vesselSafety.optional
            })
            allFiles.push({
                label: "Serial Number",
                name: "SerialNumber",
                required: row.category.charter.serialNumber.required,
                optional: row.category.charter.serialNumber.optional
            })
            setCharterState({isSelected: row.category.isCharter, files: allFiles})
        } else if (!row.category.isCharter) {
            setCharterState({isSelected: row.category.isCharter, files})
        }
        if (row.category.isStay) {
            allFiles = []
            allFiles.push({
                label: "Proof Of Id",
                name: "ProofOfId",
                required: row.category.stay.proofOfId.required,
                optional: row.category.stay.proofOfId.optional
            })
            allFiles.push({
                label: "Vessel Driver's License",
                name: "VesselDriversLicense",
                required: row.category.stay.vesselDriversLicense.required,
                optional: row.category.stay.vesselDriversLicense.optional
            })
            allFiles.push({
                label: "Vessel License",
                name: "VesselLicense",
                required: row.category.stay.vesselLicense.required,
                optional: row.category.stay.vesselLicense.optional
            })
            allFiles.push({
                label: "Vessel Safety",
                name: "VesselSafety",
                required: row.category.stay.vesselSafety.required,
                optional: row.category.stay.vesselSafety.optional
            })
            allFiles.push({
                label: "Serial Number",
                name: "SerialNumber",
                required: row.category.stay.serialNumber.required,
                optional: row.category.stay.serialNumber.optional
            })
            setStayState({isSelected: row.category.isStay, files: allFiles})
        } else if (!row.category.isStay) {
            setStayState({isSelected: row.category.isStay, files})
        }
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, searchedRows.length - page * rowsPerPage)

    const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index
    }

    useEffect(() => {
        if (initiateGet) {
            API()
                .get(
                    `vessel/category`,
                    {
                        headers: {
                            accept: "application/json"
                        }
                    }
                )
                // testing
                .then((response) => {
                    console.log("response of getting category is ", response)
                    if ((response.status = 200)) {
                        const arr = []
                        response.data.map(cat => {
                            if (cat.status !== 'SOFT_DELETE') {
                                const c = {
                                    category: cat,
                                    name: cat.name,
                                    serviceType: "",
                                    verificationFiles: ""
                                }
                                const verFiles = []
                                if (cat.isRental) c.serviceType += 'Rentals,'
                                if (cat.rental !== null && cat.isRental) {
                                    if (cat.rental.proofOfId.required || cat.rental.proofOfId.optional) verFiles.push('Proof of ID')

                                    if (cat.rental.vesselDriversLicense.required || cat.rental.proofOfId.optional) verFiles.push("Vessel Driver's License")

                                    if (cat.rental.vesselLicense.required || cat.rental.proofOfId.optional) verFiles.push('Vessel License')

                                    if (cat.rental.vesselSafety.required || cat.rental.proofOfId.optional) verFiles.push('Vessel Safety')

                                    if (cat.rental.serialNumber.required || cat.rental.proofOfId.optional) verFiles.push('Serial Number')
                                }

                                if (cat.isCharter) c.serviceType += ' Charters,'
                                if (cat.isCharter) {
                                    if (cat.charter.proofOfId.required || cat.charter.proofOfId.optional) verFiles.push('Proof of ID')

                                    if (cat.charter.vesselDriversLicense.required || cat.charter.vesselDriversLicense.optional) verFiles.push("Vessel Driver's License")

                                    if (cat.charter.vesselLicense.required || cat.charter.vesselLicense.optional) verFiles.push('Vessel License')

                                    if (cat.charter.vesselSafety.required || cat.charter.vesselSafety.optional) verFiles.push('Vessel Safety')

                                    if (cat.charter.serialNumber.required || cat.charter.serialNumber.optional) verFiles.push('Serial Number')
                                }

                                if (cat.isStay) c.serviceType += ' Stays,'
                                if (cat.stay !== null && cat.isStay) {
                                    if (cat.stay.proofOfId.required || cat.stay.proofOfId.optional) verFiles.push('Proof of ID')

                                    if (cat.stay.vesselDriversLicense.required || cat.stay.vesselDriversLicense.optional) verFiles.push("Vessel Driver's License")

                                    if (cat.stay.vesselLicense.required || cat.stay.vesselLicense.optional) verFiles.push('Vessel License')

                                    if (cat.stay.vesselSafety.required || cat.stay.vesselSafety.optional) verFiles.push('Vessel Safety')

                                    if (cat.stay.serialNumber.required || cat.stay.serialNumber.optional) verFiles.push('Serial Number')
                                }

                                c.serviceType = c.serviceType.slice(0, -1)
                                c.verificationFiles = verFiles.filter(onlyUnique).join(", ")

                                arr.push(c)
                            }
                        })
                        setTableData(arr)
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

    // testing
    const handleSave = () => {

        API()
            .post(
                `vessel/category`,
                {
                    name: nameText,
                    isVisible: true,
                    isRental: rentalState.isSelected,
                    isCharter: charterState.isSelected,
                    isStay: stayState.isSelected,
                    rental: {
                        proofOfId: {
                            optional: rentalState.files.find(item => item.name.toLowerCase() === "proofofid").optional,
                            required: rentalState.files.find(item => item.name.toLowerCase() === "proofofid").required
                        },
                        serialNumber: {
                            optional: rentalState.files.find(item => item.name.toLowerCase() === "serialnumber").optional,
                            required: rentalState.files.find(item => item.name.toLowerCase() === "serialnumber").required
                        },
                        vesselDriversLicense: {
                            optional: rentalState.files.find(item => item.name.toLowerCase() === "vesseldriverslicense").optional,
                            required: rentalState.files.find(item => item.name.toLowerCase() === "vesseldriverslicense").required
                        },
                        vesselLicense: {
                            optional: rentalState.files.find(item => item.name.toLowerCase() === "vessellicense").optional,
                            required: rentalState.files.find(item => item.name.toLowerCase() === "vessellicense").required
                        },
                        vesselSafety: {
                            optional: rentalState.files.find(item => item.name.toLowerCase() === "vesselsafety").optional,
                            required: rentalState.files.find(item => item.name.toLowerCase() === "vesselsafety").required
                        }
                    },
                    charter: {
                        proofOfId: {
                            optional: charterState.files.find(item => item.name.toLowerCase() === "proofofid").optional,
                            required: charterState.files.find(item => item.name.toLowerCase() === "proofofid").required
                        },
                        serialNumber: {
                            optional: charterState.files.find(item => item.name.toLowerCase() === "serialnumber").optional,
                            required: charterState.files.find(item => item.name.toLowerCase() === "serialnumber").required
                        },
                        vesselDriversLicense: {
                            optional: charterState.files.find(item => item.name.toLowerCase() === "vesseldriverslicense").optional,
                            required: charterState.files.find(item => item.name.toLowerCase() === "vesseldriverslicense").required
                        },
                        vesselLicense: {
                            optional: charterState.files.find(item => item.name.toLowerCase() === "vessellicense").optional,
                            required: charterState.files.find(item => item.name.toLowerCase() === "vessellicense").required
                        },
                        vesselSafety: {
                            optional: charterState.files.find(item => item.name.toLowerCase() === "vesselsafety").optional,
                            required: charterState.files.find(item => item.name.toLowerCase() === "vesselsafety").required
                        }
                    },
                    stay: {
                        proofOfId: {
                            optional: stayState.files.find(item => item.name.toLowerCase() === "proofofid").optional,
                            required: stayState.files.find(item => item.name.toLowerCase() === "proofofid").required
                        },
                        serialNumber: {
                            optional: stayState.files.find(item => item.name.toLowerCase() === "serialnumber").optional,
                            required: stayState.files.find(item => item.name.toLowerCase() === "serialnumber").required
                        },
                        vesselDriversLicense: {
                            optional: stayState.files.find(item => item.name.toLowerCase() === "vesseldriverslicense").optional,
                            required: stayState.files.find(item => item.name.toLowerCase() === "vesseldriverslicense").required
                        },
                        vesselLicense: {
                            optional: stayState.files.find(item => item.name.toLowerCase() === "vessellicense").optional,
                            required: stayState.files.find(item => item.name.toLowerCase() === "vessellicense").required
                        },
                        vesselSafety: {
                            optional: stayState.files.find(item => item.name.toLowerCase() === "vesselsafety").optional,
                            required: stayState.files.find(item => item.name.toLowerCase() === "vesselsafety").required
                        }
                    }
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
                    setInitiateGet(true)
                    console.log("response ", response.data)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })
        setOpenAddCat(false)
    }

    const handleUpdate = () => {
        API()
            .put(
                `vessel/category/${row.category._id}`,
                {
                    name: nameText,
                    isVisible: row.isVisible,
                    isRental: rentalState.isSelected,
                    isCharter: charterState.isSelected,
                    isStay: stayState.isSelected,
                    rental: {
                        proofOfId: {
                            optional: rentalState.files.find(item => item.name.toLowerCase() === "proofofid").optional,
                            required: rentalState.files.find(item => item.name.toLowerCase() === "proofofid").required
                        },
                        serialNumber: {
                            optional: rentalState.files.find(item => item.name.toLowerCase() === "serialnumber").optional,
                            required: rentalState.files.find(item => item.name.toLowerCase() === "serialnumber").required
                        },
                        vesselDriversLicense: {
                            optional: rentalState.files.find(item => item.name.toLowerCase() === "vesseldriverslicense").optional,
                            required: rentalState.files.find(item => item.name.toLowerCase() === "vesseldriverslicense").required
                        },
                        vesselLicense: {
                            optional: rentalState.files.find(item => item.name.toLowerCase() === "vessellicense").optional,
                            required: rentalState.files.find(item => item.name.toLowerCase() === "vessellicense").required
                        },
                        vesselSafety: {
                            optional: rentalState.files.find(item => item.name.toLowerCase() === "vesselsafety").optional,
                            required: rentalState.files.find(item => item.name.toLowerCase() === "vesselsafety").required
                        }
                    },
                    charter: {
                        proofOfId: {
                            optional: charterState.files.find(item => item.name.toLowerCase() === "proofofid").optional,
                            required: charterState.files.find(item => item.name.toLowerCase() === "proofofid").required
                        },
                        serialNumber: {
                            optional: charterState.files.find(item => item.name.toLowerCase() === "serialnumber").optional,
                            required: charterState.files.find(item => item.name.toLowerCase() === "serialnumber").required
                        },
                        vesselDriversLicense: {
                            optional: charterState.files.find(item => item.name.toLowerCase() === "vesseldriverslicense").optional,
                            required: charterState.files.find(item => item.name.toLowerCase() === "vesseldriverslicense").required
                        },
                        vesselLicense: {
                            optional: charterState.files.find(item => item.name.toLowerCase() === "vessellicense").optional,
                            required: charterState.files.find(item => item.name.toLowerCase() === "vessellicense").required
                        },
                        vesselSafety: {
                            optional: charterState.files.find(item => item.name.toLowerCase() === "vesselsafety").optional,
                            required: charterState.files.find(item => item.name.toLowerCase() === "vesselsafety").required
                        }
                    },
                    stay: {
                        proofOfId: {
                            optional: stayState.files.find(item => item.name.toLowerCase() === "proofofid").optional,
                            required: stayState.files.find(item => item.name.toLowerCase() === "proofofid").required
                        },
                        serialNumber: {
                            optional: stayState.files.find(item => item.name.toLowerCase() === "serialnumber").optional,
                            required: stayState.files.find(item => item.name.toLowerCase() === "serialnumber").required
                        },
                        vesselDriversLicense: {
                            optional: stayState.files.find(item => item.name.toLowerCase() === "vesseldriverslicense").optional,
                            required: stayState.files.find(item => item.name.toLowerCase() === "vesseldriverslicense").required
                        },
                        vesselLicense: {
                            optional: stayState.files.find(item => item.name.toLowerCase() === "vessellicense").optional,
                            required: stayState.files.find(item => item.name.toLowerCase() === "vessellicense").required
                        },
                        vesselSafety: {
                            optional: stayState.files.find(item => item.name.toLowerCase() === "vesselsafety").optional,
                            required: stayState.files.find(item => item.name.toLowerCase() === "vesselsafety").required
                        }
                    }
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
                    setInitiateGet(true)
                    console.log("response from put category request", response.data)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })
        setOpenEditCat(false)
    }

    // handle delete
    const handleDelete = () => {
        API()
            .delete(
                `vessel/category/${row.category._id}`
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

    const requestSearch = (searchedVal) => {
        console.log("search goes here: ", searchedVal)
        if (searchedVal === "") {
            setSearchedRows(rows)
        } else {
            const filteredRows = rows.filter((row) => {
                const combinationTitleAndTypeAndStatus =
                    row.name + row.serviceType + row.verificationFiles
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

    const handleCloseError = () => {
        setOpenError(false)
    }

    // const handleVisibility = (row) => {
    //     console.log(row)
    //     setRow(row);
    //     row.category.isVisible = !row.category.isVisible
    //     API()
    //         .put(
    //             `vessel/category/${row.category._id}`,
    //             {
    //                 name: row.category.name,
    //                 isRental: row.category.isRental,
    //                 isCharter: row.category.isCharter,
    //                 isStay: row.category.isStay,
    //                 isProofOfId: row.category.isProofOfId,
    //                 isVesselDriversLicense: row.category.isVesselDriversLicense,
    //                 isVesselLicense: row.category.isVesselLicense,
    //                 isVesselSafety: row.category.isVesselSafety,
    //                 isSerialNumber: row.category.isSerialNumber,
    //                 isVisible: row.category.isVisible
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

    const handleSelectService = (service, event) => {
        if (service === "rental") {
            setRentalState(prevState => ({...prevState, isSelected: event.target.checked}))
        } else if (service === "stay") {
            setStayState(prevState => ({...prevState, isSelected: event.target.checked}))
        } else if (service === "charter") {
            setCharterState(prevState => ({...prevState, isSelected: event.target.checked}))
        }
    }

    const handleSelectFile = (service, event, checked) => {
        if (service === "rental") {
            const mapFile = rentalState?.files?.map(item => (item.name === event.target.name ? {
                ...item,
                optional: checked === null,
                required: checked === true
            } : item))
            setRentalState(prevState => ({...prevState, files: mapFile}))
        } else if (service === "stay") {
            const mapFile = stayState?.files?.map(item => (item.name === event.target.name ? {
                ...item,
                optional: checked === null,
                required: checked === true
            } : item))
            setStayState(prevState => ({...prevState, files: mapFile}))
        } else if (service === "charter") {
            const mapFile = charterState?.files?.map(item => (item.name === event.target.name ? {
                ...item,
                optional: checked === null,
                required: checked === true
            } : item))
            setCharterState(prevState => ({...prevState, files: mapFile}))
        }
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
                                             id="alert-dialog-title">{"Add New Listing Category"}</DialogTitle>
                                <DialogTitle hidden={!openEditCat} style={{textAlign: 'center'}}
                                             id="alert-dialog-title">{"Edit Listing Category"}</DialogTitle>
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
                                                            data-testid="nameTextField "
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
                                                            placeholder="Enter your name"
                                                            inputProps={{maxLength: 50, "data-testid": "nameTextField"}}
                                                            value={nameText}
                                                            onChange={(event, value) => {
                                                                (event?.target?.value ? setNameText(event.target.value) : setNameText(""))
                                                                setUnsavedChanges(event?.target?.value !== '')
                                                            }}
                                                        />
                                                    </Grid>
                                                </Grid>

                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginLeft: "auto",
                                                    marginRight: "auto",
                                                    pointerEvents: "none",
                                                    marginBottom: 10
                                                }}>
                                                    <ThreeStateCheckbox checked={false}/> <span
                                                    style={{marginRight: 5}}> Not Selected</span>
                                                    <ThreeStateCheckbox checked={null}/> <span
                                                    style={{marginRight: 5}}> Optional</span>
                                                    <ThreeStateCheckbox checked={true}/> <span
                                                    style={{marginRight: 5}}>Required</span>
                                                </div>
                                                <Grid style={{marginBottom: '2rem'}} container item xs={12}>
                                                    <Grid style={{textAlign: "left"}} item xs={2}>
                                                        <Typography
                                                            style={{
                                                                marginLeft: "auto",
                                                                fontWeight: "500",
                                                                fontSize: "1.1rem"
                                                            }}
                                                            variant="h6"
                                                            gutterBottom
                                                        >
                                                            Service
                                                        </Typography>
                                                    </Grid>
                                                    <Grid style={{textAlign: "left"}} item xs={10}>
                                                        <Accordion>
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon/>}
                                                            >
                                                                <FormControlLabel
                                                                    onClick={(event) => event.stopPropagation()}
                                                                    onFocus={(event) => event.stopPropagation()}
                                                                    label="Rental"
                                                                    control={<Checkbox checked={rentalState?.isSelected}
                                                                                       onChange={() => handleSelectService("rental", event)}
                                                                    />}
                                                                />
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <Grid style={{marginLeft: 50}} item xs={10}>
                                                                    <FormGroup row>
                                                                        {rentalState?.files?.map(item =>
                                                                            <FormControlLabel
                                                                                key={`rental_${item.name}`}
                                                                                label={item.label}
                                                                                control={
                                                                                    <ThreeStateCheckbox
                                                                                        name={item.name}
                                                                                        checked={item.required ? true : (item.optional ? null : false)}
                                                                                        onChange={(checked) => handleSelectFile("rental", event, checked)}
                                                                                    />
                                                                                }
                                                                            />)}
                                                                    </FormGroup>
                                                                </Grid>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                        <Accordion>
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon/>}
                                                            >
                                                                <FormControlLabel
                                                                    aria-label="Acknowledge"
                                                                    onClick={(event) => event.stopPropagation()}
                                                                    onFocus={(event) => event.stopPropagation()}
                                                                    label="Stay"
                                                                    control={
                                                                        <Checkbox
                                                                            checked={stayState?.isSelected}
                                                                            onChange={() => handleSelectService("stay", event)}
                                                                        />}
                                                                />
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <Grid style={{marginLeft: 50}} item xs={10}>
                                                                    <FormGroup row>
                                                                        {stayState?.files?.map(item => <FormControlLabel
                                                                            key={`stay_${item.name}`}
                                                                            label={item.label}
                                                                            control={
                                                                                <ThreeStateCheckbox
                                                                                    name={item.name}
                                                                                    checked={item.required ? true : (item.optional ? null : false)}
                                                                                    onChange={(checked) => handleSelectFile("stay", event, checked)}
                                                                                />
                                                                            }
                                                                        />)}
                                                                    </FormGroup>
                                                                </Grid>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                        <Accordion>
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon/>}
                                                            >
                                                                <FormControlLabel
                                                                    aria-label="Acknowledge"
                                                                    onClick={(event) => event.stopPropagation()}
                                                                    onFocus={(event) => event.stopPropagation()}
                                                                    label="Charter"
                                                                    control={
                                                                        <Checkbox
                                                                            checked={charterState?.isSelected}
                                                                            onChange={() => handleSelectService("charter", event)}
                                                                        />}
                                                                />
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <Grid style={{marginLeft: 50}} item xs={10}>
                                                                    <FormGroup row>
                                                                        {charterState?.files?.map(item =>
                                                                            <FormControlLabel
                                                                                key={`charter_${item.name}`}
                                                                                label={item.label}
                                                                                control={
                                                                                    <ThreeStateCheckbox
                                                                                        name={item.name}
                                                                                        checked={item.required ? true : (item.optional ? null : false)}
                                                                                        onChange={(checked) => handleSelectFile("charter", event, checked)}
                                                                                    />
                                                                                }
                                                                            />)}
                                                                    </FormGroup>
                                                                </Grid>
                                                            </AccordionDetails>
                                                        </Accordion>
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
                                        data-testid="textSaveBtn"
                                        style={{marginRight: "1rem"}}
                                        variant="contained"
                                        color="primary"
                                    >
                                        Save
                                    </Button>
                                    <Button onClick={handleCloseAddCat} variant="outlined" data-testid="textCancelBtn"
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
                                data-testid="textDeleteBtn"
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
                                        data-testid="deleteTextField"
                                        variant="h6"
                                        gutterBottom
                                    >
                                        Are you sure you want to delete {row.name} category?
                                    </Typography>

                                    <div
                                        style={{
                                            marginTop: "2.6em",
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-evenly"
                                        }}
                                        data-testid="counterContainer"
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
                                    data-testid=" textDeleteBtn"
                                >
                                    Delete
                                </Button>
                                <Button data-testid="textCancelBtn" onClick={handleCloseDelete}
                                        style={{color: theme.palette.buttonPrimary.main}}>Cancel</Button>
                            </DialogActions>
                        </div>
                    </Dialog>
                </div>
            )}
            {openError && (
                <div>
                    <Dialog
                        open={openError}
                        onClose={handleCloseError}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <div style={{padding: '2rem'}}>
                            <CloseIcon
                                onClick={handleCloseError}
                                style={{fontSize: "2rem", cursor: "pointer", float: 'right'}}
                            />
                            <DialogTitle style={{textAlign: 'center'}}
                                         id="alert-dialog-title">{"Mandatory Fields"}</DialogTitle>
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
                                        Services and Verification Files selection are mandatory
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
                                    data-testid="textOkBtn"
                                    onClick={handleCloseError}
                                    style={{
                                        backgroundColor: theme.palette.buttonPrimary.main,
                                        color: theme.palette.background.default
                                    }}
                                    variant="contained"
                                >
                                    Ok
                                </Button>
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
                        <Grid style={{display: "flex"}} item xs={4}>
                            <ArrowBackIcon
                                onClick={onClickBack}
                                style={{fontSize: "2rem", cursor: "pointer"}}
                            />
                            <Typography
                                style={{marginLeft: '15px', fontWeight: "500"}}
                                variant="h5"
                                gutterBottom
                            >
                                Listing Category
                            </Typography>
                        </Grid>
                        <Grid style={{textAlign: "right"}} item xs={8}>

                            {/* put listing component rendering add btn*/}
                            <Button
                                data-testid="textSaveBtn"
                                style={{marginLeft: "auto"}}
                                variant="contained"
                                color="primary"
                                onClick={handleClickOpenAddCat}
                            >
                                Add New Category
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
                            placeholder={'Search Category'}
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
                                                            id={labelId}
                                                            scope="row"
                                                            padding="none"
                                                        >
                                                            {row.name}
                                                        </TableCell>
                                                        <TableCell>{row.serviceType}</TableCell>
                                                        <TableCell>{row.verificationFiles}</TableCell>
                                                        <TableCell>
                                                            {/*{row.category.isVisible && <VisibilityIcon*/}
                                                            {/*    onClick={() => {*/}
                                                            {/*        handleVisibility(row)*/}
                                                            {/*    }}*/}
                                                            {/*    style={{*/}
                                                            {/*        marginRight: "1rem",*/}
                                                            {/*        cursor: "pointer",*/}
                                                            {/*    }}*/}
                                                            {/*/>}*/}
                                                            {/*{!row.category.isVisible && <VisibilityOffIcon*/}
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
