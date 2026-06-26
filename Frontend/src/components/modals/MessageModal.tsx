import Modal from "./Modal";
import "./MessageModal.css"
import CheckIcon from "../icons/CheckIcon";

interface MessageModalProps {
    message:string
}

function MessageModal(props:MessageModalProps){

    if(!props.message){return null}

    return <Modal>
<div className="message-modal"><div className="message-modal-header">
    <CheckIcon />
    </div> 
    <h1>{props.message}</h1>
    </div>
</Modal>
}

export default MessageModal