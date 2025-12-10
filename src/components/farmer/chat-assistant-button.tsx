'use client';

import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import ChatAssistant from "./chat-assistant";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function ChatAssistantButton() {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        return null; // Don't render on desktop, it's in the dashboard sidebar
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button className="fixed bottom-20 right-4 h-16 w-16 rounded-full shadow-lg z-50">
                    <MessageSquare className="h-8 w-8" />
                    <span className="sr-only">Open AI Assistant</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>AI Assistant</DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                    <ChatAssistant />
                </div>
            </DrawerContent>
        </Drawer>
    )
}
