import React from "react"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline"
import { Container } from "@material-ui/core"
import { primaryColor } from "../../config/colors"
import theme from "../../src/theme"
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1)
  },
  container: {
    backgroundColor: theme.palette.background.default,
    margin: "5px",
    width: "155px",
    height: "60px",
    border: "1px solid",
    borderColor: theme.palette.border.heather,
    borderRadius: "9px",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    "&:hover": {
      backgroundColor: theme.palette.wavezHome.backgroundColorSearch,
      color: theme.palette.buttonPrimary.main
    }
  }
}))

const ServiceButton = (props) => {
  const classes = useStyles()
  return (
    <>
      <Button
        className={classes.container}
        onClick={props.onClick}
        startIcon={props.isClicked ? <CheckCircleOutlineIcon /> : null}
        style={props.isSelected ? { backgroundColor: theme.palette.wavezHome.backgroundColorSearch, color: primaryColor } : {}}
      >
        {props.service}
      </Button>
    </>
  )
}
export default ServiceButton
