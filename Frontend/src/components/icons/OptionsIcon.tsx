import { Menu } from 'lucide-react';
import "./OptionsIcon.css"

interface OptionsIconProps {
    onClick:()=>void
}

function OptionsIcon(props:OptionsIconProps){
    return <Menu onClick={props.onClick} className='options-icon' />
}

export default OptionsIcon