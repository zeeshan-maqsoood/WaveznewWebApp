import {Button, Grid, makeStyles, Typography} from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import AccountInfoTabs from '../../../components/accountInfo/accountInfoTabs'
import NavBar from '../../../components/navbar/navBar'
import Session from '../../../sessionService'
import {useRouter} from "next/router"
import en from "../../../locales/en.js"
import fr from "../../../locales/fr.js"
import API from "../../api/baseApiIinstance"
import theme from "../../../src/theme"
import DisplaySavedCard from "../../../components/accountInfo/displaySavedCard"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import SavedCard from "../../../components/shared/savedCard"

const useStyles = makeStyles((theme) => ({
    filler: {
        backgroundColor: theme.palette.background.lightGrey
    },
    content: {
        backgroundColor: theme.palette.background.default,
        borderLeft: `2px solid ${theme.palette.background.lightGrey}`
    },
    delete_button: {},
    addSection: {
        padding: 30,
        fontSize: 16,
        borderBottom: `2px solid ${theme.palette.background.lightGrey}`
    },
    saved_card_div: {
        width: 'fit-content',
        border: `1px solid ${  theme.palette.search.outline}`,
        marginBottom: '20px',
        borderRadius: '10px',
        alignItems: "center",
        justifyContent: "space-around"
    },
    modalStyle: {
        width:'100%',

        borderRadius: 10
    }
}))

export default function Payments() {
    const router = useRouter()
    const {locale} = router
    const t = locale === "en" ? en : fr
    const token = Session.getToken("WaveToken")
    const classes = useStyles()
    //Delete
    const [deleteWarningBox, setDeleteWarningBox] = useState(false)
    const [payoutMethods, setPayoutMethods] = useState([])
    const [paymentMethods, setPaymentMethods] = useState([])


    useEffect(() => {
        if (token && token !== "") {
            callGetSavedPaymentApi()
            callGetSavedPayoutApi()
        }
    }, [])
    const addPaymentClick = () => {
        {
            paymentMethods?.length !== 0 ? window.alert(t.payment.cardExist) :
                (token ? router.push("/accountInfo/payments/addPayment") : window.alert(t.payment.pleaseLogin))
        }
    }

    const callGetSavedPaymentApi = () => {
        if (token && token !== "") {
            console.log("calling Get Saved Card Api")
            API()
                .get("users/savedPaymentMethods", {
                    headers: {
                        authorization: `Bearer ${  token}`
                    }
                })
                .then((response) => {
                    setPaymentMethods(response.data.paymentMethods)
                })
        }
    }

    const callGetSavedPayoutApi = () => {
        if (token && token !== "") {
            API()
                .get("users/getPayoutMethods", {
                    headers: {
                        authorization: `Bearer ${  token}`
                    }
                })
                .then((response) => {
                    console.log("payout methods", response.data)
                    setPayoutMethods(response.data.payoutMethods)
                })
        }
    }

//Delete

    const confirmDelete = (id) => {
        if (id && id !== '') {
            API()
                .delete(`/users/paymentMethod/${id}`, {
                    headers: {
                        authorization: `Bearer ${  token}`
                    }
                })
                .then((response) => {
                    setDeleteWarningBox(false)
                    callGetSavedPaymentApi()
                })
                .catch((error) => console.log(error))
        }
    }

    const createAddPayoutMethodLink = () => {
        if (token && token !== '') {
            API()
                .post(`/users/AddNewPayoutMethod`, null, {
                    headers: {
                        authorization: `Bearer ${  token}`
                    }
                })
                .then((response) => {
                    if (response.data?.connectOnBoardingUrl) {
                        if (window) {
                            window.location.href = response.data?.connectOnBoardingUrl
                        }
                    }
                })
                .catch((error) => console.log(error))
        }
    }

    const handleDelete = () => {
        setDeleteWarningBox(true)
    }

    const handleModifyPaymentMethod = () => {
        // call the api and generate the stripe dashboard link editing payout method
        API()
            .get(`/users/generateStripeDashboardLink`, {
                headers: {
                    authorization: `Bearer ${  token}`
                }
            })
            .then((response) => {
                if (response.data?.stripeDashboardUrl) {
                    if (window) {
                        window.location.href = `${response.data?.stripeDashboardUrl}#/account`
                    }
                }
            })
            .catch((error) => console.log(error))
    }
    return (
        <>
            <NavBar/>

            <Grid container>
                <Grid item xs={false} lg={2} className={classes.filler}/>
                <Grid item xs={3} lg={2}>
                    <AccountInfoTabs currentTab={2}/>
                </Grid>
                <Grid item xs={9} lg={6} className={classes.content}>
                    <div className={classes.addSection}>
                        <Typography style={{fontWeight: 700, marginBottom: 20 }}>{t.payment.paymentMethods}</Typography>
                        <Typography style={{fontSize: 15}}>{t.payment.guestPaymentTerm}</Typography>
                        <Typography style={{marginBottom: 40, fontSize: 15}}>{t.payment.pleaseReview}</Typography>
                        {/*Saved card*/}

                        {
                            paymentMethods?.map((payMethod, index) => (
                                <SavedCard key={index} cardId={payMethod.id} cardType={payMethod.card.brand} cardFourDigit={payMethod.card.last4} onDeleteConfirm={confirmDelete} />
                            ))
                        }
                        <Button
                            onClick={addPaymentClick}
                            data-testid="addPaymentBtn"
                            style={{
                                fontWeight: "400",
                                textTransform: "capitalize",
                                backgroundColor: theme.palette.buttonPrimary.main,
                                color: theme.palette.background.default,
                                fontSize: 16,
                                paddingLeft: 20,
                                paddingRight: 20
                            }}>
                            {t.payment.addPaymentMethod}
                        </Button>
                        <br/>
                    </div>
                    <div className={classes.addSection}>
                        <Typography style={{fontWeight: 700, marginBottom: 20 }}>{t.payment.payoutMethods}</Typography>
                        <Typography style={{fontSize: 15}}>{t.payment.vesselOwnerPayoutTerm}</Typography>
                        <Typography style={{marginBottom: 40, fontSize: 15}}>{t.payment.pleaseReview}</Typography>
                        {payoutMethods?.length !== 0 ? (
                            <>
                                {payoutMethods.map((method, index) => (
                                    <div key={index} className={classes.saved_card_div}>
                                        <div style={{marginLeft: "1em", padding: "5px 2px"}}> {method.bank_name}
                                            <span style={{textTransform: "uppercase", border: `1px solid ${  theme.palette.search.outline}`, borderRadius: "5px", marginLeft: "5px", padding: "2px", backgroundColor: theme.palette.background.lightGrey}}>
                                                {method.currency}
                                            </span>
                                        </div>
                                        <div style={{marginLeft: "1em", padding: "0 2px 12px 2px"}}> {method.routing_number} **** {method.last4}
                                            <EditIcon
                                                style={{
                                                    marginRight: "0.5rem",
                                                    marginLeft: "3rem",
                                                    cursor: "pointer",
                                                    zIndex: 3
                                                }}
                                                onClick={() => handleModifyPaymentMethod()}
                                            />
                                            <DeleteIcon
                                                onClick={() => handleModifyPaymentMethod()}
                                                style={{zIndex: 3, cursor: "pointer", color: "#FF0000",  marginLeft: "0.2rem"}}/>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <Button
                                onClick={() => {
                                    createAddPayoutMethodLink()
                                }}
                                data-testid="addPayoutBtn"
                                style={{
                                    fontWeight: "400",
                                    textTransform: "capitalize",
                                    backgroundColor: theme.palette.buttonPrimary.main,
                                    color: theme.palette.background.default,
                                    fontSize: 16,
                                    paddingLeft: 20,
                                    paddingRight: 20
                                }}>
                                {t.payment.addPayoutMethod}
                            </Button>
                        )}
                        <br/>
                    </div>
                </Grid>
                <Grid item xs={false} lg={2} className={classes.filler}/>
            </Grid>
        </>
    )
}
