'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import ChatAssistant from "./chat-assistant";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function ChatAssistantButton() {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [isOpen, setIsOpen] = useState(false);

    if (isDesktop) {
        return null; // Don't render on desktop, it's in the dashboard sidebar
    }

    return (
        <>
            <Button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-20 right-4 h-16 w-16 rounded-full shadow-lg z-40"
            >
                <MessageSquare className="h-8 w-8" />
                <span className="sr-only">Open AI Assistant</span>
            </Button>
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <div className="p-4">
                     <h2 className="text-lg font-semibold mb-4">AI Assistant</h2>
                    <ChatAssistant />
                </div>
            </Drawer>
        </>
    )
}
