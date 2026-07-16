import { useState, useEffect, useContext } from "react";
import "./ActiveTask.css"
import type { ActiveTasksWithData, apiCurrentTimeResponseData} from "../../shared/Types";
import { AuthContext } from "../../context/AuthContext";
import ErrorModal from "../modals/ErrorModal";


type ActiveTaskProps = {
    task:ActiveTasksWithData;
    endTask:(id:string)=>void;

}

function ActiveTask(props:ActiveTaskProps){

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const context = useContext(AuthContext)
  const token = context?.token
  const [offset,setOffset] = useState(0)
  const [errorMessage,setErrorMessage] = useState("")



 useEffect(()=>{

   async function getCurrentTime(){
      try{
        const response = await fetch(backendUrl+"/active-tasks/current-time",{headers:{"Authorization":`Bearer ${token}`}})
        const responseData:apiCurrentTimeResponseData = await response.json();
        if (!response.ok){throw Error("Internal error")}
        const currentServerTime = responseData.data;
        setOffset(Date.now()-currentServerTime);
      }catch(error){
        if(error instanceof Error){
          setErrorMessage(error.message)
        }
      }
    }

    getCurrentTime()},[])
    
const [milliseconds,setMilliseconds] = useState<number>(Date.now()-props.task.timeStart)

   useEffect(() => {
    const id = setInterval(()=> {setMilliseconds((Date.now()-offset)-props.task.timeStart)}, 1000);
    return () => clearInterval(id) ;
  }, [props.task.timeStart,offset]);

   async function handleEndTask(){
    props.endTask(props.task.id)

    }


    return <li className="active-task">
      <ErrorModal errorMessage={errorMessage} onClosing={()=>setErrorMessage("")}/>
      {props.task.taskName.length>15 ? <h4>{props.task.taskName.slice(0,15)} ...</h4> : <h4>{props.task.taskName}</h4>  }
      <div className="active-task-info-container">
        <div className="name-with-timer">
      <div className="name-and-internal-number-container">
        <h3>{props.task.operatorFirstName} {props.task.operatorLastName[0]}.</h3>
        <p className="active-task-internal-number">{props.task.internalNumber}</p>
      </div>
        <div className="timer-container">
          <p>{Math.floor(Math.max(0,milliseconds) / 3600000)}h{Math.floor((Math.max(0,milliseconds) % 3600000) / 60000)}m{Math.floor((Math.max(0,milliseconds) % 60000) / 1000)}s</p>
      </div>
      </div>
        
      </div>
      <p className="end-task-button" onClick={handleEndTask} tabIndex={0}>End task</p>
  
        </li>
}

export default ActiveTask