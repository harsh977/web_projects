import React from 'react'
import './App.css'
import { Siderbar } from './components/sidebar/Siderbar'
import { Main } from './components/main/Main'


const App = () => {
  return (
    <>
    <div className='flex'>
    <Siderbar />
    <Main></Main>
    </div>
    </>
  )
}

export default App