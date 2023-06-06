import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import RecommendationTopText from "./recommendationTopText"
import ExploreMoreButton from "./exploreMoreButton"
import BoatCard from "./boatCard"
import {useRouter} from "next/router"
import en from "../../locales/en"
import fr from "../../locales/fr"

const useStyles = makeStyles((theme) => ({
  boat_card: {
    marginTop: "5%",
    display: "flex",
    flexDirection: "row",
    flexwrap: "wrap"
  },
  image_container: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: theme.palette.recommendationImageContainer.backgroundColor,
    margin: "10px",
    padding: "20px",
    fontSize: "30px"
  },
  top_text: {
    justifyContent: "center",
    textAlign: "center"
  },
  center_button: {
    textAlign: "center"
  }
}))

export default function RecommendationBar(props) {
  const router = useRouter()
  const {locale} = router
  const t = locale === 'en' ? en : fr
  const dataList = props.dataList
  dataList.length = 3

  const styles = useStyles()

  const dummies = [
    {
      _id: "001",
      name: "Boat 001",
      price: "$699/h",
      location: "Toronto",
      description: "This is boat 001",
      img: "https://picsum.photos/200/300",
      numberOfPassengers: 2
    },
    {
      _id: "002",
      name: "Boat 002",
      price: "$699/h",
      location: "Toronto",
      description: "This is boat 002",
      img: "https://picsum.photos/200/300",
      numberOfPassengers: 2
    },
    {
      _id: "003",
      name: "Boat 003",
      price: "$699/h",
      location: "Toronto",
      description: "This is boat 003",
      img: "https://picsum.photos/200/300",
      numberOfPassengers: 2
    }
  ]

  return (
    <div className={styles.grid_container}>
      <div className={styles.top_text}>
        <RecommendationTopText
          introductionText={props.introductionText}
          sectionName={props.sectionName}
          buttonText={props.buttonText}
          vesselType={props.vesselType}
        />
      </div>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        spacing={4}
      >
        {dataList
          ? (dataList.map((data) => {
            return (
              <BoatCard
                vessel={data}
                key={data._id}
                id={data._id}
                type={data.vesselType}
                name={data?.title ? data?.title : ""}
                price={data?.vesselType === 'RENTAL'?(data?.vesselPricing?.perHour?.amount>0? `${data.vesselPricing?.perHour?.amount }/${t.search.filter.hour}`:`${0}/${t.search.filter.hour}`):(data.vesselPricing?.perDay?.amount===undefined?`${0}/${t.search.filter.day}` :`${data.vesselPricing?.perDay?.amount }/${t.search.filter.day}`)}
                location={data?.vesselAddress?.city ? data?.vesselAddress?.city : ""}
                description={data?.description ? data?.description : ""}
                img={data?.images && data?.images?.length !== 0 ? data?.images[0]?.imageURL : 'https://picsum.photos/200/300'}
                numberOfPassengers={data?.numberOfPassengers ? data?.numberOfPassengers : 0}
                windowHeight={props.windowHeight}
              />
            )
          }))
          : ""}
      </Grid>
      <div className={styles.center_button}>
        <ExploreMoreButton buttonText={props.buttonText} />
      </div>
    </div>
  )
}
