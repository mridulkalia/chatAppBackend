import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../assets/loader.gif'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { setAvatarRoute } from '../utils/APIroutes'
import { Buffer } from 'buffer'
import './setAvatar.css'

function SetAvatar () {
  const api = 'https://api.multiavatar.com/45678945'
  const navigate = useNavigate()
  const [avatars, setAvatars] = useState([])
  const [isLoading, setisLoading] = useState(true)
  const [selectedAvatar, setSelectedAvatar] = useState(undefined)

  const toastOptions = {
    position: 'bottom-right',
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark'
  }

  useEffect(() => {
    const navv = () => {
      if (!localStorage.getItem('chat-app-user')) {
        navigate('/login')
      }
    }
    navv()
  }, [navigate])

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error('please select an avatar', toastOptions)
    } else {
      const userData = localStorage.getItem('chat-app-user')

      if (userData) {
        try {
          const user = JSON.parse(userData)

          const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
            image: avatars[selectedAvatar]
          })
          if (data.isSet) {
            user.isAvatarImageSet = true
            user.avatarImage = data.image
            localStorage.setItem('chat-app-user', JSON.stringify(user))
            navigate('/')
          } else {
            toast.error('error setting avatar. Please try again', toastOptions)
          }
        } catch (error) {
          console.error('Error parsing user data:', error)
          toast.error('Error parsing user data. Please try again', toastOptions)
        }
      } else {
        toast.error(
          'User data not found in local storage. Please log in again.',
          toastOptions
        )
        navigate('/login') // Redirect to the login page or an appropriate route
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = []
      for (let i = 0; i < 4; i++) {
        try {
          const image = await axios.get(
            `${api}/${Math.round(Math.random() * 1000)}`
          )
          const buffer = new Buffer(image.data)
          data.push(buffer.toString('base64'))
        } catch (error) {
          console.error('Error fetching image:', error)
        }
      }
      setAvatars(data)
      setisLoading(false)
    }

    fetchData()
  }, [])

  //This didnt work because there should always be a function in useeffect

  //   useEffect(async () => {
  //     const data = []
  //     for (let i = 0; i < 4; i++) {
  //       const image = await axios.get(
  //         `${api}/${Math.round(Math.random() * 1000)}`
  //       )
  //       const buffer = new Buffer(image.data)
  //       data.push(buffer.toString('base64'))
  //     }
  //     setAvatars(data)
  //     setisLoading(false)
  //   }, [])

  return (
    <>
      {isLoading ? (
        <section className='flex justify-center items-center flex-col gap-12 bg-[#131324] h-screen w-screen'>
          <img src={Loader} alt='loader' className='loader' />
        </section>
      ) : (
        <section className='flex justify-center items-center flex-col gap-12 bg-[#131324] h-screen w-screen'>
          <div className='title'>
            <h1 className='text-white text-5xl'>
              Pick an avatar as your Profile picture
            </h1>
          </div>
          <div className='avatars' class='flex gap-8'>
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={index}
                  className={`avatar ${
                    selectedAvatar === index ? 'selected' : ''
                  }`}
                >
                  <img
                    className='h-24'
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt='avatar'
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              )
            })}
          </div>
          <button className='submit-btn' onClick={setProfilePicture}>
            Set as Profile picture
          </button>
        </section>
      )}
      <ToastContainer />
    </>
  )
}

export default SetAvatar
