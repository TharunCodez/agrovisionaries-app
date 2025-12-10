'use client';

import ChatAssistant from "@/components/farmer/chat-assistant";

export default function AssistantPage() {
    return (
        <div className="flex flex-col h-screen bg-background">
            <div className="p-4 border-b md:hidden">
                 <h1 className="font-headline text-2xl md:text-3xl font-bold text-center">AI Assistant</h1>
            </div>
            <div className="flex-1 min-h-0">
                <ChatAssistant />
            </div>
        </div>
    )
}
