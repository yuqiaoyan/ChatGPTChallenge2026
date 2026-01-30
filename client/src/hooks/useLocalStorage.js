import { useState, useEffect } from 'react'

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (!item) return initialValue

      const parsed = JSON.parse(item)

      if (key.startsWith('chatgpt-chat-') && parsed) {
        if (!parsed.id || !Array.isArray(parsed.messages)) {
          console.warn(`Corrupt chat data for key "${key}", resetting to initial value`)
          window.localStorage.removeItem(key)
          return initialValue
        }
      }

      if (key === 'chatgpt-chats' && !Array.isArray(parsed)) {
        console.warn(`Corrupt chats list, resetting to initial value`)
        window.localStorage.removeItem(key)
        return initialValue
      }

      return parsed
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      window.localStorage.removeItem(key)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded')
        const shouldClear = window.confirm(
          'Storage is full. Would you like to clear old chats to make room? (This will keep only your 10 most recent chats)'
        )
        if (shouldClear) {
          try {
            const chatsKey = 'chatgpt-chats'
            const chatIdsStr = window.localStorage.getItem(chatsKey)
            if (chatIdsStr) {
              const chatIds = JSON.parse(chatIdsStr)
              const recentChatIds = chatIds.slice(0, 10)
              const oldChatIds = chatIds.slice(10)

              oldChatIds.forEach(id => {
                window.localStorage.removeItem(`chatgpt-chat-${id}`)
              })

              window.localStorage.setItem(chatsKey, JSON.stringify(recentChatIds))

              window.localStorage.setItem(key, JSON.stringify(valueToStore))
              setStoredValue(valueToStore)

              alert('Old chats cleared successfully. You can continue chatting.')
            }
          } catch (cleanupError) {
            console.error('Error during cleanup:', cleanupError)
            alert('Failed to clear storage. Please manually clear some browser data.')
          }
        }
      } else {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    }
  }

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error(`Error parsing storage event for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue, removeValue]
}

export default useLocalStorage
