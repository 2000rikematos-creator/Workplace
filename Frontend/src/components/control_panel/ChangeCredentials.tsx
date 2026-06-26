import ErrorModal from "../modals/ErrorModal";
import type { WorkplaceCreds } from "../../shared/Types";
import OptionsContainer from "./OptionsContainer";
import React, { useState,useEffect } from "react";
import ConfirmationModal from "../modals/ConfirmationModal";
import "./ChangeCredentials.css"

interface ChangeCredentialsProps {
    isShowing:boolean;
    workplaceData:Required<Pick<WorkplaceCreds,"companyName"|"id"|"loginName">>
    updateData:(data:Required<Pick<WorkplaceCreds,"companyName"|"id"|"loginName">>)=>void
    updateManagerPassword:(data:{currentManagerPassword:string,newManagerPassword:string,repeatNewManagerPassword:string})=>void
    updateOperatorPassword:(data:{currentOperatorPassword:string,newOperatorPassword:string,repeatNewOperatorPassword:string})=>void
    successUpdating:boolean|undefined
}


function ChangeCredentials(props:ChangeCredentialsProps){

    if(!props.workplaceData){return null}

    const options:string[] = ["Alterar nome da empresa","Alterar nome do login","Alterar password do gerente","Alterar password do operador"]
    const [selectedOption,setSelectedOption] = useState<string|undefined|null>(props.successUpdating === undefined ? undefined:undefined)
    const [errorMessage,setErrorMessage] = useState("")
    const [editWorkplaceData,setEditWorkplaceData] = useState(props.workplaceData)
    const [editManagerPassword,setEditManagerPassword] = useState({currentManagerPassword:"",newManagerPassword:"",repeatNewManagerPassword:""})
    const [editOperatorPassword,setEditOperatorPassword] = useState({currentOperatorPassword:"",newOperatorPassword:"",repeatNewOperatorPassword:""})  
    const [confirmationQuestion,setConfirmationQuestion] = useState("")
    const [confirmingType,setConfirmingType] = useState<"data"|"managerPassword"|"operatorPassword"|undefined>(undefined) 

    useEffect(()=>{setSelectedOption((prev)=>props.successUpdating === false ? prev: undefined)},[props.successUpdating])
    
    function handleSelectOption(option:string){
        setEditWorkplaceData(props.workplaceData!);
        setEditManagerPassword({currentManagerPassword:"",newManagerPassword:"",repeatNewManagerPassword:""});
        setEditOperatorPassword({currentOperatorPassword:"",newOperatorPassword:"",repeatNewOperatorPassword:""});
        setSelectedOption(option)

    }

    function handleChangeData(event:React.ChangeEvent<HTMLInputElement>,option:"data"|"managerPassword"|"operatorPassword"){
        if(option === "data"){
            setEditWorkplaceData((prev)=>{return {...prev,[event.target.name]:event.target.value}})
        }else if(option === "managerPassword"){
            setEditManagerPassword((prev)=>{return {...prev,[event.target.name]:event.target.value}})
        }else if(option === "operatorPassword"){
            setEditOperatorPassword((prev)=>{return {...prev,[event.target.name]:event.target.value}})
        }
    }

    function handleConfirmationForSubmition(event:React.SubmitEvent<HTMLFormElement>,option:"data"|"managerPassword"|"operatorPassword"){
        event.preventDefault()
        setConfirmationQuestion("Guardar alterações?")
        setConfirmingType(option)
    }

  

    function handleSubmit(option:"data"|"managerPassword"|"operatorPassword"){
        setConfirmationQuestion("")
        setConfirmingType(undefined)
        try{
            if(option === "data"){
          props.updateData(editWorkplaceData)
        }else if(option === "managerPassword"){
            if(editManagerPassword.newManagerPassword !== editManagerPassword.repeatNewManagerPassword){throw Error("Passwords não correspondem")}
            props.updateManagerPassword(editManagerPassword)
        }else if(option === "operatorPassword"){
            if(editOperatorPassword.newOperatorPassword !== editOperatorPassword.repeatNewOperatorPassword){throw Error("Passwords não correspondem")}
            props.updateOperatorPassword(editOperatorPassword)
        }
        }catch(error){
            if(error instanceof Error){
                setErrorMessage(error.message)
            }else{
                setErrorMessage("Ocorreu um erro ao alterar a passowrd")
            }
            
        }
        
        
        

    }

    function handleCancelEditing(type:"data"|"managerPassword"|"operatorPassword"){
    setSelectedOption(undefined)
    if(type === "data"){
         setEditWorkplaceData(props.workplaceData!)
    }else if(type === "managerPassword"){
       setEditManagerPassword({currentManagerPassword:"",newManagerPassword:"",repeatNewManagerPassword:""}) 
    }else if(type === "operatorPassword"){
        setEditOperatorPassword({currentOperatorPassword:"",newOperatorPassword:"",repeatNewOperatorPassword:""})
    }
    }

    function handleCancelSubmit(){
        setConfirmationQuestion("")
        setConfirmingType(undefined)
    }


if(!props.isShowing){return null}
    return <React.Fragment>
        <ConfirmationModal
         question={confirmationQuestion}
          handleCancel={handleCancelSubmit}
           handleConfirm={()=>handleSubmit(confirmingType!)}/>
        <ErrorModal errorMessage={errorMessage} onClosing={()=>setErrorMessage("")}/>
        <OptionsContainer>
      {window.innerWidth<650 ? !selectedOption ? <div className="change-credencials-container">
            <div className="settings-header"><h2>Alterar Credenciais</h2></div>
            <ul className="change-credentials-options-list">
                {options.map((item)=><li className="change-credentials-options-list-item" onClick={()=>handleSelectOption(item)}>{item}</li>)}
            </ul>
            
        </div> : null :<div className="change-credencials-container">
            <div className="settings-header"><h2>Alterar Credenciais</h2></div>
            <ul className="change-credentials-options-list">
                {options.map((item)=><li className="change-credentials-options-list-item" onClick={()=>handleSelectOption(item)}>{item}</li>)}
            </ul>
            
        </div>}      
    </OptionsContainer>
    {!selectedOption ? null : <OptionsContainer>
    {selectedOption === options[0] ? <div className="change-company-name-container change-selected-option-container">
        <div className="settings-header"><h2>Alterar nome da empresa</h2></div>
    <form className="change-credentials-form change-company-name-form" onSubmit={(event)=>handleConfirmationForSubmition(event,"data")}>
    <input className="change-credentials-input" type="text" name="companyName" value={editWorkplaceData.companyName} onChange={(event)=>handleChangeData(event,"data")}/>
    <div className="change-credentials-button-container">
        <input type="submit" value="Guardar"/>
        <button type="button" onClick={()=>handleCancelEditing("data")}> Cancelar </button>
    </div>
    
    </form>
</div>:selectedOption === options[1] ? <div className="change-selected-option-container">
    <div className="settings-header"><h2>Alterar nome do login</h2></div>
    <form className="change-credentials-form " onSubmit={(event)=>handleConfirmationForSubmition(event,"data")}>
     <input className="change-credentials-input" type="text" name="loginName" value={editWorkplaceData.loginName} onChange={(event)=>handleChangeData(event,"data")}/>
    <div className="change-credentials-button-container">
         <input type="submit" value="Guardar"/> 
     <button type="button" onClick={()=>handleCancelEditing("data")}> Cancelar </button>
    </div>
    
</form>
</div> :selectedOption === options[2] ?
<div className="change-selected-option-container">
    <div className="settings-header"><h2>Alterar palavra-passe do responsavel</h2></div>
    <form className="change-credentials-form" onSubmit={(event)=>handleConfirmationForSubmition(event,"managerPassword")}>
    <input className="change-credentials-input" type="password" placeholder="Password atual" name="currentManagerPassword" value={editManagerPassword.currentManagerPassword} onChange={(event)=>handleChangeData(event,"managerPassword")}/>
    <input className="change-credentials-input" type="password" placeholder="Nova password" name="newManagerPassword" value={editManagerPassword.newManagerPassword} onChange={(event)=>handleChangeData(event,"managerPassword")}/>
    <input className="change-credentials-input" type="password" placeholder="Repete a nova password" name="repeatNewManagerPassword" value={editManagerPassword.repeatNewManagerPassword} onChange={(event)=>handleChangeData(event,"managerPassword")}/>
     
     <div className="change-credentials-button-container"><input type="submit" value="Guardar"/>
     <button type="button" onClick={()=>handleCancelEditing("managerPassword")}> Cancelar </button></div>
     
     </form>
     </div>
 : selectedOption === options[3] ?
 <div className="change-selected-option-container">
    <div className="settings-header"><h2>Alterar palavra-passe do colaborador</h2></div>
    <form className="change-credentials-form" onSubmit={(event)=>handleConfirmationForSubmition(event,"operatorPassword")}>
    <input className="change-credentials-input" type="password" placeholder="Password atual" name="currentOperatorPassword" value={editOperatorPassword.currentOperatorPassword} onChange={(event)=>handleChangeData(event,"operatorPassword")}/>
    <input className="change-credentials-input" type="password" placeholder="Nova password" name="newOperatorPassword" value={editOperatorPassword.newOperatorPassword} onChange={(event)=>handleChangeData(event,"operatorPassword")}/>
    <input className="change-credentials-input" type="password" placeholder="Repete a nova password" name="repeatNewOperatorPassword" value={editOperatorPassword.repeatNewOperatorPassword} onChange={(event)=>handleChangeData(event,"operatorPassword")}/>
     
     <div className="change-credentials-button-container"><input type="submit" value="Guardar"/>
     <button type="button" onClick={()=>handleCancelEditing("operatorPassword")}>Cancelar</button></div>
     
     </form>
      </div>
  :null}

    </OptionsContainer>}
    
        </React.Fragment>
}

export default ChangeCredentials