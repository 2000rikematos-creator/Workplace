import { useState } from "react";
import type { AllowedDevicesType } from "../../shared/Types";
import DeleteIcon from "../icons/DeleteIcon";
import OptionsContainer from "./OptionsContainer";
import ConfirmationModal from "../modals/ConfirmationModal";
import "./AllowedDevices.css"

interface AllowedDevicesProps {
    isShowing: boolean;
    allowedDevices: AllowedDevicesType[];
    removeDevice: (device: AllowedDevicesType) => void
}

function AllowedDevices(props: AllowedDevicesProps) {
    const [deviceToDelete, setDeviceToDelete] = useState<AllowedDevicesType | undefined>(undefined)
    const [confirmationQuestion, setConfirmationQuestion] = useState("")

    if (!props.isShowing) return null
    return <OptionsContainer>
        <ConfirmationModal question={confirmationQuestion} handleCancel={() => { setConfirmationQuestion(""); setDeviceToDelete(undefined) }} handleConfirm={() => { props.removeDevice(deviceToDelete!); setConfirmationQuestion("") }} />
        <div className="allowed-devices">
            <div className="settings-header allowed-devices-header"><h2>Allowed devices</h2></div>
            <ul className="allowed-devices-list">
                {props.allowedDevices.length < 1 ? <li className="task-list-item allowed-devices-item">Nothing to show, add the device on login</li> :
                    props.allowedDevices.map((item) => <li className="task-list-item allowed-devices-item" key={item.id}>{item.name} <DeleteIcon className="delete-task-button" onClick={() => { setDeviceToDelete(item); setConfirmationQuestion("Remove device?") }} /></li>)
                }
            </ul>
        </div>
    </OptionsContainer>
}

export default AllowedDevices