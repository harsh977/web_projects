import React, { useContext } from 'react'
import './Main.css'
import {assets} from '../../assets/assets'
import { Context } from '../../context/Context'
export const Main = () => {

    const{onSent,recentPrompt,showResult,loading,resultData,setInput,input}=useContext(Context);

  return (
    <div className='main flex-1 min-h-screen'>
        <div className='rainbow-text nav flex items-center justify-between text-xl p-5 '>
            <p>Gemini</p>
            <img className='rounded-full'width={40} src={assets.user_icon} />
        </div>
        <div className='main-container max-w-4xl m-auto'>
             
            {!showResult? <><div className='greet m'>
                <p className='rainbow-text'><span>Hello, Harsh.</span></p>
                <p className='text-gray-400'>How can i help you today?</p>
            </div>
            <div className='cards grid grid-cols-4 gap-8 p-5'>
                <div className='card'>
                    <p>Suggest beautiful places for a road trip</p>
                    <img src={assets.compass_icon} />
                </div>
                <div className='card'>
                    <p>Suggest beautiful places for a road trip</p>
                    <img src={assets.bulb_icon} />
                </div>
                <div className='card'>
                    <p>Suggest beautiful places for a road trip</p>
                    <img src={assets.message_icon} />
                </div>
                <div className='card'>
                    <p>Suggest beautiful places for a road trip</p>
                    <img src={assets.code_icon} />
                </div>
            </div></> : <><div className='result '>
                <div className='result-title'>
                    <img src={assets.code_icon} />
                    <p>{recentPrompt}</p>
                </div>
                <div className='result-data flex items-start g-5'>
                    <img src={assets.gemini_icon} />
                    {loading
                    ?<>
                    <div className='loader'>
                        <hr />
                        <hr />
                        <hr />
                    </div>
                    </>: <>
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                 </>
                 }
                    
                </div>
                </div>
                </>}

            <div className='main-bottom '>
                <div className='search-box flex items-center justify-between g-5 '>
                    <input onChange={(e) =>{ setInput(e.target.value)}} value={input}
                        className='flex-1 bg-transparent border-none outline-none p-2 ' type='text' placeholder='Enter a prompt here'></input>
                    <div>
                    <img src={assets.gallery_icon} />
                    <img src={assets.mic_icon} />
                    {input ? <img src={assets.send_icon}  onClick={() => 
                        onSent()} /> : null}
                    
                    </div>
                </div>
                <p className='bottom-info'>
                Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini Apps
                </p>
            </div>
        </div>
    </div>
  )
}
