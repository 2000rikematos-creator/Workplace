import React, {useState} from "react";
import WorkPlaceOptionsContainer from "./WorkplaceOptionsContainer";
import { type WorkplaceCreds } from "../../shared/Types";
import "./CreateWorkplace.css"
import ErrorModal from "../../components/modals/ErrorModal";


type CreateWorkplaceProps = {
    isShowing:boolean
    createWorkplaceCreds:(settings:Required<Pick<WorkplaceCreds,"companyName"|"loginName"|"managerPassword"|"operatorPassword">>)=>void

}

function CreateWorkplace(props:CreateWorkplaceProps){
    const [errorMessage,setErrorMessage] = useState("")
     const [workplaceInputs,setWorkplaceInputs] = useState({companyName:"",loginName:"",managerPassword:"",operatorPassword:"",repeatManagerPassword:"",repeatOperatorPassword:""})

 function handleChange(event:React.ChangeEvent<HTMLInputElement, HTMLInputElement>){
    setWorkplaceInputs((prev)=>{return {...prev,[event.target.name]:event.target.value}})
 }

 function handleSubmit(event:React.SubmitEvent<HTMLFormElement>){
    event.preventDefault()
    if(workplaceInputs.repeatManagerPassword !== workplaceInputs.managerPassword || workplaceInputs.repeatOperatorPassword !== workplaceInputs.operatorPassword){
        setErrorMessage("As passwords não coincidem")
  return
    }

    props.createWorkplaceCreds({companyName:workplaceInputs.companyName,loginName:workplaceInputs.loginName,managerPassword:workplaceInputs.managerPassword,operatorPassword:workplaceInputs.operatorPassword})
 }
    if(!props.isShowing){return null}

return <WorkPlaceOptionsContainer>
    <ErrorModal errorMessage={errorMessage} onClosing={()=>{setErrorMessage("")}}/>
    <form className="workplace-settings-form" onSubmit={handleSubmit}>
        
        <input name="companyName" type="text" placeholder="Nome da empresa" onChange={handleChange} value={workplaceInputs.companyName}/>
        <input name="loginName" type="text" placeholder="Nome para login" onChange={handleChange} value={workplaceInputs.loginName}/>
        <input name="managerPassword" type="password" placeholder="Palavra-passe do responsável" onChange={handleChange} value={workplaceInputs.managerPassword}/>
        <input name="repeatManagerPassword" type="password" placeholder="Repetir palavra-passe do responsável" onChange={handleChange} value={workplaceInputs.repeatManagerPassword}/>
        <input name="operatorPassword" type="password" placeholder="Palavra-passe do operador" onChange={handleChange} value={workplaceInputs.operatorPassword}/>
        <input name="repeatOperatorPassword" type="password" placeholder="Repetir palavra-passe do operador" onChange={handleChange} value={workplaceInputs.repeatOperatorPassword}/>
        <input className="submit-login-button" type="submit" value="Criar"/>

    </form>
</WorkPlaceOptionsContainer>
}

export default CreateWorkplace