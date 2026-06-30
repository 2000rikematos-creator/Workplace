import {useContext, useState} from "react";
import PageLayout from "../components/shared/PageLayout";
import LandingPageContainer from "../components/landing_page/LandingPageContainer";
import WorkplaceHandler from "../components/landing_page/WorkplaceHandler";
import CreateWorkplace from "../components/landing_page/CreateWorkplace";
import type { LoginInfo, WorkplaceCreds, apiResponseDataWorkplaceCreds } from "../shared/Types";
import OpenWorkplace from "../components/landing_page/OpenWorkplace";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import ErrorModal from "../components/modals/ErrorModal";
import LoadingModal from "../components/modals/LoadingModal";



function LandingPage(){

  const context = useContext(AuthContext)
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isLoading,setIsLoading] = useState<boolean>(false)


    const [isCreatingWorkplace, setIsCreatingWorkplace] = useState<boolean>(false)
    const [isOpeningWorkplace, setIsOpeningWorkplace] = useState<boolean>(false)

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    function handleSelectWorkPlaceOption(tipo:"abrir"|"criar"){
        if(tipo === "criar"){setIsCreatingWorkplace(true)}
        if(tipo === "abrir"){setIsOpeningWorkplace(true)}

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
                setErrorMessage("Ocorreu um erro!")
            }else{
               setErrorMessage(error.message) 
            }
           }else{
            setErrorMessage("ocorreu um erro inesperado")
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
        context!.login(responseData.data,responseData.token)
        navigate("/");
    }catch(error){
        if(error instanceof Error){
            if(error.message === "Failed to fetch"){
                setErrorMessage("Ocorreu um erro!")
            }else{
               setErrorMessage(error.message) 
            }
        }else{
            setErrorMessage("Ocorreu um erro!")
        }
    }finally{
        setIsLoading(false)
    }

        
    }

  return <PageLayout>
    <LandingPageContainer>
        <LoadingModal isShowing={isLoading} />
        <ErrorModal errorMessage={errorMessage} onClosing={()=>setErrorMessage("")}/>
        <OpenWorkplace submitLoginInfo={handleSubmitLoginInfo} isShowing={isOpeningWorkplace}/>
        <CreateWorkplace createWorkplaceCreds={handleSubmitWorkplaceCreds} isShowing={isCreatingWorkplace}/>
        <WorkplaceHandler isShowing={!isCreatingWorkplace && !isOpeningWorkplace} selectWorkPlaceOption={handleSelectWorkPlaceOption}/>
    </LandingPageContainer>
  </PageLayout>

    
}

export default LandingPage