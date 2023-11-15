import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './chat.scss'
import { allUserRoute, host } from '../utils/APIroutes'
import Contacts from '../components/Contacts'
import Welcome from '../components/welcome'
import ChatContainer from '../components/ChatContainer'
import { io } from 'socket.io-client'

function Chat () {
  const socket = useRef()
  const [contacts, setContacts] = useState([])
  const [currentUser, setCurrentUser] = useState(undefined)
  const [currentChat, setCurrentChat] = useState(undefined)
  const [isLoaded, setIsLoaded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const contact = async () => {
      if (!localStorage.getItem('chat-app-user')) {
        navigate('/login')
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem('chat-app-user')))
        setIsLoaded(true)
      }
    }
    contact()
  }, [])

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host)
      socket.current.emit('add-user', currentUser._id)
    }
  }, [currentUser])

  useEffect(() => {
    const chat = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUserRoute}/${currentUser._id}`)
          setContacts(data.data)
        } else {
          navigate('/setAvatar')
        }
      }
    }
    chat()
  }, [currentUser])

  const handleChatChange = chat => {
    setCurrentChat(chat)
  }

  return (
    <section>
      <div className='contain'>
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        {isLoaded && currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
          />
        )}
      </div>
    </section>
  )
}

export default Chat
