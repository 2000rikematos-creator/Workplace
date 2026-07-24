import React,{useState, createContext} from "react";
import type { WorkplaceCreds } from "../shared/Types";



interface AuthContextType {
    isLoggedIn:boolean;
    workplaceData:Required<Pick<WorkplaceCreds,"companyName"|"loginName"|"id">>|null;
    login:(creds:Required<Pick<WorkplaceCreds,"companyName"|"loginName"|"id">>,token:string)=>void;
    logout:()=>void;
    token:string|null;
    updateData:(creds:Required<Pick<WorkplaceCreds,"companyName"|"loginName">>)=>void;
    loginManager:(token:string)=>void
    managerLogout:()=>void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)


interface AuthProviderProps {
    children:React.ReactNode
}

function AuthProvider(props:AuthProviderProps){
    const [token,setToken] = useState<string|null>(()=>{return localStorage.getItem("token")})
    const creds = localStorage.getItem("creds")
    const [workplaceData,setWorkplaceData] = useState<Required<Pick<WorkplaceCreds,"companyName"|"loginName"|"id">>|null>(()=>{if(creds === null){return null}else{ return JSON.parse(creds)
    }})
    const isLoggedIn = token !== null && workplaceData !== null

    function logout(){
       localStorage.clear()
        setWorkplaceData(null)
        setToken(null)
        window.location.href = "/"
        
    }

    function loginManager(token:string){
        localStorage.setItem("managerToken",token)
    }

    function updateData(creds:Required<Pick<WorkplaceCreds,"companyName"|"loginName">>){
        localStorage.setItem("creds",JSON.stringify(creds))
        setWorkplaceData((prev)=>{if (!prev) return null; return {...prev,companyName:creds.companyName,loginName:creds.loginName,id:prev.id}})
    }

    function login(creds:Required<Pick<WorkplaceCreds,"companyName"|"loginName"|"id">>,token:string){

        localStorage.setItem("creds",JSON.stringify(creds))
        localStorage.setItem("token",token)
        setWorkplaceData(creds)
        setToken(token)
    }

    

    function managerLogout(){
        localStorage.removeItem("managerToken")
    }

  

    return <AuthContext.Provider value={{managerLogout,isLoggedIn,workplaceData,login,logout,token,updateData,loginManager}}>
        {props.children}
    </AuthContext.Provider>
}


export {AuthProvider, AuthContext}