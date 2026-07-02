import Modal from "./Modal";
import "./ErrorModal.css"
import InfoIcon from "../icons/InfoIcon";

type ErrorModalProps = {
    onClosing:()=>void
    errorMessage:string
}

function ErrorModal(props:ErrorModalProps){
    if(!props.errorMessage) return null
return <Modal onClosing={props.onClosing}>
<div className="error-modal"><div className="error-modal-header">
    <InfoIcon />
    </div> 
    <h1>{props.errorMessage}</h1> <button className="close-error-modal-button" onClick={props.onClosing}>Ok, got it</button></div>
</Modal>
}

export default ErrorModal