const API_BASE_URL = 'http://localhost:3001'

class APIError extends Error {
  constructor(message, status, retryable = false) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.retryable = retryable
  }
}

function getErrorDetails(error, status) {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return {
      title: 'Connection Failed',
      message: 'Unable to reach the server. Please check your internet connection.',
      retryable: true
    }
  }

  switch (status) {
    case 401:
      return {
        title: 'Authentication Error',
        message: 'Invalid API key. Please check your server configuration.',
        retryable: false
      }
    case 429:
      return {
        title: 'Rate Limit Exceeded',
        message: 'Too many requests. Please wait a moment and try again.',
        retryable: true
      }
    case 500:
    case 502:
    case 503:
      return {
        title: 'Server Error',
        message: 'The AI service is temporarily unavailable. Please try again.',
        retryable: true
      }
    default:
      return {
        title: 'Request Failed',
        message: error.message || 'An unexpected error occurred. Please try again.',
        retryable: true
      }
  }
}

export async function sendMessage(messages, onChunk, onComplete, onError) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000)

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorDetails = getErrorDetails(new Error(response.statusText), response.status)
      throw new APIError(
        errorDetails.message,
        response.status,
        errorDetails.retryable
      )
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let fullResponse = ''

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop()

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)

          if (data === '[DONE]') {
            onComplete(fullResponse)
            return
          }

          try {
            const parsed = JSON.parse(data)
            const content = parsed.content || ''

            if (content) {
              fullResponse += content
              onChunk(fullResponse)
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e)
          }
        }
      }
    }

    onComplete(fullResponse)
  } catch (error) {
    clearTimeout(timeoutId)

    if (error.name === 'AbortError') {
      const timeoutError = {
        title: 'Request Timeout',
        message: 'The request took too long. Please try again.',
        retryable: true
      }
      onError(timeoutError)
      return
    }

    if (error instanceof APIError) {
      const errorDetails = getErrorDetails(error, error.status)
      onError({
        ...errorDetails,
        originalError: error
      })
    } else {
      const errorDetails = getErrorDetails(error)
      onError({
        ...errorDetails,
        originalError: error
      })
    }
  }
}
