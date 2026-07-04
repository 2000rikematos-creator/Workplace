import OptionsContainer from "./OptionsContainer";
import "./GetReport.css"

interface GetReportProps {
isShowing:boolean;
}

function GetReport(props:GetReportProps){
    if(!props.isShowing)return null
    return <OptionsContainer>
        <div className="get-report-container">
            <div className="settings-header">
                <h2>Workplace report</h2>
                <label htmlFor="time">Time interval:</label>
                <select id="time" name="time" className="select-time-dropdown">
                    <option>Last 8h</option>
                    <option>Last 24h</option>
                    <option>Last week</option>
                </select>
            </div>
        </div>
    </OptionsContainer>
}

export default GetReport