import "./TaskList.css"
import TaskListItem from "./TaskListItem";
import type { Task } from "../../shared/Types";

type TaskListProps = {
taskListArray:Task[]
startTask:(id:string)=>void
}

function TaskList(props:TaskListProps){
    if(props.taskListArray.length<1) return <h1 className="no-task-list-title">No tasks available, please add them in the control panel</h1>
return <ul className="task-list">
{props.taskListArray.map((item)=><TaskListItem startTask={props.startTask} key={item.id} task={item} />)}
</ul>
}

export default TaskList
