import React, { useState, useEffect } from "react"
import Router from "next/router"
import Button from "@material-ui/core/Button"
// i18n
// eslint-disable-next-line no-duplicate-imports
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import theme from "../../src/theme"
import Session from "../../sessionService"
import API from "../../pages/api/baseApiIinstance"

const cancelOffer = ({ closeModal, tripId, fetchOfferTrips }) => {
  const token = Session.getToken("Wavetoken")
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr
  const mobileBreakpoint = 600
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== "undefined") {
      // Handler to call on window resize
      function handleResize() {
        window.innerWidth <= mobileBreakpoint
          ? setIsMobile(true)
          : setIsMobile(false)
      }

      // Add event listener
      window.addEventListener("resize", handleResize)

      // Call handler right away so state gets updated with initial window size
      handleResize()

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize)
    }
  }, []) // Empty array ensures that effect is only run on mount

  const updateTrip = () => {
    const body = {
      tripId,
      cancelReason: null
    }
    API()
      .put("trip/cancel", body, {
        headers: {
          authorization: `Bearer ${  token}`
        }
      })
      .then((response) => {
        if (response.status = 200) {
          fetchOfferTrips()
          closeModal()
        }
      })
      .catch((e) => {
        // router.push("/somethingWentWrong");
        console.log("error: ", e)
      })
  }

  return (
    <>
      <div style={{ fontSize: "18px", lineHeight: "2",  width: isMobile? 285 : "100%", textAlign: "center"}}>
        <p style={{ fontWeight: "500", font: "Roboto" }}>
            {t.tripsPage.cancelTrip.header}
        </p>
        <hr style={{ width: 60, backgroundColor: theme.palette.buttonPrimary.main, height: 4 }}></hr>
        <p style={{ fontWeight: 500, color: theme.palette.title.matterhorn }}>
            {t.tripsPage.cancelTrip.cancelConfirm}
        </p>
        <div
          style={{
            marginTop: "2.6em",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center"
          }}
        >
          <Button
            onClick={() => updateTrip()}
            style={{
              fontWeight: "400",
              textTransform: "capitalize",
              backgroundColor: theme.palette.background.flamingo,
              color: theme.palette.background.default,
              fontSize: "18px",
              width: "120px"
            }}
          >
            {t.tripsPage.cancelTrip.button}
          </Button>
        </div>
      </div>
    </>
  )
}
export default cancelOffer
