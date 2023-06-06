import React, {useState, useContext, useEffect} from 'react'
import {makeStyles} from "@material-ui/core/styles"
import {
    Select,
    Button,
    Grid,
    Paper,
    TextField,
    Typography,
    CardContent,
    FormControl,
    Card,
    InputLabel,
    MenuItem
} from "@material-ui/core"
// i18n
import {useRouter} from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import Context from "../../store/context"
import AddPayoutBanner from "./addPayoutBanner"
import AddPaymentSave from "./addpaymentSave"

const useStyles = makeStyles((theme) => ({
    main_div: {
        width: '1128px',
        margin: "auto",
        [theme.breakpoints.down("sm")]: {
            width: '95%'
        },

        [theme.breakpoints.down("xs")]: {
            width: '95%'
        }
    },

    centerInput: {
        width: '65%',
        margin: "auto",

        marginTop: '20px',
        textAlign: "center",
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: {
            fontSize: '11px',
            margin:"auto"
        },
        [theme.breakpoints.down("xs")]: {
            fontSize: '9px',
            margin:"auto",
            marginBottom:"10px"
        }
    },
    paper: {
        margin: "auto",
        marginTop: '20px',
        paddingTop: '15px',
        marginBottom: '20px',
        width: "928px",
        [theme.breakpoints.down("xs")]: {
            width: '95%'
        },
        border: `1px solid${  theme.palette.border.heather}`,
        paddingBottom: 50,
        justifyItems: "center",
        borderRadius: '4px',
        justifySelf: "center"
    }

}))
export default function Payout() {

    const classes = useStyles()
    const router = useRouter()
    const {locale} = router
    const t = locale === 'en' ? en : fr
    const [firstName, setFirstName] = useState("")
    const [middleName, setMiddleName] = useState("")
    const [lastName, setLastName] = useState("")
    const [country, setCountry] = useState("")
    const [province, setProvince] = useState("")
    const [routingNumber, setRoutingNumber] = useState("")
    const [accountType, setAccountType] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const {globalState, globalDispatch} = useContext(Context)
    const bankAccountDetails = {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        country,
        province,
        routing_number: routingNumber,
        account_type: accountType,
        account_number: accountNumber
    }

    useEffect(() => {
        globalDispatch({type: "SET_PAY_OUT_BANK", payload: bankAccountDetails})

    }, [firstName, middleName, lastName, country, province, routingNumber, accountType, accountNumber])

    return (
        <>
            <div className={classes.main_div}>
                <div variant='outlined' className={classes.paper}>
                    <div className={classes.centerInput}>
                        <div>
                            <Typography>
                                Bank Account Details
                            </Typography>
                        </div>
                        <div>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                            </Typography>
                        </div>

                    </div>
                    <label className={"StripeElement_Label"}> First Name </label>
                    <input style={{width: '85%'}} className={'StripeElement'}
                           label='First Name'
                           type='text'
                           variant='outlined'
                           name='firstName'
                           value={firstName}
                           onChange={(event) => setFirstName(event.target.value)}
                    />

                    <label className={"StripeElement_Label"}> Middle Name </label>
                    <input style={{width: '85%'}} className={'StripeElement'}
                           label='Middle Name'
                           type='text'
                           variant='outlined'
                           name='middleName'
                           value={middleName}
                           onChange={(event) => setMiddleName(event.target.value)}
                    />
                    <label className={"StripeElement_Label"}> Last Name </label>
                    <input style={{width: '85%'}} className={'StripeElement'}
                           label='Middle Name'
                           type='text'
                           variant='outlined'
                           name='middleName'
                           value={middleName}
                           onChange={(event) => setLastName(event.target.value)}
                    />
                    <label className={"StripeElement_Label"}> Country </label>
                    <input style={{width: '85%'}} className={'StripeElement'}
                           label='Country'
                           type='text'
                           variant='outlined'
                           name='country'
                           value={country}
                           onChange={(event) => setCountry(event.target.value)}
                    />
                    <label className={"StripeElement_Label"}> Province </label>
                    <input style={{width: '85%'}} className={'StripeElement'}
                           label='Province'
                           type='text'
                           variant='outlined'
                           name='province'
                           value={province}
                           onChange={(event) => setProvince(event.target.value)}
                    />
                    <label className={"StripeElement_Label"}> Routing Number </label>
                    <input style={{width: '85%'}} className={'StripeElement'}
                           label='Routing Number'
                           type='text'
                           variant='outlined'
                           name='routingNumber'
                           value={routingNumber}
                           onChange={(event) => setRoutingNumber(event.target.value)}
                    />

                    <label className={"StripeElement_Label"}> Account Type </label>
                    <input style={{width: '85%'}} className={'StripeElement'}
                           label='Account Type'
                           type='text'
                           variant='outlined'
                           name='Account Type'
                           value={accountType}
                           onChange={(event) => setAccountType(event.target.value)}
                    />

                    <label className={"StripeElement_Label"}> Account Number </label>
                    <input style={{width: '85%'}} className={'StripeElement'}
                           label='Account Number'
                           type='text'
                           variant='outlined'
                           name='Account Number'
                           value={accountNumber}
                           onChange={(event) => setAccountNumber(event.target.value)}
                    />
                </div>
            </div>
        </>
    )
}
