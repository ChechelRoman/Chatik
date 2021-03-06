import React from 'react';
import './style.scss';
import {
  ChatBodyHeader,
  ContactHeaderProps,
} from '../../molecules/ChatBodyHeader';
import { Message } from '../../molecules/Message';
import { ChatBodySendMenu } from '../../molecules/ChatBodySendMenu';
import { Header4 } from '../../atoms/Typography';
import chatsStore from '../../../store/chatsStore';
import { observer } from 'mobx-react-lite';

interface ChatBodyProps {
  socket: WebSocket;
  currentChatId: string;
  onClick: ContactHeaderProps['onClick'];
}

export const ChatBody: React.FC<ChatBodyProps> = observer(
  ({ socket, currentChatId, onClick }) => {
    if (currentChatId === undefined) {
      return (
        <div className="user_tip">
          <Header4>Select a chat to start messaging</Header4>
        </div>
      );
    }

    const activeChat = chatsStore.chats.filter(
      (chat) => chat.id === currentChatId
    )[0];

    const messageList = activeChat.messages.map((message) => {
      return (
        <li key={message.id}>
          <Message
            link={message.link}
            attached={message.attached}
            id={message.id}
            source={message.source}
            text={message.text}
            size={message.size}
            title={message.title}
          />
        </li>
      );
    });

    return (
      <div className="chat_body">
        <div className="chat_body__header">
          <ChatBodyHeader
            contactName={activeChat.name}
            onClick={onClick}
            gender={activeChat.gender}
            lastSeen={activeChat.lastSeen}
          />
        </div>
        <div className="chat_body__messages">
          <ul>{messageList}</ul>
        </div>
        <div className="chat_body__send_menu">
          <ChatBodySendMenu
            socket={socket}
            id={activeChat.id}
            name={activeChat.name}
          />
        </div>
      </div>
    );
  }
);
