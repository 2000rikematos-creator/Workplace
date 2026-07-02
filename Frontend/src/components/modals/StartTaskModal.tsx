import React, { useState } from "react";
import Modal from "./Modal";
import "./StartTaskModal.css"
import type { Operator, Task } from "../../shared/Types";

type StartTaskModalProps = {
    isOpen: boolean;
    onClosing: () => void;
    task: Task;
    searchOperator: (name: string) => void;
    operatorsCorespondingArray: Operator[];
    selectOperator:(operatorId:string,taskId:string)=>void
}

function StartTaskModal(props: StartTaskModalProps) {
    const [input, setInput] = useState("")

    function handleChange(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) {
        setInput(event.target.value)
        props.searchOperator(event.target.value)
    }

    function handleClosing() {
        setInput("")
        props.onClosing()
    }

    if (!props.isOpen) return null
    return <Modal onClosing={handleClosing}>
        <div className="form-container">
            <h1>{props.task.task}</h1>
            <div className="search-operator-form-with-results">
                <form className="search-operator-form">
                    <input type="text" placeholder="Team member" onChange={handleChange} value={input} autoFocus/>
    
                </form>
                {input.length > 1 ? <ul className="operators-coresponding-list"> {props.operatorsCorespondingArray.length < 1 ? <li className="operators-coresponding-list-item">No Results</li> : props.operatorsCorespondingArray.map((item) => <li className="operators-coresponding-list-item" onClick={()=>{props.selectOperator(item.id,props.task.id);setInput("")}}><p className="operators-coresponding-list-item-name">{item.firstName} {item.lastName}</p><p>{item.internalNumber}</p></li>)} </ul>: null}
            </div>


        </div>
    </Modal>
}

export default StartTaskModal
