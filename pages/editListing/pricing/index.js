import React, { useState, useEffect } from "react"
import { makeStyles, withStyles } from "@material-ui/core/styles"
import {
  Grid,
  Button,
  OutlinedInput,
  InputAdornment,
  TextField,
  FormHelperText
} from "@material-ui/core"
import clsx from "clsx"
import CustomTooltip from "./toolTip"
import CustomRangePicker from "../../../components/editListing/customRangePicker"
import Hint from "../../addList/hint"
import API from "../../../pages/api/baseApiIinstance"
import Session from "../../../sessionService"
import MobileHint from "../../../components/addList/mobileHint"
import { Modal } from "react-responsive-modal"
// i18n
import { useRouter } from "next/router"
import en from "../../../locales/en"
import fr from "../../../locales/fr"
import theme from "../../../src/theme"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingLeft: "10%",
    paddingTop: 90,
    [theme.breakpoints.down("sm")]: {
      padding: 3,
      paddingTop: 100
    }
  },
  containerRoot: {
    marginBottom: 200
  },
  topPadding: {
    paddingTop: 110
  },
  container: {
    [theme.breakpoints.down("sm")]: {
      padding: 0
    }
  },
  hintContainer: {
   height: "1500px",
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  hint: {
    position: "absolute",
    top: 140,
    width: "32vw",
    zIndex: 3,
    [theme.breakpoints.down("xs")]: {
      width: "38vw"
    },
    [theme.breakpoints.down("sm")]: {
      width: "40vw",
      top: 160
    }
  },
  hintBlue: {
    backgroundColor: theme.palette.background.pattensBlue
  },
  bottomDiv: {
    position: "fixed",
    backgroundColor: theme.palette.background.default,
    bottom: 0,
    height: 80,
    width: "100%",
    alignItems: "center",
    zIndex: 11,
    borderTop: `1px ${ theme.palette.background.lightGrey} solid`
  },
  saveDiv: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 12
  },
  minDeposit: {
    fontSize: "18px",
    width: "400px",
    marginLeft: "20px",
    padding: 10,
    fontWeight: "500"
  },
  cancel_button: {
    textTransform: "capitalize",
    backgroundColor: theme.palette.background.default,
    fontWeight: "400",
    fontSize: "18px",
    color: theme.palette.buttonPrimary.main,
    height: "60%",
    marginRight: 20
  },
  save_button: {
    fontWeight: "400",
    textTransform: "capitalize",
    backgroundColor: theme.palette.buttonPrimary.main,
    color: theme.palette.background.default,
    fontSize: "18px",
    maxHeight: "70%",
    maxWidth: "150px",
    marginLeft: 20
  },
  minimumPeriodStyle: {
    fontSize: "18px",
    minWidth: 160,
    padding: 10,
    fontWeight: "500",
    [theme.breakpoints.down("xs")]: {
      width: 100
    }
  },
  perPeriodStyle: {
    minWidth: 100,
    [theme.breakpoints.down("sm")]: {
      display: "flex"
    }
  },
  amountInputRoot: {
    marginBottom: 4,
    [theme.breakpoints.down("md")]: {
      width: 150
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "5px"
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: "5px"
    }
  },
  hintModal: {
    width: "90vw",
    borderRadius: 10
  },
  minMaxDisplay: {
    fontSize: 16,
    width: "83%",
    marginBottom: 20
  }
}))

export default function Pricing({
  listingStartValue,
  getListingInfo,
  setUnsavedChanges,
  onSubmit,
  hintIsOpen,
  setHintIsOpen,
  nextPage
}) {
  const classes = useStyles()
  const token = Session.getToken("Wavetoken")
  const MIN_DEPOSIT = 500
  const MAX_DEPOSIT = 10000
  const [currency, setCurrency] = useState("CAD")
  const [minDeposit, setMinDeposit] = useState(MIN_DEPOSIT)
  const [isValidated, setIsValidated] = useState(false)
  const [errorMinDeposit, setErrorMinDeposit] = useState("")
  const [minimumTime, setMinimumTime] = useState("")
  const [errorMinimumTime, setErrorMinimumTime] = useState("")
  //i18n
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  const [pricingData, setPricingData] = useState([
    {
      perPeriod: `${t.editListing.pricing.per} ${t.editListing.pricing.hour}`,
      amount: listingStartValue?.vesselPricing?.perHour?.amount || 0,
      errorMessageAmount: ""
    },
    {
      perPeriod: `${t.editListing.pricing.per} ${t.editListing.pricing.day}`,
      amount: listingStartValue?.vesselPricing?.perDay?.amount || 0,
      errorMessageAmount: ""
    },
    {
      perPeriod: `${t.editListing.pricing.per} ${t.editListing.pricing.week}`,
      amount: listingStartValue?.vesselPricing?.perWeek?.amount || 0,
      errorMessageAmount: ""
    }
  ])

  const validate = () => {    
    setIsValidated(true)
    const updatedError = pricingData.map((item) => {
      if (item.amount === null || isNaN(item.amount) || item.amount === "") {
        setIsValidated(false)
        return { ...item, errorMessageAmount: t.editListing.pricing.errorAmountInvalid}
      }
      return item
    })

    setPricingData(updatedError)

    if (minimumTime === null || minimumTime === "" || isNaN(minimumTime)) {
      setIsValidated(false)
      setErrorMinimumTime(t.editListing.pricing.errorMinTime)
    }

    if (minDeposit === null || isNaN(minDeposit)) {
      setIsValidated(false)
      setErrorMinDeposit(t.editListing.pricing.errorMinDeposit)
    } else if (minDeposit < MIN_DEPOSIT) {      
      console.log("Error in validate")
      setIsValidated(false)
      setErrorMinDeposit(
        `${t.editListing.pricing.errorMinDepositAmountIs} $${MIN_DEPOSIT}${t.editListing.pricing.pleaseEnterAValue} $${MIN_DEPOSIT} ${t.editListing.pricing.orAbove}`
      )
    }
  }

  const handleChangeMinDeposit = (e) => {
    setMinDeposit(Math.max(+(`${Math.round(`${e.target.value  }e+2`)  }e-2`), 0))
  }

  const handleChangeMinTime = (e) => {
    setMinimumTime(Math.max(+(`${Math.round(`${e.target.value  }e+0`)  }e-0`), 0))
  }

  const handlePickMinDeposit = (event, newValue) => {
    setMinDeposit(newValue)
    setUnsavedChanges(true)
  }

  const handleChangeAmount = (perPeriodValue) => (e) => {
    const newValue = Math.max(+(`${Math.round(`${e.target.value  }e+2`)  }e-2`), 0)
    const updateAmount = pricingData.map((item) => {
      return item.perPeriod === perPeriodValue
        ? { ...item, amount: newValue }
        : item
    })
    setPricingData(updateAmount)
    setUnsavedChanges(true)
  }

  const handleOnFocusAmount = (specificItem) => {
    const updatedError = pricingData.map((item) => {
      return item.perPeriod === specificItem.perPeriod
        ? { ...item, errorMessageAmount: "" }
        : item
    })
    setPricingData(updatedError)
  }

  const handleSubmitPricing = () => {
    validate()
  }

  const renderHint = () => {
    switch (listingStartValue?.vesselType) {
      case "RENTAL":
        return (
          <div>
            <Hint
              content={
                <div>
                  <p>{t.editListing.pricing.hintEnsureRates}</p>
                  <ul>
                    <li>{t.editListing.pricing.fuelFees}</li>
                    <li>{t.editListing.pricing.cleaningFees}</li>
                    <li>{t.editListing.pricing.serviceFees}</li>
                    <li>{t.editListing.pricing.captainCrewFees}</li>
                  </ul>
                </div>
              }
            />
          </div>
        )
      case "CHARTER":
        return (
          <div>
            <div>
              <Hint
                content={
                  <div>
                    <p>{t.editListing.pricing.hintEnsureRates}</p>
                    <ul>
                      <li>{t.editListing.pricing.fuelFees}</li>
                      <li>{t.editListing.pricing.cleaningFees}</li>
                      <li>{t.editListing.pricing.serviceFees}</li>
                      <li>{t.editListing.pricing.captainCrewFees}</li>
                    </ul>
                  </div>
                }
              />
            </div>
            <Hint content={t.editListing.pricing.eachCharterListing} />
          </div>
        )
      default:
        return (
          <div>
            <Hint content={t.editListing.pricing.stayPricingHint} />            
          </div>
        )
    }
  }

  useEffect(() => {
    if (isValidated) {
      const putRequestBody = {
        vesselPricing: {
          currency,
          minimumDeposit: minDeposit,
          minimumHours: minimumTime,
          perHour: {
            amount: pricingData[0]?.amount
          //  minimumTime: minimumTime
          },
          perDay: {
            amount: pricingData[1].amount
          },
          perWeek: {
            amount: pricingData[2].amount
          }
        }
      }
      API()
        .put(
          `${listingStartValue.vesselType.toLowerCase()}s/${
            listingStartValue._id
          }`,
          putRequestBody,
          {
            headers: {
              authorization: `Bearer ${  token}`
            }
          }
        )
        .then((response) => {
          if ((response.status = 200)) {
            onSubmit(true)
            nextPage()
            console.log("response is ", response.data)
          }
        })
        .catch((e) => {
          console.log("Error is: ", e)
        })
    }
  }, [isValidated])

  useEffect(() => {
    setIsValidated(false)
    setErrorMinDeposit("")
    setErrorMinimumTime("")
    setUnsavedChanges(false)
    setMinDeposit(listingStartValue?.vesselPricing?.minimumDeposit || MIN_DEPOSIT)
    setMinimumTime(listingStartValue?.vesselPricing?.minimumHours|| "")   
    setPricingData([
      {
        perPeriod: `${t.editListing.pricing.per} ${t.editListing.pricing.hour}`,
        amount: listingStartValue?.vesselPricing?.perHour?.amount || "",
        errorMessageAmount: "",
        toolTipHint: t.editListing.pricing.toolTipPerHour
      },
      {
        perPeriod: `${t.editListing.pricing.per} ${t.editListing.pricing.day}`,
        amount: listingStartValue?.vesselPricing?.perDay?.amount || "",
        errorMessageAmount: "",
        toolTipHint: t.editListing.pricing.toolTipPerDay
      },
     {
        perPeriod: `${t.editListing.pricing.per} ${t.editListing.pricing.week}`,
        amount: listingStartValue?.vesselPricing?.perWeek?.amount || "",
        errorMessageAmount: "",
        toolTipHint: t.editListing.pricing.toolTipPerWeek
      }
    ])
  }, [listingStartValue])

  return (
    <>
      <Modal
        open={hintIsOpen}
        onClose={() => setHintIsOpen(false)}
        classNames={{
          modal: classes.hintModal
        }}
        center
        styles={{ height: "500px" }}
      >
        {listingStartValue?.vesselType === "RENTAL" && (
          <MobileHint
            closeOnScroll={false}
            content={[
              {
                hint: (
                  <div>
                    <p>{t.editListing.pricing.hintEnsureRates}</p>
                    <ul>
                      <li>{t.editListing.pricing.fuelFees}</li>
                      <li>{t.editListing.pricing.cleaningFees}</li>
                      <li>{t.editListing.pricing.serviceFees}</li>
                      <li>{t.editListing.pricing.captainCrewFees}</li>
                    </ul>
                  </div>
                )
              },
              {
                hint: t.editListing.pricing.minimumDepositHint,
                title: t.editListing.pricing.minimumDepositTitle,
                cancellation: true
              },
              {hint: t.editListing.pricing.required2List},
              {
                hint: (
                  <div>
                    <p>{t.editListing.pricing.wavezServiceFee}</p>
                    <ul>
                      <li>{t.editListing.pricing.ourFeeWillUniform}</li>
                      <li>{t.editListing.pricing.vesselOwnerFee}</li>
                      <li>{t.editListing.pricing.theseFeeExclude}</li>
                      <li>{t.editListing.pricing.noHiddenFees}</li>
                  </ul>
                  </div>
                )
              }
            ]}
            closeHint={() => setHintIsOpen(false)}
          />
        )}
        {listingStartValue?.vesselType === "CHARTER" && (
          <MobileHint
            closeOnScroll={false}
            content={[
              {
                hint: (
                  <div>
                    <p>{t.editListing.pricing.hintEnsureRates}</p>
                    <ul>
                      <li>{t.editListing.pricing.fuelFees}</li>
                      <li>{t.editListing.pricing.cleaningFees}</li>
                      <li>{t.editListing.pricing.serviceFees}</li>
                      <li>{t.editListing.pricing.captainCrewFees}</li>
                    </ul>
                  </div>
                )
              },
              { hint: t.editListing.pricing.eachCharterListing },
              {
                hint: t.editListing.pricing.minimumDepositHint,
                title: t.editListing.pricing.minimumDepositTitle,
                cancellation: true
              },
              {hint: t.editListing.pricing.required2List},
              {
                hint: (
                  <div>
                    <p>{t.editListing.pricing.wavezServiceFee}</p>
                    <ul>
                      <li>{t.editListing.pricing.ourFeeWillUniform}</li>
                      <li>{t.editListing.pricing.vesselOwnerFee}</li>
                      <li>{t.editListing.pricing.theseFeeExclude}</li>
                      <li>{t.editListing.pricing.noHiddenFees}</li>
                  </ul>
                  </div>
                )
              }
            ]}
            closeHint={() => setHintIsOpen(false)}
          />
        )}
        {listingStartValue?.vesselType === "STAY" && (
          <MobileHint
            closeOnScroll={false}
            content={[
              {
                hint: (
                  <div>
                    <p>{t.editListing.pricing.hintEnsureRates}</p>
                    <ul>
                      <li>{t.editListing.pricing.fuelFees}</li>
                      <li>{t.editListing.pricing.cleaningFees}</li>
                      <li>{t.editListing.pricing.serviceFees}</li>
                      <li>{t.editListing.pricing.captainCrewFees}</li>
                    </ul>
                  </div>
                )
              },
              { hint: t.editListing.pricing.stayPricingHint },
              {
                hint: t.editListing.pricing.minimumDepositHint,
                title: t.editListing.pricing.minimumDepositTitle,
                cancellation: true
              },
              {hint: t.editListing.pricing.required2List},
              {
                hint: (
                  <div>
                    <p>{t.editListing.pricing.wavezServiceFee}</p>
                    <ul>
                      <li>{t.editListing.pricing.ourFeeWillUniform}</li>
                      <li>{t.editListing.pricing.vesselOwnerFee}</li>
                      <li>{t.editListing.pricing.theseFeeExclude}</li>
                      <li>{t.editListing.pricing.noHiddenFees}</li>
                  </ul>
                  </div>
                )
              }
            ]}
            closeHint={() => setHintIsOpen(false)}
          />
        )}
      </Modal>
      <Grid container>
        <Grid container item xs={12} sm={6}>
          <Grid item xs={1} md={2} />
          <Grid
            item
            xs={11} // box align 10 > 11
            sm={10}
            md={10}
            classes={{ root: classes.containerRoot }}
          >
            <div className={classes.topPadding} />
            <Grid
              container
              item
              xs={12}
              style={{ display: "flex", marginTop: "50px" }}
            >
              <Grid item xs={1} sm={1} md={1}>
                <CustomTooltip title={t.editListing.pricing.toolTipMinHour} />{" "}
              </Grid>
              <Grid
                item
                xs={3}
                className={clsx(
                  classes.perPeriodStyle,
                  classes.minimumPeriodStyle
                )}
              >
               {t.editListing.pricing.minimumHour}
              </Grid>
              <Grid item xs={false} sm={5} md={6}>
                <TextField
                  onChange={handleChangeMinTime}
                  name='minimumTime'
                  value={minimumTime}
                  type='number'
                  variant='outlined'
                  onWheel={(e) => e.target.blur()}
                  onFocus={() => setErrorMinimumTime("")}
                  error={errorMinimumTime !== ""}
                  InputLabelProps={{
                    shrink: true
                  }}
                  inputProps={{
                    "data-testid": "minimumTime"
                  }}
                />
                {errorMinimumTime !== "" && (
                  <FormHelperText error>{errorMinimumTime}</FormHelperText>
                )}
              </Grid>
            </Grid>
            {pricingData.map((item) => (
                <div key={item?.perPeriod}>
                  <Grid
                    container
                    item
                    xs={12}
                    style={{ display: "flex", marginTop: "50px" }}
                  >
                    <Grid item xs={1} sm={1} md={1}>
                      <CustomTooltip title={item.toolTipHint} />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sm={3}
                      md={3}
                      className={clsx(
                        classes.perPeriodStyle,
                        classes.minimumPeriodStyle
                      )}
                    >
                      {item?.perPeriod}
                    </Grid>
                    <Grid item xs={false} sm={5} md={6}>
                      <OutlinedInput
                        classes={{ root: classes.amountInputRoot }}
                        inputProps={{
                          "data-testid": `amount_${item.perPeriod.replace(
                            / +/g,
                            ""
                          )}`
                        }}
                        type={"number"}
                        name='amount'
                        value={item.amount}
                        onWheel={(e) => e.target.blur()}
                        onChange={handleChangeAmount(item?.perPeriod)}
                        onFocus={() => handleOnFocusAmount(item)}
                        error={item.errorMessageAmount !== ""}
                        endAdornment={
                          <InputAdornment position='end'>
                            {currency}
                          </InputAdornment>
                        }
                        startAdornment={
                          <InputAdornment position='start'>$</InputAdornment>
                        }
                      />
                      {item.errorMessageAmount !== "" && (
                        <FormHelperText error>
                          {item.errorMessageAmount}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </div>
              ))}
            <Grid item xs={12} style={{ display: "flex", marginTop: "50px" }}>              
              <Grid className={classes.minDeposit}>
                {t.editListing.pricing.minimumSafetyDeposit}
              </Grid>
            </Grid>
            <CustomRangePicker
              pickValue={minDeposit || MIN_DEPOSIT}
              handlePickValue={handlePickMinDeposit}
            />
            <Grid className={classes.minMaxDisplay}>
              <b>${MIN_DEPOSIT}</b>
              <span style={{ float: "right" }}>
                <b>${MAX_DEPOSIT}</b>
              </span>
            </Grid>
            <OutlinedInput
              inputProps={{ "data-testid": "minDeposit" }}
              type={"number"}
              onChange={handleChangeMinDeposit}
              value={minDeposit}
              onWheel={(e) => e.target.blur()}
              style={{ width: "60%" }}
              endAdornment={<InputAdornment position='end'>CAD</InputAdornment>}
              startAdornment={
                <InputAdornment position='start'>$</InputAdornment>
              }
              onFocus={() => setErrorMinDeposit("")}
              error={errorMinDeposit !== ""}
            />
            {errorMinDeposit !== "" && (
              <FormHelperText error>{errorMinDeposit}</FormHelperText>
            )}
            <div marginbottom='200px' />
          </Grid>
        </Grid>
        {/* Hints */}
        <Grid
          container
          item
          xs={false}
          sm={6}
          className={classes.hintContainer}
        >
          <Grid item xs={false} sm={1} md={2} />
          <Grid item xs={false} sm={10} md={8} className={classes.hintBlue}>
            <div className={classes.hint}>{renderHint()}
            <Hint content={t.editListing.pricing.required2List} />
            <Hint
              title={t.editListing.pricing.minimumDepositTitle}
              content={t.editListing.pricing.minimumDepositHint}
              cancellation={true}
            />
            <Hint
              title={t.editListing.pricing.wavezServiceFee}
              content={
                <div>
                  <ul>
                    <li>{t.editListing.pricing.ourFeeWillUniform}</li>
                    <li>{t.editListing.pricing.vesselOwnerFee}</li>
                    <li>{t.editListing.pricing.theseFeeExclude}</li>
                    <li>{t.editListing.pricing.noHiddenFees}</li>
                  </ul>
                </div>}
            /></div>
          </Grid>
          <Grid item xs={1} md={2} />
        </Grid>
      </Grid>
      {/* Bottom Div Buttons */}
      <Grid container item xs={12} className={classes.bottomDiv}>
        <Grid item xs={1} sm={false} md={2} />
        <Grid item xs={10} sm={6} md={4} className={classes.saveDiv}>
          <Button
            onClick={() => getListingInfo()}
            style={{
              textTransform: "capitalize",
              backgroundColor: theme.palette.background.default,
              fontWeight: "400",
              fontSize: "18px",
              color: theme.palette.buttonPrimary.main,
              height: "60%",
              marginRight: 20
            }}
          >
            {t.reset}
          </Button>
          <Button
            variant='contained'
            onClick={handleSubmitPricing}
            style={{
              fontWeight: "400",
              textTransform: "capitalize",
              backgroundColor: theme.palette.buttonPrimary.main,
              color: theme.palette.background.default,
              fontSize: "18px",
              maxHeight: "50px",
              maxWidth: "250px",
              marginLeft: 20
            }}
            data-testid='saveBtn'
          >
            {t.saveContinue}
          </Button>
        </Grid>
      </Grid>
    </>
  )
}
