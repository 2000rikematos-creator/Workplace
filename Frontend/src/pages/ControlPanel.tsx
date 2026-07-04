import React,{ useContext, useEffect, useState } from "react";
import PageLayout from "../components/shared/PageLayout";
import SideBar from "../components/navigation/SideBar";
import ControlPanelOptions from "../components/control_panel/ControlPanelOptions";
import Enviornment from "../components/shared/Enviornment";
import ManageOperators from "../components/control_panel/ManageOperators";
import type {WorkplaceCreds, apiResponseData, apiResponseDataOperator, apiResponseDataOperatorlist, apiResponseDataTask, apiResponseDataTaskList, newOperator, Operator, Task, apiResponseDataUpdatedData,ControlPanelOptionsTypes } from "../shared/Types";
import OperatorInfo from "../components/control_panel/OperatorInfo";
import ManageTasks from "../components/control_panel/ManageTasks";
import LoadingModal from "../components/modals/LoadingModal";
import ErrorModal from "../components/modals/ErrorModal";
import { AuthContext } from "../context/AuthContext";
import ChangeCredentials from "../components/control_panel/ChangeCredentials";
import MessageModal from "../components/modals/MessageModal";
import { useNavigate } from "react-router";
import GetReport from "../components/control_panel/GetReport";

interface ControlPanelProps {
    menuIsClicked:boolean;
    setMenuIsClicked:(yn:boolean)=>void;
    windowWidth:number;
}



function ControlPanel(props:ControlPanelProps){

const [selectedOperator,setSelectedOperator] = useState<Operator|undefined>()
const optionsList:ControlPanelOptionsTypes[] = ["Manage staff", "Manage tasks","Manage profile","Get report"]
const [taskList,setTaskList] = useState<Task[]>([])
const [operatorsList, setOperatorsList] = useState<Operator[]>([])
const [selectedOption,setSelectedOption] = useState<ControlPanelOptionsTypes|undefined>("Manage staff")
const [isLoading, setisLoading] = useState(false)
const [errorMessage, setErrorMessage] = useState("")
const [token] = useState(()=>localStorage.getItem("token"))
const [managerToken] = useState(()=>localStorage.getItem("managerToken"))
const context = useContext(AuthContext)
const [successAddingOperator,setSuccessAddingOperator] = useState<boolean>(true)
const [successUpdatingOperator,setSuccessUpdatingOperator] = useState<boolean>(true)
const [message,setMessage] = useState("")
const [successUpdatingCreds,setSuccessUpdatingCreds] = useState<boolean|undefined>(undefined)
const navigate = useNavigate()

const backendUrl = import.meta.env.VITE_BACKEND_URL

useEffect(()=>{
    async function verifyManagerSession(){
        try{
            const response = await fetch(`${backendUrl}/settings/manager-session`,{headers:{"Authorization":`Bearer ${token}`,"Manager-Authorization":`Bearer ${managerToken}`}})
         const responseData = await response.json();
         if(!response.ok){throw Error(responseData.message)}
        }catch(error){
            if(error instanceof Error){
            if(error.message === "Failed to fetch"){
                setErrorMessage("Internal error")
            }else{
               setErrorMessage(error.message) 
            }
            }
            setTimeout(()=>{setErrorMessage("");navigate("/")},2000)
        }
        
    }

    const id = setInterval(verifyManagerSession,10000)
    return ()=>clearInterval(id)
},[])

useEffect(()=>{

    async function getAllTasks(){
        try{
            const response = await fetch(`${backendUrl}/tasks/all`,{headers:{"Authorization":`Bearer ${token}`}})
            const responseData:apiResponseDataTaskList = await response.json()
            if(!response.ok){throw new Error(responseData.message)}
            setTaskList(responseData.data)
        }catch(error){
            if(error instanceof Error){
                if(error.message === "Failed to fetch"){
                setErrorMessage("Internal error")
            }else{
               setErrorMessage(error.message) 
            }
            }
        }
    }

    async function getAllOperators(){

    try{
        const response = await fetch(`${backendUrl}/operators/all`,{headers:{"Authorization":`Bearer ${token}`}})
        const responseData:apiResponseDataOperatorlist = await response.json()
        if(!response.ok){throw Error(responseData.message)}
        setOperatorsList(responseData.data)
    }catch(error){
        if(error instanceof Error){
            if(error.message === "Failed to fetch"){
                setErrorMessage("Internal error")
            }else{
               setErrorMessage(error.message) 
            }
        }
    }
}

    async function initializeEnv(){
        setisLoading(true)
        try{
            await Promise.all([
                getAllOperators(),
                getAllTasks()
            ])
        }catch(error){
            if(error instanceof Error){
              if(error.message === "Failed to fetch"){
                setErrorMessage("Internal error")
            }else{
               setErrorMessage(error.message) 
            } 
            }else{
                setErrorMessage("Internal error")
            }
            
        }finally{
            
                setisLoading(false)
            
        }
    }
    
    initializeEnv()

    
},[selectedOption])

function handleSelectOption(option:ControlPanelOptionsTypes){
    if(option === "Get report"){
        getReportData()
    }
    props.setMenuIsClicked(false);
    setSuccessAddingOperator(true)
    const optionExists = optionsList.find((item)=>item === option)
    if(!optionExists) return 
    setSelectedOption(option)

}

async function handleAddOperator(newOperatorDetails:newOperator){
    setisLoading(true)
    try{
        const response = await fetch(`${backendUrl}/operators/add`,{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`,"Manager-Authorization":`Bearer ${managerToken}`},body:JSON.stringify(newOperatorDetails)})
        const responseData:apiResponseDataOperator = await response.json()
        if(!response.ok){throw new Error(responseData.message)}
        setOperatorsList((prev)=>[...prev,responseData.data])
        setSuccessAddingOperator(true)
        setMessage(responseData.message)
    }catch(error){
        setSuccessAddingOperator(false)
        if (error instanceof Error ){
            if(error.message === "Failed to fetch"){
                setErrorMessage("Internal error")
            }else{
               setErrorMessage(error.message) 
            }
        }
    }finally{
        setisLoading(false)
        setTimeout(()=>setMessage(""),1500)
    }
}

function handleSelectOperator(id:string){
const operatorExists = operatorsList.find((item)=>item.id === id)
if (!operatorExists) return
setSelectedOperator(operatorExists)
}

async function handleDeleteOperator(){
    setisLoading(true)
    try{
        const response = await fetch(`${backendUrl}/operators/delete/${selectedOperator!.id}`,{method:"DELETE",headers:{"Authorization":`Bearer ${token}`, "Manager-Authorization":`Bearer ${managerToken}`}})
        const responseData:{message:string} = await response.json()
        if(!response.ok){throw new Error(responseData.message)}
        setOperatorsList((prev)=>prev.filter((item)=>item.id !== selectedOperator!.id))
        setSelectedOperator(undefined)
        setMessage(responseData.message)
    }catch(error){
        if (error instanceof Error) {
            if(error.message === "Failed to fetch"){
                setErrorMessage("Internal error")
            }else{
               setErrorMessage(error.message) 
            }
        }
    }finally{
        setisLoading(false)
        setTimeout(()=>setMessage(""),1500)
    }
}

async function handleEditOperator(editedInput:Required<Pick<Operator, "firstName"|"lastName"|"phone">>){
    setisLoading(true)
   try{
    const response = await fetch(`${backendUrl}/operators/edit/${selectedOperator!.id}`,{method:"PATCH", headers:{"Content-Type":"application/json", "Authorization":`Bearer ${token}`,"Manager-Authorization":`Bearer ${managerToken}`},body:JSON.stringify(editedInput)})
    const responseData:apiResponseDataOperator = await response.json()
    if(!response.ok){throw Error(responseData.message)}
    setOperatorsList((prev)=> prev.map((op)=>op.id === selectedOperator!.id ? responseData.data:op))
    setSelectedOperator(responseData.data)
    setSuccessUpdatingOperator(true)
    setMessage(responseData.message)
}catch(error){
    setSuccessUpdatingOperator(false)
    if(error instanceof Error){
        if(error.message === "Failed to fetch"){
                setErrorMessage("Internal error")
            }else{
               setErrorMessage(error.message) 
            }
    }
   }finally{
    setisLoading(false)
    setTimeout(()=>setMessage(""),1500)
   }
}


async function handleAddNewTask(task:string){
    setisLoading(true)
    const newTask = {task:task}
    try{
        const response = await fetch(`${backendUrl}/tasks/add`,{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`,"Manager-Authorization":`Bearer ${managerToken}`},body:JSON.stringify(newTask)})
        const responseData:apiResponseDataTask = await response.json()
        if(!response.ok){throw new Error(responseData.message)}
        setTaskList((prev)=>[...prev,responseData.data])
        setMessage(responseData.message)
    }catch(error){
        if(error instanceof Error){
            if(error.message === "Failed to fetch"){
                setErrorMessage("Internal error")
            }else{
               setErrorMessage(error.message) 
            }
        }
    }finally{
        setisLoading(false)
        setTimeout(()=>setMessage(""),1500)
    }
}

async function handleDeleteTask(id:string){
    setisLoading(true)
    try{
        const response = await fetch(`${backendUrl}/tasks/delete/${id}`,{method:"DELETE",headers:{"Authorization":`Bearer ${token}`,"Manager-Authorization":`Bearer ${managerToken}`}})
        const responseData:apiResponseData = await response.json()
        if(!response.ok){throw new Error(responseData.message)}
        setTaskList((prev)=>prev.filter((item)=>item.id !== id))
        setMessage(responseData.message)
        
    }catch(error){
        if(error instanceof Error){
            if(error.message === "Failed to fetch"){
                setErrorMessage("Internal error")
            }else{
               setErrorMessage(error.message) 
            }
        }
    }finally{
        setisLoading(false);
        setTimeout(()=>setMessage(""),2000)
    }
}

async function verifySession(){
        try{
            const response = await fetch(`${backendUrl}/settings/verify-session`,{headers:{"Authorization":`Bearer ${token}`}})
            const responseData:apiResponseData = await response.json()
            if(!response.ok){throw new Error(responseData.message)}
        }catch(error){
            if(error instanceof Error){
                if(error.message === "Failed to fetch"){
                setErrorMessage("Internal error")
            }else{
               setErrorMessage(error.message) 
            }
            }else{
                setErrorMessage("Session expired please log in again")
            }
            
            setTimeout(()=>context!.logout(),5000)
        }
    }

    function handleSuccessUpdating(message:string){
        setSuccessUpdatingCreds(true)
        setMessage(message)
        setTimeout(() => {
            setMessage("")
            setSuccessUpdatingCreds(undefined)
        }, 1000);
    }

    async function handleUpdateWorkplaceData(data:Required<Pick<WorkplaceCreds,"companyName"|"loginName">>){
        setisLoading(true)
        if(!data){return}
        try{
            const response = await fetch(`${backendUrl}/settings/update/data`,{method:"PATCH",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`,"Manager-Authorization":`Bearer ${managerToken}`},body:JSON.stringify(data)})
            const responseData:apiResponseDataUpdatedData = await response.json()
            if(!response.ok){throw new Error(responseData.message)}
            context?.updateData(responseData.data)
            handleSuccessUpdating(responseData.message)
        }catch(error){
            if(error instanceof Error){
                if(error.message === "Failed to fetch"){
                setErrorMessage("Internal error")
            }else{
               setErrorMessage(error.message) 
            }
            }

        }finally{
            setisLoading(false)
        }
    }

   async function handleUpdateManagerPassword(data:{currentManagerPassword:string,newManagerPassword:string,repeatNewManagerPassword:string}){
        const {currentManagerPassword,newManagerPassword} = data
        const updated = {currentManagerPassword:currentManagerPassword,newManagerPassword:newManagerPassword}
        try{
            setisLoading(true)
            const response = await fetch(`${backendUrl}/settings/update/manager-password`,{method:"PATCH",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`,"Manager-Authorization":`Bearer ${managerToken}`},body:JSON.stringify(updated)})
            const responseData:apiResponseData = await response.json()
            if(!response.ok){throw Error(responseData.message)}
            handleSuccessUpdating(responseData.message)
        }catch(error){
            if(error instanceof Error){
                if(error.message === "Failed to fetch"){
                setErrorMessage("Internal error")
            }else{
               setErrorMessage(error.message) 
            }
            }
        }finally{
            setisLoading(false)
        }
    }

    async function handleUpdateOperatorPassword(data:{currentOperatorPassword:string,newOperatorPassword:string,repeatNewOperatorPassword:string}){
        const {currentOperatorPassword,newOperatorPassword} = data
        const updated = {currentOperatorPassword:currentOperatorPassword,newOperatorPassword:newOperatorPassword}
        try{
            setisLoading(true)
            const response = await fetch(`${backendUrl}/settings/update/operator-password`,{method:"PATCH",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`,"Manager-Authorization":`Bearer ${managerToken}`},body:JSON.stringify(updated)})
            const responseData:apiResponseData = await response.json()
            if(!response.ok){throw Error(responseData.message)}
            handleSuccessUpdating(responseData.message)
        }catch(error){
            if(error instanceof Error){
                if(error.message === "Failed to fetch"){
                setErrorMessage("Internal error")
            }else{
               setErrorMessage(error.message) 
            }
            }
        }finally{
            setisLoading(false)
        }
    }

    useEffect(()=>{
    const id = setInterval(()=>verifySession(),10000)
    return ()=> clearInterval(id)
    },[])

    useEffect(()=>{
        props.setMenuIsClicked(true)
    },[])

  async function handleDeleteProfile(){
    setisLoading(true)
    try{
        const response = await fetch(`${backendUrl}/settings/delete-profile`,{method:"DELETE",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`,"Manager-Authorization":`Bearer ${managerToken}`}})
        const responseData:apiResponseData = await response.json()
        if(!response.ok){
            throw Error(responseData.message)
        }
        setMessage(responseData.message)
        setTimeout(()=>{setMessage(""),context?.logout()},2000)
    }catch(error){
        if(error instanceof Error){
            setErrorMessage(error.message)
        }
    }finally{
        setisLoading(false)
    }
   }

     async function getReportData() {
            try{
                setisLoading(true)
              const response = await fetch(`${backendUrl}/active-tasks/finished-tasks`,{method:"GET",headers:{"Authorization":`Bearer ${token}`,"Manager-Authorization":`Bearer ${managerToken}`}})
                const responseData = response.json()
                console.log(responseData)
            }catch(error){
                console.log(error)
            }finally{
                setisLoading(false)
            }
        }


return <PageLayout>
    <MessageModal message={message}/>
    <ErrorModal onClosing={()=>setErrorMessage("")} errorMessage={errorMessage}/>
    <LoadingModal isShowing={isLoading}/>

    {props.windowWidth <900 ? props.menuIsClicked ? <SideBar clickAway={()=>props.setMenuIsClicked(false)} className="control-panel-menu" placement="left">
    <ControlPanelOptions selectOption={handleSelectOption} optionsList={optionsList} />
    </SideBar>: null : <SideBar clickAway={()=>props.setMenuIsClicked(false)} className="control-panel-menu" placement="left">
    <ControlPanelOptions selectedOption={selectedOption} selectOption={handleSelectOption} optionsList={optionsList} />
    </SideBar>}
    
    <Enviornment>
        <GetReport isShowing={selectedOption === "Get report"}/>
         <ManageTasks deleteTask={handleDeleteTask} addNewTask={handleAddNewTask} taskList={taskList} isShowing={selectedOption === optionsList[1]} />
        {props.windowWidth < 900 ? selectedOperator === undefined ? <ManageOperators selectedOperator={selectedOperator} addingOperator={!successAddingOperator} handleAddingOperator={(yn: boolean) => { setSuccessAddingOperator(!yn); if (yn === true) { setSelectedOperator(undefined) } }} selectOperator={handleSelectOperator} addOperator={handleAddOperator} isShowing={selectedOption === optionsList[0]} operatorsList={operatorsList} /> : <OperatorInfo isEditing={!successUpdatingOperator} handleEditOperatorButton={(yn: boolean) => { setSuccessUpdatingOperator(!yn) }} editOperator={handleEditOperator} deleteOperator={handleDeleteOperator} closeDetails={() => setSelectedOperator(undefined)} operatorSelected={selectedOption === optionsList[0] ? selectedOperator : undefined} /> : <React.Fragment> <ManageOperators selectedOperator={selectedOperator} addingOperator={!successAddingOperator} handleAddingOperator={(yn: boolean) => { setSuccessAddingOperator(!yn); if (yn === true) { setSelectedOperator(undefined) } }} selectOperator={handleSelectOperator} addOperator={handleAddOperator} isShowing={selectedOption === optionsList[0]} operatorsList={operatorsList} />
           <OperatorInfo isEditing={!successUpdatingOperator} handleEditOperatorButton={(yn:boolean)=>{setSuccessUpdatingOperator(!yn)}} editOperator={handleEditOperator} deleteOperator={handleDeleteOperator} closeDetails={()=>setSelectedOperator(undefined)} operatorSelected={selectedOption === optionsList[0] ? selectedOperator : undefined}/> </React.Fragment>} 
          
           {context?.workplaceData ? <ChangeCredentials
           deleteProfile={handleDeleteProfile}
           windowWidth = {props.windowWidth}
            successUpdating={successUpdatingCreds}
             isShowing={selectedOption === optionsList[2]}
              workplaceData={context.workplaceData} 
              updateData={handleUpdateWorkplaceData}
              updateManagerPassword={handleUpdateManagerPassword}
              updateOperatorPassword={handleUpdateOperatorPassword}
              />:null} 
           </Enviornment>
</PageLayout>
}

export default ControlPanel