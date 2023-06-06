import React, { useEffect, useState } from "react"
import NavBar from "../../components/navbar/navBar"
import ApiInstance from "../api/baseApiIinstance"

const Covid19Information = () => {

  const [bannerContent, setBannerContent] = useState({
    stringValue: ''
  })

  useEffect(() => {
    ApiInstance().get("configuration/HOME_INFORMATION_BANNER_PAGE_CONTENT")
        .then((response) => {
          console.log('configurations', response.data)
          if (response.data) {
            setBannerContent(response.data)
          }
        }).catch(err => {
          console.log('an erro occured', err)
    })
  }, [])

  return (
    <>
    <div>
      <NavBar />
      <div style={{ margin: 20 }}>
      <div contentEditable='false' dangerouslySetInnerHTML={{ __html: bannerContent?.stringValue ? bannerContent?.stringValue : '' }}/>
      </div>
    </div>
    </>
  )
}

export default Covid19Information
