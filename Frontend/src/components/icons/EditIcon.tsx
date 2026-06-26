import { SquarePen } from "lucide-react";

interface EditIconProps {
    className:string;
    onClick:()=>void;
}

function EditIcon(props:EditIconProps){
    return <SquarePen className={`${props.className}`} onClick={props.onClick}/>
}

export default EditIcon