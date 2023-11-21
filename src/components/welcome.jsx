import React from 'react'
import Robot from '../assets/robot.gif'

function Welcome ({ currentUser }) {
  return (
    <main className='flex flex-col justify-center items-center text-white'>
      <img className='h-[350px]' src={Robot} alt='robot' />
      <h1 className='text-[30px]'>
        Welcome, <span className='text-[#4e00ff]'>{currentUser.username}</span>
      </h1>
      <h3 className='text-[19px]'>Please select a chat to start messaging.</h3>
    </main>
  )
}

export default Welcome
