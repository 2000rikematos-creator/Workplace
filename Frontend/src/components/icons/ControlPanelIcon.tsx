
import { Settings } from "lucide-react";

interface ControlPaneliconProps {
    onClick?:()=>void;
    className?:string;
}

function ControlPanelicon(props:ControlPaneliconProps){
    return <Settings onClick={props.onClick} className={`${props.className}`}/>
}

export default ControlPanelicon
