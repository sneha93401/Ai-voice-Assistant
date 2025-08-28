import React, { useContext } from 'react'
import './App.css'
import virtualAssistant from './assets/ai.png'
import { MdOutlineMic } from "react-icons/md";
import { dataContext } from './context/UserContext';
import aivoice from './assets/aiVoice.gif'
import speakeImg from './assets/speak.gif'

function App() {
let {recognition,speaking,setSpeaking, prompt , response , setPrompt , setResponse} =   useContext(dataContext)
  return (
    <div>
      <div className="main">
        <img src={virtualAssistant} alt=""  id='aiAssist'/>
        <span>I am Dew , your Advanced virtual Assistant</span>
        {!speaking  ? 
        
        <button onClick={()=>{
          setPrompt("listening...")
          setSpeaking(true)
          setResponse(false)
          recognition.start()}}>click me <MdOutlineMic /> </button>
        : <div className='response'>
          {!response 
          ?  
          <img src={speakeImg} alt=""  id='speakgif'/> 
          : 
          <img src={aivoice} alt=""  id='aiVoice'/>
          }
         
        <p>{prompt}</p>
        </div>
        }
        
      </div>
    </div>
  )
}

export default App
