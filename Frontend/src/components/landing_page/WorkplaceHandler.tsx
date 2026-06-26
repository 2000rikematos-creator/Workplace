
import "./WorkplaceHandler.css"
import logo from "../../assets/logo-with-name.png"

type WorkPlaceHandlerProps = {
selectWorkPlaceOption:(tipo:"criar"|"abrir")=>void
isShowing:boolean
}

function WorkplaceHandler(props:WorkPlaceHandlerProps){

    if(!props.isShowing){return null}
    
return <div className="workplace-handler">
<div className="landing-page-logo-container"><img src={logo}/></div>
<div className="selector-container">
    <h2 onClick={()=>props.selectWorkPlaceOption("abrir")} className="workplace-handler-button">Abrir area de trabalho</h2>
<h2 onClick={()=>props.selectWorkPlaceOption("criar")} className="workplace-handler-button">Criar area de trabalho</h2>
    </div>    

</div>
}

export default WorkplaceHandler