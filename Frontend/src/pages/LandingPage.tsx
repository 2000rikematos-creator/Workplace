import {useContext, useState} from "react";
import PageLayout from "../components/shared/PageLayout";
import LandingPageContainer from "../components/landing_page/LandingPageContainer";
import WorkplaceHandler from "../components/landing_page/WorkplaceHandler";
import CreateWorkplace from "../components/landing_page/CreateWorkplace";
import type { LoginInfo, ManagerLoginResponseData, VerifyDeviceResponse, WorkplaceCreds, apiResponseDataWorkplaceCreds } from "../shared/Types";
import OpenWorkplace from "../components/landing_page/OpenWorkplace";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import ErrorModal from "../components/modals/ErrorModal";
import LoadingModal from "../components/modals/LoadingModal";
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import AllowDeviceModal from "../components/modals/AllowDeviceModal";



function LandingPage(){

    const fpPromise = FingerprintJS.load();

  const context = useContext(AuthContext)
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isLoading,setIsLoading] = useState<boolean>(false)
  const [allowDeviceIsShowing,setAllowDeviceIsShowing] = useState<boolean>(false)
  const [selectedWorkplace,setSelectedWorkplace] = useState<apiResponseDataWorkplaceCreds|undefined>()


    const [isCreatingWorkplace, setIsCreatingWorkplace] = useState<boolean>(false)
    const [isOpeningWorkplace, setIsOpeningWorkplace] = useState<boolean>(false)

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    function handleSelectWorkPlaceOption(type:"open"|"create"){
        if(type === "create"){setIsCreatingWorkplace(true)}
        if(type === "open"){setIsOpeningWorkplace(true)}

    }

   async function handleSubmitWorkplaceCreds(settings:Required<Pick<WorkplaceCreds,"loginName"|"managerPassword"|"operatorPassword"|"companyName">>){
    setIsLoading(true)
        try{
            const response = await fetch(`${backendUrl}/settings/create-workplace`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(settings)})
            const responseData:apiResponseDataWorkplaceCreds = await response.json()
            if(!response.ok){throw new Error(responseData.message)}
             context!.login(responseData.data,responseData.token)
            navigate("/")
        }catch(error){
           if( error instanceof Error){
            if(error.message === "Failed to fetch"){
                setErrorMessage("Internal error, please try again later")
            }else{
               setErrorMessage(error.message) 
            }
           }else{
            setErrorMessage("Internal error, please try again later")
           }
        }finally{
            setIsLoading(false)
        }


       

        
    }

   async function handleSubmitLoginInfo(info:LoginInfo){

    try{
        setIsLoading(true)
        const response = await fetch(`${backendUrl}/settings/open-workplace`, {method:"POST", headers:{"Content-Type":"application/json"},body:JSON.stringify(info)})
        const responseData:apiResponseDataWorkplaceCreds = await response.json()
        if(!response.ok){throw Error(responseData.message)}

        const fp = await fpPromise
        const result = await fp.get()
        const fingerprint = result.visitorId

        const verifyDevice = await fetch(backendUrl+`/allowed-devices/verify-device`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fingerprint:fingerprint,companyId:responseData.data.id})})
        const verifyDeviceResponse:VerifyDeviceResponse = await verifyDevice.json()
        
        if(verifyDeviceResponse.message === "Device not allowed"){
            setSelectedWorkplace(responseData)
            return setAllowDeviceIsShowing(true)
        }

        context!.login(responseData.data,responseData.token)
        navigate("/");
    }catch(error){
        if(error instanceof Error){
            if(error.message === "Failed to fetch"){
                setErrorMessage("Internal error")
            }else{
               setErrorMessage(error.message) 
            }
        }else{
            setErrorMessage("Internal error")
        }
    }finally{
        setIsLoading(false)
    }

        
    }

   async function handleJustAllow(password:string,companyId:string|undefined){
      setIsLoading(true)
    try{
        const response = await fetch(`${backendUrl}/settings/manager`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:password,companyId:companyId})})
        const responseData:ManagerLoginResponseData = await response.json()
        if(!response.ok){throw new Error(responseData.message)}
        context!.login(selectedWorkplace!.data,selectedWorkplace!.token)
        navigate("/")
        setAllowDeviceIsShowing(false)
        setSelectedWorkplace(undefined)
    }catch(error){
        if(error instanceof Error){
            setErrorMessage(error.message)
        }else{
            setErrorMessage("ocorreu um erro")
        }
    }finally{
        setIsLoading(false)
    }   
}

   async function handleAllowAndAdd(password:string,companyId:string|undefined,name:string){
    setIsLoading(true)
    try{
        const response = await fetch(`${backendUrl}/settings/manager`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:password,companyId:companyId})})
        const responseData:ManagerLoginResponseData = await response.json()
        if(!response.ok){throw new Error(responseData.message)}
        
        const fp = await fpPromise
        const result = await fp.get()
        const fingerprint = result.visitorId

        const addDevice = await fetch(backendUrl+"/allowed-devices/add-device",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fingerprint:fingerprint,companyId:companyId,name:name})})
        const addDeviceResponse = await addDevice.json();
        
        if(!addDevice.ok){
            throw Error(addDeviceResponse.message)
        }

        context!.login(selectedWorkplace!.data,selectedWorkplace!.token)
        navigate("/")
        setAllowDeviceIsShowing(false)
        setSelectedWorkplace(undefined)
        

        
    }catch(error){
        if(error instanceof Error){
            setErrorMessage(error.message)
        }else{
            setErrorMessage("ocorreu um erro")
        }
    }finally{
        setIsLoading(false)
    }   
    }





  return <PageLayout>
    <LandingPageContainer>
        <AllowDeviceModal
        addDevice={handleAllowAndAdd}
        handleCancel={()=>{navigate("/");setAllowDeviceIsShowing(false)}}
        justAllow={handleJustAllow}
        isShowing={allowDeviceIsShowing}
        companyId={selectedWorkplace?.data.id}
        />
        <LoadingModal isShowing={isLoading} />
        <ErrorModal errorMessage={errorMessage} onClosing={()=>setErrorMessage("")}/>
        <OpenWorkplace submitLoginInfo={handleSubmitLoginInfo} isShowing={isOpeningWorkplace}/>
        <CreateWorkplace createWorkplaceCreds={handleSubmitWorkplaceCreds} isShowing={isCreatingWorkplace}/>
        <WorkplaceHandler isShowing={!isCreatingWorkplace && !isOpeningWorkplace} selectWorkPlaceOption={handleSelectWorkPlaceOption}/>
    </LandingPageContainer>
  </PageLayout>

    
}

export default LandingPage