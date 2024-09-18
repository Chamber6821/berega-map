import { useCallback, useMemo, useState } from "react"

export type MessageType = {
  author: 'user' | 'bot',
  text: string
}

export type AssistantType = {
  dialog: MessageType[],
  loading: boolean,
  ask: (message: string) => void
}

export default function useAssistant(): AssistantType {
  const [dialog, setDialog] = useState<MessageType[]>([])
  const [loading, setLoading] = useState(false)

  const ask = useCallback(async (message: string) => {
    setLoading(true)
    try {
      const response = await fetch('http://198.199.64.195:7771/filter_data', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          history: dialog.map(x => x.text),
          text: message,
          language: 'ru'
        })
      })
      const answer = await response.json()
      setDialog([...dialog, { author: 'bot', text: answer.text }])
    } finally {
      setLoading(false)
    }
  }, [dialog])

  const assistant = useMemo<AssistantType>(() => ({
    dialog,
    loading,
    ask
  }), [dialog, loading, ask])
  return assistant
}
