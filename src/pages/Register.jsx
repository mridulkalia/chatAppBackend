import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.svg'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { registerRoute } from '../utils/APIroutes'

function Register () {
  const navigate = useNavigate()
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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
      const { password, email, username } = values
      const { data } = await axios.post(registerRoute, {
        username,
        email,
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
    const { password, confirmPassword, email, username } = values
    if (password !== confirmPassword) {
      toast.error('password and confirm password must be same', toastOptions)
      return false
    } else if (username.length < 4) {
      toast.error('username should be greater than 3 characters', toastOptions)
      return false
    } else if (password.length < 8) {
      toast.error(
        'password should be equal or greater than 8 characters',
        toastOptions
      )
      return false
    } else if (email === '') {
      toast.error('email is required', toastOptions)
      return false
    }
    return true
  }
  const handleChange = event => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }
  return (
    <>
      <div className='h-screen w-screen flex flex-col justify-center items-center gap-4 bg-[#131324]'>
        <form
          className='flex flex-col gap-8 rounded-3xl py-12 px-20 bg-[#00000076]'
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
            onChange={e => handleChange(e)}
          />
          <input
            class='input'
            type='email'
            placeholder='Email'
            name='email'
            onChange={e => handleChange(e)}
          />
          <input
            class='input'
            type='password'
            placeholder='Password'
            name='password'
            onChange={e => handleChange(e)}
          />
          <input
            class='input'
            type='password'
            placeholder='Confirm Password'
            name='confirmPassword'
            onChange={e => handleChange(e)}
          />
          <button
            class='bg-[#997af0] text-white py-4 px-8 border-none font-bold rounded-lg text-base transition duration-150 ease-in-out hover:bg-[#4e0eff] '
            type='submit'
          >
            CREATE USER
          </button>
          <span class='text-white uppercase'>
            Already have an account ?
            <Link
              class='text-[#4e0eff] font-bold no-underline px-2'
              to='/login'
            >
              {' '}
              Login
            </Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </>
  )
}

export default Register
