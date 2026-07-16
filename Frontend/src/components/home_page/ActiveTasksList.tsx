
import "./ActiveTasksList.css"
import ActiveTask from "./ActiveTask";
import type {ActiveTasksWithData } from "../../shared/Types";

type ActiveTasksListProps = {
    activeTasksList:ActiveTasksWithData[]
    endTask:(id:string)=>void;
}

function ActiveTasksList(props:ActiveTasksListProps){
if (props.activeTasksList.length === 0) return <h1 className="no-active-tasks-title">No currently active tasks</h1>
return <ul className="active-tasks-list">
{props.activeTasksList.map((item)=><ActiveTask key={item.id} endTask={props.endTask} task={item}/>)}
</ul>

}

export default ActiveTasksList