
import React from 'react';
import { BotIcon } from './icons/BotIcon';

export const Header: React.FC = () => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 flex items-center space-x-3 shadow-lg sticky top-0 z-10">
      <div className="bg-fuchsia-600 p-2 rounded-full">
        <BotIcon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-gray-100">ElectroBot</h1>
        <p className="text-sm text-green-400 flex items-center">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
          En ligne
        </p>
      </div>
    </div>
  );
};
