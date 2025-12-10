'use client';

import ChatAssistant from "@/components/farmer/chat-assistant";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function AssistantPage() {
    const isMobile = useMediaQuery("(max-width: 768px)");

    if (!isMobile) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
                <div className="lg:col-span-2 flex flex-col gap-6">
                   <h1 className="font-headline text-2xl md:text-3xl font-bold">AI Assistant</h1>
                   <p className="text-muted-foreground">
                        Welcome to your AI-powered farming assistant. You can ask me questions about the app, get advice on farming practices in your region, or upload a photo of a plant for a health diagnosis.
                   </p>
                </div>
                <div className="lg:col-span-1 h-full">
                    <ChatAssistant />
                </div>
            </div>
        )
    }
    
    return (
        <div className="flex flex-col h-full w-full fixed inset-0 bg-background md:static">
            <div className="p-4 border-b md:hidden">
                 <h1 className="font-headline text-2xl md:text-3xl font-bold text-center">AI Assistant</h1>
            </div>
            <div className="flex-1 overflow-hidden">
                <ChatAssistant />
            </div>
        </div>
    )
}
