import { Phone } from "lucide-react";

interface PhoneIconProps {
    className:string;
}

function PhoneIcon(props:PhoneIconProps){
    return <Phone className={`${props.className}`}/>
}

export default PhoneIcon