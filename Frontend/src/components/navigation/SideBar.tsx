import React,{useRef,useEffect} from "react";
import "./SideBar.css"

type SideBarProps = {
    children:React.ReactNode
    title?:string
    clickAway?:()=>void
    placement:"left"|"right";
    className?:string;
}

function SideBar(props:SideBarProps){
const menuSideBarRef = useRef<HTMLBodyElement>(null)



useEffect(()=>{

    function clickAway(event:MouseEvent){
        event.stopPropagation()
        if(menuSideBarRef.current){
           if(!menuSideBarRef.current.contains(event.target as Node)){
            props.clickAway!()
           }
        }
    }

    document.body.addEventListener("mousedown",clickAway)

    return ()=> document.body.removeEventListener("mousedown",clickAway)
},[])

return <aside ref={menuSideBarRef} style={{[props.placement]:"0px"}} className={`${props.className} side-bar`}>
{props.title ? <h1 className="side-bar-title">{props.title}</h1> : null}
{props.children}
</aside>
}

export default SideBar