import { House } from "lucide-react";

interface HomeIconProps {
    onClick?:()=>void;
    className?:string;
}

function HomeIcon(props:HomeIconProps){
    return <House onClick={props.onClick} className={`${props.className}`}/>
}

export default HomeIcon