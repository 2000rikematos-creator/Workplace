import Modal from "./Modal";
import React,{ useState,useRef} from "react";
import "./ManagerLoginModal.css"

type ManagerLoginModalProps = {
    isShowing:boolean
    password:(password:string)=>void
    onClosing:()=>void
}

function ManagerLoginModal(props:ManagerLoginModalProps){
   
    const [input,setInput] = useState("")
    const loginRef = useRef(null)
    function handleChange(event:React.ChangeEvent<HTMLInputElement>){
        setInput(event.target.value)
    }
    function handleSubmitPassword(){
        props.password(input)
        setInput("")
        
    }
    function handleClosing(){
        props.onClosing()
        setInput("")
    }

    if(!props.isShowing)return null
    return <Modal onClosing={handleClosing}>
<div ref={loginRef}className="manager-login-modal">
    <input type="password" value={input} onChange={handleChange} placeholder="Palavra passe do gerente" autoFocus={true}/>
    <button onClick={handleSubmitPassword}>Entrar</button>
</div>
    </Modal>
}

export default ManagerLoginModal