import React, {useState} from "react";
import OptionsContainer from "./OptionsContainer";
import { type Task } from "../../shared/Types";
import "./ManageTasks.css"
import AddIcon from "../icons/AddIcon";
import DeleteIcon from "../icons/DeleteIcon";
import ConfirmationModal from "../modals/ConfirmationModal";

type CurrentAction = "deleteTask"|"addTask"|undefined

type ManageTasksType = {
    isShowing:boolean
    taskList:Task[]
    addNewTask:(task:string)=>void
    deleteTask:(id:string)=>void
}

function ManageTasks(props:ManageTasksType){
    const [isAddingTask,setIsAddingTask] = useState(false)
    const [taskInput, setTaskInput] = useState("")
    const [currentAction,setCurrentAction] = useState<CurrentAction>(undefined)
    const [confirmationQuestion,setConfirmationQuestion] = useState("")
    const [currentTask,setCurrentTask] = useState<Task|undefined>(undefined)

    function handleAddTaskInput(event:React.ChangeEvent<HTMLInputElement, HTMLInputElement>){
        setTaskInput(event.target.value)
    }

    function handleConfirm(){
        if(currentAction === "deleteTask"){
            props.deleteTask(currentTask!.id)
        }
        setConfirmationQuestion("")
        setCurrentAction(undefined)
    }

    if(!props.isShowing){return null}

    return <OptionsContainer>
        <ConfirmationModal question={confirmationQuestion} handleConfirm={()=>handleConfirm()} handleCancel={()=>{setConfirmationQuestion("");setCurrentAction(undefined);setCurrentTask(undefined)}}/>
        <div className="manage-tasks-container">
            <div className="manage-tasks-header settings-header">
                {isAddingTask ? <div className="add-task-form">
                <h2 className="settings-title">Add task</h2>
                <div className="manage-tasks-add-task-form">
                    <input autoFocus type="text" onChange={handleAddTaskInput} value={taskInput} placeholder="task"/>
                <div className="manage-tasks-add-task-form-button-container">
                    <button className="add-task" onClick={()=>{props.addNewTask(taskInput); setIsAddingTask(false);setTaskInput("")}}>Add</button>
                <button className="cancel-add-task" onClick={()=>{setIsAddingTask(false); setTaskInput("")}} className="manage-tasks-add-task-form-cancel-button">Cancel</button> </div>
                </div>
                
            </div>:<React.Fragment><h2 className="settings-title">Manage tasks</h2> <AddIcon onClick={()=>setIsAddingTask(true)}/></React.Fragment>}
            </div>
            
                    {props.taskList.length<1 ? <h2 className="no-list-title">Nothing to show</h2>:<ul className="current-tasks-list">
                {props.taskList.map((item)=><li className="current-task-list-item"><p className="current-task-list-item">{item.task}</p> <DeleteIcon className="delete-task-button" onClick={()=>{setCurrentTask(item);setCurrentAction("deleteTask");setConfirmationQuestion("Are you sure you want to delete this task?")}}/></li>)}
            </ul>}
            
        </div>
    </OptionsContainer>
}

export default ManageTasks