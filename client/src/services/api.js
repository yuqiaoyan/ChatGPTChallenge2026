const API_BASE_URL = 'http://localhost:3001'

export async function sendMessage(messages, onChunk, onComplete, onError) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
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
    console.error('API error:', error)
    onError(error)
  }
}
