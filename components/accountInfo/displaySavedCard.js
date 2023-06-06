import {Button, Grid, makeStyles, Typography} from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import Session from '../../sessionService'
import {useRouter} from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import API from "../../pages/api/baseApiIinstance"
import Image from "next/image"
import {isEmptyArray} from "formik"
import DeleteWarningBox from "../../components/yourListing/deleteWarningBox"
import {Modal} from "react-responsive-modal"

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
        width: '250px',
        height: '50px',
        border: `1px solid ${  theme.palette.search.outline}`,
        marginBottom: '20px',
        borderRadius: '10px',
        alignItems: "center",
        justifyContent: "space-around",
        display: "flex"
    },
    modalStyle: {
        borderRadius: 10
    }
}))
export default function DisplaySavedCard() {
    const router = useRouter()
    const {locale} = router
    const t = locale === "en" ? en : fr
    const token = Session.getToken("WaveToken")
    const classes = useStyles()
    const [cardDetails, setCardDetails] = useState([])
    const [cardType, setCardType] = useState("")
    const [cardFourDigit, setCardFourDigit] = useState("")
    const [deleteId, setDeleteId] = useState("")
    //Delete
    const [deleteWarningBox, setDeleteWarningBox] = useState(false)

    useEffect(() => {
        const callSavedPaymentApi = () => {
            if (token !== "") {
                console.log("calling Get Saved Card Api")
                API()
                    .get("users/savedPaymentMethods", {
                        headers: {
                            authorization: `Bearer ${  token}`
                        }
                    })
                    .then((response) => {
                        setCardDetails(response.data)
                        setCardType(response.data?.paymentMethods[0]?.card.brand)
                        setCardFourDigit(response.data?.paymentMethods[0]?.card.last4)
                        setDeleteId(response.data?.paymentMethods[0]?.id)
                        console.log("card details", response.data)
                        console.log("card Id", response.data?.paymentMethods[0]?.id)
                        console.log("Four digit", cardFourDigit)
                        console.log("Delete Id", deleteId)
                    })
            }
        }
        // callSavedPaymentApi();

    }, [])
    const addPaymentClick = () => {
        {
            deleteId?.valueOf() ? window.alert("If you want to add a new credit card, please remove the existing one..") :
                token ? router.push("/accountInfo/payments/addPayment") : window.alert("Please Login")
        }
    }
//Delete
    const confirmDelete = (id) => {
        if (id  && id !== '') {
            API()
                .delete(`/users/paymentMethod/${id}`, {
                    headers: {
                        authorization: `Bearer ${  token}`
                    }
                })
                .then((response) => {
                    setDeleteWarningBox(false)
                    setCardDetails([])
                    setCardFourDigit("")
                    setDeleteId("")
                    router.reload()
                })
                .catch((error) => console.log(error))
        }
    }

    const handleDelete = () => {
        setDeleteWarningBox(true)
    }

    // useEffect(() => {
    //     if (deleteId && deleteId !== '') {
    //         confirmDelete();
    //     }
    // }, [deleteId])
    return (
        <>
            <Modal
                classNames={{modal: classes.modalStyle}}
                open={deleteWarningBox}
                onClose={() => setDeleteWarningBox(false)}
                center
            >
                <DeleteWarningBox
                    title={"this card"}
                    confirmDelete={() => confirmDelete(deleteId)}
                    cancelDelete={() => setDeleteWarningBox(false)}
                />
            </Modal>
            {/*Delete Model*/}


            <div className={classes.saved_card_div}>
                {(() => {
                    if (!isEmptyArray(cardDetails.paymentMethods)) {
                        if (cardType === "visa") {
                            return (
                                <>
                                    <Image src="/assets/images/image _visa.png" alt="logo" width={42}
                                           height={26}/>
                                    <Typography>{cardType} **** {cardFourDigit}</Typography>
                                </>)
                        }
                        if (cardType === "mastercard") {
                            return (
                                <>
                                    <Image src="/assets/images/image_master.png" alt="logo" width={42}
                                           height={26}/>
                                    <Typography>{cardType.substring(0, 6)} **** {cardFourDigit}</Typography>
                                </>
                            )
                        }
                        if (cardType === "amex") {
                            return (
                                <>
                                    <Image src="/assets/images/image _american.png" alt="logo" width={42}
                                           height={26}/>
                                    <Typography> {cardType} **** {cardFourDigit}</Typography>
                                </>
                            )
                        }
                        if (cardType !== "amex" && cardType !== "visa" && cardType !== "master") {
                            return (
                                <>
                                    <Typography> {cardType} **** {cardFourDigit}</Typography>
                                </>
                            )
                        }
                    } else {
                        return ``
                    }
                })()}
                {deleteId?.valueOf() ? <Button
                    className={classes.delete_button}
                    onClick={() => {
                        handleDelete(deleteId)
                    }}
                >
                    <Image className={classes.logo}
                           src="/assets/images/delete.png"
                           alt="logo"
                           width="9.33px"
                           height="12px"
                    />
                </Button> : ``}
            </div>
        </>
    )
}
