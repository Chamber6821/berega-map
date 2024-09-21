import Chat from "./Chat";
import MyMessage from "./MyMessage";
import CompanionMessage from "./CompanionMessage";
import { AssistantType } from "@/app/hooks/useAssistant";

export default function AssistantChat({ assistant, onClose }: { assistant: AssistantType, onClose?: () => void }) {
  return <Chat
    inputDisabled={assistant.loading}
    onClose={onClose}
    onSend={assistant.ask}
  >
    {
      assistant.dialog.map(x =>
        x.author === 'user'
          ? <MyMessage key={x.author + x.text}>{x.text}</MyMessage>
          : <CompanionMessage key={x.author + x.text}>{x.text}</CompanionMessage>
      )
    }
  </Chat>
}
