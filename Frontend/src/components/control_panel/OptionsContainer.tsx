import React from "react";
import "./OptionsContainer.css"

type optionsContainerProps = {
    children:React.ReactNode
}

function OptionsContainer(props:optionsContainerProps){
    return <div className="options-container">
{props.children}
    </div>
}

export default OptionsContainer