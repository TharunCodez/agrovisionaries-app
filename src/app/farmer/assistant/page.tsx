'use client';

import ChatAssistant from "@/components/farmer/chat-assistant";

export default function AssistantPage() {
    return (
        <div className="flex flex-col gap-6 h-full pb-20 md:pb-6">
            <h1 className="font-headline text-2xl md:text-3xl font-bold">AI Assistant</h1>
            <div className="flex-1">
                <ChatAssistant />
            </div>
        </div>
    )
}
