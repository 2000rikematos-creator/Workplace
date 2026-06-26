import { LayoutGrid } from 'lucide-react';
import "./MenuIcon.css"

interface MenuIconProps {
    onClick:()=>void
}

function MenuIcon(props:MenuIconProps){
    return <LayoutGrid onClick={props.onClick} className='menu-icon' />
}

export default MenuIcon
