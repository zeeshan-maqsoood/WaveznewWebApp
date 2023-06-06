import React from "react"
import PaymentInfo from "../../../components/accountInfo/paymentInfo"
import BillingAddress from "../../../components/accountInfo/billingAddress"
import AccountInfoBanner from "../../../components/accountInfo/addPaymentBanner"
import {Elements} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js'
import AddPaymentSave from "../../../components/accountInfo/addpaymentSave"
import {makeStyles} from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
    payment_div:{
        margin:"auto",
        width:'650px',
        [theme.breakpoints.down("xs")]: {
            width:'100%'
        }
    },
    button_div: {
        backgroundColor: theme.palette.background.default,
        position: "absolute",
        display: "flex",
        width: '110%',
        height: '70px',
        justifyContent: "center",
        paddingTop: '5px',
        paddingBottom: '5px',
        border:  `1px solid ${theme.palette.search.outline}`
    }

}))
const stripePromise = loadStripe(process.env.STRIPE_SECRET_KEY)
export default function addPayment() {
    const classes = useStyles()
    return (
        <div>
            <AccountInfoBanner/>
            <Elements stripe={stripePromise}>
               <div className={classes.payment_div} >
                   <PaymentInfo/>
                   <BillingAddress/>
               </div>
                <div className={classes.button_div}>
                <AddPaymentSave/>
                </div>
            </Elements>
        </div>
    )
}
