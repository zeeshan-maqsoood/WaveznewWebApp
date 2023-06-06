import React, { useState, useEffect } from "react"
import { withStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import Badge from "@material-ui/core/Badge"
import ListItemText from "@material-ui/core/ListItemText"
import Session from "../../sessionService"
import { useRouter } from "next/router"
import theme from "../../src/theme"
import {socket} from "../../src/socket"

export default function CustomizedMenus(props) {
  const [anchorEl, setAnchorEl] = useState(null)
  const userInitials = Session.getUserInitials("UserInitials")
  const [selectedOption, setSelectedOption] = useState()
  const [isMobile, setIsMobile] = useState(false)
  const [windowSize, setWindowSize] = useState("")
  const [menu, setMenu] = useState([])
  const mobileBreakpoint = 600

  const router = useRouter()

  const profileMenu = [
    "Profile",
    "Listings",
    "Messages",
    "Calendar",
    "Trips",
    "Favourites",
    "Sign Out"
  ]

  const profileMenuMobile = [
    "Profile",
    "Listings",
    "Messages",
    "Favourites",
    "Sign Out"
  ]

  const handleSelectedOption = (option) => {
    console.log("option is: ", option)
    if (option === "Sign Out") {
      socket.disconnect()
      router.push("/")
      Session.clear()
    } else if (option === "Profile") {
      router.push("/accountInfo/profile")
    } else if (option === "Listings") {
      router.push("/yourListings")
    } else if (option === "Messages") {
      router.push("/messages")
    } else if (option === "Trips") {
      router.push("/trips")
    } else if (option === "Calendar") {
      router.push("/calendar")
    } else if (option === "Favourites") {
      router.push("/favourite")
    }
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== "undefined") {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize(window.innerWidth)
        window.innerWidth <= mobileBreakpoint
          ? setMenu(profileMenuMobile)
          : setMenu(profileMenu)
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
    <div>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Badge
          color="error"
          overlap="circular"
          // badgeContent={
          //   Session.getNotifications().listings +
          //   Session.getNotifications().trips +
          //   Session.getNotifications().conversations
          // }
        >
          <div
            style={{
              width: 30,
              height: 30,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: theme.palette.buttonPrimary.main,
              backgroundColor: theme.palette.background.default,
              borderRadius: "50%"
            }}
          >
            {userInitials.toUpperCase()}
          </div>
        </Badge>
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menu.map((item) =>
          (item !== "Calendar" || props.isVesselOwner ? (
            <MenuItem key={item} onClick={() => handleSelectedOption(item)}>
              {/* {Session.getNotifications().listings +
                Session.getNotifications().trips +
                Session.getNotifications().conversations !==
                0 && (
                <div
                  style={{
                    width: 15,
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  {item === "Listings" && (
                    <Badge
                      color="error"
                      overlap="circular"
                      badgeContent={Session.getNotifications().listings}
                    />
                  )}
                  {item === "Messages" && (
                    <Badge
                      color="error"
                      overlap="circular"
                      badgeContent={Session.getNotifications().conversations}
                    />
                  )}
                  {item === "Trips" && (
                    <Badge
                      color="error"
                      overlap="circular"
                      badgeContent={Session.getNotifications().trips}
                    />
                  )}
                </div>
              )} */}
              {item}
            </MenuItem>
          ) : null)
        )}
      </Menu>
    </div>
  )
}
