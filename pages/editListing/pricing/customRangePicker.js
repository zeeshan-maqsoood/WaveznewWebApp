import React from "react"
import { makeStyles, withStyles} from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Slider from "@material-ui/core/Slider"

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(10),
    "& .MuiSlider-thumb": {
      height: 24,
      width: 24
    }},
      root: {
    margin: 30,
    width: "80%",
    color: theme.palette.buttonPrimary.main
  
  }
}))

const CustomSlider = withStyles(theme => ({
  track: {
    height: 5,
    color: theme.palette.buttonPrimary.main
  },
  rail: {
    height: 2,
    opacity: 0.5,
    backgroundColor: theme.palette.background.silver
  },
  mark: {
    backgroundColor: theme.palette.background.silver,
    height: 8,
    width: 1,
    marginTop: -3
  },
  markActive: {
    opacity: 1,
    backgroundColor: 'currentColor'
  },
  thumb: {
    color: theme.palette.buttonPrimary.main
  }
}))(Slider)

// const useStyles = makeStyles({
//   root: {
//     margin: 30,
//     width: "100%",
//     color: theme.palette.buttonPrimary.main,
//   }
// });

const marks = [
  {
    value: 1000
  },
  {
    value: 2000
  },
  {
    value: 3000
  },
  {
    value: 4000
  },
  {
    value: 5000
  },
  {
    value: 6000
  },
  {
    value: 7000
  },
  {
    value: 8000
  },
  {
    value: 9000
  },
  {
    value: 10000
  }
]

export default function CustomRangePicker(props) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs>
          <CustomSlider
            marks={marks}
            valueLabelDisplay='on'
            step={1000}
            min={1000}
            max={10000}
            value={props.pickValue}
            onChange={props.handlePickValue}
          />
        </Grid>
      </Grid>
    </div>
  )
}
