import QuestionMark from "../icons/QuestionMark";
import Modal from "./Modal";
import "./ConfirmationModal.css"

interface ConfirmationModalProps {
    question:string;
    handleConfirm:()=>void
    handleCancel:()=>void
}

function ConfirmationModal(props:ConfirmationModalProps){
if(!props.question){return null}
    return <Modal>
<div className="confirmation-modal"><div className="confirmation-modal-header">
    <QuestionMark />
    </div> 
    <h1>{props.question}</h1><div className="confirmation-modal-button-container">
        <button className="confirmation-modal-confirm-button" onClick={()=>props.handleConfirm()}>Confirm</button>
            <button className="confirmation-modal-cancel-button" onClick={()=>props.handleCancel()}>Cancel</button> </div>
        </div>
</Modal>
}

export default ConfirmationModal