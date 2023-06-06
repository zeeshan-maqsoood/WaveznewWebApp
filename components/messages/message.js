import React from "react"
import { format } from "timeago.js"
import { makeStyles } from "@material-ui/core"
import moment from "moment"

const useStyles = makeStyles((theme) => ({
  message: {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  },
  messageOwn: {
    alignItems: "flexEnd",
    width: "100%"
  },
  messageTop: {
    display: "flex"
  },
  messageTopOwn: {
    display: "flex",
    justifyContent: "flex-end"
  },
  messageImg: {
    width: "auto",
    maxWidth: "100%",
    height: "auto",
    maxHeight: "200px",
    borderRadius: 10
  },
  messageText: {
    padding: "10px",
    borderRadius: "12px",
    backgroundColor: theme.palette.background.lightGrey,
    color: "black",
    maxWidth: "400px",
    marginBottom: "0px",
    marginTop: "10px",
    [theme.breakpoints.down("xs")]: {
      maxWidth: "80%"
    }
  },
  messageOwnText: {
    padding: "10px",
    borderRadius: "12px",
    backgroundColor: "#1877f2",
    maxWidth: "400px",
    color: "white",
    marginBottom: "0px",
    marginTop: "10px",
    [theme.breakpoints.down("xs")]: {
      maxWidth: "80%"
    }
  },
  messageBottom: {
    fontSize: "12px"
  },
  messageBottomOwn: {
    fontSize: "12px",
    display: "flex",
    justifyContent: "flex-end"
  }
}))

export default function Message({ message, own }) {
  const classes = useStyles()

  return (
    <div className={own ? classes.messageOwn : classes.message}>
      <div className={own ? classes.messageTopOwn : classes.messageTop}>
        <p className={own ? classes.messageOwnText : classes.messageText}>
          {message.imageUrl ? (
            <>
              <a
                href={message.imageUrl}
                download={moment(new Date()).format().toString()}
              >
                <img
                  className={classes.messageImg}
                  src={message.imageUrl}
                  alt="attached image"
                />
              </a>
              <br />
            </>
          ) : null}
          {message.text}
        </p>
      </div>
      <div className={own ? classes.messageBottomOwn : classes.messageBottom}>
        {format(message.createdAt)}
      </div>
    </div>
  )
}
