import { X } from "lucide-react"
import "./CloseIcon.css"

interface CloseIconProps {
    onClick:()=>void
    spacingInPx?:string;
    className?:string;
}

function CloseIcon(props:CloseIconProps){
    return <X className={`close-icon ${props.className}`} style={{right:`${props.spacingInPx}`}} onClick={()=>props.onClick()}/>
}

export default CloseIcon