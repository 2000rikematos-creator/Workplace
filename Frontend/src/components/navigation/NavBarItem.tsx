import React from "react";
import "./NavBarItem.css"


type NavBarItemProps = {
    children:React.ReactNode;
    className?:string;
    onClick:()=>void;
}

function NavBarItem(props:NavBarItemProps){
return <li className={`${props.className} nav-bar-item`} onClick={props.onClick}>
    {props.children}
</li>
}

export default NavBarItem