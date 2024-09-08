import { useEffect, useState } from "react";
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
    setTimeout(
      () => {
        setHistory([...history, { author: 'bot', text: 'Bot answer' }])
        setBlocked(false)
      },
      1000
    )
  }
  return <Chat
    inputStyle={blocked ? { pointerEvents: 'none' } : undefined}
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
