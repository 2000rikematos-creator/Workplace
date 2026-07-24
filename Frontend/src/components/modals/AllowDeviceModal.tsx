import QuestionMark from "../icons/QuestionMark";
import Modal from "./Modal";
import "./AllowDeviceModal.css"
import { useState } from "react";
import AllowDeviceName from "./AllowDeviceName";

interface AllowDeviceModalProps {
    isShowing:boolean;
    handleCancel:()=>void;
    addDevice:(password:string,companyId:string|undefined,deviceName:string)=>void;
    justAllow:(password:string,companyId:string|undefined)=>void;
    companyId:string|undefined;
}

function AllowDeviceModal(props:AllowDeviceModalProps){
const [passwordInput,setPasswordInput] = useState("")
const [deviceNameIsShowing,setDeviceNameIsShowing] = useState(false)

function handleAddDevice(name:string){
props.addDevice(passwordInput,props.companyId,name)
setDeviceNameIsShowing(false)
}

if(!props.isShowing && !props.companyId){return null}
    return <Modal>
        <AllowDeviceName onClosing={()=>setDeviceNameIsShowing(false)} addDevice={handleAddDevice} isShowing={deviceNameIsShowing}/>
<div className="confirmation-modal allowed-device-modal">
    <div className="confirmation-modal-header">
    <QuestionMark />
    </div> 
    <h1>Unknown device</h1>
    <h2>Authorization required</h2>
        <div className="allow-device-button-container">
         <input type="password" placeholder="Manager Password" value={passwordInput} onChange={(e)=>setPasswordInput(e.target.value)}/>   
        <button className="allow-device-button" onClick={()=>props.justAllow(passwordInput,props.companyId)}>Allow just this time</button>
        <button className="allow-device-button" onClick={()=>setDeviceNameIsShowing(true)}>Add device</button>
        <button className="allow-device-button" onClick={()=>props.handleCancel()}>Cancel</button>
        </div>
        </div>
</Modal>
}

export default AllowDeviceModal