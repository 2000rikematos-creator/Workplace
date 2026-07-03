import { useContext,useState,useEffect } from "react"
import { useNavigate,useLocation } from "react-router"
import "./NavBar.css"
import NavBarItem from "./NavBarItem"
import { AuthContext } from "../../context/AuthContext"
import ManagerLoginModal from "../../components/modals/ManagerLoginModal"
import type { ManagerLoginResponseData } from "../../shared/Types"
import ErrorModal from "../../components/modals/ErrorModal"
import LoadingModal from "../../components/modals/LoadingModal"
import MenuIcon from "../icons/MenuIcon"
import OptionsIcon from "../icons/OptionsIcon"
import CloseIcon from "../icons/CloseIcon"
import SideBar from "./SideBar"
import logo from "../../assets/white-logo.png"
import ControlPanelicon from "../icons/ControlPanelIcon"
import HomeIcon from "../icons/HomeIcon"
import LogoutIcon from "../icons/LogoutIcon"

interface NavBarProps {
    clickMenu:()=>void;
    menuIsClicked:boolean;
    closeMenuClick:()=>void;
    windowWidth:number;
    smallScreenSize:number;
    optionsIsClicked:boolean;
    setOptionsIsClicked:(yn:boolean)=>void
}

function NavBar(props:NavBarProps){
    const location = useLocation()
    const navigate = useNavigate()
  const context = useContext(AuthContext)
  const [loginManagerIsShowing,setLoginManagerIsShowing] = useState(false)
  const [errorMessage,setErrorMessage] = useState("")
  const [isloading,setIsLoading] = useState(false)
  const token = context?.token;
    const backendUrl = import.meta.env.VITE_BACKEND_URL

   useEffect(()=>{
          const managerIsLoggedin = localStorage.getItem("managerToken")
          if(!location.pathname.startsWith("/control-panel") && managerIsLoggedin){
              context!.managerLogout()
          }
      },[location.pathname]) 
      

 async function handleConfirmPassword(password:string){
    setIsLoading(true)
    const data = {companyId:context!.workplaceData!.id, password:password}
try{
    const response = await fetch(`${backendUrl}/settings/manager`,{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},body:JSON.stringify(data)})
    const responseData:ManagerLoginResponseData = await response.json()
    if(!response.ok){throw new Error(responseData.message)}
    context?.loginManager(responseData.token)
    navigate("/control-panel")
    setLoginManagerIsShowing(false)
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

  function handleMenuClick(){
    props.clickMenu()
  }

  

   if(!context?.isLoggedIn){ return null };
    return <nav className="nav-bar">
        <LoadingModal isShowing={isloading}/>
        <ErrorModal onClosing={()=>setErrorMessage("")} errorMessage={errorMessage}/>
        <ManagerLoginModal onClosing={()=>setLoginManagerIsShowing(false)} isShowing={loginManagerIsShowing} password={handleConfirmPassword}/>
        <ul className="nav-bar-items">
            {props.windowWidth > 900 ? <div className="nav-bar-logo-container"><img src={logo} className="nav-bar-logo"/></div>: props.menuIsClicked ? <CloseIcon spacingInPx="30" onClick={()=>props.closeMenuClick()}/> : <MenuIcon onClick={handleMenuClick}/>}
            <div className="name-container"><h1 className="company-name-title">{context.workplaceData!.companyName}</h1></div>
            {props.windowWidth > 650 ? <ul className="navigation-buttons">
             {location.pathname === "/control-panel" ? null : <NavBarItem onClick={()=>setLoginManagerIsShowing(true)}> <ControlPanelicon className="nav-icon"/></NavBarItem>}   
              {location.pathname ==="/" ? null : <NavBarItem onClick={()=> navigate("/")}><HomeIcon className="nav-icon"/></NavBarItem>}  
               <NavBarItem className="logout-button" onClick={()=>context?.logout()}> <LogoutIcon className="nav-icon"/></NavBarItem> 
            </ul>: props.optionsIsClicked ? <CloseIcon spacingInPx="15" onClick={()=>props.setOptionsIsClicked(false)}/> :<OptionsIcon onClick={()=>props.setOptionsIsClicked(true)}/>}
            
        </ul>
      {props.windowWidth < 650 && props.optionsIsClicked ? <SideBar clickAway={()=>props.setOptionsIsClicked(false)} placement="right" className="options-sidebar">
        <ul className="navigation-buttons-small">
              {location.pathname === "/control-panel" ? null : <NavBarItem className="nav-options" onClick={()=>{setLoginManagerIsShowing(true);props.setOptionsIsClicked(false)}}><ControlPanelicon className="nav-icon"/>Control Panel</NavBarItem> } 
               {location.pathname === "/" ? null : <NavBarItem className="nav-options" onClick={()=> {navigate("/");props.setOptionsIsClicked(false)}}><HomeIcon className="nav-icon"/>Home</NavBarItem>}
               <NavBarItem className="logout-button nav-options" onClick={()=>context?.logout()}> <LogoutIcon className="nav-icon"/>Logout</NavBarItem> 
            </ul>
      </SideBar> : null}  
        
    </nav>
}

export default NavBar