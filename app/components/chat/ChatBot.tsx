import { useState } from "react";
import Chat from "./Chat";
import MyMessage from "./MyMessage";

export default function ChatBot({ onClose }: { onClose?: () => void }) {
  const [history, setHistory] = useState<string[]>([])
  return <Chat onClose={onClose} onSend={x => setHistory([...history, x])}>
    {
      history.map(x => <MyMessage key={x}>{x}</MyMessage>)
    }
  </Chat >
}
