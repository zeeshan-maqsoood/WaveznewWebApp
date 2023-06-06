import React, { useEffect, useState } from "react"
import NavBar from "../../components/navbar/navBar"
import Session from "../../sessionService"

const TermsOfService = (props) => {
  //const [title, setTitle] = useState();
  const [content, setContent] = useState()

  useEffect(() => {
    const config = Session.getConfiguration()
    // let newTitle = config.find(
    //   (item) => item.key === "TERMS_OF_SERVICE_TITLE"
    // ).stringValue;
    const newContent = config?.find(
      (item) => item.key === "TERMS_OF_SERVICE_PAGE_CONTENT"
    ).stringValue
    setContent(newContent)
  }, [])
  return (
    <>
      <NavBar />
      <div style={{ margin: 20, textAlign: "center" }}>
        <h1>Terms Of Service</h1>
        <div
          contentEditable='false'
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </>
  )
}
export default TermsOfService
