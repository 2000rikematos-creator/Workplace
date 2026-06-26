import { useState, useEffect } from "react";
import "./ActiveTask.css"
import type { ActiveTasksWithData} from "../../shared/Types";


type ActiveTaskProps = {
    task:ActiveTasksWithData;
    endTask:(id:string,timeEnd:number)=>void;

}

function ActiveTask(props:ActiveTaskProps){
    
const [milliseconds,setMilliseconds] = useState<number>(()=>Date.now()-props.task.timeStart)

   useEffect(() => {
    
    const id = setInterval(()=> setMilliseconds(Date.now()-props.task.timeStart), 1000);
    return () => clearInterval(id) ;
  }, [props.task.timeStart]);
   
     

    function handleEndTask(){
        props.endTask(props.task.id, Date.now())
    }
    return <li className="active-task">
      <div className="name-with-timer">
      <div className="name-and-internal-number-container">
        <h3>{props.task.operatorFirstName} {props.task.operatorLastName[0]}.</h3>
        <p className="active-task-internal-number">{props.task.internalNumber}</p>
      </div>
        <div className="timer-container">
          <p>{Math.floor(milliseconds / 3600000)}h{Math.floor((milliseconds % 3600000) / 60000)}m{Math.floor((milliseconds % 60000) / 1000)}s</p>
      </div>
      </div>
      

        {props.task.taskName.length>15 ? <h4>{props.task.taskName.slice(0,15)} ...</h4> : <h4>{props.task.taskName}</h4>  }
        <p className="end-task-button" onClick={handleEndTask}>Terminar</p>
  
        </li>
}

export default ActiveTask