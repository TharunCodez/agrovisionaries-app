'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, Send, BrainCircuit, User, Bot, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Badge } from '../ui/badge';
import type { DiagnosePlantOutput } from '@/ai/flows/plant-diagnoser-flow';
import { runDiagnosePlant, runGeneralChat } from '@/app/api/ai-actions';
import { useTranslation } from 'react-i18next';

type Message = {
  role: 'user' | 'assistant';
  content: string | React.ReactNode;
};

export default function ChatAssistant() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
        role: 'assistant',
        content: t('welcome_message')
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

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
      const response = await runGeneralChat({ query: currentInput, history, language: i18n.language });
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
    if (!file || isLoading) return;

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
            const diagnosis = await runDiagnosePlant({ photoDataUri: dataUri, language: i18n.language });
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
    <Card className="flex flex-col h-full max-h-[calc(100vh-12rem)] md:shadow-lg border-0 md:border md:shadow-sm rounded-xl overflow-hidden">
        <CardHeader className='text-center hidden md:block'>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <BrainCircuit className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>{t('ai_assistant')}</CardTitle>
            <CardDescription>{t('ai_assistant_subtitle')}</CardDescription>
        </CardHeader>
        <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-4 pb-28 md:pb-24" ref={scrollRef}>
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
            </div>
            <div className="w-full absolute bottom-0 bg-background/80 backdrop-blur-sm border-t p-3 flex items-center gap-3 z-50 pointer-events-auto">
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
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    aria-label={t('attach_image')}
                    >
                    <Paperclip className="h-5 w-5" />
                    <span className="sr-only">{t('attach_image')}</span>
                </Button>
                <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('ask_question')}
                        className="flex-1"
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" className="bg-primary rounded-full" disabled={isLoading || !input.trim()} aria-label={t('send')}>
                        <Send className="h-5 w-5" />
                        <span className="sr-only">{t('send')}</span>
                    </Button>
                </form>
            </div>
        </div>
    </Card>
  );
}

function DiagnosisCard({ diagnosis }: { diagnosis: DiagnosePlantOutput }) {
    const {t} = useTranslation();

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
