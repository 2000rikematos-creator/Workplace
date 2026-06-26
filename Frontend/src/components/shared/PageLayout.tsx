import React from "react";
import "./PageLayout.css"

type LayoutType = {
    children:React.ReactNode
}

function PageLayout(props:LayoutType){
return <div className="page-layout">
    {props.children}
</div>
}

export default PageLayout