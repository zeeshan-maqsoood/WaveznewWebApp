import React, {useEffect, useState} from "react"
import NavBar from "../../components/navbar/navBar"
import Session from "../../sessionService"
import ApiInstance from '../api/baseApiIinstance'

const Partners = (props) => {
  const [title, setTitle] = useState()
  const [content, setContent] = useState()
  
  useEffect(() => {
   const config = Session.getConfiguration()
   if (config && Array.isArray(config)) {
       const newContent = config?.find(item => item.key === "PARTNERS_PAGE_CONTENT")?.stringValue
       const newTitle = config?.find(item => item.key === "PARTNERS_TITLE")?.stringValue
       setContent(newContent)
       setTitle(newTitle)
   } else {
       ApiInstance().get("configuration/PARTNERS_PAGE_CONTENT")
           .then((res) => {
               setContent(res?.data?.stringValue)
       }).catch(err => {
           console.log('An error occurred getting the page content', err)
       })
       ApiInstance().get("configuration/PARTNERS_TITLE")
           .then((res) => {
               setTitle(res?.data?.stringValue)
           }).catch(err => {
           console.log('An error occurred getting the page content', err)
       })
   }
   //let newTitle =  config.find(item => item.key === "PARTNERS_TITLE").stringValue;


  }, [])
  return (
    <>
     <NavBar />
      <div style={{ margin: 20 }}>
        <h1>{title}</h1>
        <div
          contentEditable='false'
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </>
  )
}
export default Partners
