import React, { useContext } from "react"
import Badge from "@material-ui/core/Badge"
import { makeStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import AddIcon from "@material-ui/icons/Add"
import RemoveIcon from "@material-ui/icons/Remove"
import Context from '../../store/context'

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    "& > *": {
    },
    "& .MuiBadge-root": {
      marginRight: theme.spacing(4)
    }
  }
}))

export default function Counter({ onMinus = () => { }, onPlus = () => { }, displayValue, disabled }) {
  const { globalState, globalDispatch } = useContext(Context)
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div>
        <Button
          aria-label="reduce"
          onClick={() => {
            onMinus()
          }}
          disabled={disabled}
        >
          <RemoveIcon fontSize="small" />
        </Button>

        {displayValue}
        <Button
          aria-label="increase"
          onClick={() => {
            onPlus()
          }}
          disabled={disabled}
        >
          <AddIcon fontSize="small" />
        </Button>
      </div>
    </div>
  )
}
