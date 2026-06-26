import { LogOut } from "lucide-react";

interface logOutIconProps {
    onClick?:()=>void;
    className?:string;
}

function LogoutIcon(props:logOutIconProps){
    return <LogOut onClick={props.onClick} className={`${props.className}`}/>
}

export default LogoutIcon