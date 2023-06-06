import React, {useState, useMemo, useContext, useEffect } from 'react'
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

// i18n
import {useRouter} from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import {makeStyles} from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
    main_div: {},
    centerInput: {
        display: "grid",
        margin: "auto",
        gridTemplateColumns: 'auto auto',
        gap: "17em",
        width: "fit-content"
    },
    logo_div: {
        display: "grid",
        gap: '1em',
        height: '26px',
        gridTemplateColumns: '1fr 1fr 1fr'
    },
    logo: {},
    paper: {
        margin: 20,
        padding: 20,
        marginBottom: 10,
        paddingBottom: 50,
        justifyItems: "center",
        borderRadius: '10px',
        justifySelf: "center"
    },
button: {
        marginTop: '5px',
        backgroundColor:theme.palette.buttonPrimary.main,
        borderRadius: '4px',
        width: '182px',
        border: "none",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: '20px',
        lineHeight: '25px',
        letterSpacing: '0.2em',
        textTransform: 'capitalize',
        marginLeft:"auto",
        marginRight:"auto",
        color: theme.palette.background.default,
        '&:hover': {
            border: `2px solid ${theme.palette.search.outline}`,
            fontSize: '19px',
            cursor: 'pointer'
        },
            [theme.breakpoints.down("xs")]: {
                width: '30%',
                height: '80%',
                marginLeft:"auto",
                marginRight:"auto"
            }
        }

}))

export default function AddPaymentSave() {
    const classes = useStyles()
    const stripe = useStripe()
    const elements = useElements()
    const token = Session.getToken("WaveToken")
    const [clientSecret, setClientSecret] = useState("")
    const {globalState, globalDispatch} = useContext(Context)
    const router = useRouter()
    const {locale} = router
    const t = locale === 'en' ? en : fr

    //Calling client secret Api
    const clientSecretApiCaller = async () => {
        return API()
            .get("/users/createSavePaymentIntent",
                {
                    headers: {
                        authorization: `Bearer ${  token}`
                    }
                })
    }
    const handleSubmit = async (event) => {
       if (!globalState.nameOnCard) {
           window.alert(t.payment.nameReq)
       } else if (!globalState.cardNumberElement) {
       window.alert(t.payment.cardElement)
       } else if (!globalState.addressDetails.address) {
           window.alert(t.payment.addressReq)
       } else if (!globalState.addressDetails.city) {
           window.alert(t.payment.cityReq)
       } else if (!globalState.addressDetails.province) {
           window.alert(t.payment.provinceReq)
       } else if (!globalState.addressDetails.country) {
           window.alert(t.payment.countryReq)
       } else if (!globalState.addressDetails.postalCode) {
           window.alert(t.payment.postalCodeReq)
       } else {
            clientSecretApiCaller()
                .then(async (response) => {
                    console.log(response.config, "response")
                    console.log(response, "response")
                    if ((response.status = 200)) {
                        setClientSecret(response.data)
                        event.preventDefault()
                        if (!stripe || !elements) {
                            return
                        }
                        const result = await stripe.confirmCardSetup(response.data.client_secret, {
                            payment_method: {
                                //  card: elements.getElement(CardNumberElement),
                                card: elements.getElement(globalState.cardNumberElement.elementType),
                                billing_details: {
                                    name: globalState.nameOnCard,
                                    address: {
                                        city: globalState.addressDetails.city,
                                        line1: globalState.addressDetails.address,
                                        line2: globalState.addressDetails.address2,
                                        postal_code: globalState.addressDetails.postalCode,
                                        state: globalState.addressDetails.province
                                    }
                                }
                            }
                        })
                        if (result.error) {
                            window.alert(result.error.message)
                        } else {
                            await router.push("/accountInfo/payments")
                        }
                    }
                })
                .catch((err) => {
                    console.log("an error occurred while getting the configurations", err)
                })
        }
    }
    return (
        <button className={classes.button}
                onClick={(event) => {
                    handleSubmit(event).then(r => {})
                }}>{t.save}
        </button>
    )
}

