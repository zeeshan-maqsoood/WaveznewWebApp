import React, {useContext} from "react"
import Link from "next/link"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faArrowRight} from "@fortawesome/free-solid-svg-icons"
import {makeStyles} from "@material-ui/core/styles"
import Context from "../../store/context"

const useStyles = makeStyles((theme) => ({
    recommendation_container: {
        color: theme.palette.wavezHome.reviewsText,
        float: "left",
        fontWeight: "bold",
        fontSize: "24px",
        fontFamily: "Nunito Sans, Roboto, sans-serif"
    },
    section_name_highlighted: {
        color: theme.palette.buttonPrimary.main
    },
    a: {
        color: theme.palette.recommendationTopTex.aColor,
        float: "right",
        margin: "6px",
        fontSize: "22px"
    }
}))

const RecommendationTopText = (props) => {
    const {globalState, globalDispatch} = useContext(Context)
    const setGlobalDispatch = () => {
        { globalState.addSearchTerm!==""?globalDispatch({type: "SET_SEARCH_TERM", payload:""}):`` }
        globalDispatch({type: "SET_VESSEL_TYPE", payload: (props.buttonText.toUpperCase().substr(0, props.buttonText.length-1))})
    }
    const linkUrl = `/search/${  props.vesselType}`
    const classes = useStyles()
    return (
      <>
        <div className={classes.recommendation_container}>
          <h4>
            {props.introductionText}{' '}
            <span className={classes.section_name_highlighted}>
              {props.sectionName}
            </span>
          </h4>
        </div>
        <Link legacyBehavior href={linkUrl}>
          <a className={classes.a} onClick={setGlobalDispatch}>
            All <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </Link>
      </>
    )
}

export default RecommendationTopText
