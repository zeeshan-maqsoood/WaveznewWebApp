import React from "react"
import PropTypes from "prop-types"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import TableSortLabel from "@material-ui/core/TableSortLabel"

// i18n
import { useRouter } from "next/router"
import en from "../../locales/en"
import fr from "../../locales/fr"
import {Checkbox} from "@material-ui/core"

function GenericTableHead(props) {

    const { classes, order, orderBy, onRequestSort, headCells, displayAllCells, numSelected, rowCount, onSelectAllClick } = props
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property)
    }
    //locale
    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : fr

    return (
        <TableHead>
            <TableRow>
                {/*<TableCell/>*/}
                <TableCell padding="checkbox">
                    {!!displayAllCells && (
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={(rowCount > 0 && numSelected === rowCount) || (rowCount > 0 && numSelected > rowCount)}
                            onChange={onSelectAllClick}
                        />
                    )}
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align ? headCell.align : (headCell.numeric ? "right" : "left")}
                        padding={headCell.disablePadding ? "none" : "normal"}
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

GenericTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
}

export default GenericTableHead
