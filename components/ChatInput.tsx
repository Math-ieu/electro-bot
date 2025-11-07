
import React, { useState } from 'react';
import { SendIcon } from './icons/SendIcon';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-900 border-t border-gray-700">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Posez votre question ici..."
          disabled={isLoading}
          className="w-full bg-gray-800 border border-gray-600 rounded-full py-3 pl-5 pr-14 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-300"
          autoFocus
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full text-white bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
