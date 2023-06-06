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
import PropTypes from 'prop-types'
import DeleteIcon from "@material-ui/icons/Delete"

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
        display: "flex",
        "&:hover": {
            border: `1px solid ${  theme.palette.background.deepSkyBlue}`
        },
        cursor: "pointer"
    },
    modalStyle: {
        borderRadius: 10
    }
}))
export default function SavedCard(props) {
    const { cardId, cardType, cardFourDigit, onDeleteConfirm } = props
    const router = useRouter()
    const classes = useStyles()
    //Delete
    const [deleteWarningBox, setDeleteWarningBox] = useState(false)

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
                    confirmDelete={() => onDeleteConfirm(cardId)}
                    cancelDelete={() => setDeleteWarningBox(false)}
                />
            </Modal>
            {/*Delete Model*/}


            <div className={classes.saved_card_div}>
                {(() => {
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
                })()}
                <Button
                    className={classes.delete_button}
                    onClick={() => {
                        setDeleteWarningBox(true)
                    }}
                >
                    <DeleteIcon style={{color: "red"}}/>
                </Button>
            </div>
        </>
    )
}

SavedCard.protoTypes = {
    cardType: PropTypes.string.isRequired,
    cardFourDigit: PropTypes.number.isRequired,
    cardId: PropTypes.any.isRequired,
    onDeleteConfirm: PropTypes.func.isRequired
}
