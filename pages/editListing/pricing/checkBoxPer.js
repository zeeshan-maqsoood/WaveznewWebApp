import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  Grid,
  Tooltip,
  IconButton,
  Checkbox,
  OutlinedInput,
  InputAdornment,
  TextField
} from "@material-ui/core"
import { ErrorOutline } from "@material-ui/icons"
import CustomRangePicker from "./customRangePicker"
import theme from "../../../src/theme"

const useStyles = makeStyles((theme) => ({
  minDeposit: {
    fontSize: "18px",
    width: "400px",
    marginLeft: "20px",
    padding: 10,
    fontWeight: "500"
  }
}))

export default function CheckBoxPer(props) {
  const classes = useStyles()
  const originalObject= {checked: false, amount: 0, minimumTime: 0}
  const originalPerHour= props.vesselPricing?.perHour ?? originalObject
  const originalPerDay= props.vesselPricing?.perDay ?? originalObject
  const originalPerWeek= props.vesselPricing?.perWeek ?? originalObject
  const originalMinDeposit = props.vesselPricing?.minimumDeposit ?? 1000

  const [perHour, setPerHour] = useState(originalPerHour)
  const [perDay, setPerDay] = useState(originalPerDay)
  const [perWeek, setPerWeek] = useState(originalPerWeek)
  const [minDeposit, setMinDeposit] = useState(originalMinDeposit)

  const [pricingData, setPricingData] = useState([
    {
      perPeriod: "Per Hour",
      minimumPeriod: "Minimum Hours",
      checked: perHour.checked,
      amount: perHour.amount,
      minimumTime: perHour.minimumTime
    },
    {
      perPeriod: "Per Day",
      minimumPeriod: "Minimum Days",
      checked: perDay.checked,
      amount: perDay.amount,
      minimumTime: perDay.minimumTime
    },
    {
      perPeriod: "Per Week",
      minimumPeriod: "Minimum Weeks",
      checked: perWeek.checked,
      amount: perWeek.amount,
      minimumTime: perWeek.minimumTime
    }
  ])

  const handleCheckBox = (perPeriodValue) => (e) => {
    const updateChecked = pricingData.map((item) => {
      return item.perPeriod === perPeriodValue
        ? { ...item, checked: e.target.checked }
        : item
    })
    setPricingData(updateChecked)
    if (perPeriodValue === "Per Hour") {
      setPerHour({ ...perHour, checked: e.target.checked })
    } else if (perPeriodValue === "Per Day") {
      setPerDay({ ...perDay, checked: e.target.checked })
    } else {
      setPerWeek({ ...perWeek, checked: e.target.checked })
    }
  }

  const handleChangeMinDeposit = (e) => {
    console.log("value change: ", e.target.value)
    setMinDeposit(e.target.value)
  }

  const handlePickMinDeposit = (event, newValue) => {
    setMinDeposit(newValue)
  }


  const handleChangeAmount = (perPeriodValue) => (e) => {
    const updateAmount = pricingData.map((item) => {
      return item.perPeriod === perPeriodValue
        ? { ...item, amount: e.target.value }
        : item
    })
    setPricingData(updateAmount)

    if (perPeriodValue === "Per Hour") {
      setPerHour({ ...perHour, amount: e.target.value })
    } else if (perPeriodValue === "Per Day") {
      setPerDay({ ...perDay, amount: e.target.value })
    } else {
      setPerWeek({ ...perWeek, amount: e.target.value })
    }
  }

  const handleChangeMinimumTime = (perPeriodValue) => (e) => {
    const updateAmount = pricingData.map((item) => {
      return item.perPeriod === perPeriodValue
        ? { ...item, minimumTime: e.target.value }
        : item
    })
    setPricingData(updateAmount)

    if (perPeriodValue === "Per Hour") {
      setPerHour({ ...perHour, minimumTime: e.target.value })
    } else if (perPeriodValue === "Per Day") {
      setPerDay({ ...perDay, minimumTime: e.target.value })
    } else {
      setPerWeek({ ...perWeek, minimumTime: e.target.value })
    }
  }

  useEffect(() => {
    props.onHandleHour(perHour)
    props.onHandleDay(perDay)
    props.onHandleWeek(perWeek)
    props.onHandleMinDeposit(minDeposit)
  }, [perHour, perDay, perWeek, minDeposit])

  return (
    <div>
      {pricingData.map((item) => (
        <Grid item xs={12} style={{ display: "flex", marginTop: "50px" }}>
          <Grid>
            <Tooltip title='hint will be added later'>
              <IconButton>
                <ErrorOutline />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid>
            <Checkbox
              style={{ color: theme.palette.buttonPrimary.main }}
              onChange={handleCheckBox(item.perPeriod)}
            />
          </Grid>
          <Grid
            style={{
              fontSize: "18px",
              width: "120px",
              marginLeft: "20px",
              padding: 10,
              fontWeight: "500",
              color: item.checked ? theme.palette.text.black : theme.palette.background.silver
            }}
          >
            {item.perPeriod}
          </Grid>
          <Grid>
            <OutlinedInput
              name='amount'
              value={item.amount}
              onChange={handleChangeAmount(item.perPeriod)}
              disabled={!item.checked ? true : false}
              style={{ width: "100%" }}
              id='outlined-adornment-weight'
              endAdornment={
                <InputAdornment position='end'>
                  {props.currencyUnit}
                </InputAdornment>
              }
              startAdornment={
                <InputAdornment position='start'>$</InputAdornment>
              }
            />
          </Grid>
          {item.minimumPeriod && (
            <Grid
              style={{
                fontSize: "18px",
                marginLeft: "40px",
                width: "20%",
                padding: 10,
                fontWeight: "500",
                color: item.checked ? theme.palette.text.black : theme.palette.background.silver
              }}
            >
              {item.minimumPeriod}
            </Grid>
          )}
          {item.minimumPeriod && (
            <Grid>
              <TextField
                variant='outlined'
                value={item.minimumTime}
                onChange={handleChangeMinimumTime(item.perPeriod)}
                disabled={!item.checked ? true : false}
              />
            </Grid>
          )}
        </Grid>
      ))}
       <Grid item xs={12} style={{ display: "flex", marginTop: "50px" }}>
                <Grid>
                  <Tooltip title='hint will be added later'>
                    <IconButton>
                      <ErrorOutline />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid className={classes.minDeposit}>
                  Minimum safety deposit required to book
                </Grid>
              </Grid>
              <CustomRangePicker
                pickValue={minDeposit}
                handlePickValue={handlePickMinDeposit}
              />
              <OutlinedInput
                onChange={handleChangeMinDeposit}
                value={minDeposit}
                style={{ width: "30%" }}
                endAdornment={
                  <InputAdornment position='end'>CAD</InputAdornment>
                }
                startAdornment={
                  <InputAdornment position='start'>$</InputAdornment>
                }
              />
    </div>
  )
}
