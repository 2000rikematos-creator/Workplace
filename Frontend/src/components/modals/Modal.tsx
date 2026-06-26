import React from "react";
import { createPortal } from "react-dom";
import "./Modal.css"

type ModalProps = {
children:React.ReactNode
onClosing?:()=>void
}

function Modal(props:ModalProps){
   function handleClick(e:React.MouseEvent<HTMLDivElement, MouseEvent>){
        e.stopPropagation();
         props.onClosing!()
   } 

const Modal = <div className="modal-overlay" onClick={handleClick}>
    <div className="modal" onClick={(e)=>e.stopPropagation()}>
{props.children}
    </div>


</div>

return createPortal(Modal,document.body)

}

export default Modal
