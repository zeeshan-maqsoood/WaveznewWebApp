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
import {useFormik} from "formik"

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
    inputField: {
        minWidth: "15vw"
    },
    centerInput: {
        display: "grid",
        margin: "auto",
        gridTemplateColumns: 'auto',
        gap: "17em",
        width: "fit-content",
        [theme.breakpoints.down("sm")]: {
            fontSize: '11px'
        },
        [theme.breakpoints.down("xs")]: {
            fontSize: '9px',
            gap: "4em"
        }
    },
    paper: {
        margin: "auto",
        marginTop:'20px',
        paddingTop:'15px',
        marginBottom:'20px',
        width: "95%",
        border: `1px solid${  theme.palette.border.heather}`,
        paddingBottom: 50,
        justifyItems: "center",
        borderRadius: '10px',
        justifySelf: "center"
    },
    clear_btn: {
        backgroundColor: theme.palette.buttonPrimary.main,
        color: theme.palette.background.default,
        justifyContent: "center",
        "&:hover": {
            backgroundColor: theme.palette.buttonPrimary.main
        }
    }
}))
export default function BillingAddress() {

    const classes = useStyles()
    const router = useRouter()
    const {locale} = router
    const t = locale === 'en' ? en : fr
    const [address, setAddress] = useState("")
    const [address2, setAddress2] = useState("")
    const [apartment, setApartment] = useState("")
    const [city, setCity] = useState("")
    const [country, setCountry] = useState("")
    const [province, setProvince] = useState("")
    const [postalCode, setPostalCode] = useState("")
    const {globalState, globalDispatch} = useContext(Context)
    const addressDetails = {
        address,
        address2,
        apartment,
        city,
        country,
        province,
        postalCode
    }

    useEffect(() => {
        globalDispatch({type: "SET_ADDRESS_DETAILS", payload: addressDetails})
        console.log('globalState.addressDetails', globalState.addressDetails)
        console.log('addressDetails', addressDetails)
    }, [address, address2, city, apartment, country, postalCode, province])

    const clear = () => {
        setAddress("")
        setAddress2("")
        setApartment("")
        setCity("")
        setCountry("")
        setProvince("")
        setPostalCode("")
        globalDispatch({type: "SET_ADDRESS_DETAILS", payload: ""})
    }
    return (
        <>
           <div className={classes.main_div}>
               <div variant='outlined' className={classes.paper}>
                   <Grid item xs={12} className={classes.centerInput}>
                       <h3>{t.payment.billingAddress}</h3>
                   </Grid>
                   <label className={"StripeElement_Label"} > {t.payment.address} </label>
                   <input  className={'StripeElement'}
                          label='Address'
                          type='text'
                          variant='outlined'
                          name='address'
                          value={address}
                          onChange={(event) => setAddress(event.target.value)}
                   />
                   {/*{!address?<div style={{background:"red"}} className={"StripeElement"} >Required</div>:""}*/}
                   <label className={"StripeElement_Label"} > {t.payment.address2} </label>
                   <input  className={'StripeElement'}
                          label='Address 2 (optional)'
                          type='text'
                          variant='outlined'
                          name='address2'
                          value={address2}
                          onChange={(event) => setAddress2(event.target.value)}
                   />
                   <label className={"StripeElement_Label"} > {t.payment.apartment} </label>
                   <input className={'StripeElement'}
                          label='Apartment, suite, etc (optional)'
                          type='text'
                          variant='outlined'
                          name='apartment'
                          value={apartment}
                          onChange={(event) => setApartment(event.target.value)}
                   />
                   <label className={"StripeElement_Label"}  > {t.payment.city} </label>
                   <input  className={'StripeElement'}
                          label='City'
                          type='text'
                          variant='outlined'
                          name='city'
                          value={city}
                          onChange={(event) => setCity(event.target.value)}
                   />

                   <label className={"StripeElement_Label"}  > {t.payment.country}</label>
                   <input  className={'StripeElement'}
                          label='Country'
                          type='text'
                          variant='outlined'
                          name='country'
                          value={country}
                          onChange={(event) => setCountry(event.target.value)}
                   />
                   <label className={"StripeElement_Label"}  > {t.payment.province} </label>
                   <input  className={'StripeElement'}
                          label='Province'
                          type='text'
                          variant='outlined'
                          name='province'
                          value={province}
                          onChange={(event) => setProvince(event.target.value)}
                   />
                   <label className={"StripeElement_Label"}  > {t.payment.postalCode} </label>
                   <input  className={'StripeElement'}
                          label='Postal/Zip Code'
                          type='text'
                          variant='outlined'
                          name='postalCode'
                          value={postalCode}
                          onChange={(event) => setPostalCode(event.target.value)}
                   />
                 {/*  {!postalCode?<div style={{background:"red"}} className={"StripeElement"} >Required</div>:``}*/}
               </div>
           </div>
        </>
    )
}
