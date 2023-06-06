import React, { useState, useContext, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import PreDepartureContainer from "../../../../components/trips/predepartureContainer"
import ReportConfirmation from '../../../../components/trips/reportConfirmation'
import { Modal } from "react-responsive-modal"
import NavBar from '../../../../components/navbar/navBar'
// i18n
import { useRouter } from 'next/router'
import en from '../../../../locales/en.js'
import fr from '../../../../locales/fr.js'

const useStyles = makeStyles((theme) => ({
    text: {
        fontSize: 24,
        marginBottom: "10px",
        [theme.breakpoints.down("xs")]: {
            fontSize: 16
        }
    },
    list: {
        paddingLeft: "20px"
    },
    subList: {
        marginLeft: "40px"
    },
    customModal: {
        padding: '41px',
        maxWidth: '616px',
        borderRadius: 10
    }
}))

const checkDocumentation = (props) => {
    const classes = useStyles()
    const router = useRouter()
    const { locale } = router
    const t = locale === 'en' ? en : fr
    const [reportSelected, setReportSelected] = useState(false)

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
                <ReportConfirmation reportInfo={"CHECK_DOCUMENTATION"} closeModal={() => setReportSelected(false)} />
            </Modal>
            <PreDepartureContainer header={t.predepartureChecklist.docs.header} imgSource={"/assets/images/check_documentation.png"}
                onBackClick={() => { router.back() }}
                onNextClick={() => { router.push(`/trips/${  router.query?.id  }/startVerification`) }}
                onReportClick={() => setReportSelected(true)}
                onHintClick={() => { }}>
                <ul className={classes.list}>
                    <li className={classes.text}>{t.predepartureChecklist.docs.p1}</li>
                </ul>
                <div className={classes.subList}>
                    <p className={classes.text}>{t.predepartureChecklist.docs.p2}</p>
                    <p className={classes.text}>{t.predepartureChecklist.docs.p3}</p>
                    <p className={classes.text}>{t.predepartureChecklist.docs.p4}</p>
                    <p className={classes.text}>{t.predepartureChecklist.docs.p5}</p>
                    <p className={classes.text}>{t.predepartureChecklist.docs.p6}</p>
                </div>
                <ul className={classes.list}>
                    <li className={classes.text}>{t.predepartureChecklist.docs.p7}</li>
                </ul>
            </PreDepartureContainer>
        </>
    )
}

export default checkDocumentation
