import {User} from "lucide-react"

interface PersonIconProps {
    className:string;
}

function PersonIcon(props:PersonIconProps){
    return <User className={`${props.className}`}/>
}

export default PersonIcon