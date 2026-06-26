
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
                setErrorMessage("Ocorreu um erro!")
            }else{
               setErrorMessage(error.message) 
            }
                }else{
                    setErrorMessage("ocorreu um erro ao obter as tarefas ativas")
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
                setErrorMessage("Ocorreu um erro!")
            }else{
               setErrorMessage(error.message) 
            }
                }else{
                    setErrorMessage("ocorreu um erro ao obter a lista de tarefas")
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
                setErrorMessage("Ocorreu um erro!")
            }else{
               setErrorMessage(error.message) 
            }
                }else{
                    setErrorMessage("ocorreu um erro ao obter a lista de operadores")
                }
            }
        }


         async function openTaskModal(id:string){
            props.setMenuIsClicked(false)
            try{
                setIsLoading(true)
                await getAllOperators()
                const task = taskArray.find((item)=>item.id === id)
                if(!task) {throw Error("ocorreu um erro ao selecionar a tarefa")}
                 setSelectedTask(task)
                 setStartTaskModalIsOpen(true)
            }catch(error){
               if(error instanceof Error){
                if(error.message === "Failed to fetch"){
                setErrorMessage("Ocorreu um erro!")
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
             setErrorMessage("Termina primeiro a tarefa atual!");
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
                setErrorMessage("Ocorreu um erro!")
            }else{
               setErrorMessage(error.message) 
            }
            }else{
                setErrorMessage("nao foi possivel adicionar tarefa")
            }
        }finally{
            setIsLoading(false)
        }
        
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
                setErrorMessage("Ocorreu um erro!")
            }else{
               setErrorMessage(error.message) 
            }
            }else{
                setErrorMessage("ocorreu um erro")
            }
        }finally{
            setIsLoading(false)
        }

    
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
                setErrorMessage("Ocorreu um erro!")
            }else{
               setErrorMessage(error.message) 
            }
            }else{
                setErrorMessage("sessão terminada, por reinicie a sessão")
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
    
    <Enviornment> <ActiveTasksList endTask={handleEndTask} activeTasksList={activeTasks}/>  </Enviornment>  
        </PageLayout>
}


export default HomePage