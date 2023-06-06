import React, {useState} from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  Card,
  CardContent,
  Typography
} from "@material-ui/core"
import CancellationPolicy from "../../components/trips/cancellationPolicy.js"
import EmojiObjectsOutlinedIcon from '@material-ui/icons/EmojiObjectsOutlined'
// i18n
import { useRouter } from 'next/router'
import en from '../../locales/en.js'
import fr from '../../locales/fr.js'
import theme from "../../src/theme"
import { Modal } from "react-responsive-modal"

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "10%",
    maxWidth: "550px",
    minHeight: "120px",
    [theme.breakpoints.down("xs")]: {
      margin: 0,
      marginTop: 10,
      marginBottom: 10,
      width: "100%",
      minHeight: "20px"
    }
  },
  title: {
    color: theme.palette.text.black,
    fontSize: 14,
    fontWeight: 500
  },
  styledTitle: {
    color: theme.palette.text.darkCerulean,
    fontSize: 14,
    fontWeight: 500,
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  customModal: {
    width: 500,
    borderRadius: 10,
    [theme.breakpoints.down("xs")]: {
      width: 300
    }
  }
}))

const Hint = ({ content, title = null, cancellation}) => {
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === 'en' ? en : fr
  const [openCancelation,  setOpenCancellation] = useState(false)

  const handleOpenCancelation = () => {
    setOpenCancellation(true)
  }

  return (
    <>
    <Modal
        open={openCancelation}
        onClose={() => setOpenCancellation(false)}
        classNames={{
          modal: classes.customModal
        }}
        center
      >
        <CancellationPolicy />
      </Modal>
      <Card className={classes.root} variant="outlined">
        <CardContent>
          {/* Style "hint" and show title if title provided */}
          <>
            <span style={{ display: "-webkit-inline-box", marginLeft: -7, flexDirection: "row", alignContent: "center", alignItems: "center", textAlign: "center" }} >
              <EmojiObjectsOutlinedIcon style={{ display: "inline-block", color: theme.palette.text.darkCerulean }} />
              <Typography className={classes.styledTitle} color="textSecondary" gutterBottom>
                {t.hint.hint}
              </Typography>
            </span>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              {title}
            </Typography></>
          <Typography variant="body2" component="div">
            {content}
            {cancellation && <div>{t.editListing.pricing.youCanRead} <a onClick={handleOpenCancelation} style={{cursor: "pointer", color: theme.palette.buttonPrimary.main, textDecoration: "underline"}}>{t.editListing.pricing.cancellationAndRefund}</a> {t.editListing.pricing.forMoreInfo}</div> }
          </Typography>
        </CardContent>
      </Card>
    </>
  )
}

export default Hint
