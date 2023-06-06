import React, { useState, useContext, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import PreDepartureContainer from "../../../components/trips/predepartureContainer"
import ReportConfirmation from '../../../components/trips/reportConfirmation'
import { Modal } from "react-responsive-modal"
import NavBar from '../../../components/navbar/navBar'
import ReviewModal from '../../../components/trips/reviewModal'
// i18n
import { useRouter } from 'next/router'
import en from '../../../locales/en.js'
import fr from '../../../locales/fr.js'

const useStyles = makeStyles((theme) => ({
    text: {
        fontSize: 24,
        marginBottom: "10px",
        [theme.breakpoints.down("xs")]: {
            fontSize: 16
        }
    },
    customModal: {
        padding: '41px',
        maxWidth: '616px',
        borderRadius: 10,
        width: "80%"
    },
    reviewModal: {
        maxWidth: '616px',
        borderRadius: 10,
        width: "80%"
    },
    reviewLink: {
        color: theme.palette.buttonPrimary.main,
        textDecoration: "underline",
        cursor: "pointer",
        fontSize: 24,
        marginBottom: "10px",
        [theme.breakpoints.down("xs")]: {
            fontSize: 16
        }
    }
}))

const Checklist = (props) => {
    const classes = useStyles()
    const router = useRouter()
    const { locale } = router
    const t = locale === 'en' ? en : fr
    const [reportSelected, setReportSelected] = useState(false)
    const [reviewOpen, setReviewOpen] = useState(false)

    return (
        <>
            <div />
            <Modal
                open={reportSelected}
                onClose={() => setReportSelected(false)}
                classNames={{
                    modal: classes.customModal
                }}
                center
            >
                <ReportConfirmation reportInfo={"POST_TRIP"} closeModal={() => setReportSelected(false)} />
            </Modal>
            <Modal
                open={reviewOpen}
                onClose={() => setReviewOpen(false)}
                classNames={{
                    modal: classes.reviewModal
                }}
                center
            >
                <ReviewModal closeModal={() => setReviewOpen(false)} />
            </Modal>
            <PreDepartureContainer isPreDeparture={false} header={t.postdepartureChecklist.header} imgSource={"/assets/images/undraw_Weather_re_qsmd_1.png"}
                onBackClick={() => { router.back() }}
                onNextClick={() => { router.push(`/trips/${  router.query?.id  }/endVerification`) }}
                onReportClick={() => { setReportSelected(true) }}
                onHintClick={() => { }}>
                <ul style={{ paddingLeft: "20px" }}>
                    <li className={classes.text}>{t.postdepartureChecklist.p1OwnerQ}</li>
                </ul>
                <p className={classes.text}>{t.postdepartureChecklist.p1OwnerA}</p>
                <ul style={{ paddingLeft: "20px" }}>
                    <li className={classes.text}>{t.postdepartureChecklist.p2OwnerQ}</li>
                </ul>
                <p className={classes.text}>{t.postdepartureChecklist.p2OwnerA}</p>
                <ul style={{ paddingLeft: "20px" }}>
                    <li className={classes.text}>{t.postdepartureChecklist.p3OwnerQ}</li>
                </ul>
                <p className={classes.text}>{t.postdepartureChecklist.p3OwnerA}</p>
                <p className={classes.text}>{t.postdepartureChecklist.p4OwnerQ}</p>
                <ul style={{ paddingLeft: "20px" }}>
                    <li className={classes.text}>{t.postdepartureChecklist.p4OwnerA}</li>
                </ul>               
            </PreDepartureContainer>
        </>
    )
}

export default Checklist
