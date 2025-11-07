
import React from 'react';
import type { Message } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';

  const wrapperClasses = `flex items-start space-x-3 max-w-lg ${isBot ? '' : 'ml-auto flex-row-reverse space-x-reverse'}`;
  const bubbleClasses = `p-4 rounded-2xl ${isBot ? 'bg-gray-700 rounded-tl-none' : 'bg-fuchsia-600 rounded-tr-none'}`;
  const textClasses = 'text-white whitespace-pre-wrap';

  const Icon = isBot ? BotIcon : UserIcon;

  return (
    <div className={wrapperClasses}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isBot ? 'bg-gray-600' : 'bg-fuchsia-500'}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className={bubbleClasses}>
        <p className={textClasses}>{message.text}</p>
      </div>
    </div>
  );
};
