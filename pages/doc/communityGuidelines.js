import React, {useEffect, useState} from "react"
import NavBar from "../../components/navbar/navBar"
import Session from "../../sessionService"

const CommunityGuidelines = (props) => {

 return (
   <>
     <NavBar />
     <div style={{ margin: 20, textAlign: "center" }}>
       <h1>Community Guidelines</h1>
       <div>Community Guidelines Content</div>
     </div>
   </>
 )
}
export default CommunityGuidelines