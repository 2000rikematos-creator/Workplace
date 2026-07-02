import React,{useState} from "react";
import WorkPlaceOptionsContainer from "./WorkplaceOptionsContainer";
import { type LoginInfo } from "../../shared/Types";
import "./OpenWorkplace.css"

interface OpenWorkplaceProps  {
isShowing:boolean
submitLoginInfo:(info:LoginInfo)=>void
}

function OpenWorkplace(props:OpenWorkplaceProps){

    const [loginInfo,setLoginInfo] = useState<LoginInfo>({loginName:"",operatorPassword:""})

    function handleSubmit(event:React.SubmitEvent<HTMLFormElement>){
        event.preventDefault()
        props.submitLoginInfo(loginInfo)
    }

    function handleChange(event:React.ChangeEvent<HTMLInputElement, HTMLInputElement>){
        setLoginInfo((prev)=>{return {...prev,[event.target.name]:event.target.value}})
    }

if(!props.isShowing){return null}

    return <WorkPlaceOptionsContainer>
<form className="workplace-settings-form" onSubmit={handleSubmit}>
    <input type="text" placeholder="Staff username" onChange={handleChange} value={loginInfo.loginName} name="loginName"/>
    <input type="password" placeholder="Staff password" onChange={handleChange} value={loginInfo.operatorPassword} name="operatorPassword"/>
    <input className="submit-login-button" type="submit" value="Sign in"/>
</form>
    </WorkPlaceOptionsContainer>
}

export default OpenWorkplace