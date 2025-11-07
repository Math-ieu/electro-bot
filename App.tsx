
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { Message } from './types';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { Header } from './components/Header';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction:
            "Vous êtes 'ElectroBot', un assistant IA amical et compétent pour une boutique en ligne spécialisée dans les gadgets électroniques. Votre objectif est d'aider les clients en répondant à leurs questions sur les produits, les commandes, les retours et les spécifications techniques. Soyez poli, concis et répondez toujours en français.",
        },
      });

       // Initial welcome message
       setMessages([{
        id: 'initial-welcome',
        sender: 'bot',
        text: "Bonjour ! Je suis ElectroBot, votre assistant virtuel. Comment puis-je vous aider aujourd'hui avec vos produits électroniques ?"
      }]);

    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(`Failed to initialize AI model: ${e.message}`);
      } else {
        setError('An unknown error occurred during initialization.');
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSendMessage = async (userInput: string) => {
    if (!chatRef.current) {
      setError('Chat session is not initialized.');
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: userInput,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: userInput });
      
      let botResponse = '';
      const botMessageId = `bot-${Date.now()}`;

      // Create an initial empty message for the bot to stream into
      setMessages((prev) => [...prev, { id: botMessageId, text: '', sender: 'bot' }]);

      for await (const chunk of stream) {
        botResponse += chunk.text;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: botResponse } : msg
          )
        );
      }
    } catch (e: unknown) {
       let errorMessage = 'An error occurred while fetching the response.';
      if (e instanceof Error) {
        errorMessage = `API Error: ${e.message}`;
      }
      setMessages((prev) => [...prev, {id: `err-${Date.now()}`, text: `Désolé, une erreur est survenue. ${errorMessage}`, sender: 'bot'}]);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-gray-900 shadow-2xl rounded-lg border border-gray-700 my-4">
      <Header />
      <div className="flex-grow p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && messages[messages.length-1]?.sender === 'user' && (
           <div className="flex items-start space-x-3 max-w-lg">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-600">
                  <div className="w-5 h-5 text-white animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
              </div>
              <div className="p-4 rounded-2xl bg-gray-700 rounded-tl-none">
                  <p className="text-white italic">ElectroBot est en train d'écrire...</p>
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
       {error && (
        <div className="p-4 text-center text-red-400 bg-red-900/50 border-t border-red-800">
          <p>Error: {error}</p>
        </div>
      )}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
