import React, {useEffect, useState} from "react"
import NavBar from "../../components/navbar/navBar"
import Session from "../../sessionService"

const HowItWorks = (props) => {
  //const [title, setTitle] = useState();
  const [content, setContent] = useState()
  
  useEffect(() => {
   const config = Session.getConfiguration()
   //let newTitle =  config.find(item => item.key === "HOW_IT_WORKS_TITLE").stringValue;
   const newContent = config?.find(item => item.key === "HOW_IT_WORKS_PAGE_CONTENT").stringValue

   setContent(newContent)
  }, [])
  return (
    <>
       <NavBar />
      <div style={{ margin: 20, textAlign: "center" }}>
        <h1>How It Works</h1>
        <div
          contentEditable='false'
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </>
  )
}
export default HowItWorks