
import Enviornment from "../components/shared/Enviornment";
import StartTaskModal from "../components/modals/StartTaskModal";
import SideBar from "../components/navigation/SideBar";
import PageLayout from "../components/shared/PageLayout";
import {type Operator, type ActiveTasks, type Task,type apiResponseDataAllActiveTasks,type apiResponseData, type apiResponseDataAddActiveTask, type apiResponseDataTasks, type apiResponseDataOperatorsList, type ActiveTasksWithData } from "../shared/Types";
import { useEffect, useState,useContext } from "react";
import ErrorModal from "../components/modals/ErrorModal";
import TaskList from "../components/home_page/TaskList";
import ActiveTasksList from "../components/home_page/ActiveTasksList";
import LoadingModal from "../components/modals/LoadingModal";
import { AuthContext } from "../context/AuthContext";
import ConfirmationModal from "../components/modals/ConfirmationModal";

interface HomePageProps {
    menuIsClicked:boolean;
    smallScreenSize:number;
    windowWidth:number;
    sideBarClickAway:()=>void
    setMenuIsClicked:(yn:boolean)=>void;
}

function HomePage(props:HomePageProps){
    const [errorMessage, setErrorMessage] = useState("")
    const [operatorsCorespondingArray,setOperatorsCorespondingArray] = useState<Operator[]>([])
    const [startTaskModalIsOpen, setStartTaskModalIsOpen] = useState(false)
    const [selectedTask, setSelectedTask]= useState<Task|undefined>(undefined)
    const [taskArray,setTaskArray] = useState<Task[]>([])
    const [activeTasks,setActiveTasks]= useState<ActiveTasksWithData[]>([])
    const [operatorsList, setOperatorsList] = useState<Operator[]>([])
    const [isLoading,setIsLoading] = useState(false)
    const context = useContext(AuthContext)
    const [confirmationQuestion,setConfirmationQuestion] = useState("")
    const [taskToDelete,setTaskToDelete] = useState<{id:string,timeEnd:number}|undefined>(undefined)
    let token = context?.token
    
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL


    useEffect(()=>{
        
        async function getAllActiveTasks(){
            try{
                const response = await fetch(`${backendUrl}/active-tasks/all`,{headers:{"Authorization":`Bearer ${token}`}})
                const responseData:apiResponseDataAllActiveTasks = await response.json()
                if(!response.ok){throw new Error(responseData.message)}
                setActiveTasks(responseData.data)
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

        async function getAllTasks(){
            try{
                const response = await fetch(`${backendUrl}/tasks/all`,{headers:{"Authorization":`Bearer ${token}`}})
                const responseData:apiResponseDataTasks = await response.json()
                if(!response.ok){throw new Error(responseData.message)} 
                setTaskArray(responseData.data)
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

        let intervalId:number|undefined

async function initializeEnv(){
    try{
          setIsLoading(true)
       await Promise.all([
        getAllActiveTasks(),
         getAllTasks()
        ]) 

        intervalId = setInterval(async()=>{
         await getAllActiveTasks()
        },1000)
          
        }catch(error){
            if(error instanceof Error){
               setErrorMessage(error.message) 
            }
        }finally{
            setIsLoading(false)
        }
}
        
        
         initializeEnv()
        
       return ()=>{clearInterval(intervalId)} 
        
    },[token])



   

    async function getAllOperators(){
            try {
                const response = await fetch(`${backendUrl}/operators/all`,{headers:{"Authorization":`Bearer ${token}`}})
                const responseData:apiResponseDataOperatorsList = await response.json()
                if(!response.ok){throw new Error(responseData.message)}
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


         async function openTaskModal(id:string){
            props.setMenuIsClicked(false)
            try{
                setIsLoading(true)
                await getAllOperators()
                const task = taskArray.find((item)=>item.id === id)
                if(!task) {throw Error("Internal error")}
                 setSelectedTask(task)
                 setStartTaskModalIsOpen(true)
            }catch(error){
               if(error instanceof Error){
                if(error.message === "Failed to fetch"){
                setErrorMessage("internal error")
            }else{
               setErrorMessage(error.message) 
            }
               } 
            }finally{
                setIsLoading(false)
            }
         

    }

    function searchOperator(name:string){
        const operatorsCoresponding:Operator[] = operatorsList.filter((item)=> (item.firstName.toLowerCase() +" "+ item.lastName.toLowerCase()).includes(name.toLowerCase()))   
        setOperatorsCorespondingArray(operatorsCoresponding)
    }

   async function handleSelectOperator(operatorId:string,taskId:string){
    setIsLoading(true)
        const operatorIsActive = activeTasks.find((item)=>item.operatorId === operatorId)
        if(operatorIsActive){
            setStartTaskModalIsOpen(false);
             setErrorMessage("Finish the active task first");
              setIsLoading(false)
              return
            }

        const activeTask:Required<Pick<ActiveTasks, "operatorId"|"taskId">> = {operatorId:operatorId, taskId:taskId}
        try{
            const response = await fetch(`${backendUrl}/active-tasks/add`,{method:"POST",headers:{"Content-type":"application/json","Authorization":`Bearer ${token}`},body:JSON.stringify(activeTask)})
            const responseData:apiResponseDataAddActiveTask = await response.json()
            if(!response.ok){throw new Error(responseData.message)}
            setActiveTasks((prev)=>[...prev,responseData.data])
            setStartTaskModalIsOpen(false)
        }catch(error){
            if(error instanceof Error){
                if(error.message === "Failed to fetch"){
                setErrorMessage("Internal error")
            }else{
               setErrorMessage(error.message) 
            }
            }
        }finally{
            setIsLoading(false)
        }
        
    }

    function confirmEndtask(id:string,timeEnd:number){
        setConfirmationQuestion("End task?")
        setTaskToDelete({id,timeEnd})
    }

    

    async function handleEndTask(id:string, timeEnd:number){

        setIsLoading(true)

        const findTask = activeTasks.find((item)=>item.id === id)
        if(!findTask){return setErrorMessage("occoreu um erro")}
        try{
            const response = await fetch(`${backendUrl}/active-tasks/end/${id}`,{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},body:JSON.stringify({timeEnd:timeEnd})})
            const responseData = await response.json()
            if(!response.ok){throw Error(responseData.message)}
            setActiveTasks((prev)=>prev.filter((item)=>item.id !== id))
        }catch(error){
            if(error instanceof Error){
                if(error.message === "Failed to fetch"){
                setErrorMessage("Internal error")
            }else{
               setErrorMessage(error.message) 
            }
            }
        }finally{
            setIsLoading(false)
            
        }

    
    }

    function handleConfirm(){
        handleEndTask(taskToDelete!.id,taskToDelete!.timeEnd)
        setConfirmationQuestion("")
    }

  

    useEffect(()=>{

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
                setErrorMessage("Session error")
            }
            
            setTimeout(()=>{setErrorMessage("");context!.logout()},2000)
        }
    }

    const id = setInterval(()=>verifySession(),10000)
    return ()=> clearInterval(id)
    },[token])
    

   return <PageLayout>
    <LoadingModal isShowing={isLoading} />
    <ErrorModal onClosing={()=>{setErrorMessage("")}} errorMessage={errorMessage}/>
        <ConfirmationModal question={confirmationQuestion} handleConfirm={handleConfirm} handleCancel={()=>{setTaskToDelete(undefined);setConfirmationQuestion("")}}/>
    <StartTaskModal
     searchOperator={searchOperator}
      onClosing={()=>setStartTaskModalIsOpen(false)}
       isOpen={startTaskModalIsOpen}
        task={selectedTask!}
        operatorsCorespondingArray={operatorsCorespondingArray}
        selectOperator={handleSelectOperator}
        />
        {props.windowWidth > 900 ? <SideBar placement="left"> <TaskList startTask={openTaskModal} taskListArray={taskArray}/> </SideBar>
        : props.menuIsClicked ? <SideBar placement="left" clickAway={()=>props.sideBarClickAway()}> <TaskList startTask={openTaskModal} taskListArray={taskArray}/> </SideBar>:null}
    
    <Enviornment> <ActiveTasksList endTask={confirmEndtask} activeTasksList={activeTasks}/>  </Enviornment>  
        </PageLayout>
}


export default HomePage