import React, { useState, useEffect } from "react"
import NavBar from "../../components/navbar/navBar"
import API from "../api/baseApiIinstance"
import Accordion from "@material-ui/core/Accordion"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Typography from "@material-ui/core/Typography"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

const FAQ = (props) => {
  //const [title, setTitle] = useState("FAQ");
  const [content, setContent] = useState()

  useEffect(() => {
    API()
      .get("faq")
      .then((response) => {
        setContent(response.data.filter((item) => item.visible === true))
      })
      .catch((err) => {
        console.log("error from FAQ get route")
      })
  }, [])
  return (
    <>
      <NavBar />
      <div style={{ margin: 20, textAlign: "center" }}>
        <h1>FAQ</h1>
        <div style={{width: "80%", margin: "auto"}}>
          {content?.map((item) => (
            <Accordion key={item.question}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-label='Expand'
                aria-controls='additional-actions1-content'
                id='additional-actions1-header'
              >
                <FormControlLabel
                  aria-label='Acknowledge'
                  onClick={(event) => event.stopPropagation()}
                  onFocus={(event) => event.stopPropagation()}
                  control={<div style={{ margin: 5 }} />}
                  label={<b>{item.question}</b>}
                />
              </AccordionSummary>
              <AccordionDetails>
                <Typography color='textSecondary'>{item.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </>
  )
}
export default FAQ
