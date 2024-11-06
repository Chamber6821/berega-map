import { useCallback, useEffect, useMemo, useState } from "react"
import { useFilters } from "../filters/useFilters"

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
  const setFilters = useFilters(x => x.set)
  const parseFilters = useFilters(x => x.parse)

  const ask = useCallback(async (message: string) => {
    setDialog(x => [...x, { author: 'user', text: message }])
    setLoading(true)
    try {
      const response = await fetch('https://berega.city/filter_data', {
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
      setDialog(x => [...x, { author: 'bot' as const, text: answer.text }])
      setFilters({ searchParams: answer.request_params ? new URLSearchParams(answer.request_params) : undefined })
      parseFilters(new URLSearchParams(answer.request_params || undefined))
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
