import { formatTime } from "@/utils/format-time";
import React from "react";

interface ChatWindowProps {
    typers: never[];
    userName: string;
    messages: any;
    text: string;
    setText: React.Dispatch<React.SetStateAction<string>>,
    sendMessage: () => void
}

const ChatWindow = ({
    typers,
    userName,
    messages,
    text,
    setText,
    sendMessage
}: ChatWindowProps) => {

    // handleKeyDown
    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    return (
        <div className="w-full max-w-2xl h-[90vh] bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
            {/* CHAT HEADER */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
                <div className="h-10 w-10 rounded-full bg-[#075E54] flex items-center justify-center text-white font-semibold">
                    R
                </div>
                <div className="flex-1">
                    <div className="text-sm font-medium text-[#303030]">
                        Realtime group chat
                    </div>

                    {typers.length ? (
                        <div className="text-xs text-gray-500">
                            {typers.join(', ')} is typing...
                        </div>
                    ) : (
                        ''
                    )}
                </div>
                <div className="text-sm text-gray-500">
                    Signed in as{' '}
                    <span className="font-medium text-[#303030] capitalize">
                        {userName}
                    </span>
                </div>
            </div>

            {/* CHAT MESSAGE LIST */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-100 flex flex-col">
                {messages.map((m: any) => {
                    const mine = m.sender === userName;
                    return (
                        <div
                            key={m.id}
                            className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[78%] p-3 my-2 rounded-[18px] text-sm leading-5 shadow-sm ${mine
                                    ? 'bg-[#DCF8C6] text-[#303030] rounded-br-2xl'
                                    : 'bg-white text-[#303030] rounded-bl-2xl'
                                    }`}>
                                <div className="break-words whitespace-pre-wrap">
                                    {m.text}
                                </div>
                                <div className="flex justify-between items-center mt-1 gap-16">
                                    <div className="text-[11px] font-bold">{m.sender}</div>
                                    <div className="text-[11px] text-gray-500 text-right">
                                        {formatTime(m.ts)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* CHAT TEXTAREA */}
            <div className="px-4 py-3 border-t border-gray-200 bg-white">
                <div className="flex items-center justify-between gap-4 border border-gray-200 rounded-full">
                    <textarea
                        rows={1}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="w-full resize-none px-4 py-4 text-sm outline-none placeholder:text-gray-400 text-gray-600"
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-green-500 text-white px-4 py-2 mr-2 rounded-full text-sm font-medium cursor-pointer">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
