import React, { useContext, useEffect, useState, useRef } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Grid, TextField, Card, Button } from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import theme from "../../src/theme"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  contentTitle: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: "24px",
    color: theme.palette.title.matterhorn,
    marginLeft: "5%",
    marginTop: "30px",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "5px"
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "5px"
    }
  },
  descContent: {
    justifyContent: "center",
    color: theme.palette.text.secondary,
    lineHeight: "1.5rem",
    marginLeft: "5%"
  },
  descBtn: {
    display: "grid",
    marginInline: "auto",
    color: theme.palette.buttonPrimary.main
  }
}))

export default function Description({ descriptionTxt, limitCharacters }) {
  const classes = useStyles()
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  // description
  const LongText = ({ content, limit }) => {
    const [showAll, setShowAll] = useState(false)

    const showMore = () => setShowAll(true)
    const showLess = () => setShowAll(false)
    if (content?.length <= limit) {
      return <div>{content}</div>
    }
    if (showAll) {
      // We show the extended text and a link to reduce it
      return (
        <div>
           {content}<a onClick={showLess} style={{cursor: "pointer", color: theme.palette.buttonPrimary.main}}> Read less</a>
          <Button onClick={showLess} className={classes.descBtn}>
            {t.listingInfo.showLess}
            <ExpandLessIcon style={{ gridColumnStart: "none" }} />
          </Button>
        </div>
      )
    }
    // In the final case, we show a text with ellipsis and a `Read more` button
    const toShow = `${content?.substring(0, limit)  }... `
    return (
      <div>
        {toShow}<a onClick={showMore} style={{cursor: "pointer", color: theme.palette.buttonPrimary.main}}>Read more</a>
        <Button onClick={showMore} className={classes.descBtn}>
          {t.listingInfo.showMore}
          <ExpandMoreIcon style={{ gridColumnStart: "none" }} />
        </Button>
      </div>
    )
  }

  return (
    <>
      <Grid className={classes.contentTitle} item xs={12}>
        {t.listingInfo.description}
        <div
          style={{
            borderBottom: "1px solid rgb(221, 221, 221)",
            marginTop: "5px",
            marginBottom: "20px"
          }}
        />
      </Grid>
      <Grid item className={classes.descContent} xs={12}>
        <LongText content={descriptionTxt} limit={limitCharacters} />        
      </Grid>
    </>
  )
}
