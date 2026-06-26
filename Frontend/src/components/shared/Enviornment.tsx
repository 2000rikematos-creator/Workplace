import React from "react";
import "./Enviornment.css"


type ActiveTaskSpaceProps = {
    children:React.ReactNode
}

function Enviornment(props:ActiveTaskSpaceProps){
    return <div className="enviornment">
        {props.children}
    </div>
}

export default Enviornment