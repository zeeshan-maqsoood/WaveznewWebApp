import React, {useState, useMemo, useContext, useEffect, forwardRef, useImperativeHandle } from 'react'
import API from "../../pages/api/baseApiIinstance"
import Session from "../../sessionService"
import Context from "../../store/context"
import {
    useStripe,
    useElements
} from '@stripe/react-stripe-js'

// i18n
import {useRouter} from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"

const BookAddPaymentSave = forwardRef((props, ref) => {
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
    const handlePaymentMethodSubmit = async (savePaymentMethod) => {
        return new Promise(async (resolve, reject) => {
            if (!globalState.nameOnCard || !globalState.cardNumberElement ||
                !globalState.addressDetails.address || !globalState.addressDetails.city ||
                !globalState.addressDetails.province || !globalState.addressDetails.country
                || !globalState.addressDetails.postalCode
            ) {
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
                }
                resolve()
            } else {
                // if (savePaymentMethod) {
                    clientSecretApiCaller()
                        .then(async (response) => {
                            if ((response.status = 200)) {
                                setClientSecret(response.data)
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
                                    reject(result.error)
                                    window.alert(result.error.message)
                                } else {
                                    resolve(result)
                                    // await router.push("/accountInfo/payments")
                                }
                            }
                        })
                        .catch((err) => {
                            reject(err)
                            console.log("an error occurred while getting the client secret", err)
                        })
                // } else {
                    // const token = await stripe.createToken(elements.getElement(globalState.cardNumberElement.elementType), {
                    //     name: globalState.nameOnCard,
                    //     address_line1: globalState.addressDetails.address,
                    //     address_line2: globalState.addressDetails.address2,
                    //     address_city: globalState.addressDetails.city,
                    //     address_state: globalState.addressDetails.province
                    // });
                    // if (token?.error) {
                    //     resolve();
                    //     window.alert(token.error.message)
                    // } else {
                    //     resolve(token);
                    // }
                // }
            }
        })
    }

    useImperativeHandle(
        ref,
        () => ({
            handlePaymentMethodSubmit
        })
    )
    return (
        <></>
    )
})

export default BookAddPaymentSave
