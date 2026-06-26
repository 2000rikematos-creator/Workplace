
import "./LoadingModal.css"
import Modal from "./Modal";

type LoadingModalProps = {
    isShowing:boolean;
}

function LoadingModal(props:LoadingModalProps){
    if(!props.isShowing){return null}
    return <Modal><div className="loading-spinner"></div> </Modal>
}

export default LoadingModal