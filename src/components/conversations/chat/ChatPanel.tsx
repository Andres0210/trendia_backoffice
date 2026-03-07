/* eslint-disable @typescript-eslint/no-explicit-any */

import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ChatTools from "./ChatTools";

type Props = {
  activeConversation: any;
  messages: any[];
};

export default function ChatPanel({ activeConversation, messages }: Props) {
  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Selecciona una conversación
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader conversation={activeConversation} />

      <ChatMessages messages={messages} />

      <ChatInput
       conversationId={activeConversation?.id || null}
        onSend={(text) => {
          console.log("mensaje a enviar:", text);
        }}
      />
    </div>
  );
}
