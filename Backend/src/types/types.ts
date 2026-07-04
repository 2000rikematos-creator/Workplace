import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
export interface workplaceCreateCreds {
    loginName:string,managerPassword:string,operatorPassword:string,companyName:string
}

export interface token {
    companyName:string,
  loginName: string,
  id: string,
  iat: number,
  exp: number
}

export interface workplaceData extends workplaceCreateCreds{
id:string
}

export interface newOperator {
    firstName:string;
    lastName:string;
    phone:string;

}


export interface Operator extends newOperator {
    id:string;
    workplaceId:string;
    internalNumber:number;
}

export type Task = {
        id:string;
        task:string;
        workplaceId:string;
    } 

export interface ActiveTasks {
    id:string;
    taskId:string;
    operatorId:string;
    timeStart:number;
    workplaceId:string;
}    

export interface ActiveTasksWithData extends ActiveTasks{
    operatorFirstName:string;
    operatorLastName:string;
    taskName:string;
}

export interface FinishedTasks extends ActiveTasks {
timeEnd:number;
}

export interface ActiveTaskRequest extends AuthMiddlewareRequest {
body:{operatorId:string,taskId:string}
}
 
export interface EndActiveTaskRequest extends Request {
    params:{id:string}
    body:{timeEnd:number}
}

export interface LoginManagerRequest extends Request {
    body:{companyId:string,password:string}
    workplace:token
}

export interface AuthMiddlewareRequest extends Request{
    workplace:token
}

export interface addOperatorType extends AuthMiddlewareRequest{
    body:newOperator;
    managerAuth:ManagerToken;
}

export interface DeleteOperatorType extends AuthMiddlewareRequest{
    managerAuth:ManagerToken;
    params:{id:string};
}

export interface EditOperatorRequest extends AuthMiddlewareRequest {
    managerAuth:ManagerToken;
    params: { id: string };
    body:Required<Pick<Operator,"firstName"|"lastName"|"phone">>;
}

export interface createWorkplaceRequest extends Request {
    body:workplaceCreateCreds
}

export interface openWorkplaceCredsRequest extends Request{
    body:Required<Pick<workplaceData, "loginName"|"operatorPassword">>
}

export interface ManagerToken {
    role:string;
    workplace:string;
    iat:number;
    exp:number;
}

export interface ManagerMiddlewareAuth extends Request {
    managerAuth:ManagerToken
}

export interface UpadateWorkplaceDataRequest extends Request{
    managerAuth:ManagerToken;
    workplace:token;
}

export interface UpdateWorkplaceRequestManagerPassword extends UpadateWorkplaceDataRequest{
    body:{currentManagerPassword:string,newManagerPassword:string}
}

export interface UpdateWorkplaceRequestOperatorPassword extends UpadateWorkplaceDataRequest{
    body:{currentOperatorPassword:string,newOperatorPassword:string}
}

export interface addTaskRequest extends AuthMiddlewareRequest{
    managerAuth:ManagerToken;
    body:{task:string}
}

export interface deleteTaskRequest extends AuthMiddlewareRequest{
    managerAuth:ManagerToken;
    params:{id:string}
}

export interface DeleteProfileRequest extends AuthMiddlewareRequest{
    managerAuth:ManagerToken;
}

export interface ManagerAuthResponse extends AuthMiddlewareRequest{
    managerAuth:ManagerToken;
}