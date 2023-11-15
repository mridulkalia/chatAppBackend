import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.svg'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { loginRoute } from '../utils/APIroutes'

function Login () {
  const navigate = useNavigate()
  const [values, setValues] = useState({
    username: '',
    password: ''
  })
  const toastOptions = {
    position: 'bottom-right',
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark'
  }

  useEffect(() => {
    if (localStorage.getItem('chat-app-user')) {
      navigate('/')
    }
  }, [])

  const handleSubmit = async event => {
    event.preventDefault()
    if (handleValidation()) {
      const { password, username } = values
      const { data } = await axios.post(loginRoute, {
        username,
        password
      })
      if (data.status === false) {
        toast.error(data.msg, toastOptions)
      }
      if (data.status === true) {
        localStorage.setItem('chat-app-user', JSON.stringify(data.user))
        navigate('/')
      }
    }
  }
  const handleValidation = () => {
    const { password, username } = values
    if (password === '') {
      toast.error('username and password is required', toastOptions)
      return false
    } else if (username.length === '') {
      toast.error('username and password is required', toastOptions)
      return false
    }
    return true
  }
  const handleChange = event => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }
  return (
    <>
      <div class='h-screen w-screen flex flex-col justify-center items-center gap-4 bg-[#131324]'>
        <form
          class='flex flex-col gap-8 rounded-3xl py-12 px-20 bg-[#00000076]'
          onSubmit={event => handleSubmit(event)}
        >
          <div className='brand' class='flex justify-center items-center gap-4'>
            <img class='h-20' src={Logo} alt='Logo' />
            <h1 class='text-white font-bold text-4xl'>SNAPPY</h1>
          </div>
          <input
            class='input'
            type='text'
            placeholder='Username'
            name='username'
            min={3}
            onChange={e => handleChange(e)}
          />
          <input
            class='input'
            type='password'
            placeholder='Password'
            name='password'
            onChange={e => handleChange(e)}
          />
          <span class='text-red-600 absolute bottom-[273px] left-[837px] font-normal text-[12px] cursor-pointer hover:underline'>
            Forgot Password
          </span>
          <button
            class='bg-[#997af0] text-white py-4 px-8 border-none font-bold rounded-lg text-base transition duration-150 ease-in-out hover:bg-[#4e0eff] '
            type='submit'
          >
            LOGIN USER
          </button>
          <span class='text-white uppercase'>
            Don't have an account ?
            <Link
              class='text-[#4e0eff] font-bold no-underline px-2'
              to='/register'
            >
              Register
            </Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </>
  )
}

export default Login
