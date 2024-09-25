import { useContext, useState } from 'react'
import React from 'react'
import {assets} from '../../assets/assets'
import './Sidebar.css'
import { Context } from '../../context/Context'
export const Siderbar = () => {
  const [extended,setExtended]=useState(false);
  const{onSent,previousPrompt,setRecentPrompt,newChat}=useContext(Context)

  const loadPrompt=async(prompt) => {
    setRecentPrompt(prompt)
     await onSent(prompt);
  }
  return (
    <>
    <div className='sidebar min-h-screen inline-flex flex-col justify-between bg-customColor'>
      <div className='top'>
        <img  className='menu block ml-4 cursor-pointer' src={assets.menu_icon} onClick={() => setExtended(!extended)} />
        <div onClick={() => newChat()}className='new-chat mt-10 items-center gap-2.5 p'>
          <img src={assets.plus_icon} />
          {extended?<p>New Chat</p>:null}
        </div>
        {extended?     
        <div className='recent flex-col '>
          <p className='recent-title mt-8 mb-5 '>Recent</p>
          {console.log(previousPrompt)}
          {previousPrompt.map((item,index) => {
              return (
                <div onClick={() => loadPrompt(item)} className='recent-entry flex items-start gap-2.5 p-2.5 pr-6 rounded-3xl hover:bg-gray-50'>
                <img src={assets.message_icon} />
                <p>{item.substring(0,10)} ....</p>
              </div>
              )
          })}
          
        </div> : null}
      </div>
      <div className='bottom flex-col gap-3 m-2'>
        <div className='bottom-item flex items-start gap-2.5 p-2.5 pr-6 rounded-3xl hover:bg-gray-50'>
          <img src={assets.question_icon} />
          {extended?<p>Help</p>:null}
        </div>
        <div className='bottom-item recent-entry flex items-start gap-2.5 p-2.5 pr-6 rounded-3xl hover:bg-gray-50'>
          <img src={assets.history_icon} />
          {extended? <p>Activity</p> : null}
        </div>
        <div className='bottom-item recent-entry flex items-start gap-2.5 p-2.5 pr-6 rounded-3xl hover:bg-gray-50'>
          <img src={assets.setting_icon} />
          {extended?<p>Settings</p>: null}
        </div>
      </div>
    </div>
    </>
  )
  
  
}
