import "./TaskListitem.css"
import { type Task } from "../../shared/Types";

type TaskListItemProps = {

task:Partial<Pick<Task,"task"|"id">>;
startTask:(id:string)=>void

}

function TaskListItem(props:TaskListItemProps){

    function handleClick(){
        props.startTask(props.task.id!)
    }

return <li className="task-list-item" onClick={handleClick}>
   {props.task.task!.length>15 ? <h2 className="task-name">{props.task.task?.slice(0,15)}...</h2>: <h2 className="task-name">{props.task.task}</h2>}
</li>
}

export default TaskListItem