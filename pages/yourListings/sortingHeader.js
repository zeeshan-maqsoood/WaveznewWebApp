import React from "react"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TablePagination from "@material-ui/core/TablePagination"
import TableRow from "@material-ui/core/TableRow"
import TableSortLabel from "@material-ui/core/TableSortLabel"
import Paper from "@material-ui/core/Paper"

// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"

function EnhancedTableHead(props) {

  const { classes, order, orderBy, onRequestSort } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }
  //locale
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  const headCells = [
    {
      id: "title",
      numeric: false,
      name: true,
      disablePadding: true,
      label: t.yourListingsPage.name
    },
    {
      id: "updatedAt",
      numeric: false,
      name: false,
      disablePadding: true,
      label: t.yourListingsPage.date,      
      isMobile: props.isMobile
    },
    {
      id: "vesselType",
      numeric: false,
      name: false,
      disablePadding: true,
      label: t.yourListingsPage.type,
      isMobile: props.isMobile
    },
    {
      id: "vesselStatus",
      numeric: false,
      name: false,
      disablePadding: true,
      label: t.yourListingsPage.status,
      isMobile: props.isMobile
    }
  ]

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            style={{ fontSize: "24px", paddingLeft: 20, display: headCell.isMobile === true && "none"  }}
            key={headCell.id}
            align={headCell.name ? "left" : "center"}
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
        <TableCell style={{ fontSize: "24px", paddingLeft: 20, display: props.isMobile === true && "none" }}>{t.yourListingsPage.calendar}</TableCell>
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  //numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  //onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
}

export default EnhancedTableHead