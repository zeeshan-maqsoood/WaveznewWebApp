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
    marginTop: 30,
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


export default function CustomRangePicker(props) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs>
          <CustomSlider
            valueLabelDisplay='on'
            min={500}
            max={10000}            
            value={ +(`${Math.round(props?.pickValue?? `${500  }e+0`)   }e-0`)}
            onChange={props.handlePickValue}
          />
        </Grid>
      </Grid>
    </div>
  )
}
