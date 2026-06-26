import {Trash2} from "lucide-react"

interface DeleteIconProps {
    className:string;
    onClick:()=>void;
}

function DeleteIcon(props:DeleteIconProps){
    return <Trash2 className={`${props.className}`} onClick={props.onClick}/>
}

export default DeleteIcon