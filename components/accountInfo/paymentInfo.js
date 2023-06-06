import React, {useState, useMemo, useContext, useEffect } from 'react'
import {loadStripe} from '@stripe/stripe-js'
import API from "../../pages/api/baseApiIinstance"
import Session from "../../sessionService"
import Context from "../../store/context"
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    CardElement,
    Elements
} from '@stripe/react-stripe-js'

import {Grid, Paper } from "@material-ui/core"
// i18n
import {useRouter} from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import {makeStyles} from "@material-ui/core/styles"
import Image from "next/image"
import theme from "../../src/theme"

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.STRIPE_SECRET_KEY)
const useStyles = makeStyles((theme) => ({
        main_div: {
            width: '95%',
            margin: "auto",
            [theme.breakpoints.down("sm")]: {
                width: '95%'
            },

            [theme.breakpoints.down("xs")]: {
                width: '95%'
            }
        },
        centerInput: {
            display: "grid",
            //margin: "auto",
            gridTemplateColumns: '35% 25%',
            //gap: "auto",
            justifyContent: "space-around",
            fontSize: '14px',
            alignItems: "center",
            width: "100%",
            [theme.breakpoints.down("sm")]: {
                fontSize: '11px',
                marginRight: "15px"
            },
            [theme.breakpoints.down("xs")]: {
                fontSize: '9px',
                gap: "4em"
            }
        },
        title_div: {},
        logo_div: {
            display: "flex",
            gap: '1em'
        },
        logo: {},
        paper: {
            margin: "auto",
            marginTop: '20px',
            marginBottom: '20px',
            width: "95%",
            paddingTop: '15px',
            border: `1px solid${  theme.palette.border.heather}`,
            paddingBottom: 50,
            justifyItems: "center",
            borderRadius: '10px',
            justifySelf: "center"
        },
        button_div: {
            backgroundColor: theme.palette.background.default,
            position: "absolute",
            top: '1300px',
            marginTop: '0px',
            display: "flex",
            width: '110%',
            height: '70px',
            justifyContent: "center",
            paddingTop: '5px',
            paddingBottom: '5px',
            border: `1px solid ${  theme.palette.search.outline}`
        },
        button: {
            marginTop: '5px',
            backgroundColor: theme.palette.buttonPrimary.main,
            borderRadius: '4px',
            width: '182px',
            border: "none",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: '20px',
            lineHeight: '25px',
            letterSpacing: '0.2em',
            textTransform: 'capitalize',
            color: theme.palette.background.default
        },
        expire_cvc_div: {}
    }))

const useOptions = () => {

    const options = useMemo(
        () => ({
            style: {
                base: {
                    color: theme.palette.paymentInfo.optionBase,
                    letterSpacing: "0.025em",
                    fontFamily: "Source Code Pro, monospace",
                    "::placeholder": {
                        color: theme.palette.paymentInfo.placeholder
                    }
                },
                invalid: {
                    color: theme.palette.paymentInfo.optionInvalid
                }
            }
        }),
        []
    )
    return options
}
export default function PaymentInfo() {
    const classes = useStyles()
    const [cardNumberElement, setCardNumberElement] = useState()
    const {globalState, globalDispatch} = useContext(Context)
    console.log(globalState, "globalState")
    const router = useRouter()
    const {locale} = router
    const options = useOptions()
    const [nameOnCard, setNameOnCard] = useState("")
    const [CardNoElement, setCardNoElement] = useState("")
    // const [nameOnCard, setNameOnCard] = useState("")
    const t = locale === 'en' ? en : fr

    useEffect(() => {
        globalDispatch({type: "SET_CARD_NUMBER_ELEMENT", payload: cardNumberElement})
        globalDispatch({type: "SET_NAME_ON_CARD", payload: nameOnCard})
    }, [cardNumberElement, nameOnCard])

    return (
      <div className={classes.main_div}>
        <div variant="outlined" className={classes.paper}>
          <div className={classes.centerInput}>
            <div className={classes.title_div}>
              <h3>{t.payment.paymentInfo}</h3>
            </div>
            <div className={classes.logo_div}>
              <Image
                className={classes.logo}
                src="/assets/images/image _visa.png"
                alt="logo"
                width={42}
                height={26}
              />
              <Image
                src="/assets/images/image_master.png"
                alt="logo"
                width={42}
                height={26}
              />
              <Image
                src="/assets/images/image _american.png"
                alt="logo"
                width={42}
                height={26}
              />
            </div>
          </div>
          <label className={'StripeElement_Label'}>
            {' '}
            {t.payment.nameOnCard}
          </label>
          <input
            className={'StripeElement'}
            onChange={(event) => setNameOnCard(event.target.value)}
          />
          <label className={'StripeElement_Label'}>
            {' '}
            {t.payment.cardNumber}{' '}
          </label>
         
          <CardNumberElement
            options={options}
            onReady={() => {
              console.log('CardNumberElement [ready]')
            }}
            onChange={(event) => {
              const value = event.target.value
              console.log('CardNumberElement [change]', event)
              globalDispatch({
                type: 'SET_CARD_NUMBER_ELEMENT',
                payload: event
              })
            }}
            onBlur={() => {
              console.log('CardNumberElement [blur]')
            }}
            onFocus={() => {
              console.log('CardNumberElement [focus]')
            }}
          />
          <div className={classes.expire_cvc_div}>
            <label className={'StripeElement_Label'}>
              {' '}
              {t.payment.expirationDate}{' '}
            </label>
            <CardExpiryElement
              options={options}
              onReady={() => {
                console.log('CardNumberElement [ready]')
              }}
              onChange={(event) => {
                console.log('CardNumberElement [change]', event)
              }}
              onBlur={() => {
                console.log('CardNumberElement [blur]')
              }}
              onFocus={() => {
                console.log('CardNumberElement [focus]')
              }}
            />
            <label className={'StripeElement_Label'}>{t.payment.cvc} </label>
            <CardCvcElement
              options={options}
              onReady={() => {
                console.log('CardNumberElement [ready]')
              }}
              onChange={(event) => {
                console.log('CardNumberElement [change]', event)
              }}
              onBlur={() => {
                console.log('CardNumberElement [blur]')
              }}
              onFocus={() => {
                console.log('CardNumberElement [focus]')
              }}
            />
          </div>
        </div>
      </div>
    )
}

