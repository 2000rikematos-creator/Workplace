
import "./ControlPanelOptions.css"

type ControlPanelOptionsProps = {
    optionsList:string[]
    selectOption:(option:"Gerir colaboradores" | "Gerir tarefas" | "Alterar credenciais")=>void
}

function ControlPanelOptions(props:ControlPanelOptionsProps){
    return <ul className="control-panel-options-list">
    {props.optionsList.map((item:string)=><li onClick={()=>props.selectOption(item as "Gerir colaboradores" | "Gerir tarefas" | "Alterar credenciais")} className="control-panel-options-list-item"><p>{item}</p></li>)}
    </ul>
}

export default ControlPanelOptions