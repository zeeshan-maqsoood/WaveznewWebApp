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
    customModal: {
        padding: '41px',
        maxWidth: '616px',
        borderRadius: 10
    }
}))

const watercraftCondition = (props) => {
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
                <ReportConfirmation reportInfo={"WATERCRAFT_CONDITIONS"} closeModal={() => setReportSelected(false)} />
            </Modal>
            <PreDepartureContainer header={t.predepartureChecklist.condition.header} imgSource={"/assets/images/undraw_Yacht_re_kkai_1.png"}
                onBackClick={() => { router.back() }}
                onNextClick={() => { router.push(`/trips/${  router.query?.id  }/predepartureChecklist/equipment`) }}
                onReportClick={() => { setReportSelected(true) }}
                onHintClick={() => { }}>
                <ul className={classes.list}>
                    <li className={classes.text}>{t.predepartureChecklist.condition.p1}</li>
                    <li className={classes.text}>{t.predepartureChecklist.condition.p2}</li>
                    <li className={classes.text}>{t.predepartureChecklist.condition.p3}</li>
                    <li className={classes.text}>{t.predepartureChecklist.condition.p4}</li>
                    <li className={classes.text}>{t.predepartureChecklist.condition.p5}</li>
                    <li className={classes.text}>{t.predepartureChecklist.condition.p6}</li>
                    <li className={classes.text}>{t.predepartureChecklist.condition.p7}</li>
                </ul>
            </PreDepartureContainer>
        </>
    )
}

export default watercraftCondition
