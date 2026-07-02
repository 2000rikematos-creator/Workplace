
import "./ControlPanelOptions.css"

type ControlPanelOptionsProps = {
    optionsList:string[]
    selectOption:(option:"Gerir colaboradores" | "Gerir tarefas" | "Gerir perfil")=>void;
    selectedOption?:string|undefined;
}

function ControlPanelOptions(props:ControlPanelOptionsProps){
    return <ul className="control-panel-options-list">
    {props.optionsList.map((item:string)=><li key={item} style={props.selectedOption === item ? {backgroundColor:"var(--light-color)",color:"var(--secondary-color)"}:undefined} onClick={()=>props.selectOption(item as "Gerir colaboradores" | "Gerir tarefas" | "Gerir perfil")} className="control-panel-options-list-item"><p>{item}</p></li>)}
    </ul>
}

export default ControlPanelOptions