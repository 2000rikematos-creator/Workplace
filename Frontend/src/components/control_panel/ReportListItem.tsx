import type { FinishedTasksWithData } from "../../shared/Types"
import "./ReportListItem.css"


 function ReportListItem(props:FinishedTasksWithData){
    const timeStart = new Date(parseInt(props.timeStart))
    const timeEnd = new Date(parseInt(props.timeEnd))
    const totalTime = parseInt(props.timeEnd) - parseInt(props.timeStart)
     return <li className="report-list-item">
        <p className="finished-task-operator-name">{props.firstName} {props.lastName}</p>
        <p className="finished-tasks-operator-internal-number">{props.internalNumber}</p>
        <p className="finished-tasks-task">{props.task}</p>
        <p className="finished-tasks-time-start">{timeStart.getHours()}h{timeStart.getMinutes()}m{timeStart.getSeconds()}s | {timeStart.getDate()<9 ? "0"+timeStart.getDate():timeStart.getDate()}/{timeStart.getMonth()+1 <9 ? "0" + timeStart.getMonth():timeStart.getMonth()}/{timeStart.getFullYear()}</p>
        <p className="finished-tasks-time-end">{timeEnd.getHours()}h{timeEnd.getMinutes()}m{timeEnd.getSeconds()}s | {timeEnd.getDate() < 9 ? "0" + timeEnd.getDate():timeEnd.getDate()}/{timeEnd.getMonth()+1<9? "0"+timeEnd.getMonth():timeEnd.getMonth()}/{timeEnd.getFullYear()}</p>
        <p className="finished-tasks-total-time">{Math.floor(totalTime / 3600000)}h{Math.floor((totalTime % 3600000) / 60000)}m{Math.floor((totalTime % 60000) / 1000)}s</p>
        </li>
 }

 export default ReportListItem