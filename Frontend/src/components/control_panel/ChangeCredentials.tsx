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
    successUpdating:boolean|undefined;
    windowWidth:number;
    deleteProfile:()=>void;
}

type Options = "Alterar nome da empresa"|"Alterar nome do login"|"Alterar palavra-passe do responsável"|"Alterar palavra-passe do colaborador"|"Eliminar perfil"


function ChangeCredentials(props:ChangeCredentialsProps){

    if(!props.workplaceData){return null}

    const options:Options[] = ["Alterar nome da empresa","Alterar nome do login","Alterar palavra-passe do responsável","Alterar palavra-passe do colaborador","Eliminar perfil"]
    const [selectedOption,setSelectedOption] = useState<Options|undefined|null>(props.successUpdating === undefined ? undefined:undefined)
    const [errorMessage,setErrorMessage] = useState("")
    const [editWorkplaceData,setEditWorkplaceData] = useState(props.workplaceData)
    const [editManagerPassword,setEditManagerPassword] = useState({currentManagerPassword:"",newManagerPassword:"",repeatNewManagerPassword:""})
    const [editOperatorPassword,setEditOperatorPassword] = useState({currentOperatorPassword:"",newOperatorPassword:"",repeatNewOperatorPassword:""})  
    const [confirmationQuestion,setConfirmationQuestion] = useState("")
    const [confirmingType,setConfirmingType] = useState<"data"|"managerPassword"|"operatorPassword"|undefined>(undefined) 

    useEffect(()=>{setSelectedOption((prev)=>props.successUpdating === false ? prev: undefined)},[props.successUpdating])
    
    function handleSelectOption(option:Options){
        if(option === "Eliminar perfil"){
            setConfirmationQuestion("Pretende eliminar permanentemente este perfil e todos os dados a ele associados?")
        }
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


    function handleConfirm(){
        if(selectedOption === "Eliminar perfil"){
            props.deleteProfile()
            setConfirmationQuestion("")
        }else{
            handleSubmit(confirmingType!)
            setConfirmationQuestion("")
        }
    }

if(!props.isShowing){return null}
    return <React.Fragment>
        <ConfirmationModal
         question={confirmationQuestion}
          handleCancel={handleCancelSubmit}
           handleConfirm={handleConfirm}/>
        <ErrorModal errorMessage={errorMessage} onClosing={()=>setErrorMessage("")}/>
            
            {props.windowWidth<900 ? !selectedOption ? <OptionsContainer>
       <div className="change-credencials-container">
            <div className="settings-header"><h2>Gerir perfil</h2></div>
            <ul className="change-credentials-options-list">
                {options.map((item)=><li className="change-credentials-options-list-item" onClick={()=>handleSelectOption(item)}>{item}</li>)}
            </ul>
            
        </div> </OptionsContainer> : null : <OptionsContainer><div className="change-credencials-container">
            <div className="settings-header"><h2>Gerir perfil</h2></div>
            <ul className="change-credentials-options-list">
                {options.map((item)=><li style={selectedOption === item ? {backgroundColor:"var(--secondary-color)",color:"var(--light-color)"}:undefined} className="change-credentials-options-list-item" onClick={()=>handleSelectOption(item)}>{item}</li>)}
            </ul>
        </div>    
    </OptionsContainer>}

    {!selectedOption ? null : <OptionsContainer>
    {selectedOption === options[0] ? <div className="change-company-name-container change-selected-option-container">
        <div className="settings-header"><h2>{options[0]}</h2></div>
    <form className="change-credentials-form change-company-name-form" onSubmit={(event)=>handleConfirmationForSubmition(event,"data")}>
    <input className="change-credentials-input" type="text" name="companyName" value={editWorkplaceData.companyName} onChange={(event)=>handleChangeData(event,"data")}/>
    <div className="change-credentials-button-container">
        <input type="submit" value="Guardar"/>
        <button type="button" onClick={()=>handleCancelEditing("data")}>Cancelar</button>
    </div>
    
    </form>
</div>:selectedOption === options[1] ? <div className="change-selected-option-container">
    <div className="settings-header"><h2>{options[1]}</h2></div>
    <form className="change-credentials-form " onSubmit={(event)=>handleConfirmationForSubmition(event,"data")}>
     <input className="change-credentials-input" type="text" name="loginName" value={editWorkplaceData.loginName} onChange={(event)=>handleChangeData(event,"data")}/>
    <div className="change-credentials-button-container">
         <input type="submit" value="Guardar"/> 
     <button type="button" onClick={()=>handleCancelEditing("data")}>Cancelar</button>
    </div>
    
</form>
</div> :selectedOption === options[2] ?
<div className="change-selected-option-container">
    <div className="settings-header"><h2>{options[2]}</h2></div>
    <form className="change-credentials-form" onSubmit={(event)=>handleConfirmationForSubmition(event,"managerPassword")}>
    <input className="change-credentials-input" type="password" placeholder="Palavra-passe atual" name="currentManagerPassword" value={editManagerPassword.currentManagerPassword} onChange={(event)=>handleChangeData(event,"managerPassword")}/>
    <input className="change-credentials-input" type="password" placeholder="Nova palavra-passe" name="newManagerPassword" value={editManagerPassword.newManagerPassword} onChange={(event)=>handleChangeData(event,"managerPassword")}/>
    <input className="change-credentials-input" type="password" placeholder="Repete a nova palavra-passe" name="repeatNewManagerPassword" value={editManagerPassword.repeatNewManagerPassword} onChange={(event)=>handleChangeData(event,"managerPassword")}/>
     
     <div className="change-credentials-button-container"><input type="submit" value="Guardar"/>
     <button type="button" onClick={()=>handleCancelEditing("managerPassword")}>Cancelar</button></div>
     
     </form>
     </div>
 : selectedOption === options[3] ?
 <div className="change-selected-option-container">
    <div className="settings-header"><h2>{options[3]}</h2></div>
    <form className="change-credentials-form" onSubmit={(event)=>handleConfirmationForSubmition(event,"operatorPassword")}>
    <input className="change-credentials-input" type="password" placeholder="Palavra-passe atual" name="currentOperatorPassword" value={editOperatorPassword.currentOperatorPassword} onChange={(event)=>handleChangeData(event,"operatorPassword")}/>
    <input className="change-credentials-input" type="password" placeholder="Nova palavra-passe" name="newOperatorPassword" value={editOperatorPassword.newOperatorPassword} onChange={(event)=>handleChangeData(event,"operatorPassword")}/>
    <input className="change-credentials-input" type="password" placeholder="Repete a nova palavra-passe" name="repeatNewOperatorPassword" value={editOperatorPassword.repeatNewOperatorPassword} onChange={(event)=>handleChangeData(event,"operatorPassword")}/>
     
     <div className="change-credentials-button-container"><input type="submit" value="Guardar"/>
     <button type="button" onClick={()=>handleCancelEditing("operatorPassword")}>Cancelar</button></div>
     
     </form>
      </div>
  :null}

    </OptionsContainer>}
    
        </React.Fragment>
}

export default ChangeCredentials