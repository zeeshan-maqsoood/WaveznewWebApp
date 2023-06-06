import React, {useEffect, useState} from "react"
import NavBar from "../../components/navbar/navBar"
import Session from "../../sessionService"

const AboutWaveShare = (props) => {
  //const [title, setTitle] = useState();
  const [content, setContent] = useState()
  
  useEffect(() => {
   const config = Session.getConfiguration()
   //let newTitle =  config.find(item => item.key === "ABOUT_WAVESHARE_TITLE").stringValue;
   const newContent = config?.find(item => item.key === "ABOUT_WAVEZ_PAGE_CONTENT").stringValue

   setContent(newContent)
  }, [])
  return (
    <>
      <NavBar />
      <div style={{ margin: 20, textAlign: "center" }}>
        <h1>About Wavez</h1>
        <div
          contentEditable='false'
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </>
  )
}
export default AboutWaveShare
