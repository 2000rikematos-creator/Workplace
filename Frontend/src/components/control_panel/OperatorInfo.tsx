import React, { useEffect, useState } from "react";
import OptionsContainer from "./OptionsContainer";
import type { Operator } from "../../shared/Types";
import "./OperatorInfo.css"
import CloseIcon from "../icons/CloseIcon";
import PersonIcon from "../icons/PersonIcon";
import IdentificationIcon from "../icons/IdentificationIcon";
import PhoneIcon from "../icons/PhoneIcon";
import DeleteIcon from "../icons/DeleteIcon";
import EditIcon from "../icons/EditIcon";
import ConfirmationModal from "../modals/ConfirmationModal";

type CurrentAction = "deleteOperator"|"editOperator"|undefined

type OperatorPropsType = {
  operatorSelected: Operator | undefined
  closeDetails: () => void
  deleteOperator: () => void
  editOperator: (input: Required<Pick<Operator, "firstName" | "lastName" | "phone">>) => void
  isEditing: boolean
  handleEditOperatorButton: (yn: boolean) => void
}


function OperatorInfo({ operatorSelected, closeDetails, deleteOperator, editOperator, isEditing, handleEditOperatorButton }: OperatorPropsType) {
  if (!operatorSelected) return null

  const [input, setInput] = useState<Required<Pick<Operator, "firstName" | "lastName" | "phone">>>({ firstName: operatorSelected.firstName, lastName: operatorSelected.lastName, phone: operatorSelected.phone })
  const [confirmationQuestion,setConfirmationQuestion] = useState("")
  const [currentAction,setCurrentAction] = useState<CurrentAction>(undefined)

  useEffect(() => {
    setInput({ firstName: operatorSelected.firstName, lastName: operatorSelected.lastName, phone: operatorSelected.phone });
    handleEditOperatorButton(false);
  }, [operatorSelected])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInput((prev) => { return { ...prev, [event.target.name]: event.target.value } })
  }

  function handleSubmitEdited() {
    editOperator(input)
  }

  function handleCancelbutton() {
    handleEditOperatorButton(false)
    setInput({ firstName: operatorSelected!.firstName, lastName: operatorSelected!.lastName, phone: operatorSelected!.phone })
  }

  function confirmAction(){

    if(currentAction === "deleteOperator"){
      deleteOperator()
    }
    if(currentAction === "editOperator"){
      handleSubmitEdited()
    }
    setCurrentAction(undefined)
    setConfirmationQuestion("")
  }

  return <OptionsContainer>
    <ConfirmationModal question={confirmationQuestion} handleConfirm={()=>confirmAction()} handleCancel={()=>{setConfirmationQuestion(""); setCurrentAction(undefined)}}/>

    <div className="operator-info">
      <div className="operator-info-container">
        <div className="operator-info-header"> <h2>Informações do colaborador</h2><div className="close-operator-button-container"><CloseIcon className="close-details-button" onClick={closeDetails} /></div>
        </div>
        {isEditing ? <form className="edit-details-form" onSubmit={(e)=>{e.preventDefault();setCurrentAction("editOperator"); setConfirmationQuestion("Guardar alterações?")}}>
          <input className="edit-detail" type="text" name="firstName" value={input.firstName} onChange={handleChange} />
          <input className="edit-detail" type="text" name="lastName" value={input.lastName} onChange={handleChange} />
          <input className="edit-detail" type="text" name="phone" value={input.phone} onChange={handleChange} />
          <div className="edit-operator-info-button-container">
            <input className="editing-operator-button save-operator-changes-button" type="submit" value="Guardar"/>
          <button className="editing-operator-button cancel-operator-changes-button" type="button" onClick={handleCancelbutton}>Cancelar</button>
          </div>
          
        </form> : 
        
        <React.Fragment>

          <div className="operator-details">
            <div className="operator-detail operator-details-name-container"><PersonIcon className="operator-details-icon person-icon" /><h3 className="operator-details-name">{operatorSelected.firstName} {operatorSelected.lastName}</h3></div>
            <div className="operator-detail operator-details-id-container"><IdentificationIcon className="operator-details-icon identification-icon" /><h4 className="operator-details-id">{operatorSelected.internalNumber}</h4></div>
            <div className="operator-detail operator-details-phone-number-conatiner"><PhoneIcon className="operator-details-icon phone-icon" /><h4 className="operator-details-phone-number">{operatorSelected.phone}</h4></div>
          </div>

          <div className="operator-info-button-container"><DeleteIcon className="operator-details-button delete-icon" onClick={() => {setCurrentAction("deleteOperator"), setConfirmationQuestion("Pretende eliminar premanentemente este colaborador?")}} /><EditIcon className="operator-details-button edit-icon" onClick={() => handleEditOperatorButton(true)} /></div>
        </React.Fragment>

        }

      </div>
    </div>

  </OptionsContainer>
}

export default OperatorInfo