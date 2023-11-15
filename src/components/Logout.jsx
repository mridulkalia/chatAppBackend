import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BiPowerOff } from 'react-icons/bi'

function Logout () {
  const navigate = useNavigate()
  const handleClick = async () => {
    localStorage.clear()
    navigate('/login')
  }
  return (
    <button
      onClick={handleClick}
      className='flex justify-center items-center p-2 rounded-lg bg-[#9a86f3] border-none cursor-pointer text-lg'
    >
      <BiPowerOff />
    </button>
  )
}

export default Logout
