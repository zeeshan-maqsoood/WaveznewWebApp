import React, { useContext, useEffect, useState } from "react"
import NavBar from "../../../components/navbar/navBar"
import { makeStyles } from "@material-ui/core/styles"
// eslint-disable-next-line no-duplicate-imports
import { withStyles } from "@material-ui/core/styles"
import { useRouter } from "next/router"
import API from "../../api/baseApiIinstance"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import Avatar from "@material-ui/core/Avatar"
import { Typography } from "@material-ui/core"
import Rating from "@material-ui/lab/Rating"
import StarRateRoundedIcon from "@material-ui/icons/StarRateRounded"
import theme from "../../../src/theme"
import moment from "moment"
import TablePagination from "@material-ui/core/TablePagination"

const useStyles = makeStyles((theme) => ({
  reviews_container: {
    marginTop: 10
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    width: "fit-content"
  }
}))

const StyledRating = withStyles({
  iconFilled: {
    color: theme.palette.userReview.iconFilled
  },
  iconHover: {
    color: theme.palette.userReview.iconHover
  }
})(Rating)

const VesselReviews = (props) => {
  const classes = useStyles()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const router = useRouter()
  const [userReviews, setUserReviews] = useState([])
  const [totalReviews, setTotalReviews] = useState()

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10))
      setPage(0)
  }

  useEffect(() => {
    
    if (router.asPath !== router.route) {
      console.log("Page changes: ", page, rowsPerPage)
      const vesselId = router.query.id
      API()
        .get(`reviews/vesselReviews/${vesselId}?p=${page + 1}&s=${rowsPerPage}`)
        .then((response) => {
          setTotalReviews(response.data.totalCount)
          setUserReviews(response.data.reviews)
        })
        .catch((e) => {
          console.log("Error from get information files is: ", e)
          // router.push("/somethingWentWrong");
        })
    }
  }, [page, rowsPerPage])

  return (
    <>
    <NavBar/>
      <div style={{ margin: "auto" }}>
       <Typography variant="h5" style={{textAlign: "center", marginTop: 20}}>All reviews</Typography>
        <Grid container>
          {userReviews?.map((data) => (
            <Grid item xs={12} md={6} key={data._id}>
              <Paper style={{ margin: 30, padding: 20 }}>
                <Grid container>
                  <Grid item xs={2} md={2}>
                    <Avatar
                      style={{height: 60, width: 60}}
                      src={data?.reviewer?.profileImageUrl}
                    />
                  </Grid>
                  <Grid item xs={10} md={10}>
                    <Typography variant='h6' gutterBottom>
                      {data?.reviewer?.firstName} {data?.reviewer?.lastName}
                    </Typography>
                    <Typography
                      variant='body2'
                      gutterBottom
                      style={{ cursor: "pointer" }}
                      color='textSecondary'
                    >
                      {data?.reviewer?.rawAddress || "Canada"} |{" "}
                      {moment(data?.createdAt).format("MM/DD/YYYY")}
                    </Typography>
                    <Typography>
                      {" "}
                      <StyledRating
                        name='customized-color'
                        defaultValue={data.rating}
                        getLabelText={(value) =>
                          `${value} Heart${value !== 1 ? "s" : ""}`
                        }
                        precision={0.5}
                        icon={<StarRateRoundedIcon fontSize='medium' />}
                        disabled
                      />
                    </Typography>
                    <div>{data?.description}</div>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </div>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component='div'
        className={classes.paper}
        count={totalReviews}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={"Reviews per page"}
    />
    </>
  )
}

export default VesselReviews
