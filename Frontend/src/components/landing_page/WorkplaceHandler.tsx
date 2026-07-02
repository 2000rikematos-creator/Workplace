
import "./WorkplaceHandler.css"
import logo from "../../assets/logo-with-name.png"

type WorkPlaceHandlerProps = {
selectWorkPlaceOption:(type:"create"|"open")=>void
isShowing:boolean
}

function WorkplaceHandler(props:WorkPlaceHandlerProps){

    if(!props.isShowing){return null}
    
return <div className="workplace-handler">
<div className="landing-page-logo-container"><img src={logo} alt="company-logo"/></div>
<div className="selector-container">
    <h2 onClick={()=>props.selectWorkPlaceOption("open")} className="workplace-handler-button">Open workplace</h2>
<h2 onClick={()=>props.selectWorkPlaceOption("create")} className="workplace-handler-button">Create workplace</h2>
    </div>    

</div>
}

export default WorkplaceHandler