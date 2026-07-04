import React, { useState, useRef, useEffect } from "react";
import "./ManageOperators.css"
import type {newOperator, Operator } from "../../shared/Types";
import OptionsContainer from "./OptionsContainer";
import AddIcon from "../icons/AddIcon";
import SearchIcon from "../icons/SearchIcon";

type GerirOperadoresProps = {
    operatorsList: Operator[]
    isShowing: boolean
    addOperator:(newOperator:newOperator)=>void
    selectOperator:(id:string)=>void
    selectedOperator:Operator|undefined
    addingOperator:boolean
    handleAddingOperator:(yn:boolean)=>void
}


function ManageOperators(props: GerirOperadoresProps) {
    const [searchIsActive, setSearchIsActive] = useState<boolean>(false)
    const [input, setInput] = useState("")
    const [corespondingList, setCorespondingList] = useState<Operator[]>([])
    const searchRef = useRef(null)
    const listRef = useRef(null)
    const [newOperator, setNewOperator] = useState<newOperator>({firstName:"",lastName:"",phone:""})

    useEffect(() => {

        searchIsActive ? document.body.addEventListener("mousedown", clickAway) : null

        return () =>{document.body.removeEventListener("mousedown", clickAway);} 
    },
        [searchIsActive])

   


    function handleChange(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) {
        setInput(event.target.value)
        setCorespondingList(() => props.operatorsList.filter((item) => item.firstName.includes(event.target.value.toLowerCase()) || item.lastName.includes(event.target.value.toLowerCase())|| (item.firstName.toLowerCase() + " " + item.lastName.toLowerCase()).includes(event.target.value.toLowerCase())))
    }

    function clickAway(event: MouseEvent) {
        event.stopPropagation()
        if (event.target !== searchRef.current) {
            setSearchIsActive(false);
            setInput("")
        }
    }

    function handleSearchButton() {
        setSearchIsActive(true)
    }

    function handleAddOperatorButton() {
        props.handleAddingOperator(true)
        setNewOperator({firstName:"",lastName:"",phone:""})
    }

    function cancelAddOperator() {
        props.handleAddingOperator(false)
        setNewOperator({firstName:"",lastName:"",phone:""})
    }  

    function handleSubmitAddOperator(event:React.SubmitEvent<HTMLFormElement>){
        event.preventDefault()
        props.addOperator(newOperator)

    }

    function inputName(which:"first"|"last"|"phone", event:React.ChangeEvent<HTMLInputElement, Element>){

        if(which === "first"){setNewOperator((prev)=>{return {...prev,firstName:event.target.value}})}
        if(which === "last"){setNewOperator((prev)=>{return {...prev,lastName:event.target.value}})}
        if(which === "phone"){setNewOperator((prev)=>{return {...prev,phone:event.target.value}})}

    }
    
   

    if (!props.isShowing) return null


    return <OptionsContainer>
 {props.addingOperator ? 
 <div className="add-operator">
           <div className="add-operator-header settings-header"><h2 className="add-operator-title settings-title">Add team member</h2></div> 
            <form className="add-operator-form" onSubmit={handleSubmitAddOperator}>
                <input className="add-operator-first-name add-operator-input" onChange={(event)=>inputName("first", event)} type="text" placeholder="First name" name="firstName" value={newOperator.firstName}/>
                <input className="add-operator-last-name add-operator-input" onChange={(event)=>inputName("last", event)} type="text" placeholder="Last name/s" name="lastName" value={newOperator.lastName} />
             <input className="add-operator-phone add-operator-input" onChange={(event)=>inputName("phone", event)} type="text" placeholder="Phone number" name="phone" value={newOperator.phone} />
    <div className="add-operator-button-container">
        <input className="add-operator-add-button" type="submit" value="Add" />
         <button className="add-operator-cancel-button" type="button" onClick={cancelAddOperator} >Cancel</button>
    </div>
                
            </form>
        </div>
            :
            <div className="buttons-with-list">
                {searchIsActive ? <form className="manage-operators-search-form">
                    <input ref={searchRef} type="text" value={input} onChange={handleChange} placeholder="Operador" />
                </form> : <div className="settings-header">
                    <h2>Manage staff</h2>
                    <AddIcon onClick={handleAddOperatorButton}/>
                    <SearchIcon onClick={handleSearchButton}/>
                </div>}
                <div className="manage-operators-list-container">
                    {props.operatorsList.length<1 ? <h2 className="no-list-title">Nothing to show</h2> : <ul className="manage-operators-list">
                {input.length < 1 ? 
                    props.operatorsList.map((item: Operator) => <li style={props.selectedOperator?.id === item.id ? {backgroundColor:"var(--secondary-color)",color:"var(--light-color)"}:undefined} onMouseDown={()=>props.selectOperator(item.id)} className="manage-operators-list-item"><p className="manage-operators-list-item-name">{item.firstName} {item.lastName}</p> <p className="manage-operators-list-item-id">{item.internalNumber}</p></li>): corespondingList.map((item: Operator) => <li ref={listRef} onMouseDown={()=>props.selectOperator(item.id)} className="manage-operators-list-item"><p className="manage-operators-list-item-name">{item.firstName} {item.lastName}</p> <p className="manage-operators-list-item-id">{item.internalNumber}</p></li>)}
                    </ul> }
                    
                </div>
            
            </div>}
    </OptionsContainer>
       


   
}

export default ManageOperators

