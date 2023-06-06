import React, { Component, useState, useEffect, useContext } from "react"
import Router from "next/router"
import Button from "@material-ui/core/Button"
// i18n
// eslint-disable-next-line no-duplicate-imports
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import theme from "../../src/theme"

const InvalidSearchModal = (props) => {
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr
  const mobileBreakpoint = 600
  const [windowSize, setWindowSize] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== "undefined") {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize(window.innerWidth)
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

  return (
    <>
      <div style={{ fontSize: "18px", lineHeight: 2, width: isMobile ? 285 : 450, textAlign: "center", padding: 10 }}>
        <p style={{ fontWeight: 500, color: theme.palette.title.matterhorn }}>
          {props.message}
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
            onClick={props.closeModal}
            style={{
              fontWeight: "400",
              textTransform: "capitalize",
              backgroundColor: theme.palette.buttonPrimary.main,
              color: theme.palette.background.default,
              fontSize: "18px",
              width: "120px"
            }}
          >
            {t.okay}
          </Button>
        </div>
      </div>
    </>
  )
}
export default InvalidSearchModal
