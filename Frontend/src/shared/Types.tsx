export type Task = {
        id:string;
        task:string;
        workplaceId:string;
    } 


export type ActiveTasks = {
    id:string;
    workplaceId:string;
    operatorId:string;
    taskId:string;
    timeStart:number;
}

export interface ActiveTasksWithData extends ActiveTasks {
    internalNumber:number;
    operatorFirstName:string;
    operatorLastName:string;
    taskName:string;
}

export type Operator = {
    id:string;
    internalNumber:number
    workplaceId:string
    firstName:string;
    lastName:string;
    phone:string;

}

export type newOperator = {
    firstName:string;
    lastName:string;
    phone:string;
}

export type WorkplaceCreds = {
    companyName:string;
    loginName:string;
    managerPassword:string;
    operatorPassword:string;
    id:string;
}

export interface VerifyDeviceResponse extends apiResponseData{
message:"Device allowed"|"Device not allowed"
}

export type LoginInfo = {
    loginName:string;
    operatorPassword:string;
}

export type apiResponseData = {
    message:string,
}
export interface apiCurrentTimeResponseData extends apiResponseData{
data:number
}

export interface apiResponseDataTaskList extends apiResponseData {
data:Task[]
}

export interface apiResponseDataOperatorlist extends apiResponseData{
    data:Operator[]
}

export interface apiResponseDataOperator extends apiResponseData{
    data:Operator
}

export interface apiResponseaDataUpdatedOperatorInfo extends apiResponseData{
    data:Required<Pick<Operator,"firstName"|"lastName"|"phone">>
}

export interface apiResponseDataTask extends apiResponseData{
    data:Task
}

export interface apiResponseDataAllActiveTasks extends apiResponseData {
    data:ActiveTasksWithData[]
}

export interface apiResponseDataTasks extends apiResponseData {
    data:Task[]
}

export interface apiResponseDataOperatorsList extends apiResponseData {
    data:Operator[]
}

export interface apiResponseDataAddActiveTask extends apiResponseData{
    data:ActiveTasksWithData
}

export interface apiResponseDataWorkplaceCreds extends apiResponseData {
data:Required<Pick<WorkplaceCreds,"companyName"|"loginName"|"id">>,
token:string
}

export interface apiResponseDataUpdatedData extends apiResponseData {
    data:Required<Pick<WorkplaceCreds,"companyName"|"loginName">>
}


export interface ManagerLoginResponseData extends apiResponseData {
    token:string
}

export interface FinishedTasksWithData {
    firstName:string,
    lastName:string,
    task:string,
    id:string,
    internalNumber:number,
    timeStart:string,
    timeEnd:string
}

export interface FinishedTasksWithDataResponse extends apiResponseData{
    data:FinishedTasksWithData[]
}

export interface AllowedDevicesType {
    id:string;
    name:string;
    fingerprint:string;
}


export interface AllowedDevicesResponse extends apiResponseData {
    data:AllowedDevicesType[];
} 

export type ControlPanelOptionsTypes = "Manage staff"| "Manage tasks"|"Manage profile"|"Get report"|"Allowed devices";
export type ManageProfileOptionsTypes = "Change company name"|"Change staff username"|"Change manager password"|"Change staff password"|"Delete workplace profile"