import { FingerprintPattern } from "lucide-react";

interface IdentificationIconProps{
    className:string;
}

function IdentificationIcon(props:IdentificationIconProps){
    return <FingerprintPattern className={`${props.className}`}/>
}

export default IdentificationIcon