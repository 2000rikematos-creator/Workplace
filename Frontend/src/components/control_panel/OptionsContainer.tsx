import React from "react";
import "./OptionsContainer.css"

type optionsContainerProps = {
    children:React.ReactNode
    className?:string;
}

function OptionsContainer(props:optionsContainerProps){
    return <div className={`${props.className} options-container`}>
{props.children}
    </div>
}

export default OptionsContainer