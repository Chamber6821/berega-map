import { useState } from "react";
import Chat from "./Chat";
import MyMessage from "./MyMessage";
import CompanionMessage from "./CompanionMessage";

type Message = {
  author: 'user' | 'bot',
  text: string
}

export default function ChatBot({ onClose }: { onClose?: () => void }) {
  const [history, setHistory] = useState<Message[]>([])
  const [blocked, setBlocked] = useState(false)
  const handleSend = (message: string) => {
    setHistory([...history, { author: 'user', text: message }])
    setBlocked(true)
    const ask = async () => {
      const response = await fetch('http://198.199.64.195:7771/filter_data', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          history: history.map(x => x.text),
          text: message,
          language: 'ru'
        })
      })
      const answer = await response.json()
      setHistory(x => [...x, { author: 'bot', text: answer.text }])
      setBlocked(false)
    }
    ask()
  }
  return <Chat
    inputDisabled={blocked}
    onClose={onClose}
    onSend={handleSend}
  >
    {
      history.map(x =>
        x.author === 'user'
          ? <MyMessage key={x.author + x.text}>{x.text}</MyMessage>
          : <CompanionMessage key={x.author + x.text}>{x.text}</CompanionMessage>
      )
    }
  </Chat>
}
