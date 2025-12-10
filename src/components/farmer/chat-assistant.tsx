'use client';
import { useState, useRef, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Paperclip, Send, BrainCircuit, User, Bot, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Badge } from '../ui/badge';
import type { DiagnosePlantOutput, DiagnosePlantInput } from '@/ai/flows/plant-diagnoser-flow';
import type { GeneralChatInput } from '@/ai/flows/general-chat-flow';
import { runDiagnosePlant, runGeneralChat } from '@/app/api/ai-actions';


type Message = {
  role: 'user' | 'assistant';
  content: string | React.ReactNode;
};

const initialMessages: Message[] = [
    {
        role: 'assistant',
        content: "Hello! I'm your AI assistant. How can I help you today? You can ask me questions about the app or upload a photo of a plant for a health diagnosis."
    }
]

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    const currentInput = input;
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        content: typeof m.content === 'string' ? m.content : 'Image diagnosis was displayed.'
      }));
      const response = await runGeneralChat({ query: currentInput, history });
      const assistantResponse: Message = {
        role: 'assistant',
        content: response
      };
      setMessages(prev => [...prev, assistantResponse]);
    } catch(error) {
        console.error("Chat failed:", error);
        const errorResponse: Message = {
            role: 'assistant',
            content: "Sorry, I encountered an error. Please try again."
        };
        setMessages(prev => [...prev, errorResponse]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
        const dataUri = event.target?.result as string;

        const imagePreview = (
            <div className='flex flex-col items-center gap-2'>
                <p>Plant photo for diagnosis:</p>
                <img src={dataUri} alt="Uploaded plant" className="max-w-48 rounded-lg" />
            </div>
        );

        setMessages(prev => [...prev, { role: 'user', content: imagePreview }]);

        try {
            const diagnosis = await runDiagnosePlant({ photoDataUri: dataUri });
            const assistantResponse: Message = {
                role: 'assistant',
                content: <DiagnosisCard diagnosis={diagnosis} />
            };
            setMessages(prev => [...prev, assistantResponse]);
        } catch (error) {
            console.error("Diagnosis failed:", error);
            const errorResponse: Message = {
                role: 'assistant',
                content: "Sorry, I encountered an error while analyzing the image. Please try again."
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="flex h-full max-h-[100vh] flex-col md:max-h-[80vh] shadow-none border-0 md:border md:shadow-sm">
        <CardHeader className='text-center hidden md:block'>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <BrainCircuit className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>AI Assistant</CardTitle>
            <CardDescription>Your personal farming support bot.</CardDescription>
        </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-2 ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'assistant' && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0">
                    <Bot size={20} />
                  </div>
                )}
                <div className={`rounded-lg px-4 py-2 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {typeof message.content === 'string' ? (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    message.content
                  )}
                </div>
                 {message.role === 'user' && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground flex-shrink-0">
                    <User size={20} />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
                <div className="flex items-start gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0">
                        <Bot size={20} />
                    </div>
                     <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin"/>
                     </div>
                </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="relative mt-auto border-t pt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question or upload a plant photo..."
            className="pr-20"
            disabled={isLoading}
          />
           <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
            disabled={isLoading}
            />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute right-10 top-1/2 -translate-y-1/2"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            >
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Attach image</span>
          </Button>
          <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2" disabled={isLoading || !input.trim()}>
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function DiagnosisCard({ diagnosis }: { diagnosis: DiagnosePlantOutput }) {

    if (!diagnosis.isPlant) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Image Not a Plant</AlertTitle>
                <AlertDescription>
                    The uploaded image does not appear to be a plant. Please upload a clear photo of a plant leaf or stem.
                </AlertDescription>
            </Alert>
        )
    }

    const isHealthy = diagnosis.severity === 'None';

    const severityBadgeClass = () => {
        switch(diagnosis.severity) {
            case 'High': return 'bg-destructive text-destructive-foreground';
            case 'Medium': return 'bg-yellow-500 text-yellow-foreground';
            case 'Low': return 'bg-blue-500 text-blue-foreground';
            default: return 'bg-green-600 text-green-foreground';
        }
    }

    return (
        <div className="space-y-3 text-sm">
            <h4 className="font-bold">Plant Diagnosis Report</h4>
            <div className='space-y-2 rounded-lg border bg-background/50 p-2'>
                <p><strong>Health Status:</strong> {isHealthy ? 'Healthy' : 'Problem Detected'}</p>
                <p><strong>Identified Issue:</strong> {diagnosis.disease}</p>
                <div className='flex items-center gap-2'>
                    <strong>Severity:</strong> <Badge className={severityBadgeClass()}>{diagnosis.severity}</Badge>
                </div>
            </div>
             <div className='space-y-2'>
                <h5 className="font-semibold">Recommended Treatment:</h5>
                <p className='text-xs'>{diagnosis.treatment}</p>
             </div>
             <div className='space-y-2'>
                <h5 className="font-semibold">Next Steps:</h5>
                <ul className="list-disc pl-5 text-xs">
                    {diagnosis.nextSteps.map((step, i) => <li key={i}>{step}</li>)}
                </ul>
            </div>
        </div>
    )
}
