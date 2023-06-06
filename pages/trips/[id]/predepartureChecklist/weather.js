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
  customModal: {
    paddingLeft: '20px',
    paddingRight: '20px',
    width: "90%",
    maxWidth: '616px',
    borderRadius: 10
  }
}))

const weather = (props) => {
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
        <ReportConfirmation reportInfo={"WEATHER"} closeModal={() => setReportSelected(false)} />
      </Modal>
      <PreDepartureContainer header={t.predepartureChecklist.weather.header} imgSource={"/assets/images/undraw_Weather_re_qsmd_1.png"}
        onBackClick={() => { router.back() }}
        onNextClick={() => { router.push(`/trips/${  router.query?.id  }/predepartureChecklist/watercraftCondition`) }}
        onReportClick={() => { setReportSelected(true) }}
        onHintClick={() => { }}>
        <ul style={{ paddingLeft: "20px" }}>
          <li className={classes.text}>{t.predepartureChecklist.weather.p1}</li>
          <li className={classes.text}>{t.predepartureChecklist.weather.p2}</li>
        </ul>
      </PreDepartureContainer>
    </>
  )
}

export default weather
