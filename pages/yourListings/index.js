import React, { Component, useState, useEffect, useContext } from "react"
import { fade, makeStyles } from "@material-ui/core/styles"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  Paper
} from "@material-ui/core"

import SearchBar from "material-ui-search-bar"
import Session from "../../sessionService"
import API from "../api/baseApiIinstance"
import Context from "../../store/context"
import CreateIcon from "@material-ui/icons/Create"
import DeleteIcon from "@material-ui/icons/Delete"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import CalendarTodayIcon from "@material-ui/icons/CalendarToday"
import { Modal } from "react-responsive-modal"
import DeleteWarningBox from "../../components/yourListing/deleteWarningBox"
import moment from "moment"
import clsx from "clsx"
import LoginPrompt from "../../components/addList/loginPrompt"
import EnhancedTableHead from "./sortingHeader"
import Footer from "../../components/footer"

// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import NavBar from "../../components/navbar/navBar.js"
import Login from "../../components/login/login"
import theme from "../../src/theme"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%"
  },
  topHeader: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "inline"
    }
  },
  paperRoot: {
    margin: 20
  },
  icon: {
    fontSize: "20px",
    marginRight: 2,
    [theme.breakpoints.down("xs")]: {
      fontSize: 15
    }
  },
  button_group: {
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  edit_button: {
    color: theme.palette.wavezHome.backgroundColorSearch,
    backgroundColor: theme.palette.buttonPrimary.main,
    fontSize: "16px",
    fontWeight: 400,
    textTransform: "capitalize",
    margin: 10,
    borderRadius: 3,
    [theme.breakpoints.down("xs")]: {
      marginRight: 3,
      width: 60,
      height: 25,
      fontSize: 12
    },
    [theme.breakpoints.down("md")]: {
      marginBottom: "5px"
    }
  },
  start_button: {
    backgroundColor: theme.palette.background.eucalyptus
  },
  delete_button: {
    backgroundColor: theme.palette.background.flamingo
  },
  search: {
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "530px",
    boxRadius: "8px",
    border: `1px solid ${  theme.palette.navBar.darkerGrey}`,
    marginTop: "12px"
  },
  nameColumn: {
    fontWeight: "500",
    fontSize: "24px",
    color: theme.palette.title.matterhorn,
    textTransform: "capitalize",
    [theme.breakpoints.down("md")]: {
      fontSize: "18px"
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "14px",
      padding: 0,
      paddingTop: 10,
      paddingBottom: 10
    }
  },
  boatName: {
    margin: 25,
    [theme.breakpoints.down("xs")]: {
      width: 150,
      margin: 5
    }
  },
  tableCell: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: "24px",
    color: theme.palette.title.matterhorn,
    textTransform: "capitalize",
    [theme.breakpoints.down("md")]: {
      fontSize: "18px"
    },
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
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
  startSection: {
    display: "flex",
    alignItems: "center"
  },
  searchBarRoot: {
    marginLeft: "auto",
    marginRight: "auto",
    width: "500px",
    [theme.breakpoints.down("xs")]: {
      maxWidth: "300px"
    }
  },
  calendarIcon: {
    color: theme.palette.buttonPrimary.main,
    cursor: "pointer",
    marginTop: 10,
    [theme.breakpoints.down("xs")]: {
      fontSize: 20
    }
  },
  modalStyle: {
    borderRadius: 10
  },
  customModal: {
    padding: "41px",
    maxWidth: "616px",
    borderRadius: 10
  }
}))

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

const YourListings = () => {
  const classes = useStyles()
  const mobileBreakpoint = 600
  const [windowSize, setWindowSize] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [rows, setRows] = useState([])
  const [searchedRows, setSearchedRows] = useState([])
  const [searched, setSearched] = useState("")
  const [isDeleted, setIsDeleted] = useState(false)
  const [deleteWarningBox, setDeleteWarningBox] = useState(false)
  const [deleteInfo, setDeleteInfo] = useState({
    id: "",
    vesselType: "",
    name: ""
  })
  //state for sorting header
  const [order, setOrder] = useState("desc")
  const [orderBy, setOrderBy] = useState("updatedAt")
  //state for pagination
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  //locale
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  const token = Session.getToken("Wavetoken")
  const { globalState, globalDispatch } = useContext(Context)

  const onHandleCalendarClick = (listingId) => {
    globalDispatch({ type: "SET_CALENDAR_LISTING", payload: listingId })
    router.push("calendar")
  }

  useEffect(() => {
    clearNotifications()
  }, [])

  const clearNotifications = () => {
    const currNotifications = Session.getNotifications()
    const body = {
      listings: 0,
      trips: currNotifications.trips,
      conversations: currNotifications.conversations
    }
    API()
      .post(`/notifications/${  Session.getUserId()}`, body, {
        headers: {
          authorization: `Bearer ${  token}`
        }
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("listings notifications cleared")
        }
      })
      .catch((e) => {
        // router.push("/somethingWentWrong");
        console.log("somethingWentWrong: ", e)
      })
  }

  const renderActionButton = (row) => {
    return (
      <div style={{ display: "flex" }}>
        <Button
          variant="contained"
          className={
            row.updatedAt !== row.createdAt
              ? classes.edit_button
              : clsx(classes.start_button, classes.edit_button)
          }
          onClick={() => handleEdit(row._id, row.vesselType)}
        >
          {row.updatedAt !== row.createdAt ? (
            <div className={classes.startSection}>
              <CreateIcon className={classes.icon} /> {t.edit}
            </div>
          ) : (
            <div className={classes.startSection}>
              <PlayArrowIcon className={classes.icon} />
              {t.start}{" "}
            </div>
          )}
        </Button>

        <Button
          className={clsx(classes.delete_button, classes.edit_button)}
          onClick={() => {
            handleDelete(row.vesselType, row._id, row.title)
          }}
        >
          <DeleteIcon className={classes.icon} />
          {t.delete}
        </Button>
      </div>
    )
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
    if (searchedVal === "") {
      setSearchedRows(rows)
    } else {
      const filteredRows = rows.filter((row) => {
        const combinationTitleAndTypeAndStatus =
          row.title + row.vesselType + row.vesselStatus
        return combinationTitleAndTypeAndStatus
          .toLowerCase()
          .includes(searchedVal.toLowerCase())
      })
      setSearchedRows(filteredRows)
    }
  }

  const cancelSearch = () => {
    setSearched("")
    requestSearch(searched)
  }

  const handleEdit = (vesselId, vesselType) => {
    router.push(`/editListing/${vesselType}/${vesselId}`)
  }

  const confirmDelete = (deleteInfo) => {
    const vesselType = deleteInfo.vesselType
    const id = deleteInfo.id

    API()
      .delete(`${vesselType.toLowerCase()}s/${id}`, {
        headers: {
          authorization: `Bearer ${  token}`
        }
      })
      .then((response) => {
        setDeleteWarningBox(false)
      })
      .catch((error) => console.log(error))
    setIsDeleted(true)
  }

  const handleDelete = (vesselType, id, name) => {
    setDeleteInfo({ id, vesselType, name })
    setDeleteWarningBox(true)
  }

  useEffect(() => {
    setIsDeleted(false)
    const callApiListings = () => {
      if (token !== "") {
        API()
          .get("users/getListings", {
            headers: {
              authorization: `Bearer ${  token}`
            }
          })
          .then((response) => {
            setRows(response.data.listings)
            setSearchedRows(response.data.listings)
          })
      } else {
        onLandingListingPage()
      }
    }

    callApiListings()
    globalDispatch({ type: "SET_ADDLIST_STEP", payload: 1 })
    globalDispatch({ type: "GET_STARTED", payload: false })
  }, [isDeleted])

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== "undefined") {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize(window.innerWidth)
        window.innerWidth <= mobileBreakpoint
          ? setIsMobile(true)
          : setIsMobile(false)
      }

      // Add event listener
      window.addEventListener("resize", handleResize)

      // Call handler right away so state gets updated with initial window size
      handleResize()

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize)
    }
  }, []) // Empty array ensures that effect is only run on mount

  const [login, setLogin] = useState(false)

  const [loginPrompt, setLoginPrompt] = useState(false)

  const onClosePrompt = () => {
    setLoginPrompt(false)
  }
  const onCloseModal = (closeState) => {
    setCloseState(closeState)
  }

  const onOpenLoginModal = () => {
    setLogin(!login)
  }
  const onLandingListingPage = () => {
    setLoginPrompt(true)
  }

  return (
    <>
      <NavBar />
      <Modal
        open={loginPrompt}
        onClose={() => setLoginPrompt(false)}
        classNames={{
          modal: classes.customModal
        }}
        center
      >
        <LoginPrompt closeModal={onClosePrompt} setLogin={onOpenLoginModal} />
      </Modal>
      <Modal
        open={login}
        onClose={() => setLogin(false)}
        classNames={{
          modal: classes.customModal
        }}
        center
      >
        <Login onCloseModal={onCloseModal} />
      </Modal>
      <Modal
        classNames={{ modal: classes.modalStyle }}
        open={deleteWarningBox}
        onClose={() => setDeleteWarningBox(false)}
        center
      >
        <DeleteWarningBox
          title={`${deleteInfo.name} Listing`}
          confirmDelete={() => confirmDelete(deleteInfo)}
          cancelDelete={() => setDeleteWarningBox(false)}
        />
      </Modal>

      <div className={classes.topHeader}>
        <h2 style={{ marginLeft: "50px", marginTop: "20px" }}>
          {t.yourListingsPage.header}
        </h2>

        <SearchBar
          inputProps={{ "data-testid": "searchValue" }}
          className={classes.search}
          classes={{ root: classes.searchBarRoot }}
          value={searched}
          placeholder={t.search.search}
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={cancelSearch}
        />
      </div>
      <hr></hr>

      <Paper classes={{ root: classes.paperRoot }}>
        <TableContainer>
          <Table classes={classes.table}>
            <EnhancedTableHead
              isMobile={isMobile}
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={searchedRows.length}
            />
            <TableBody data-testid="list">
              {stableSort(searchedRows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover key={row._id}>
                      <TableCell classes={{ root: classes.nameColumn }}>
                        <div style={{ display: "flex" }}>
                          <img
                            src={
                              row.images.length !== 0
                                ? `${row?.images[0]?.imageURL}?${Date.now()}`
                                : `/assets/images/maskGroup.png`
                            }
                            width="140px"
                            height="80px"
                            alt="boat img placeholder"
                          />
                          <div className={classes.boatName}>
                            <span style={{ margin: 10 }}>{row.title}</span>{" "}
                            <br />
                            {isMobile && (
                              <div style={{ display: "flex" }}>
                                {renderActionButton(row)}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {moment(row.updatedAt).format("YYYY-MM-DD HH:mm")}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {row.vesselType.toLowerCase()}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {row.vesselStatus.toLowerCase()}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <CalendarTodayIcon
                          onClick={() => onHandleCalendarClick(row._id)}
                          style={{
                            color: theme.palette.buttonPrimary.main,
                            cursor: "pointer"
                          }}
                        />
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.button_group}
                      >
                        {renderActionButton(row)}
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={searchedRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          labelRowsPerPage={t.yourListingsPage.listingPerPage}
        />
      </Paper>
      <Footer />
    </>
  )
}

export default YourListings
