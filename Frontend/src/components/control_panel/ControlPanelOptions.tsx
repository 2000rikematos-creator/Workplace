
import "./ControlPanelOptions.css"

import {type ControlPanelOptionsTypes } from "../../shared/Types"

type ControlPanelOptionsProps = {
    optionsList:ControlPanelOptionsTypes[]
    selectOption:(option:ControlPanelOptionsTypes)=>void;
    selectedOption?:ControlPanelOptionsTypes|undefined;
}

function ControlPanelOptions(props:ControlPanelOptionsProps){
    return <ul className="control-panel-options-list">
    {props.optionsList.map((item:ControlPanelOptionsTypes)=><li key={item} style={props.selectedOption === item ? {backgroundColor:"var(--light-color)",color:"var(--secondary-color)"}:undefined} onClick={()=>props.selectOption(item as ControlPanelOptionsTypes)} className="control-panel-options-list-item"><p>{item}</p></li>)}
    </ul>
}

export default ControlPanelOptions