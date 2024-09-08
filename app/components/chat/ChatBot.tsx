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
  return <Chat onClose={onClose} onSend={x => setHistory([...history, { author: 'user', text: x }])}>
    {
      history.map(x =>
        x.author === 'user'
          ? <MyMessage key={x.author + x.text}>{x.text}</MyMessage>
          : <CompanionMessage key={x.author + x.text}>{x.text}</CompanionMessage>
      )
    }
  </Chat>
}
