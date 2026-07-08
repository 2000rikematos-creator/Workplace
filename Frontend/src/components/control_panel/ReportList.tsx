import type { FinishedTasksWithData } from "../../shared/Types"
import "./ReportList.css"
import ReportListItem from "./ReportListItem";

interface ReportListProps {
    list:FinishedTasksWithData[]|undefined;
}


function ReportList(props:ReportListProps){
    if(props.list === undefined || props.list.length<1){
        return <li className="nothing-to-show-report"><p>Nothing to show</p></li>
    }

    

return <div className="report-list-table">

    <ul className="report-list">
        <div className="report-list-header">
        <p>Name</p>
        <p>Internal number</p>
        <p>Task</p>
        <p>Started</p>
        <p>Finished</p>
        <p>Total</p>
        </div>
    {props.list.map((item)=><ReportListItem
    internalNumber={item.internalNumber}
    firstName={item.firstName}
     lastName={item.lastName}
    task={item.task} 
    timeStart={item.timeStart} 
    timeEnd={item.timeEnd} 
    id={item.id} 
    />)}
</ul>
</div>

}

export default ReportList