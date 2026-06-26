import { Plus } from "lucide-react";
import "./AddIcon.css"

interface AddIconProps {
    onClick:()=>void
}

function AddIcon(props:AddIconProps){
    return <Plus className="add-icon" onClick={props.onClick}/>
}

export default AddIcon