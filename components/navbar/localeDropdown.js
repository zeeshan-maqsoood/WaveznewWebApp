import React, {useState} from "react"
import Button from "@material-ui/core/Button"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import { faGlobe } from "@fortawesome/free-solid-svg-icons"
// eslint-disable-next-line no-duplicate-imports
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { useRouter } from "next/router"
import Link from "next/link"
import theme from "../../src/theme"

export default function SimpleMenu() {
  const [anchorEl, setAnchorEl] = useState(null)
  const router = useRouter()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const LOCALES = { en: "EN", fr: "FR" }

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        style={{ color: theme.palette.background.default }}
      >
        <FontAwesomeIcon icon={faGlobe} style={{ marginRight: 5 }} />
        {router.locale}
        <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: 5 }} />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Link
          legacyBehavior
          href={{
            pathname: router.pathname,
            query:
              router.query?.id !== undefined
                ? { id: router.query?.id, type: router.query?.type }
                : {}
          }}
          locale={'en'}
        >
          <MenuItem onClick={handleClose}>{LOCALES.en}</MenuItem>
        </Link>
        <Link
          legacyBehavior
          href={{
            pathname: router.pathname,
            query:
              router.query?.id !== undefined
                ? { id: router.query?.id, type: router.query?.type }
                : {}
          }}
          locale={'fr'}
        >
          <MenuItem onClick={handleClose} data-testid="frenchBtn">
            {LOCALES.fr}
          </MenuItem>
        </Link>
      </Menu>
    </div>
  )
}
