'use client';

import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import Link from 'next/link';

export default function ChatAssistantButton() {
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    if (isDesktop) {
        return null; // Don't render on desktop, it's in the dashboard sidebar
    }

    return (
        <Button 
            asChild
            className="fixed bottom-20 right-4 h-16 w-16 rounded-full shadow-lg z-40"
        >
            <Link href="/farmer/assistant">
                <MessageSquare className="h-8 w-8" />
                <span className="sr-only">Open AI Assistant</span>
            </Link>
        </Button>
    )
}
