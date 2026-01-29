export function generateId() {
  return crypto.randomUUID()
}

export function generateChatTitle(message) {
  if (!message || message.trim().length === 0) {
    return 'New Chat'
  }

  const maxLength = 50
  const trimmed = message.trim()

  if (trimmed.length <= maxLength) {
    return trimmed
  }

  const truncated = trimmed.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')

  if (lastSpace > maxLength * 0.6) {
    return truncated.substring(0, lastSpace) + '...'
  }

  return truncated + '...'
}

export function formatTimestamp(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) {
    return 'Just now'
  } else if (diffMins < 60) {
    return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }
}
