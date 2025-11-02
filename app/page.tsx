'use client'

import { useState, useEffect, useRef } from 'react'
import { Hash, Users, Mic, Headphones, Settings, Plus, Search, Send, Smile, Image, PlusCircle } from 'lucide-react'

interface Message {
  id: string
  user: string
  content: string
  timestamp: Date
  avatar: string
}

interface Channel {
  id: string
  name: string
  type: 'text' | 'voice'
}

interface Server {
  id: string
  name: string
  icon: string
}

export default function DiscordClone() {
  const [servers] = useState<Server[]>([
    { id: '1', name: 'Server 1', icon: 'S1' },
    { id: '2', name: 'Server 2', icon: 'S2' },
    { id: '3', name: 'Server 3', icon: 'S3' },
  ])

  const [channels] = useState<Channel[]>([
    { id: '1', name: 'general', type: 'text' },
    { id: '2', name: 'random', type: 'text' },
    { id: '3', name: 'memes', type: 'text' },
    { id: '4', name: 'General Voice', type: 'voice' },
    { id: '5', name: 'Gaming', type: 'voice' },
  ])

  const [onlineUsers] = useState([
    { id: '1', name: 'User1', status: 'online', avatar: 'U1' },
    { id: '2', name: 'User2', status: 'online', avatar: 'U2' },
    { id: '3', name: 'User3', status: 'idle', avatar: 'U3' },
    { id: '4', name: 'User4', status: 'dnd', avatar: 'U4' },
  ])

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      user: 'User1',
      content: 'Welcome to the server!',
      timestamp: new Date(Date.now() - 3600000),
      avatar: 'U1'
    },
    {
      id: '2',
      user: 'User2',
      content: 'Hey everyone! How are you all doing today?',
      timestamp: new Date(Date.now() - 1800000),
      avatar: 'U2'
    },
    {
      id: '3',
      user: 'User3',
      content: 'Pretty good! Just working on some projects.',
      timestamp: new Date(Date.now() - 900000),
      avatar: 'U3'
    },
  ])

  const [currentMessage, setCurrentMessage] = useState('')
  const [currentChannel, setCurrentChannel] = useState(channels[0])
  const [currentServer, setCurrentServer] = useState(servers[0])
  const [username, setUsername] = useState('')
  const [showUsernameModal, setShowUsernameModal] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (currentMessage.trim() && username) {
      const newMessage: Message = {
        id: Date.now().toString(),
        user: username,
        content: currentMessage,
        timestamp: new Date(),
        avatar: username.substring(0, 2).toUpperCase()
      }
      setMessages([...messages, newMessage])
      setCurrentMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#43b581'
      case 'idle': return '#faa61a'
      case 'dnd': return '#f04747'
      default: return '#747f8d'
    }
  }

  if (showUsernameModal) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: '#36393f',
          padding: '32px',
          borderRadius: '8px',
          width: '440px',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)'
        }}>
          <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 600 }}>Enter Your Username</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && username.trim()) {
                setShowUsernameModal(false)
              }
            }}
            placeholder="Username"
            style={{
              width: '100%',
              padding: '12px',
              background: '#202225',
              border: 'none',
              borderRadius: '4px',
              color: '#dcddde',
              fontSize: '16px',
              marginBottom: '20px',
              outline: 'none'
            }}
            autoFocus
          />
          <button
            onClick={() => {
              if (username.trim()) {
                setShowUsernameModal(false)
              }
            }}
            style={{
              width: '100%',
              padding: '12px',
              background: '#5865f2',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#4752c4'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#5865f2'}
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Server List */}
      <div style={{
        width: '72px',
        background: '#202225',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px 0',
        gap: '8px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: '#5865f2',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'border-radius 0.2s',
          marginBottom: '8px'
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderRadius = '16px'}
        onMouseLeave={(e) => e.currentTarget.style.borderRadius = '50%'}
        >
          <Hash size={28} color="white" />
        </div>

        <div style={{ width: '32px', height: '2px', background: '#36393f', borderRadius: '1px' }} />

        {servers.map((server) => (
          <div
            key={server.id}
            onClick={() => setCurrentServer(server)}
            style={{
              width: '48px',
              height: '48px',
              background: currentServer.id === server.id ? '#5865f2' : '#36393f',
              borderRadius: currentServer.id === server.id ? '16px' : '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: 600,
              fontSize: '18px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderRadius = '16px'
              if (currentServer.id !== server.id) e.currentTarget.style.background = '#5865f2'
            }}
            onMouseLeave={(e) => {
              if (currentServer.id !== server.id) {
                e.currentTarget.style.borderRadius = '50%'
                e.currentTarget.style.background = '#36393f'
              }
            }}
          >
            {server.icon}
          </div>
        ))}

        <div style={{
          width: '48px',
          height: '48px',
          background: '#36393f',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          color: '#43b581'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderRadius = '16px'
          e.currentTarget.style.background = '#43b581'
          e.currentTarget.style.color = 'white'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderRadius = '50%'
          e.currentTarget.style.background = '#36393f'
          e.currentTarget.style.color = '#43b581'
        }}
        >
          <Plus size={24} />
        </div>
      </div>

      {/* Channel List */}
      <div style={{
        width: '240px',
        background: '#2f3136',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          height: '48px',
          padding: '0 16px',
          borderBottom: '1px solid #202225',
          display: 'flex',
          alignItems: 'center',
          fontWeight: 600,
          fontSize: '15px',
          cursor: 'pointer',
          boxShadow: '0 1px 0 rgba(0, 0, 0, 0.2)'
        }}>
          {currentServer.name}
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 8px'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              padding: '0 8px',
              marginBottom: '4px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#96989d',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Text Channels
            </div>
            {channels.filter(c => c.type === 'text').map((channel) => (
              <div
                key={channel.id}
                onClick={() => setCurrentChannel(channel)}
                style={{
                  padding: '6px 8px',
                  margin: '2px 0',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: currentChannel.id === channel.id ? '#393c43' : 'transparent',
                  color: currentChannel.id === channel.id ? '#ffffff' : '#96989d',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                  if (currentChannel.id !== channel.id) {
                    e.currentTarget.style.background = '#35373c'
                    e.currentTarget.style.color = '#dcddde'
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentChannel.id !== channel.id) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#96989d'
                  }
                }}
              >
                <Hash size={20} />
                <span style={{ fontSize: '16px' }}>{channel.name}</span>
              </div>
            ))}
          </div>

          <div>
            <div style={{
              padding: '0 8px',
              marginBottom: '4px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#96989d',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Voice Channels
            </div>
            {channels.filter(c => c.type === 'voice').map((channel) => (
              <div
                key={channel.id}
                style={{
                  padding: '6px 8px',
                  margin: '2px 0',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#96989d',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#35373c'
                  e.currentTarget.style.color = '#dcddde'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#96989d'
                }}
              >
                <Users size={20} />
                <span style={{ fontSize: '16px' }}>{channel.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Panel */}
        <div style={{
          height: '52px',
          background: '#292b2f',
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px',
          gap: '8px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#5865f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 600
          }}>
            {username.substring(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1, fontSize: '14px', fontWeight: 600 }}>
            {username}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ cursor: 'pointer', color: '#b9bbbe', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#dcddde'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#b9bbbe'}>
              <Mic size={20} />
            </div>
            <div style={{ cursor: 'pointer', color: '#b9bbbe', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#dcddde'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#b9bbbe'}>
              <Headphones size={20} />
            </div>
            <div style={{ cursor: 'pointer', color: '#b9bbbe', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#dcddde'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#b9bbbe'}>
              <Settings size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Channel Header */}
        <div style={{
          height: '48px',
          borderBottom: '1px solid #202225',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '8px',
          boxShadow: '0 1px 0 rgba(0, 0, 0, 0.2)'
        }}>
          <Hash size={24} color="#8e9297" />
          <span style={{ fontWeight: 600, fontSize: '16px' }}>{currentChannel.name}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px', color: '#b9bbbe' }}>
            <Search size={20} style={{ cursor: 'pointer' }} />
            <Users size={20} style={{ cursor: 'pointer' }} />
          </div>
        </div>

        {/* Messages Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {messages.map((message) => (
            <div key={message.id} style={{
              display: 'flex',
              gap: '16px',
              padding: '4px 16px',
              marginBottom: '8px',
              borderRadius: '4px',
              transition: 'background 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#32353b'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#5865f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 600,
                flexShrink: 0
              }}>
                {message.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, fontSize: '16px', color: '#ffffff' }}>{message.user}</span>
                  <span style={{ fontSize: '12px', color: '#72767d' }}>{formatTime(message.timestamp)}</span>
                </div>
                <div style={{ fontSize: '16px', color: '#dcddde', lineHeight: '1.4' }}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div style={{ padding: '0 16px 24px' }}>
          <div style={{
            background: '#40444b',
            borderRadius: '8px',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ cursor: 'pointer', color: '#b9bbbe', display: 'flex', alignItems: 'center' }}>
              <PlusCircle size={24} />
            </div>
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message #${currentChannel.name}`}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#dcddde',
                fontSize: '15px',
                padding: '11px 0'
              }}
            />
            <div style={{ display: 'flex', gap: '12px', color: '#b9bbbe' }}>
              <div style={{ cursor: 'pointer' }}><Smile size={24} /></div>
              <div style={{ cursor: 'pointer' }}><Image size={24} /></div>
              <div
                onClick={sendMessage}
                style={{
                  cursor: 'pointer',
                  color: currentMessage.trim() ? '#5865f2' : '#b9bbbe',
                  transition: 'color 0.2s'
                }}>
                <Send size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Member List */}
      <div style={{
        width: '240px',
        background: '#2f3136',
        overflowY: 'auto',
        padding: '24px 8px'
      }}>
        <div style={{
          marginBottom: '8px',
          padding: '0 8px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#96989d',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Online — {onlineUsers.filter(u => u.status === 'online').length}
        </div>
        {onlineUsers.map((user) => (
          <div
            key={user.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '6px 8px',
              margin: '2px 0',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#35373c'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#5865f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 600
              }}>
                {user.avatar}
              </div>
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: getStatusColor(user.status),
                border: '3px solid #2f3136'
              }} />
            </div>
            <span style={{ fontSize: '15px', color: '#ffffff' }}>{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
