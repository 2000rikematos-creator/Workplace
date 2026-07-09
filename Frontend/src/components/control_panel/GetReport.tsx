import OptionsContainer from "./OptionsContainer";
import "./GetReport.css"
import type { FinishedTasksWithData } from "../../shared/Types";
import ReportList from "./ReportList";
import MessageModal from "../modals/MessageModal";
import { useEffect, useState } from "react";

interface GetReportProps {
isShowing:boolean;
data:FinishedTasksWithData[]|undefined
selectTime:(option:"8"|"24"|"168")=>void
windowIsSmall:boolean;
}

function GetReport(props:GetReportProps){
    const [message,setMessage] = useState("")
    
useEffect(()=>{if(props.windowIsSmall){
        setMessage("Rotate the screen for better viewing")
    }else{
            setMessage("")
        }},[props.windowIsSmall])
    


    if(!props.isShowing)return null

    return <OptionsContainer>
        <MessageModal onClosing={()=>setMessage("")} message={message}/>
        <div className="get-report-container">
            <div className="settings-header report-header">
                <h2>Workplace report</h2>
                <label htmlFor="time">Finished in the last</label>
                <select id="time" name="time" className="select-time-dropdown" onChange={(e)=>props.selectTime(e.target.value as "8"|"24"|"168")}>
                    <option value="8">8h</option>
                    <option value="24">24h</option>
                    <option value="168">Week</option>
                </select>
            </div>
            <ReportList list={props.data}/>
        </div>
    </OptionsContainer>
}

export default GetReport