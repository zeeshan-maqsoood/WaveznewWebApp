import React, {useContext, useEffect, useState} from "react"
import { makeStyles } from "@material-ui/core/styles"

// i18n
import { useRouter } from 'next/router'
import en from '../../locales/en.js'
import fr from '../../locales/fr.js'
import Context from "../../store/context"
import theme from "../../src/theme"

const useStyles = makeStyles((theme) => ({
  explore_button: {
    fontSize: "15px",
    marginTop: "20px",
    color: theme.palette.background.default,
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: theme.palette.buttonPrimary.main
  }
}))

const ExploreMoreButton = (props) => {
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === 'en' ? en : fr
  const {globalState, globalDispatch} = useContext(Context)
  const [buttonText, setButtonText]= useState("")
  const  setVesselType = () => {
    setButtonText(props.buttonText)
    { globalState.addSearchTerm!==""?globalDispatch({type: "SET_SEARCH_TERM", payload:""}):`` }
    globalDispatch({type: "SET_VESSEL_TYPE", payload:(props.buttonText.toUpperCase().substr(0, props.buttonText.length-1))})
    router.push(`/search/${props.buttonText.toUpperCase().substr(0, props.buttonText.length-1)}`)
  }

  return (
    <>
      <button type="button" onClick={setVesselType} className={classes.explore_button}>{t.exploreMore}{" "}{props.buttonText}</button>
      <style jsx>{`
      `}</style>
    </>
  )
}

export default ExploreMoreButton
