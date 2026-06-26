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
        if(currentAction === "addTask"){
            props.addNewTask(taskInput);
             setIsAddingTask(false);
            setTaskInput("")
        }
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
                <h2 className="settings-title">Adicionar tarefas</h2>
                <div className="manage-tasks-add-task-form">
                    <input autoFocus type="text" onChange={handleAddTaskInput} value={taskInput} placeholder="Tarefa"/>
                <div className="manage-tasks-add-task-form-button-container">
                    <button onClick={()=>{setCurrentAction("addTask"); setConfirmationQuestion("Criar tarefa?")}}>Adicionar</button>
                <button onClick={()=>{setIsAddingTask(false); setTaskInput("")}} className="manage-tasks-add-task-form-cancel-button">Cancelar</button> </div>
                </div>
                
            </div>:<React.Fragment><h2 className="settings-title">Gerir tarefas</h2> <AddIcon onClick={()=>setIsAddingTask(true)}/></React.Fragment>}
            </div>
            
           
            
            <ul className="current-tasks-list">
                {props.taskList.map((item)=><li className="current-task-list-item"><p className="current-task-list-item">{item.task}</p> <DeleteIcon className="delete-task-button" onClick={()=>{setCurrentTask(item);setCurrentAction("deleteTask");setConfirmationQuestion("Pretende eliminar esta tarefa permanentemente?")}}/></li>)}
            </ul>
        </div>
    </OptionsContainer>
}

export default ManageTasks