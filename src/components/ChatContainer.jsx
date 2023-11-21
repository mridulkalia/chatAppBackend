import React, { useState, useEffect, useRef } from 'react'
import Logout from './Logout'
import ChatInput from './ChatInput'
import axios from 'axios'
import { sendMessageRoute, getAllMessagesRoute } from '../utils/APIroutes'
import './chatcontainer.scss'
import { v4 as uuidv4 } from 'uuid'

function ChatContainer ({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([])
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const scrollRef = useRef()

  useEffect(() => {
    if (currentChat) {
      const handle_response = async () => {
        const response = await axios.post(getAllMessagesRoute, {
          from: currentUser._id,
          to: currentChat._id
        })
        setMessages(response.data)
      }
      handle_response()
    }
  }, [currentChat])

  const handleSendMsg = async msg => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg
    })
    socket.current.emit('send-msg', {
      to: currentChat._id,
      from: currentUser._id,
      message: msg
    })

    const msgs = [...messages]
    msgs.push({ fromSelf: true, message: msg })
    setMessages(msgs)
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-recieve', msg => {
        setArrivalMessage({ fromSelf: false, message: msg })
      })
    }
  }, [])

  useEffect(() => {
    arrivalMessage && setMessages(prev => [...prev, arrivalMessage])
  }, [arrivalMessage])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <>
      {currentChat && (
        <main className='header'>
          <div className='chat-header'>
            <div className='flex items-center gap-4'>
              <div>
                <img
                  className='h-12'
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt='avatar'
                />
              </div>
              <div className='username'>
                <h3 className='text-white'>{currentChat.username}</h3>
              </div>
            </div>
            <Logout />
          </div>
          <div className='chat-messages'>
            {messages.map(message => {
              return (
                <div ref={scrollRef} key={uuidv4()}>
                  <div
                    className={`message ${
                      message.fromSelf ? 'sended' : 'recieved'
                    }`}
                  >
                    <div className='content'>
                      <p>{message.message}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </main>
      )}
    </>
  )
}

export default ChatContainer
