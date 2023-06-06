import {Button, Grid, makeStyles, Typography} from '@material-ui/core'
import React, {useState} from 'react'
import AccountInfoBanner from '../../../components/accountInfo/accountInfoBanner'
import Session from '../../../sessionService'
import {useRouter} from "next/router"
import en from "../../../locales/en.js"
import fr from "../../../locales/fr.js"
import {isEmptyArray} from "formik"
import theme from "../../../src/theme"
import DisplaySavedCard from "../../../components/accountInfo/displaySavedCard"
import AddPayoutBanner from "../../../components/accountInfo/addPayoutBanner"
import AddPayout from "../../../components/accountInfo/payout"

const useStyles = makeStyles((theme) => ({
    filler: {
        backgroundColor: theme.palette.background.lightGrey
    },
    content: {
        backgroundColor: theme.palette.background.default,
        borderLeft: `2px solid ${  theme.palette.background.lightGrey}`
    },
    delete_button: {},
    addSection: {
        padding: 30,
        fontSize: 16,
        borderBottom: `2px solid ${  theme.palette.background.lightGrey}`
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
        width: '100%',

        borderRadius: 10
    },
    button_div: {
        backgroundColor: theme.palette.background.default,

        margin: "auto",
        display: "flex",
        width: '100%',
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
        marginLeft: "auto",
        marginRight: "auto",
        color: theme.palette.background.default,
        '&:hover': {
            border: `2px solid ${  theme.palette.search.outline}`,
            fontSize: '19px',
            cursor: 'pointer'
        },
        [theme.breakpoints.down("xs")]: {
            width: '30%',
            height: '80%',
            marginLeft: "auto",
            marginRight: "auto"
        }
    }
}))

export default function Payments() {
    const router = useRouter()
    const {locale} = router
    const t = locale === "en" ? en : fr
    const token = Session.getToken("WaveToken")
    const classes = useStyles()

    const [deleteId, setDeleteId] = useState("")

    //Delete
    const [deleteWarningBox, setDeleteWarningBox] = useState(false)


    return (
        <>

            {/*Delete Model*/}
            {/*<Modal*/}
            {/*    classNames={{modal: classes.modalStyle}}*/}
            {/*    open={deleteWarningBox}*/}
            {/*    onClose={() => setDeleteWarningBox(false)}*/}
            {/*    center*/}
            {/*>*/}
            {/*    <DeleteWarningBox*/}
            {/*        title={"this card"}*/}
            {/*        confirmDelete={() => confirmDelete(deleteId)}*/}
            {/*        cancelDelete={() => setDeleteWarningBox(false)}*/}
            {/*    />*/}
            {/*</Modal>*/}
            {/*Delete Model*/}
            <AddPayoutBanner/>
            <Grid container style={{backgroundColor:theme.palette.background.whiteSmoke}}>
               <div style={{backgroundColor:"white", margin: "auto"}} >
                   <AddPayout/>
               </div>
                <div className={classes.button_div}>
                    <button className={classes.button}
                            onClick={(event) => {
                                //handleSubmit(event)
                            }}>{t.continue}
                    </button>
                </div>
            </Grid>
        </>
    )
}