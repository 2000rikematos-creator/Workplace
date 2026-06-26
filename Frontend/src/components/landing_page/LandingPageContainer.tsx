import React from "react";
import "./LandingPageContainer.css"

type LandingPageContainerProps = {
    children:React.ReactNode
}

function LandingPageContainer(props:LandingPageContainerProps){
    return <div className="landing-page-container">
        {props.children}
    </div>
}

export default LandingPageContainer