import Modal from "./Modal";
import "./AllowDeviceName.css"
import { useState } from "react";
import ErrorModal from "./ErrorModal";


interface AllowDeviceModalProps {
    isShowing:boolean;
    addDevice:(name:string)=>void;
    onClosing:()=>void;
}

function AllowDeviceName(props:AllowDeviceModalProps){
    const [input,setInput] = useState("")
    const [errorMessage,setErrorMessage] = useState("")

    function handleSubmitName(){
        props.addDevice(input);
        setInput("")

    }

    if(!props.isShowing)return null
    return <Modal>
        <ErrorModal onClosing={()=>setErrorMessage("")} errorMessage={errorMessage}/>
       <div className="allow-device-modal">
        <div className="settings-header">
            <h1>Device Name</h1>
        </div>
        <input type="text" placeholder="device name" value={input} onChange={(e)=>setInput(e.target.value)}/>
        <div className="device-button-container">
        <button onClick={()=>handleSubmitName()}>Add device</button>
        <button onClick={()=>{props.onClosing();setInput("")}}>Cancel</button>
        </div>
        
        </div> 
    </Modal>
}

export default AllowDeviceName