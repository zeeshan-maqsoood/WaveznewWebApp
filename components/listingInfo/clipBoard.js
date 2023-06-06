/* eslint-disable no-duplicate-imports */
import React, { useState, useEffect } from "react"
import { makeStyles, withStyles } from "@material-ui/core/styles"
import { FormControl } from "@material-ui/core"
import { OutlinedInput } from "@material-ui/core"
// eslint-disable-next-line no-duplicate-imports
import { InputAdornment } from "@material-ui/core"
import { Snackbar } from "@material-ui/core"
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import clsx from "clsx"
//import theme from "../"
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"

const useStyles = makeStyles((theme) => ({
  header: {
      fontSize: 18,
      fontWeight: 500,
      textAlign: "center",
      paddingBottom: 10
  },
  margin: {
    margin: "auto"
  },
  textField: {
    width: "100%"
  },
  copyButton: {
    cursor: "pointer",
    fontWeight: 500
  },
  outlinedRoot: {
    background: theme.palette.buttonPrimary.main
  },
  inputRoot: {
      background: theme.palette.background.bookingBackground
  },
  whiteText: {
      color: "white"
  }
}))

export default function ClipBoard() {
  const classes = useStyles()
  const url = window.location.href
  const [openSnackBar, setOpenSnackBar] = useState(false)
  //i18n
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr
  
  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setOpenSnackBar(true)
  }

  return (
    <>
     <Snackbar        
        open={openSnackBar}
        onClose={() => setOpenSnackBar(false)}
        message="Copied"
      />
      <div className={classes.header}>Copy URL to ClipBoard</div>
      <FormControl
        className={clsx(classes.margin, classes.textField)}
        variant='outlined'
      >
        <OutlinedInput
          classes = {{root: classes.outlinedRoot, input: classes.inputRoot}}
          value={url}
          endAdornment={
            <InputAdornment
              onClick={handleCopy}
              className={classes.copyButton}
              position='end'
              style={{color: "white"}}
            >
             <span style={{color: "white"}}><FileCopyOutlinedIcon/></span> 
            </InputAdornment>
          }
          labelWidth={0}
        />
      </FormControl>
    </>
  )
}
