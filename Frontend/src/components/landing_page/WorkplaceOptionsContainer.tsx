import React from "react";
import "./WorkplaceOptionsContainer.css"
import logo from "../../assets/white-logo.png"

type WorkPlaceOptionsContainerProps = {
    children:React.ReactNode
}

function WorkPlaceOptionsContainer(props:WorkPlaceOptionsContainerProps){
    return <div className="workplace-options-container">
        <div className="login-logo-container"> <img src={logo} alt="company-logo" /> </div>
{props.children}
    </div>
}

export default WorkPlaceOptionsContainer