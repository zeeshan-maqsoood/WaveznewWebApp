/* eslint-disable no-duplicate-imports */
import React, { useState, useEffect } from "react"
import Router from "next/router"
import Button from "@material-ui/core/Button"
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import theme from "../../src/theme"

const DeleteWarningBox = ({
  confirmDelete = () => {},
  cancelDelete = () => {},
  title
}) => {
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
      <div style={{ fontSize: "18px", lineHeight: "2",  width: isMobile? 285 : 500, textAlign: "center"}}>
        <p style={{ fontWeight: "500", font: "Roboto" }}>
          Delete confirmation
        </p>
        <hr style={{ width: 60, backgroundColor: theme.palette.buttonPrimary.main, height: 4 }}></hr>
        <p style={{ fontWeight: 500, color: theme.palette.title.matterhorn }}>
          Are you sure you want to delete {title} ?
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
            onClick={() => confirmDelete()}
            style={{
              fontWeight: "400",
              textTransform: "capitalize",
              backgroundColor: theme.palette.background.flamingo,
              color: theme.palette.background.default,
              fontSize: "18px",
              width: "120px"
            }}
          >
            Delete
          </Button>
          <Button
            onClick={() => cancelDelete()}
            style={{
              color: theme.palette.buttonPrimary.main,
              marginLeft: 20,
              fontWeight: "400",
              textTransform: "capitalize",
              backgroundColor: theme.palette.background.default,
              fontSize: "18px",
              maxWidth: "150px"
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </>
  )
}
export default DeleteWarningBox
