import './App.css'
import { useContext, useState,useEffect } from 'react'
import HomePage from './pages/HomePage'
import NavBar from './components/navigation/NavBar'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ControlPanel from './pages/ControlPanel';
import LandingPage from './pages/LandingPage';
import {AuthContext} from '../src/context/AuthContext';



function App() {
const context = useContext(AuthContext)
const [menuIsClicked,setMenuIsClicked] = useState<boolean>(false)
const [optionsIsClicked,setOptionsIsClicked] = useState<boolean>(false)
const [windowWidth,setWindowWidth] = useState(window.innerWidth)
const smallScreenSize = 650

function resize(){
        setWindowWidth(window.innerWidth)
    }

useEffect(()=>{
    window.addEventListener("resize",resize)

    return ()=>window.removeEventListener("resize",resize)
   },[])  


   useEffect(()=>{
    if(windowWidth>smallScreenSize){
      setMenuIsClicked(false)}
      setOptionsIsClicked(false)
    }
  
  ,[windowWidth])

   

  return <Router>
<NavBar
 optionsIsClicked={optionsIsClicked} 
 setOptionsIsClicked={(yn)=>setOptionsIsClicked(yn)} 
 smallScreenSize={smallScreenSize} 
 windowWidth={windowWidth}
  closeMenuClick={()=>setMenuIsClicked(false)} 
  clickMenu={()=>setMenuIsClicked((true))}
   menuIsClicked={menuIsClicked} /> 
<Routes>
  <Route path='/landing-page' element={context?.isLoggedIn ? <Navigate to="/" replace/> : <LandingPage />}/>
  <Route path='/' element={context?.isLoggedIn ? <HomePage
  setMenuIsClicked={(yn)=>setMenuIsClicked(yn)}
   sideBarClickAway={()=>setMenuIsClicked(false)}
    windowWidth={windowWidth} smallScreenSize={smallScreenSize}
     menuIsClicked={menuIsClicked}/> : <Navigate to="/landing-page" replace/>} />
  <Route path="/control-panel" element={context?.isLoggedIn? <ControlPanel windowWidth={windowWidth} 
  setMenuIsClicked={(yn)=>setMenuIsClicked(yn)}
   menuIsClicked={menuIsClicked} /> : <Navigate to="/landing-page" replace/>} />
</Routes>
  </Router>

   

 
    
  
    
}

export default App
