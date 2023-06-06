import Head from "next/head"
import "bootstrap/dist/css/bootstrap.css"
import styles from "../styles/Home.module.css"
import React, {useContext, useEffect, useState} from "react"
import NavBar from "../components/navbar/navBar"
import CovidResponse from "../components/covidResponse"
import WavezHome from "../components/wavezHome"
import Footer from '../components/footer'
import ApiInstance from './api/baseApiIinstance'
import Session from "../sessionService"

const index = () => {
  const [informationBannerData, setInformationBannerData] = useState(
      {
          bannerTitle: { stringValue: ''},
          bannerContent: { stringValue: ''}
      }
  )
  const [showBanner, setShowBanner] = useState(true)
  const [homeData, setHomeData] = useState({
      heroText: { stringValue: ''},
      heroImage: { stringValue: '/assets/images/background.jpg'}
  })
  const [privacyPolicyLink, setPrivacyPolicyLink] = useState("")
  const [partnersLink, setPartnersLink] = useState("")
  const [termsOfServiceLink, setTermsOfServiceLink] = useState("")
  const [howItWorksLink, setHowItWorksLink] = useState("")
  const [aboutWavezLink, setAboutWavezLink] = useState("")
  useEffect(() => {
      ApiInstance().get("configuration")
          .then((response) => {
              if (response.data) {
                  Session.setConfiguration(response.data)
                  let bannerTitle = { stringValue: '' }
                  const bannerContent = { stringValue: '' }
                  let showBanner = true
                  let heroText = { stringValue: '' }
                  let heroImage = { stringValue: '/assets/images/background.jpg' }

                  response.data.map((res) => {
                      switch (res.key) {
                          case 'HOME_HERO_TEXT':
                              heroText = res
                              break
                          case 'HOME_HERO_IMAGE':
                              heroImage = res
                              break
                          case 'HOME_INFORMATION_BANNER_TITLE':
                              bannerTitle = res
                              showBanner = res.booleanValue
                              break
                          case 'PRIVACY_POLICY_PAGE_CONTENT':
                              setPrivacyPolicyLink(res?.stringValue)
                              break
                          case 'TERMS_OF_SERVICE_PAGE_CONTENT':
                              setTermsOfServiceLink(res?.stringValue)
                              break
                          case 'HOW_IT_WORKS_PAGE_CONTENT':
                              setHowItWorksLink(res?.stringValue)
                              break
                          case 'ABOUT_WAVEZ_PAGE_CONTENT':
                              setAboutWavezLink(res?.stringValue)
                              break
                          default:
                              break
                      }
                  })

                  console.log(bannerTitle, bannerContent, heroImage, heroText, showBanner)
                  setShowBanner(showBanner)
                  setHomeData({ heroText, heroImage})
                  setInformationBannerData({ bannerTitle, bannerContent})
              }
          }).catch(err => {
          console.log('an error occurred while getting the configurations', err)
      })
  }, [])

  return (
    <React.Fragment>
      <NavBar />
      {showBanner && <div><CovidResponse bannerData={informationBannerData}/></div>}
      <WavezHome homeData={homeData}/>
      <Footer privacyPolicyLink={privacyPolicyLink} termsOfServiceLink={termsOfServiceLink} howItWorksLink={howItWorksLink} aboutWavezLink={aboutWavezLink} />
    </React.Fragment>
  )
}

export default index
