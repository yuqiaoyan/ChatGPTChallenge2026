import { useState, useEffect } from 'react'
import useLocalStorage from './useLocalStorage'
import { generateId, generateChatTitle } from '../utils/helpers'
import { sendMessage as sendMessageToAPI } from '../services/api'

const STORAGE_KEYS = {
  CHATS: 'chatgpt-chats',
  CHAT_PREFIX: 'chatgpt-chat-',
  ACTIVE_CHAT: 'chatgpt-active-chat'
}

function useChat() {
  const [chatIds, setChatIds] = useLocalStorage(STORAGE_KEYS.CHATS, [])
  const [activeChatId, setActiveChatId] = useLocalStorage(STORAGE_KEYS.ACTIVE_CHAT, null)
  const [activeChat, setActiveChat] = useState(null)
  const [chats, setChats] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (activeChatId) {
      loadChat(activeChatId)
    }
  }, [activeChatId])

  useEffect(() => {
    const allChats = chatIds.map(id => loadChatData(id)).filter(Boolean)
    setChats(allChats)
  }, [chatIds])

  const loadChatData = (chatId) => {
    try {
      const chatData = window.localStorage.getItem(`${STORAGE_KEYS.CHAT_PREFIX}${chatId}`)
      if (chatData) {
        return JSON.parse(chatData)
      }
    } catch (error) {
      console.error('Error loading chat:', error)
    }
    return null
  }

  const loadChat = (chatId) => {
    const chat = loadChatData(chatId)
    if (chat) {
      setActiveChat(chat)
      return chat
    }
    return null
  }

  const saveChat = (chat) => {
    try {
      window.localStorage.setItem(
        `${STORAGE_KEYS.CHAT_PREFIX}${chat.id}`,
        JSON.stringify(chat)
      )
    } catch (error) {
      console.error('Error saving chat:', error)
    }
  }

  const createChat = () => {
    const newChat = {
      id: generateId(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    saveChat(newChat)
    setChatIds([newChat.id, ...chatIds])
    setActiveChatId(newChat.id)
    setActiveChat(newChat)

    return newChat
  }

  const switchChat = (chatId) => {
    setActiveChatId(chatId)
  }

  const addMessage = (message) => {
    if (!activeChat) return

    const newMessage = {
      id: generateId(),
      parentId: null,
      childrenIds: [],
      role: message.role,
      content: message.content,
      timestamp: Date.now()
    }

    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, newMessage],
      updatedAt: Date.now()
    }

    setActiveChat(updatedChat)
    saveChat(updatedChat)

    const updatedChatIds = [updatedChat.id, ...chatIds.filter(id => id !== updatedChat.id)]
    setChatIds(updatedChatIds)

    return newMessage
  }

  const updateLastMessage = (content) => {
    if (!activeChat || activeChat.messages.length === 0) return

    const messages = [...activeChat.messages]
    const lastMessage = messages[messages.length - 1]
    messages[messages.length - 1] = {
      ...lastMessage,
      content: content
    }

    const updatedChat = {
      ...activeChat,
      messages,
      updatedAt: Date.now()
    }

    setActiveChat(updatedChat)
    saveChat(updatedChat)
  }

  const updateChatTitle = (chatId, title) => {
    const chat = loadChatData(chatId)
    if (chat) {
      const updatedChat = {
        ...chat,
        title,
        updatedAt: Date.now()
      }
      saveChat(updatedChat)
      if (activeChatId === chatId) {
        setActiveChat(updatedChat)
      }

      setChats(prevChats =>
        prevChats.map(c => c.id === chatId ? updatedChat : c)
      )
    }
  }

  const sendMessage = async (content) => {
    if (!activeChat || !content.trim()) return

    setIsLoading(true)

    const userMessage = {
      id: generateId(),
      parentId: null,
      childrenIds: [],
      role: 'user',
      content: content.trim(),
      timestamp: Date.now()
    }

    const updatedChatWithUser = {
      ...activeChat,
      messages: [...activeChat.messages, userMessage],
      updatedAt: Date.now()
    }

    if (updatedChatWithUser.messages.length === 1) {
      const title = generateChatTitle(content)
      updatedChatWithUser.title = title
    }

    setActiveChat(updatedChatWithUser)
    saveChat(updatedChatWithUser)

    const updatedChatIds = [updatedChatWithUser.id, ...chatIds.filter(id => id !== updatedChatWithUser.id)]
    setChatIds(updatedChatIds)

    const assistantMessage = {
      id: generateId(),
      parentId: null,
      childrenIds: [],
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    }

    const updatedChatWithAssistant = {
      ...updatedChatWithUser,
      messages: [...updatedChatWithUser.messages, assistantMessage],
      updatedAt: Date.now()
    }

    setActiveChat(updatedChatWithAssistant)
    saveChat(updatedChatWithAssistant)

    const apiMessages = updatedChatWithUser.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    await sendMessageToAPI(
      apiMessages,
      (chunk) => {
        const messages = [...updatedChatWithAssistant.messages]
        messages[messages.length - 1] = {
          ...messages[messages.length - 1],
          content: chunk
        }
        const updatedChat = {
          ...updatedChatWithAssistant,
          messages,
          updatedAt: Date.now()
        }
        setActiveChat(updatedChat)
        saveChat(updatedChat)
      },
      (finalContent) => {
        setIsLoading(false)
      },
      (error) => {
        console.error('Error sending message:', error)
        setIsLoading(false)
      }
    )
  }

  return {
    chatIds,
    chats,
    activeChat,
    activeChatId,
    isLoading,
    setIsLoading,
    createChat,
    switchChat,
    loadChat,
    addMessage,
    updateLastMessage,
    updateChatTitle,
    sendMessage
  }
}

export default useChat
