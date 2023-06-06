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

const equipment = (props) => {
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
                <ReportConfirmation reportInfo={"EQUIPMENT"} closeModal={() => setReportSelected(false)} />
            </Modal>
            <PreDepartureContainer header={t.predepartureChecklist.equipment.header} imgSource={"/assets/images/equipment_checklist.png"}
                onBackClick={() => { router.back() }}
                onNextClick={() => { router.push(`/trips/${  router.query?.id  }/predepartureChecklist/generalPreparations`) }}
                onReportClick={() => { setReportSelected(true) }}
                onHintClick={() => { }}>
                <ul className={classes.list}>
                    <li className={classes.text}>{t.predepartureChecklist.equipment.p1}</li>
                    <li className={classes.text}>{t.predepartureChecklist.equipment.p2}</li>
                </ul>
                <div className={classes.subList}>
                    <p className={classes.text}>{t.predepartureChecklist.equipment.p3}</p>
                    <p className={classes.text}>{t.predepartureChecklist.equipment.p4}</p>
                    <p className={classes.text}>{t.predepartureChecklist.equipment.p5}</p>
                </div>
                <ul className={classes.list}>
                    <li className={classes.text}>{t.predepartureChecklist.equipment.p6}</li>
                    <li className={classes.text}>{t.predepartureChecklist.equipment.p7}</li>
                </ul>
                <div className={classes.subList}>
                    <p className={classes.text}>
                        {t.predepartureChecklist.equipment.p8}<br />
                        {t.predepartureChecklist.equipment.p9}<br />
                        {t.predepartureChecklist.equipment.p10}<br />
                        {t.predepartureChecklist.equipment.p11}</p>
                </div>
                <ul className={classes.list}>
                    <li className={classes.text}>{t.predepartureChecklist.equipment.p12}</li>
                </ul>
                <div className={classes.subList}>
                    <p className={classes.text}>
                        {t.predepartureChecklist.equipment.p13}<br />
                        {t.predepartureChecklist.equipment.p14}<br />
                        {t.predepartureChecklist.equipment.p15}<br />
                        {t.predepartureChecklist.equipment.p16}<br />
                        {t.predepartureChecklist.equipment.p17}</p>
                </div>
                <ul className={classes.list}>
                    <li className={classes.text}>{t.predepartureChecklist.equipment.p18}</li>
                    <li className={classes.text}>{t.predepartureChecklist.equipment.p19}</li>
                </ul>
            </PreDepartureContainer>
        </>
    )
}

export default equipment
